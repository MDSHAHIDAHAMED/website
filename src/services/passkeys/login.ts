import { PasskeyLoginStartResponse } from "@/hooks/use-passkey-login";
import { logger } from "@/lib/default-logger";
import { authPostMethod } from "@/services/api";
import endPoints from "@/services/urls";
import { store } from "@/store";
import { setWebauthnRegistrationId } from "@/store/slices/passkey-slice";
import { setExpiresAt } from "@/store/slices/user-slice";
import { bufferToBase64Url } from "@/utils/buffer-to-base64";
import { storeDeviceFromResponse } from "@/utils/device-manager";
import { handleServiceError } from "@/utils/error-handler";
import { showErrorToast } from "@/utils/toast";
import { PasskeyLoginFinishResponse } from "@/utils/user-auth";
import { base64UrlToUint8Array } from "@/utils/webauthn";
  /**
   * Prepares and safely parses PublicKeyCredentialRequestOptions.
   * Ensures proper binary conversions for WebAuthn API.
   */
  function preparePublicKeyOptions(
    raw: string | PublicKeyCredentialRequestOptions
  ): PublicKeyCredentialRequestOptions {
    const publicKey =
      typeof raw === 'string' ? JSON.parse(raw) : structuredClone(raw);
  
    publicKey.challenge = base64UrlToUint8Array(publicKey.challenge);
    if (publicKey.allowCredentials?.length) {
      publicKey.allowCredentials = publicKey.allowCredentials.map((cred: any) => ({
        ...cred,
        id: base64UrlToUint8Array(cred.id),
      }));
    }
    return publicKey;
  }
  
  /* -------------------------------------------------------------------------- */
  /*                               API FUNCTIONS                                */
  /* -------------------------------------------------------------------------- */
  
  /**
   * Step 1: Request WebAuthn challenge & credential options from backend.
   * Uses centralized error handling to prevent crashes.
   */
  async function beginPasskeyLogin(): Promise<PublicKeyCredentialRequestOptions> {
    try {
      const response = await authPostMethod<PasskeyLoginStartResponse>(
        endPoints.PASSKEY_LOGIN_START,
        {}
      );
  
      const publicKeyRaw = response?.data?.publicKey;
      if (!publicKeyRaw)
        throw new Error('Invalid server response: missing `publicKey`.');
  
      return preparePublicKeyOptions(publicKeyRaw);
    } catch (err) {
      const message = handleServiceError(err, 'Failed to initiate passkey login.');
      throw new Error(message); // Re-throw to let parent catch handle it
    }
  }
  
  /**
   * Step 2: Complete the passkey login by sending signed assertion to backend.
   * Applies consistent structured error handling.
   * 
   * Note: The /passkeys/login/finish response IS wrapped in `data` object.
   * Response structure: { data: { user, session, passkey, device } }
   */
  async function completePasskeyLogin(assertion: PublicKeyCredential): Promise<{ jwt: string | null; user: Record<string, any> | null }> {
    try {
      const credentialResponse = assertion.response as AuthenticatorAssertionResponse;
  
      const payload = {
        credential: {
          id: assertion.id,
          type: assertion.type,
          rawId: bufferToBase64Url(assertion.rawId),
          response: {
            authenticatorData: bufferToBase64Url(credentialResponse.authenticatorData),
            clientDataJSON: bufferToBase64Url(credentialResponse.clientDataJSON),
            signature: bufferToBase64Url(credentialResponse.signature),
            userHandle: credentialResponse.userHandle
              ? bufferToBase64Url(credentialResponse.userHandle)
              : null,
          },
          clientExtensionResults: assertion.getClientExtensionResults(),
        },
      };
  
      // Note: Response is NOT wrapped in `data` for passkey login finish
      const response = await authPostMethod<PasskeyLoginFinishResponse>(
        endPoints.PASSKEY_LOGIN_FINISH,
        payload
      );

      console.log('[PasskeyLogin] Raw response from /passkeys/login/finish:', response);

      // Extract data from response
      const { user, session, passkey, device } = response?.data ?? {};

      // Store passkey ID as webauthn registration ID
      store.dispatch(setWebauthnRegistrationId(passkey?.id ?? null));

      // Store device info for future authenticated requests
      if (device) {
        console.log('[PasskeyLogin] Storing device info:', device);
        storeDeviceFromResponse(device);
      }
 
      /**
       * Set expires at state in Redux
       */
      if (session?.expires_at) {
        const expiresAt = session.expires_at;
        console.log('[PasskeyLogin] Setting expires_at in Redux:', expiresAt);
        logger.debug('[Token] Setting expires at:', expiresAt);
        // Dispatch Redux action to update store
        store.dispatch(setExpiresAt(expiresAt));
      }
      
      // Return expires_at as JWT indicator and user object
      const jwt = session?.expires_at?.toString() ?? null;
      const userData = user ? { ...user, id: user.user_id } : null;
      
      console.log('[PasskeyLogin] Returning:', { jwt, hasUser: !!userData, user: userData });
      
      return { jwt, user: userData };
    } catch (err) {
      store.dispatch(setWebauthnRegistrationId(null));
      const message = handleServiceError(err, 'Failed to complete passkey login.');
      showErrorToast('passkey-login-failed', message);
      return { jwt: null, user: null };
    }
  }
export { beginPasskeyLogin, completePasskeyLogin };
