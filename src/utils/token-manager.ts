'use client';

import { logger } from '@/lib/default-logger';
import { paths } from '@/paths';
import { authPostMethod } from '@/services/api';
import endPoints from '@/services/urls';
import { store } from '@/store';
import { clearPasskeyData } from '@/store/slices/passkey-slice';
import { setExpiresAt } from '@/store/slices/user-slice';

/* ---------------------------------------------------------------------------
   TOKEN MANAGER (Handles: expiry check + renew + timestamp logic)
--------------------------------------------------------------------------- */

// Prevent concurrent refresh calls
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Read token expiry from Redux (stored in SECONDS)
 */
export function getTokenExpiry(): number | null {
  const state = store.getState();
  const expiry = state.user.expiresAt;
  return expiry ? expiry * 1000 : null; // convert to ms
}

/**
 * Check expiry state
 */
export async function checkTokenExpiry(): Promise<{
  isExpired: boolean;
  isNearExpiry: boolean;
  expiresAtMs: number | null;
}> {
  const expiresAtSec = store.getState().user.expiresAt;

  if (!expiresAtSec) {
    store.dispatch(setExpiresAt(0));
    return { isExpired: true, isNearExpiry: false, expiresAtMs: null };
  }

  const expiresAtMs = expiresAtSec * 1000;
  const nowMs = Date.now();

  const diffMs = expiresAtMs - nowMs;

  const isExpired = diffMs <= 0;
  const isNearExpiry = diffMs > 0 && diffMs < 60_000; // < 60 sec

  return { isExpired, isNearExpiry, expiresAtMs };
}

/**
 * Renew HTTP-only cookie session
 */
export async function renewToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const response = await authPostMethod<{
        data?: {
          session?: { expires_at: number };
        };
      }>(endPoints.SESSION_RENEW, {});

      const newExp = response?.data?.session?.expires_at;

      if (newExp) {
        store.dispatch(setExpiresAt(newExp)); // store SECONDS as given
        logger.debug('[Token] Renewed. New Expires At:', newExp);
      }
      isRefreshing = false;
      refreshPromise = null;
      return true;
    } catch {
      store.dispatch(clearPasskeyData());
      globalThis.location.replace(paths.auth.custom.signIn);
      isRefreshing = false;
      refreshPromise = null;
      return false;
    }
  })();

  return refreshPromise;
}
