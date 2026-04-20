'use client';

/**
 * AuthGuard Component
 * ===================
 * Protects routes that require an authenticated user.
 *
 * Features:
 * - Verifies session cookie existence via /api/cookie endpoint
 * - Shows splash screen during authentication check
 * - Redirects unauthenticated users to sign-in page
 * - Clears all auth-related state on session expiry
 *
 * @module components/auth/auth-guard
 */

import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useDispatch } from 'react-redux';

import SplashScreen from '@/components/sections/splash-screen';
import { usePasskeyState } from '@/hooks/use-passkey-state';
import { useUser } from '@/hooks/use-user';
import { paths } from '@/paths';
import { store } from '@/store';
import { clearAllDeviceInfo } from '@/store/slices/device-slice';
import { clearPasskeyData } from '@/store/slices/passkey-slice';
import { setExpiresAt } from '@/store/slices/user-slice';
import { verifySessionCookie } from '@/utils/session-utils';

// =============================================================================
// Types
// =============================================================================

export interface AuthGuardProps {
  /** Child components to render when user is authenticated */
  children: React.ReactNode;
}

// =============================================================================
// Component
// =============================================================================

/**
 * AuthGuard - Authentication Protection Wrapper
 *
 * @description
 * Wraps protected routes and verifies user authentication status.
 * Uses session cookie verification as the primary authentication check.
 *
 * Flow:
 * 1. Check if session_jwt cookie exists
 * 2. If cookie exists → Allow access, render children
 * 3. If no cookie → Clear auth state and redirect to sign-in
 *
 * @param props - Component props
 * @param props.children - Child components to render when authenticated
 *
 * @returns JSX element (SplashScreen, Alert, or children)
 *
 * @example
 * <AuthGuard>
 *   <DashboardLayout />
 * </AuthGuard>
 */
export function AuthGuard({ children }: Readonly<AuthGuardProps>): React.JSX.Element | null {
  // =============================================================================
  // Hooks
  // =============================================================================

  const router = useRouter();
  const dispatch = useDispatch();
  const { error } = useUser();
  const { setIsPasskeyEnabled, isPasskeyEnabled } = usePasskeyState();

  // =============================================================================
  // State
  // =============================================================================

  /** Tracks whether the authentication check is in progress */
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  // =============================================================================
  // Callbacks
  // =============================================================================

  /**
   * Clears all authentication-related state and redirects to sign-in.
   *
   * This function is called when:
   * - Session cookie is missing or invalid
   * - User session has expired
   *
   * Actions performed:
   * 1. Clear token expiration from user slice
   * 2. Clear passkey data from passkey slice
   * 3. Clear device info from device slice
   * 4. Reset passkey enabled state
   * 5. Redirect to sign-in page
   */
  const clearAuthAndRedirect = React.useCallback((): void => {
    // Clear Redux state
    dispatch(setExpiresAt(null as unknown as number));
    store.dispatch(clearPasskeyData());
    store.dispatch(clearAllDeviceInfo());

    // Reset passkey state
    setIsPasskeyEnabled(false);

    // Redirect to sign-in page
    router.replace(paths.auth.custom.signIn);
  }, [dispatch, router, setIsPasskeyEnabled]);

  // =============================================================================
  // Effects
  // =============================================================================

  /**
   * Performs authentication check on component mount and state changes.
   *
   * The check verifies if a valid session cookie exists:
   * - Cookie exists → User is authenticated, allow access
   * - No cookie → Clear state and redirect to sign-in
   */
  React.useEffect(() => {
    const checkAuthentication = async (): Promise<void> => {
      // Verify session cookie via API
      const hasValidSession = await verifySessionCookie();

      if (hasValidSession && isPasskeyEnabled) {
        // Valid session - allow access
        setIsChecking(false);
        return;
      }

      // No valid session - clear auth and redirect
      clearAuthAndRedirect();
    };

    checkAuthentication().catch(() => {
      // On error, redirect to sign-in for safety
      clearAuthAndRedirect();
    });
  }, [clearAuthAndRedirect]);

  // =============================================================================
  // Render
  // =============================================================================

  // Show splash screen while checking authentication
  if (isChecking) {
    return <SplashScreen />;
  }

  // Show error alert if user data fetch failed
  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  // User is authenticated - render protected content
  return <>{children}</>;
}
