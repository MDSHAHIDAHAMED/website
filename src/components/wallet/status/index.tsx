'use client';

import React, { type ReactElement } from 'react';
import { useWalletState } from '@/hooks/use-wallet';
import { Button, Container, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { logger } from '@/lib/default-logger';
import AtomTooltip from '@/components/atoms/tooltip';
import { ConnectWallet } from '../connect-wallet';

export function WalletStatus(): ReactElement {
  // ---------------------------
  // Get wallet state from custom hook
  // ---------------------------
  const {
    address,       // Wallet address
    displayName,   // Short display name (first 6 + last 4 chars)
    balance,       // Balance object { formatted, symbol }
    error,         // Last wallet error
    txStatus,      // Optional transaction status
    txError,       // Optional transaction error
    isConnected,   // Connection state
    isConnecting,  // Connection state
    isDisconnected,// Connection state
    disconnect,    // Method to disconnect wallet
  } = useWalletState('ethereum'); // pass wallet type explicitly

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // ---------------------------
  // Debug log
  // ---------------------------
  logger.debug('WalletStatus Render', useWalletState('ethereum'));

  return (
    <Container>
      {/* Connect Wallet Button */}
       <ConnectWallet />

      {/* Connected Wallet */}
      {isConnected && (
        <>
          {/* Header with Checkmark */}
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <CheckCircleOutlineIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Wallet Connected
            </Typography>
          </Stack>

          {/* Wallet Details */}
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Stack direction="column" spacing={1} sx={{ flexGrow: 1 }}>
              <AtomTooltip title={address || ''}>
                <Typography variant="body2" color="text.secondary" noWrap>
                  Address: {isSmallScreen ? displayName : address || ''}
                </Typography>
              </AtomTooltip>

              <Typography variant="body2" color="text.secondary">
                Balance: {balance?.formatted ?? '0.00'} {balance?.symbol ?? ''}
              </Typography>
            </Stack>
          </Stack>

          {/* Disconnect Button */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => disconnect?.()}
          >
            Disconnect
          </Button>
        </>
      )}

      {/* Transaction Error */}
      {txError && (
        <Typography variant="body1" color="error" mt={1}>
          Transaction Error: {txError}
        </Typography>
      )}

      {/* Generic Wallet Error */}
      {error && (
        <div style={{ color: theme.palette.error.main, marginTop: 10 }}>
          <p>{error.message || 'Unknown Error'}</p>
        </div>
      )}
    </Container>
  );
}
