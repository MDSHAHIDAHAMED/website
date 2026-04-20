'use client';

import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useAccount } from 'wagmi';
import { WalletSignDialog } from '../sign-dialog';

/**
 * WalletAuthButton
 * ----------------
 * Generic trigger for wallet authentication.
 * 
 * Can be used anywhere in the app (header, profile, login, etc.)
 * 
 * Responsibilities:
 * - Opens WalletSignDialog
 * - Optionally runs a callback after successful authentication
 */

interface WalletAuthButtonProps {
  label?: string;
  color?: 'primary' | 'secondary' | 'inherit';
  onAuthenticated?: (address: string) => void;
}

export function WalletAuthButton({
  label = 'Authenticate Wallet',
  color = 'secondary',
  onAuthenticated,
}: Readonly<WalletAuthButtonProps>): React.ReactElement {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { address, isConnected } = useAccount();

  const handleClick = () => {
    if (!isConnected) {
      // You could trigger a wallet connect modal here if needed
      console.warn('⚠️ Wallet not connected. Prompt connect modal.');
      return;
    }
    setDialogOpen(true);
  };

  const handleClose = () => setDialogOpen(false);

  const handleSuccess = () => {
    if (onAuthenticated && address) onAuthenticated(address);
    setDialogOpen(false);
  };

  return (
    <>
      <Button variant="contained" color={color} onClick={handleClick}>
        {label}
      </Button>

      {dialogOpen && (
        <WalletSignDialog
          open={dialogOpen}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
