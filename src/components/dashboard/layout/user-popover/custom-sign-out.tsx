'use client';

import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import AtomTypography from '@/components/atoms/typography';
import { usePasskeyState } from '@/hooks/use-passkey-state';
import { useUser } from '@/hooks/use-user';
import { useWalletState } from '@/hooks/use-wallet';
import { authClient } from '@/lib/auth/custom/client';
import { paths } from '@/paths';
import { store } from '@/store';
import { clearAllDeviceInfo } from '@/store/slices/device-slice';
import { clearPasskeyData } from '@/store/slices/passkey-slice';
import { setExpiresAt } from '@/store/slices/user-slice';

export function CustomSignOut(): React.JSX.Element {
  const { t } = useTranslation();
  const { clearUser } = useUser();
  const { setIsPasskeyEnabled } = usePasskeyState();
  const { disconnect } = useWalletState('ethereum');

  const router = useRouter();

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      await disconnect()
      await authClient.signOut();

      // Clear all local state
      clearUser();
      store.dispatch(clearPasskeyData());
      store.dispatch(clearAllDeviceInfo());
      store.dispatch(setExpiresAt(null as unknown as number));

      // Redirect to sign-in page
      router.push(paths.auth.custom.signIn);
    } catch {
      // Even on error, cleanup and redirect
      clearUser();
      store.dispatch(clearPasskeyData());
      store.dispatch(clearAllDeviceInfo());
      store.dispatch(setExpiresAt(null as unknown as number));
      router.push(paths.auth.custom.signIn);
    } finally {
      setIsPasskeyEnabled(false);
    }
  }, [clearUser, router, setIsPasskeyEnabled, disconnect]);

  return (
    <MenuItem
      component="div"
      onClick={handleSignOut}
      sx={{ justifyContent: 'center', fontSize: '12px !important', py: 1, minHeight: 'auto' }}
    >
      <AtomTypography variant="subtitle3">
      {t('common:logout')}
      </AtomTypography>
    </MenuItem>
  );
}
