import { logger } from "@/lib/default-logger";
import { authPostMethod } from "@/services/api";
import endPoints from "@/services/urls";
import { store } from "@/store";
import { setWebauthnRegistrationId } from "@/store/slices/passkey-slice";
import { setExpiresAt } from "@/store/slices/user-slice";
import { bufferToBase64Url } from "@/utils/buffer-to-base64";
import { handleServiceError } from "@/utils/error-handler";
import { PasskeyRegisterFinishResponse } from "@/utils/user-auth";
import { base64UrlToUint8Array } from "@/utils/webauthn";
 
 
/* -----------------------------------------------------------------------------
* Step 1️⃣ : Request Registration Options (Challenge) from Backend
* -------------------------------------------------------------------------- */
export async function fetchRegistrationOptions(): Promise<{ publicKeyOptions: PublicKeyCredentialCreationOptions; userId: string; }> {
  const START_URL = endPoints.PASSKEY_REGISTER_START;
  try {
    const response = await authPostMethod<{ data: { publicKey: any; user_id: string; }; }>(
      START_URL,
      {}
    );
 
    const rawPublicKey = response?.data?.publicKey;
    if (!rawPublicKey) throw new Error("Invalid backend response: missing `publicKey` field");
 
    const publicKeyOptions =
      typeof rawPublicKey === "string" ? JSON.parse(rawPublicKey) : rawPublicKey;
 
    // Convert binary fields required by WebAuthn
    publicKeyOptions.challenge = base64UrlToUint8Array(publicKeyOptions.challenge);
    publicKeyOptions.user.id = base64UrlToUint8Array(publicKeyOptions.user.id);
 
    // Convert excludeCredentials if present
    if (publicKeyOptions.excludeCredentials?.length) {
      publicKeyOptions.excludeCredentials = publicKeyOptions.excludeCredentials.map((cred: any) => ({
        ...cred,
        id: base64UrlToUint8Array(cred.id),
      }));
    }
    // ✅ Enforce local device authenticator with verification
    publicKeyOptions.authenticatorSelection = {
      userVerification: "required",          // Must verify via biometric or PIN
      residentKey: "preferred",              // Allow discoverable credentials
      // authenticatorAttachment: "platform",   // Only built-in (Touch ID / Face ID / Windows Hello)
    };
 
    // Optional: ensure attestation conveys meaningful info
    publicKeyOptions.attestation = "none"; // or "direct" if backend expects it
 
    return {
      publicKeyOptions,
      userId: response.data.user_id,
    };
  } catch (err: any) {
    const message = handleServiceError(
      err,
      "Failed to fetch registration options. Please try again."
    );
    throw new Error(message);
  }
}
 
/* -----------------------------------------------------------------------------
* Step 2️⃣ : Send Attestation (Credential) to Backend
* -------------------------------------------------------------------------- */
/**
 * Submits the WebAuthn attestation credential to complete passkey registration.
 * 
 * Note: The /passkeys/register/finish response IS wrapped in `data` object.
 * Response structure: { data: { user, session, passkey } }
 * 
 * @param publicKeyOptions - The public key options from registration start
 * @param credential - The WebAuthn credential from navigator.credentials.create()
 * @param userId - The user ID from registration start
 * @returns Promise with JWT and user object
 */
export async function submitAttestation(
  publicKeyOptions: any,
  credential: PublicKeyCredential,
  userId: string
): Promise<{ jwt: any; user: Record<string, any> | null }> {
  const FINISH_URL = endPoints.PASSKEY_REGISTER_FINISH;
  try {
    const attestationResponse = credential.response as AuthenticatorAttestationResponse;
 
    // Encode all ArrayBuffers as Base64URL - matches API spec
    const finishPayload = {
      credential: {
        id: credential.id,
        type: credential.type,
        rawId: bufferToBase64Url(credential.rawId),
        response: {
          attestationObject: bufferToBase64Url(attestationResponse.attestationObject),
          clientDataJSON: bufferToBase64Url(attestationResponse.clientDataJSON),
        },
        clientExtensionResults: credential.getClientExtensionResults(),
      },
    };
 
    // Response is wrapped in `data` for passkey register finish
    const finishRes = await authPostMethod<PasskeyRegisterFinishResponse>(FINISH_URL, finishPayload);
 
    const expiresAtSeconds = finishRes?.data?.session?.expires_at ?? null;
    
    // Store passkey ID as webauthn registration ID
    store.dispatch(setWebauthnRegistrationId(finishRes?.data?.passkey?.id ?? null));

    /**
     * Set expires at state in Redux
     */
    if (expiresAtSeconds) {
      const expiresAt = expiresAtSeconds;
      logger.debug('[Token] Setting expires at:', expiresAt);
      // Dispatch Redux action to update store
      store.dispatch(setExpiresAt(expiresAt));
    }

    const jwt = expiresAtSeconds?.toString() ?? null;
    const user = finishRes?.data?.user ? { ...finishRes.data.user, id: finishRes.data.user.user_id } : null;
 
    return { jwt, user };
  } catch (err: any) {
    store.dispatch(setWebauthnRegistrationId(null));
    const message = handleServiceError(err, "Failed to complete passkey registration.");
    throw new Error(message);
  }
}
 
 