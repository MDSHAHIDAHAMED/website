'use client';

import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { useAsync } from '@/hooks/use-async'; // Custom hook to manage loading, error, success states
import { base64UrlToUint8Array, createCredential } from '@/utils/webauthn'; // WebAuthn helpers

/**
 * PasskeyRegister Component
 * -------------------------
 * Provides UI and logic for registering a passkey / biometric credential.
 * Steps:
 * 1. Request registration options (challenge, user info) from backend
 * 2. Convert base64url strings to ArrayBuffers (required by WebAuthn)
 * 3. Call navigator.credentials.create() to register on the device
 * 4. Send credential back to backend to finalize registration
 */
export default function PasskeyRegister() {
  const { t } = useTranslation();
  const { loading, message, error, run, setMessage } = useAsync();

  /**
   * handleRegister
   * --------------
   * Triggered when user clicks "Create Passkey".
   * Handles the full registration flow with WebAuthn.
   */
  const handleRegister = async () => {
    await run(async () => {
      // Step 1️⃣: Request passkey registration options from backend
      // Backend returns `publicKey` options (challenge, user ID, etc.)
      const { data } = await axios.post(
        '/auth/passkeys/register/start',
        {},
        { withCredentials: true } // Send cookies if backend requires session
      );

      const publicKey = data.publicKey;

      // Step 2️⃣: Convert base64url fields to ArrayBuffer
      // WebAuthn requires ArrayBuffer, backend typically sends base64url strings
      publicKey.challenge = base64UrlToUint8Array(publicKey.challenge);
      publicKey.user.id = base64UrlToUint8Array(publicKey.user.id);

      // Step 3️⃣: Create credential on the device
      // This triggers biometric prompt (Touch ID, Face ID, Windows Hello, PIN, etc.)
      const credential = await createCredential(publicKey);

      if (!credential) throw new Error(t('passkey:registerFailed'));

      // Step 4️⃣: Send credential back to backend to finish registration
      // Backend validates the attestation and issues full-access JWT
      const res = await axios.post(
        '/auth/passkeys/register/finish',
        { credential },
        { withCredentials: true }
      );

      // Show success message and log JWT for now
      setMessage(t('passkey:registerSuccess'));
    });
  };

  // --- Component UI ---
  return (
    <Box
      component={motion.div} // Framer Motion for fade-in + slide-up animation
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      textAlign="center"
      mt={4}
    >
      <Typography variant="h6" gutterBottom>
        {t('passkey:registerTitle')}
      </Typography>

      {/* Register button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleRegister}
        disabled={loading} // Disable while registration is in progress
      >
        {loading ? <CircularProgress size={24} /> : t('passkey:registerButton')}
      </Button>

      {/* Success / Error alerts */}
      {message && (
        <Alert sx={{ mt: 2 }} severity="success">
          {message}
        </Alert>
      )}
      {error && (
        <Alert sx={{ mt: 2 }} severity="error">
          {error}
        </Alert>
      )}
    </Box>
  );
}
