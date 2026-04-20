
/**
 * str2ab
 * -------
 * Convert a regular string into an ArrayBuffer (Uint8Array).
 * WebAuthn API requires ArrayBuffer for challenge and user IDs during registration/login.
 *
 * Example:
 *   const buf = str2ab('hello');
 */
export const str2ab = (str: string) => new TextEncoder().encode(str);

/**
 * base64UrlToUint8Array
 * ----------------------
 * Convert a base64url-encoded string to a Uint8Array (ArrayBuffer).
 * WebAuthn backends often send challenge and credential IDs in base64url format.
 * Browsers require ArrayBuffer, so this function decodes base64url → Uint8Array.
 *
 * Example:
 *   const arr = base64UrlToUint8Array('SGVsbG8td29ybGQ_');
 */
export const base64UrlToUint8Array = (base64url: string) =>
  Uint8Array.from(
    atob(base64url.replaceAll('_', '/').replaceAll('-', '+')), // Convert URL-safe → normal base64
    c => (c.codePointAt(0) ?? 0) // Map each char to its numeric byte (codePointAt for unicode)
  );

/**
 * createCredential
 * ----------------
 * Wrapper around `navigator.credentials.create()` for passkey/biometric registration.
 * Accepts `PublicKeyCredentialCreationOptions` from backend.
 * Returns a `PublicKeyCredential` which contains the attestation data for backend verification.
 *
 * Example:
 *   const credential = await createCredential(publicKeyOptions);
 */
export const createCredential = async (publicKey: PublicKeyCredentialCreationOptions) =>
  (await navigator.credentials.create({ publicKey })) as PublicKeyCredential;

/**
 * getAssertion
 * ------------
 * Wrapper around `navigator.credentials.get()` for passkey/biometric login.
 * Accepts `PublicKeyCredentialRequestOptions` from backend.
 * Returns a `PublicKeyCredential` which contains the assertion data for backend verification.
 *
 * Example:
 *   const assertion = await getAssertion(publicKeyOptions);
 */
export const getAssertion = async (publicKey: PublicKeyCredentialRequestOptions) =>
  (await navigator.credentials.get({ publicKey })) as PublicKeyCredential;
