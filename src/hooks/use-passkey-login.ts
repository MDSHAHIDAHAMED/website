'use client';

import { beginPasskeyLogin, completePasskeyLogin } from '@/services/passkeys/login';
import { handleServiceError } from '@/utils/error-handler';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useUser } from '@/hooks/use-user';
import { useWalletState } from '@/hooks/use-wallet';
import { logger } from '@/lib/default-logger';

import { usePasskeyState } from './use-passkey-state';

/* -------------------------------------------------------------------------- */
/*                              Type Definitions                              */
/* -------------------------------------------------------------------------- */

/** Response structure for `/passkeys/login/start` */
export interface PasskeyLoginStartResponse {
  data: {
    publicKey: string | PublicKeyCredentialRequestOptions;
  };
}

/** Hook return type */
interface UsePasskeyLoginResult {
  loading: boolean;
  error: string | null;
  loginWithPasskey: () => Promise<string | null>;
}

/* -------------------------------------------------------------------------- */
/*                                 MAIN HOOK                                  */
/* -------------------------------------------------------------------------- */

/**
 * usePasskeyLogin()
 * -----------------------------------------------------------------------------
 * Custom React hook to handle the full WebAuthn passkey login flow.
 *
 * High-level flow:
 *  1. Begin: Fetch WebAuthn challenge + credential options
 *  2. Prompt: Trigger native biometric prompt (Touch ID, Face ID, etc.)
 *  3. Finish: Send signed credential to backend for validation
 *  4. Done: Receive and return session token (JWT)
 *
 * This hook ensures:
 *  - Strong typing
 *  - Centralized error handling
 *  - Clean UI feedback via toast notifications
 */
export function usePasskeyLogin(): UsePasskeyLoginResult {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser(); // ⬅️ inject context action
  const { setIsPasskeyEnabled } = usePasskeyState(); // ⬅️ use Redux-persisted passkey state
  const { disconnect } = useWalletState('ethereum'); // ⬅️ wallet disconnect function

  /**
   * Login with passkey
   * Disconnects any connected wallet before starting the login process
   */
  const loginWithPasskey = useCallback(async (): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      /* -------------------------------------------------------
       * 0. Disconnect wallet if connected (cleanup before login)
       * ------------------------------------------------------- */
      try {
        await disconnect();
      } catch (disconnectError) {
        // Log but don't block login if wallet disconnect fails
        logger.warn('[PasskeyLogin] Wallet disconnect failed:', disconnectError);
      }

      /* -------------------------------------------------------
       * 1. Begin: Request challenge + credential options
       * ------------------------------------------------------- */
      const publicKey = await beginPasskeyLogin();

      /* -------------------------------------------------------
       * 2. Trigger device's native WebAuthn prompt
       * ------------------------------------------------------- */
      const credential = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential;
      if (!credential) throw new Error('No credential returned from WebAuthn.');

      /* -------------------------------------------------------
       * 3. Finish: Send signed assertion to backend
       * ------------------------------------------------------- */
      // 3. Complete → Send signed assertion back to backend
      const { jwt, user } = await completePasskeyLogin(credential);

      if (!jwt) {
        return null;
      }

      if (user) {
        setUser(user); // ⬅️ store logged-in user globally
        setIsPasskeyEnabled(true);
      } else {
        setIsPasskeyEnabled(true);
      }

      /* -------------------------------------------------------
       * Success: Notify & return token
       * ------------------------------------------------------- */
      showSuccessToast('passkey-login-success', t('passkey:loginSuccess'));
      return jwt;
    } catch (err: any) {
      const code = err?.code;
      const message = handleServiceError(err, t('passkey:loginFailed'));
      logger.error(code, 'code');

      setError(message);

      switch (code) {
        case 'NotAllowedError':
          showErrorToast('passkey-login-cancelled', t('passkey:loginCancelled'));
          break;
        case 'NotSupportedError':
          showErrorToast('passkey-not-supported', t('passkey:notSupported'));
          break;
        case 'InvalidStateError':
          showErrorToast('passkey-not-available', t('passkey:notAvailable'));
          break;
        case 'ConstraintError':
          showErrorToast('passkey-device-constraints', t('passkey:deviceConstraints'));
          break;
        case 'TimeoutError':
          showErrorToast('passkey-login-timeout', t('passkey:loginTimeout'));
          break;
        case 0:
          showErrorToast('passkey-login-cancelled', t('passkey:loginCancelled'));
          break;
        default:
          showErrorToast('passkey-login-failed', message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [t, setUser, setIsPasskeyEnabled, disconnect]);

  return { loading, error, loginWithPasskey };
}

