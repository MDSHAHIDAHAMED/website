import { paths } from '@/paths';
import { authGetMethod, authPostMethod } from '@/services/api';
import endPoints from '@/services/urls';
import { storeDeviceFromResponse } from '@/utils/device-manager';
import { handleServiceError } from '@/utils/error-handler';
import type { AuthDevice, AuthSession, AuthUser } from '@/utils/user-auth';

/**
 * User data response from /me endpoint
 * Response structure: { data: { user, session, device } }
 */
export interface MeResponse {
  data: {
    user: AuthUser;
    session: AuthSession;
    device: AuthDevice;
  };
}

/**
 * Logout response from /sessions/logout endpoint
 */
export interface LogoutResponse {
  data: Record<string, any>;
}

/**
 * Fetches current user data from /me endpoint
 * Uses cookies for authentication (no Authorization header needed)
 * Also stores device info and hasPasskeyForUser from response
 */
export async function fetchCurrentUser(): Promise<MeResponse> {
  try {
    const response = await authGetMethod<MeResponse>(endPoints.ME);
    
    if (!response?.data?.user) {
      throw new Error('Invalid response from /me endpoint');
    }

    // Store device info from /me response for future authenticated requests
    if (response.data.device) {
      storeDeviceFromResponse(response.data.device);
    }

    return response;
  } catch (err) {
    const message = handleServiceError(err, 'Failed to fetch current user');
    if(!isInAuthPage()) {
      globalThis.location.replace(paths.auth.custom.signIn);
    }
    throw new Error(message);
  }
}

/**
 * Logs out the current user from /sessions/logout endpoint
 * Uses cookies for authentication (no Authorization header needed)
 */
export async function logoutUser(): Promise<LogoutResponse> {
  try {
    const response = await authPostMethod<LogoutResponse>(endPoints.SIGN_OUT);
    
    // The response format is { data: {} }, so we just need to check if response exists
    if (!response) {
      throw new Error('Logout request failed');
    }
    return response;
  } catch (err) {
    const message = handleServiceError(err, 'Failed to logout user');
    throw new Error(message);
  }
}
function isInAuthPage(): boolean {
  if (globalThis.window === undefined) return false;
  const path = globalThis.location.pathname;
  return globalThis.location.pathname.startsWith("/auth/custom") || path === "/";
}
