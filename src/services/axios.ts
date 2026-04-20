'use client';

import { config } from '@/config';
import { authClient } from '@/lib/auth/custom/client';
import { logger } from '@/lib/default-logger';
import endPoints from '@/services/urls';
import { store } from '@/store';
import { clearPasskeyData } from '@/store/slices/passkey-slice';
import { getDeviceHeaders } from '@/utils/device-manager';
import { checkTokenExpiry, getTokenExpiry, renewToken } from '@/utils/token-manager';
import axios, { type AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

/* -----------------------------------------------------------------------------
* TYPES
* -------------------------------------------------------------------------- */
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _requestId?: string;
}
/**
* Generate a unique request ID (for traceability / observability)
*/
const generateRequestId = (): string => crypto.randomUUID();
/**
* Manage duplicate requests — aborts the previous request to same URL
*/
const manageDuplicateRequests = (url: string, ongoingRequests: Record<string, AbortController>): AbortController => {
  if (ongoingRequests[url]) {
    ongoingRequests[url].abort();
    logger.warn(`Duplicate request aborted: ${url}`);
  }
  const controller = new AbortController();
  ongoingRequests[url] = controller;
  return controller;
};
/**
* Retrieve CSRF token from cookies (supports both Django and generic)
*/
const getCSRFToken = (): string | null => {
  if (typeof document !== 'undefined') {
    const regex = /(^|;\s*)(csrftoken|XSRF-TOKEN)=([^;]+)/;
    const match = regex.exec(document.cookie);
    return match ? decodeURIComponent(match[3]) : null;
  }
  return null;
};
/**
* Extract updated CSRF token from response headers (if backend rotates it)
*/
const updateCSRFTokenFromResponse = (response: AxiosResponse): void => {
  try {
    const newToken =
      response.headers['x-csrftoken'] ||
      response.headers['x-xsrf-token'] ||
      response.headers['X-CSRF-Token'] ||
      response.headers['X-CSRFToken'] ||
      response.headers['x-csrf-token'];
    if (newToken && typeof document !== 'undefined') {
      document.cookie = `csrftoken=${newToken}; path=/; SameSite=Lax`;
    }
  } catch {
    // fail silently
  }
};
/**
* Process Set-Cookie headers from response (handles case-insensitive header keys)
* Browsers automatically process Set-Cookie headers, but we log them for debugging
* and ensure they're accessible regardless of header key casing
*/
const processSetCookieHeaders = (response: AxiosResponse): void => {
  try {
    if (typeof document === 'undefined') return;
    const headers = response.headers;
    const rawHeaders = (response as any).rawHeaders || (response as any).headers?.raw || {};
    // Case-insensitive search for Set-Cookie header
    // Axios typically normalizes headers to lowercase, but handle all cases
    let setCookieHeader: string | string[] | undefined;
    // First, try direct access with common case variations
    setCookieHeader =
      headers['set-cookie'] || // Normalized lowercase (most common in axios)
      headers['Set-Cookie'] || // Original case (if not normalized)
      headers['SET-COOKIE'] || // Uppercase
      headers['Cookie'] || // Alternative (shouldn't happen, but handle it)
      headers['cookie'] || // Lowercase alternative
      rawHeaders['set-cookie'] || // Raw headers lowercase
      rawHeaders['Set-Cookie'] || // Raw headers original case
      rawHeaders['SET-COOKIE']; // Raw headers uppercase
    // If not found, iterate through all header keys for case-insensitive matching
    if (!setCookieHeader) {
      const headerKeys = Object.keys(headers);
      for (const key of headerKeys) {
        if (key.toLowerCase() === 'set-cookie') {
          setCookieHeader = headers[key];
          break;
        }
      }
    }
    // Also check raw headers if available
    if (!setCookieHeader && rawHeaders && typeof rawHeaders === 'object') {
      const rawHeaderKeys = Object.keys(rawHeaders);
      for (const key of rawHeaderKeys) {
        if (key.toLowerCase() === 'set-cookie') {
          setCookieHeader = rawHeaders[key];
          break;
        }
      }
    }
    // For logout responses, ensure cookies are properly cleared
    // Check if this is a logout endpoint
    const url = response.config.url ?? '';
    const isLogoutEndpoint = url.includes('/sessions/logout') || url.includes('/logout');
    if (isLogoutEndpoint) {
      // If Set-Cookie header was found, the browser should process it automatically
      // But if it wasn't found (due to case sensitivity or axios limitations),
      // we can't manually clear session cookies as we don't know their exact names/domains/paths
      // The server should always send proper Set-Cookie headers to clear cookies
      if (!setCookieHeader) {
        logger.warn('[Cookie] Logout response received but no Set-Cookie header found - cookies may not be cleared');
      }
    }
  } catch (error) {
    logger.error('[Cookie] Error processing Set-Cookie headers', error);
  }
};
/**
* Enforce HTTPS-only requests (security compliance)
*/
const enforceSecureProtocol = (url?: string): void => {
  if (url && !url.startsWith('https://') && !url.startsWith('/')) {
    throw new Error(`Insecure protocol blocked: ${url}`);
  }
};
/**
* Decode JWT token to extract expiration and issued at time
* Returns decoded JWT payload with exp (expiration) and iat (issued at) timestamps
*/
function decodeJWT(token: string): { exp?: number; iat?: number } | null {
  try {
    // JWT structure: header.payload.signature
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    // Convert base64url to base64 and decode
    const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + (c.codePointAt(0) ?? 0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
/* -----------------------------------------------------------------------------
* BASE AXIOS INSTANCES
* -------------------------------------------------------------------------- */
/** 🌐 Global backend API client */
const Axios: AxiosInstance = axios.create({
  baseURL: config.envType === 'dev' ? '/api/core' : config.others.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 300000,
  withCredentials: true,
});
/** 🔒 Auth API client (proxied through Next.js rewrite for local dev) */
const AuthAxios: AxiosInstance = axios.create({
  baseURL: config.envType === 'dev' ? '/api/auth' : config.others.authUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 120000,
  withCredentials: true,
});
/** 🧩 Track ongoing requests for deduplication */
const ongoingRequests: Record<string, AbortController> = Object.create(null);
/* -----------------------------------------------------------------------------
* TOKEN AUTO-REFRESH SCHEDULER (ADDED)
* - uses getTokenExpiry() from token-manager (returns ms) and renewToken()
* - reschedules when Redux store user.expiresAt changes
* - only runs in browser
* -------------------------------------------------------------------------- */

const SAFETY_WINDOW_MS = 60_000; // refresh 60s before expiry
let autoRefreshTimer: ReturnType<typeof setTimeout> | null = null;
let lastKnownExpirySec: number | null = null;

/**
 * Clear auto-refresh timer
 */
function clearAutoRefreshTimer() {
  if (autoRefreshTimer) {
    clearTimeout(autoRefreshTimer);
    autoRefreshTimer = null;
  }
}

/**
 * Schedule the next auto-refresh based on current token expiry
 */
function scheduleAutoRefresh() {
  try {
    if (globalThis.window === undefined) return;


    clearAutoRefreshTimer();

    const expiryMs = getTokenExpiry(); // returns epoch ms or null
    if (!expiryMs) {
      lastKnownExpirySec = null;
      return;
    }

    const now = Date.now();
    let wait = expiryMs - now - SAFETY_WINDOW_MS;

    // never schedule too close or negative time - fallback to small delay
    if (wait < 5000) wait = 5000;

    // store last known expiry (in seconds) so we can detect changes
    lastKnownExpirySec = Math.floor(expiryMs / 1000);

    autoRefreshTimer = setTimeout(async () => {
      try {
        // double-check before renewing
        const { isExpired } = await checkTokenExpiry();
        if (isExpired) {
          return;
        }

        await renewToken();
        // renewToken() should update Redux and cause subscription to reschedule
      } catch {
        // best-effort signout on failure
        try {
          await authClient.signOut();
        } catch (e) {
          logger.error('[AutoRefresh] signOut failed after renew error:', e);
        }
      }
    }, wait);
  } catch (err) {
    logger.error('[AutoRefresh] schedule error:', err);
  }
}

/**
 * Subscribe to store changes (only user.expiresAt)
 * Reschedule when expiresAt changes (login/renew/logout)
 */
let unsubscribeStore: (() => void) | null = null;

function startAutoRefreshSubscription() {
  if (globalThis.window === undefined) return;


  // If already subscribed, do nothing
  if (unsubscribeStore) return;

  let prevExpiry = store.getState().user.expiresAt ?? null;

  unsubscribeStore = store.subscribe(() => {
    try {
      const state = store.getState();
      const currExpiry = state.user.expiresAt ?? null;

      // If expiry changed (login, renew, logout), reschedule
      if (currExpiry !== prevExpiry) {
        prevExpiry = currExpiry;
        scheduleAutoRefresh();
      }
    } catch (err) {
      logger.error('[AutoRefresh] store subscription error:', err);
    }
  });

  // initial schedule
  scheduleAutoRefresh();
}

/**
 * Stop subscription and clear timer (useful on sign out)
 */
function stopAutoRefreshSubscription() {
  if (unsubscribeStore) {
    unsubscribeStore();
    unsubscribeStore = null;
  }
  clearAutoRefreshTimer();
}

// Start the subscription/scheduler after a microtask to avoid circular dependency issues
// The store might not be fully initialized when this module is first imported
if (globalThis.window !== undefined) {
  // Use setTimeout to defer until after the current module initialization cycle
  setTimeout(() => {
    try {
      startAutoRefreshSubscription();
    } catch (err) {
      logger.error('[AutoRefresh] init error:', err);
    }
  }, 0);
}

/* -----------------------------------------------------------------------------
* TOKEN VALIDATION
* Uses token utilities from @/utils/token-manager
* -------------------------------------------------------------------------- */
/**
* Ensure valid token before making requests
* Checks expiry and renews if needed
* Uses checkTokenExpiry() and renewToken() from token-manager utils
*/
async function ensureValidToken(): Promise<boolean> {
  if (globalThis.window === undefined) return true; // Skip on server
  try {
    // Get expiresAt from Redux to check if it exists
    const state = store.getState();
    const expiresAt = state.user.expiresAt;
    // If expiresAt is not set, allow request to proceed (might be during login)
    // The 401 handler will deal with invalid tokens
    if (!expiresAt) {
      return true;
    }
    // Check token expiry
    const { isExpired, isNearExpiry } = await checkTokenExpiry();
    // If token is expired, logout the user
    if (isExpired) {
      return false;
    }
    // If token is near expiry (< 1 minute), renew it proactively
    if (isNearExpiry) {
      const renewed = await renewToken();
      return renewed;
    }
    // Token is valid
    return true;
  } catch {
    // On error, let the request proceed (HttpOnly cookie will be sent anyway)
    return true;
  }
}
/* -----------------------------------------------------------------------------
* REQUEST INTERCEPTOR
* -------------------------------------------------------------------------- */
const createRequestInterceptor =
  (isAuthInstance = false) =>
  async (config: CustomAxiosRequestConfig) => {
    const url = config.url ?? '';
    // 1️⃣ Enforce HTTPS (except for relative paths)
    if (url.startsWith('http')) enforceSecureProtocol(url);
    // 2️⃣ Abort duplicate request (same endpoint)
    if (!url.includes(endPoints.ME)) {
      const controller = manageDuplicateRequests(url, ongoingRequests);
      config.signal = controller.signal;
  }
    // 3️⃣ Add request correlation ID
    config._requestId = generateRequestId();
    config.headers['X-Request-Id'] = config._requestId;

    // Skip token check for login/register/auth endpoints (expiresAt not set yet during login)
    const skipTokenCheck =
  // ME endpoint must NEVER be validated inside interceptor
  url.includes(endPoints.ME) ||

  // Signup (OTP)
  url.includes(endPoints.SIGN_UP_START) ||
  url.includes(endPoints.SIGN_UP_FINISH) ||

  // Two-factor OTP flows
  url.includes(endPoints.TWO_FACTOR_AUTH_SESSION) ||
  url.includes(endPoints.TWO_FACTOR_AUTH__VERIFY_CODE) ||

  // Login with 2FA OTP flows
  url.includes(endPoints.TWO_FA_LOGIN_START) ||
  url.includes(endPoints.TWO_FA_LOGIN_FINISH) ||
  
  // Passkey login + register flows
  url.includes(endPoints.PASSKEY_LOGIN_START) ||
  url.includes(endPoints.PASSKEY_LOGIN_FINISH) ||
  url.includes(endPoints.PASSKEY_REGISTER_START) ||
  url.includes(endPoints.PASSKEY_REGISTER_FINISH) ||
  // Session management flows
  url.includes(endPoints.SIGN_OUT) ||
  url.includes(endPoints.SESSION_RENEW);
    if (skipTokenCheck) {
      logger.debug('[Token] Skipping token check for:', url);
    } else if (globalThis.window !== undefined) {
      try {
        await ensureValidToken();
      } catch (err) {
        logger.error('[Token] Token check failed:', err);
        store.dispatch(clearPasskeyData());
      }
    }
    // 5️⃣ Attach CSRF token for auth calls
    if (isAuthInstance) {
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken; // Django style
        config.headers['X-CSRF-Token'] = csrfToken; // Express style
      }
    }

    // 6️⃣ Attach device headers for ALL API requests
    // Device headers are automatically included on every request:
    // - If device_id exists: sends X-Device-Id
    // - If no device_id: sends X-Device-Name + X-Device-Platform
    // For signup/login START endpoints, always use fresh browser values (not from Redux)
    const isStartEndpoint =
      url.includes(endPoints.SIGN_UP_START) ||
      url.includes(endPoints.TWO_FA_LOGIN_START) ||
      url.includes(endPoints.TWO_FACTOR_AUTH_SESSION)

    const deviceHeaders = getDeviceHeaders(isStartEndpoint);
    Object.entries(deviceHeaders).forEach(([key, value]) => {
      if (value) {
        config.headers[key] = value;
      }
    });

    return config;
  };
/* -----------------------------------------------------------------------------
* RESPONSE INTERCEPTOR
* -------------------------------------------------------------------------- */
const createResponseInterceptor = (instanceName: string) => ({
  onSuccess: (response: AxiosResponse) => {
    const url = response.config.url ?? '';
    Reflect.deleteProperty(ongoingRequests, url);
    // ✅ Auto-update CSRF token if backend rotates it
    updateCSRFTokenFromResponse(response);
    // ✅ Process Set-Cookie headers (handles case-insensitive header keys)
    processSetCookieHeaders(response);
    return response;
  },
  onError: async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    const { status } = error.response;
    // ⚠️ Handle 401: Token renewal flow
    if (status === 401) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        // TOKEN RENEWAL FLOW: Renew the session and retry the original request
        const renewed = await renewToken();
        if (renewed) {
          // HttpOnly cookie is automatically updated by server
          // Retry with the appropriate instance (Axios or AuthAxios)
          return (instanceName === 'AuthAxios' ? AuthAxios : Axios)(originalRequest);
        }
        // If renewal failed, user is already logged out by renewToken()
        throw new Error('Session expired. Please login again.');
      }
      // If already retried once and still 401, logout
      throw new Error('Session expired. Please login again.');
    }
    // 🧩 For all other errors (400, 403, 500, etc.), pass raw error to error handler
    // This allows the error handler to extract the actual API error message
    throw error;
  },
});
/* -----------------------------------------------------------------------------
* INTERCEPTOR REGISTRATION
* -------------------------------------------------------------------------- */
// 🔹 Global API client
Axios.interceptors.request.use(createRequestInterceptor(false), Promise.reject);
Axios.interceptors.response.use(
  createResponseInterceptor('Axios').onSuccess,
  createResponseInterceptor('Axios').onError
);
// 🔹 Auth API client (CSRF-enabled)
AuthAxios.interceptors.request.use(createRequestInterceptor(true), Promise.reject);
AuthAxios.interceptors.response.use(
  createResponseInterceptor('AuthAxios').onSuccess,
  createResponseInterceptor('AuthAxios').onError
);
/* -----------------------------------------------------------------------------
* EXPORTS
* -------------------------------------------------------------------------- */
export { AuthAxios, Axios };
export default Axios;