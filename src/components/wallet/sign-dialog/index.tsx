import React from 'react';
import { Dialog, DialogTitle, DialogContent, CircularProgress, Typography, Button } from '@mui/material';
import { useWalletAuth } from '@/hooks/use-wallet-auth';

interface WalletSignDialogProps {
  open: boolean;               // Controls dialog visibility
  onClose: () => void;         // Callback when dialog is closed
  onSuccess?: () => void;      // Optional callback when wallet authentication succeeds
}

/**
 * WalletSignDialog
 * ----------------
 * Generic dialog component to prompt the user to sign a message with their connected wallet.
 * Works with `useWalletAuth` hook for signing and verification.
 *
 * Flow:
 * 1. User opens the dialog.
 * 2. Clicks "Sign & Verify" to sign the wallet message.
 * 3. Hook handles signing & local verification (frontend-only or mocked for testing).
 * 4. If successful, `onSuccess` callback fires (optional).
 * 5. Dialog closes automatically after signing attempt.
 */
export function WalletSignDialog({ open, onClose, onSuccess }: Readonly<WalletSignDialogProps>) {
  // Hook provides the authenticate function, loading state, and status message
  const { authenticate, loading, status } = useWalletAuth();

  /**
   * Trigger wallet authentication process.
   * Handles calling the hook, firing onSuccess if available, and closing dialog.
   */
  const handleAuth = async () => {
    try {
      // Authenticate returns a "token" (or mock nonce for frontend-only test)
      const token = await authenticate();
      if (token) onSuccess?.();
    } finally {
      // Always close the dialog after an attempt (errors propagate to caller)
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Wallet Authentication</DialogTitle>
      <DialogContent sx={{ textAlign: 'center', py: 3 }}>
        {loading ? (
          // Show spinner while signing is in progress
          <CircularProgress />
        ) : (
          <>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Please sign the message to verify your wallet ownership.
            </Typography>

            {/* Trigger wallet signing */}
            <Button variant="contained" color="secondary" onClick={handleAuth}>
              Sign & Verify
            </Button>

            {/* Display status message (success/error) */}
            {status && <Typography variant="caption" sx={{ mt: 1 }}>{status}</Typography>}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
