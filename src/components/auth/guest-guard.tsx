'use client';

/**
 * GuestGuard Component
 * ====================
 * Protects routes meant only for unauthenticated users (guests).
 *
 * Features:
 * - Verifies session cookie existence via /api/cookie endpoint
 * - Shows splash screen during authentication check
 * - Redirects authenticated users to dashboard
 * - Allows access to sign-in/sign-up pages for guests
 *
 * @module components/auth/guest-guard
 */

import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import SplashScreen from '@/components/sections/splash-screen';
import { usePasskeyState } from '@/hooks/use-passkey-state';
import { useUser } from '@/hooks/use-user';
import { paths } from '@/paths';
import { verifySessionCookie } from '@/utils/session-utils';

// =============================================================================
// Types
// =============================================================================

export interface GuestGuardProps {
  /** Child components to render when user is a guest (not authenticated) */
  children: React.ReactNode;
}

// =============================================================================
// Component
// =============================================================================

/**
 * GuestGuard - Guest-Only Route Protection Wrapper
 *
 * @description
 * Wraps guest-only routes (sign-in, sign-up, etc.) and prevents
 * authenticated users from accessing them.
 * Uses session cookie verification as the primary authentication check.
 *
 * Flow:
 * 1. Check if session_jwt cookie exists
 * 2. If cookie exists → Redirect to dashboard (user is already logged in)
 * 3. If no cookie → Allow access to guest routes
 *
 * @param props - Component props
 * @param props.children - Child components to render when user is a guest
 *
 * @returns JSX element (SplashScreen, Alert, or children)
 *
 * @example
 * <GuestGuard>
 *   <SignInPage />
 * </GuestGuard>
 */
export function GuestGuard({ children }: Readonly<GuestGuardProps>): React.JSX.Element | null {
  // =============================================================================
  // Hooks
  // =============================================================================

  const router = useRouter();
  const { error } = useUser();
  const { isPasskeyEnabled } = usePasskeyState(); 

  // =============================================================================
  // State
  // =============================================================================

  /** Tracks whether the authentication check is in progress */
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  // =============================================================================
  // Effects
  // =============================================================================

  /**
   * Performs authentication check on component mount.
   *
   * The check verifies if a valid session cookie exists:
   * - Cookie exists → User is authenticated, redirect to dashboard
   * - No cookie → User is a guest, allow access to guest routes
   */
  React.useEffect(() => {
    const checkAuthentication = async (): Promise<void> => {
      // Verify session cookie via API
      const hasValidSession = await verifySessionCookie();
    

      if (hasValidSession && isPasskeyEnabled) {
        // User is already authenticated - redirect to dashboard
        router.replace(paths.dashboard.overview);
        return;
      }

      // No valid session - allow guest access
      setIsChecking(false);
    };

    checkAuthentication().catch(() => {
      // On error, allow guest access (fail open for guest routes)
      setIsChecking(false);
    });
  }, [router]);

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

  // User is a guest - render guest-only content
  return <>{children}</>;
}
