'use client';

/**
 * User Context - Optimized for OTP and Auth Management
 * =====================================================
 *
 * Responsibilities:
 * 1️⃣ Track authenticated user (user)
 * 2️⃣ Track OTP verification flow (otpMethodId + otpEmail)
 * 3️⃣ Centralize session validation (checkSession)
 * 4️⃣ Provide utility functions: setUser, clearUser, refreshUser, setOtpMethodId, setOtpEmail
 * 
 * Principles applied:
 * - SOLID: Each state field has a clear, single responsibility.
 * - DRY: Centralized API error handling and toast logic.
 * - KISS: Clear separation of pre-auth and auth state.
 * - YAGNI: No unnecessary flags or duplicate states.
 */

import { authClient } from '@/lib/auth/custom/client';
import { logger } from '@/lib/default-logger';
import type { User } from '@/types/user';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import i18next from 'i18next';
import * as React from 'react';
import type { UserContextValue } from '../types';

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: Readonly<UserProviderProps>): React.JSX.Element {
  // ---------------------------------------------------------------------------
  // State: Authenticated user + pre-auth OTP info
  // ---------------------------------------------------------------------------
  const [state, setState] = React.useState<{
    user: User | null;           // Logged-in user
    error: string | null;        // Global error
    isLoading: boolean;          // Loading state for session API
    otpMethodId: string | null;  // OTP verification method ID
    otpEmail: string | null;     // Email used in OTP pre-auth flow
  }>({
    user: null,
    error: null,
    isLoading: true,
    otpMethodId: null,
    otpEmail: null,
  });

  // ---------------------------------------------------------------------------
  // Check session and update authenticated user state
  // ---------------------------------------------------------------------------
  const checkSession = React.useCallback(async (showToast = false) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Fetch user from /me endpoint
      const { data, error } = await authClient.getUser();

      // Handle error from /me call
      if (error !== undefined) {
        const message = error || i18next.t('auth:failedToValidateSession');
        setState(prev => ({ ...prev, user: null, error: message, isLoading: false }));
        if (showToast) showErrorToast('user-context-failed-to-validate-session', message);
        return;
      }

      // Update user state
      setState(prev => ({ ...prev, user: data ?? null, error: null, isLoading: false }));
      if (showToast && data) showSuccessToast('user-context-session-validated-successfully', i18next.t('auth:sessionValidatedSuccessfully'));
    } catch (err: any) {
      const message = err?.message || 'Something went wrong';
      setState(prev => ({ ...prev, user: null, error: message, isLoading: false }));
      if (showToast) showErrorToast('user-context-failed-to-validate-session', message);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Clear user state (logout)
  // ---------------------------------------------------------------------------
  const clearUser = React.useCallback(() => {
    setState({
      user: null,
      error: null,
      isLoading: false,
      otpMethodId: null,
      otpEmail: null,
    });
  }, []);

  // ---------------------------------------------------------------------------
  // Set authenticated user
  // ---------------------------------------------------------------------------
  const setUser = React.useCallback((user: User | null) => {
    setState(prev => ({ ...prev, user, error: null, isLoading: false }));
  }, []);

  // ---------------------------------------------------------------------------
  // Refresh user data with optional toast
  // ---------------------------------------------------------------------------
  const refreshUser = React.useCallback(async () => {
    await checkSession(true);
  }, [checkSession]);

  // ---------------------------------------------------------------------------
  // OTP method ID setter
  // ---------------------------------------------------------------------------
  const setOtpMethodId = React.useCallback((methodId: string | null) => {
    setState(prev => ({ ...prev, otpMethodId: methodId }));
  }, []);

  // ---------------------------------------------------------------------------
  // OTP email setter (pre-auth flow)
  // ---------------------------------------------------------------------------
  const setOtpEmail = React.useCallback((email: string | null) => {
    setState(prev => ({ ...prev, otpEmail: email }));
  }, []);

  // ---------------------------------------------------------------------------
  // Initialize session on mount
  // ---------------------------------------------------------------------------
  React.useEffect(() => {
    checkSession().catch(err => logger.error('Initial session check failed:', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Context value exposed to components
  // ---------------------------------------------------------------------------
  const contextValue = {
    ...state,
    checkSession,
    clearUser,
    setUser,
    refreshUser,
    setOtpMethodId,
    setOtpEmail,
  } satisfies UserContextValue;

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
