'use client';

import { Box } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

import AtomButton from '@/components/atoms/button';
import AtomTooltip from '@/components/atoms/tooltip';
import { useWalletConnection } from '@/hooks/use-wallet-connection';

export function ConnectWallet(): React.ReactElement {
  const { t } = useTranslation(['buttons', 'wallet']);
  // Handle wallet connection API calls
  // This hook automatically calls the backend when wallet connects
  // and disconnects if address already exists in DB
  useWalletConnection();

  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
      <ConnectButton.Custom>
        {({ account, chain, openAccountModal, openConnectModal, authenticationStatus, mounted }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

          if (!ready) {
            return (
              <span aria-hidden="true" style={{ opacity: 0, pointerEvents: 'none', userSelect: 'none' }}>
                {t('buttons:connectWallet')}
              </span>
            );
          }

          // 🧩 Not connected
          if (!connected) {
            return (
              <AtomTooltip title={t('buttons:connectWallet')}>
                <AtomButton
                  variant="contained"
                  onClick={openConnectModal}
                  size="medium"
                  label={t('buttons:connectWallet')}
                  id="connect-wallet-button"
                />
              </AtomTooltip>
            );
          }

          // ✅ Connected
          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {/* Account Button */}
              <AtomTooltip title={`(${t('buttons:connected')})`}>
                <AtomButton
                  variant="contained"
                  color="secondary"
                  size="medium"
                  onClick={openAccountModal}
                  label={account?.displayName ?? ''}
                  id="account-button"
                />
              </AtomTooltip>
            </Box>
          );
        }}
      </ConnectButton.Custom>
    </Box>
  );
}
