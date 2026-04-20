'use client';

import { useAsync } from '@/hooks/use-async'; // Custom hook to handle loading, error, success states
import { base64UrlToUint8Array, getAssertion } from '@/utils/webauthn'; // WebAuthn helper functions
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * PasskeyLogin Component
 * ----------------------
 * Provides UI and logic for logging in using WebAuthn / Passkeys.
 * Works in combination with a backend that implements WebAuthn challenges.
 */
export default function PasskeyLogin() {
  const { t } = useTranslation();
  // Destructure state and helper from custom async hook
  const { loading, message, error, run, setMessage } = useAsync();

  /**
   * handleLogin
   * -----------
   * Triggered when user clicks "Login with Passkey".
   * Performs the WebAuthn login flow:
   * 1. Fetches login challenge from backend
   * 2. Converts necessary data from base64url to ArrayBuffer
   * 3. Calls navigator.credentials.get() to prompt biometric/device authentication
   * 4. Sends the assertion back to backend for verification
   */
  const handleLogin = async () => {
    await run(async () => {
      // Step 1: Request a WebAuthn login challenge from the backend
      const { data } = await axios.post(
        '/auth/passkeys/login/start',
        {}, // No body required for starting login
        { withCredentials: true } // Include cookies if backend requires session
      );

      const publicKey = data.publicKey; // WebAuthn options for navigator.credentials.get()

      // Step 2: Convert base64url challenge & credential IDs to ArrayBuffer
      // Browsers expect ArrayBuffer, backend typically sends base64url string
      publicKey.challenge = base64UrlToUint8Array(publicKey.challenge);
      publicKey.allowCredentials = publicKey.allowCredentials.map((cred: any) => ({
        ...cred,
        id: base64UrlToUint8Array(cred.id), // Convert credential ID for browser
      }));

      // Step 3: Request assertion from the device (biometric prompt)
      // This triggers Touch ID / Face ID / Windows Hello / PIN, depending on platform
      const assertion = await getAssertion(publicKey);

      if (!assertion) throw new Error(t('passkey:loginFailed'));

      // Step 4: Send assertion to backend for verification
      // Backend validates the signature and issues a full-access JWT
      const res = await axios.post(
        '/auth/passkeys/login/finish',
        { credential: assertion },
        { withCredentials: true }
      );

      // Display success message and log JWT for now
      setMessage(t('passkey:loginSuccess'));
    });
  };

  // --- Component UI ---
  return (
    <Box
      component={motion.div} // Adds Framer Motion animation
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      textAlign="center"
      mt={4}
    >
      <Typography variant="h6" gutterBottom>
        {t('passkey:loginTitle')}
      </Typography>

      {/* Login button */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogin}
        disabled={loading} // Disable button while login is in progress
      >
        {loading ? <CircularProgress size={24} /> : t('passkey:loginButton')}
      </Button>

      {/* Success / Error feedback */}
      {message && <Alert sx={{ mt: 2 }} severity="success">{message}</Alert>}
      {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}
    </Box>
  );
}
