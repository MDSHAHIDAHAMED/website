'use client';

import { fetchRegistrationOptions, submitAttestation } from '@/services/passkeys/register';
import { handleServiceError } from '@/utils/error-handler';
import { createCredential } from '@/utils/webauthn';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { type UserContextValue } from '@/contexts/auth/types';
import { UserContext } from '@/contexts/auth/user-context';
import { useAsync } from '@/hooks/use-async';
import { usePasskeyState } from '@/hooks/use-passkey-state';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

/**
 * ---------------------------------------------------------------------
 * usePasskeyRegister
 * ---------------------------------------------------------------------
 * Custom hook that handles full WebAuthn passkey registration flow:
 * 
 * Flow:
 *  1. Request registration options (publicKey) from backend
 *  2. Trigger: Trigger browser's biometric prompt to create credential
 *  3. Finish: Send generated credential back to backend to complete setup
 *
 * Returns:
 *  - loading: boolean → indicates async operation state
 *  - error: string | null → contains error message (if any)
 *  - registerPasskey: function → triggers registration flow
 * ---------------------------------------------------------------------
 */
export function usePasskeyRegister() {
  const { t } = useTranslation();
  const { loading, error, run } = useAsync();
  const { setUser } = useContext(UserContext) as UserContextValue; // ⬅️ inject context action
  const { setIsPasskeyEnabled, isPasskeyEnabled } = usePasskeyState(); // ⬅️ use Redux-persisted passkey state

  const registerPasskey = useCallback(async (): Promise<string | undefined> => {
    let token: string | undefined = undefined;

    // Check if user already has passkey enabled
    if (isPasskeyEnabled) {
      showErrorToast('passkey-already-enabled', t('passkey:alreadyEnabled'));
      return undefined;
    }

    await run(async () => {
      try {
        // 1. Fetch registration challenge (with internal error handling)
        const { publicKeyOptions, userId } = await fetchRegistrationOptions();

        // 2. Trigger WebAuthn native UI (Touch ID / Face ID / PIN)
        const credential = await createCredential(publicKeyOptions);
        if (!credential) throw new Error('Credential creation failed.');

        // 3. Send credential to backend to finalize registration
        const { jwt: issuedJwt, user } = await submitAttestation(publicKeyOptions, credential, userId);
        if (!issuedJwt) throw new Error('Registration failed: missing session token.');
        token = issuedJwt;
        if (user) {
          setUser(user); // ⬅️ store logged-in user globally
          setIsPasskeyEnabled(true);
        }

        showSuccessToast('passkey-register-success', t('passkey:registerSuccess'));
      } catch (err: any) {
        // -----------------------------------------------------------------
        // Centralized Error Handling (WebAuthn + Network + Logical)
        // -----------------------------------------------------------------

        const code = err?.code;
        const message = handleServiceError(err, t('passkey:registerFailed'));

        // WebAuthn-specific error cases
        switch (code) {
          case 'NotSupportedError':
            showErrorToast('passkey-register-not-supported', t('passkey:registerNotSupported'));
            break;
          case 'NotAllowedError':
            showErrorToast('passkey-register-cancelled', t('passkey:registerCancelled'));
            break;
          case 'SecurityError':
            showErrorToast('passkey-secure-connection', t('passkey:secureConnection'));
            break;
          case 'InvalidStateError':
            showErrorToast('passkey-already-registered', t('passkey:alreadyRegistered'));
            break;
          case 'ConstraintError':
            showErrorToast('passkey-register-constraints', t('passkey:registerConstraints'));
            break;
          case 'TimeoutError':
            showErrorToast('passkey-register-timeout', t('passkey:registerTimeout'));
            break;
            case 0:
            showErrorToast('passkey-register-cancelled', t('passkey:registerCancelled'));
            break;
          default:
            // Check for specific error messages
            if (message.includes('already registered') || message.includes('credential already exists')) {
              showErrorToast('passkey-credential-exists', t('passkey:credentialExists'));
            } else if (message.includes('authenticator that contains one of the credentials already registered')) {
              showErrorToast('passkey-device-already-registered', t('passkey:deviceAlreadyRegistered'));
            } else {
              showErrorToast('passkey-register-failed', message);
            }
        }
        throw err;
      }
    });

    return token;
  }, [run, t]);

  return { loading, error, registerPasskey };
}
