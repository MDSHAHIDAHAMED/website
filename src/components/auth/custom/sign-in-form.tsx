'use client';

import Stack from '@mui/material/Stack';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import AtomButton from '@/components/atoms/button';
import AtomTabs from '@/components/atoms/tabs';
import { SignUpForm } from '@/components/auth/custom/sign-up-form';
import { usePasskeyLogin } from '@/hooks/use-passkey-login'; // <-- new hook import
import { logger } from '@/lib/default-logger';
import { paths } from '@/paths';
import { Box } from '@mui/material';
import { SyntheticEvent, useState } from 'react';


// --- Component ---------------------------------------------------------------

export function SignInForm(): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);

  /** Handles tab switch between "Sign up" and "Log in" */
  const handleTabChange = (_event: SyntheticEvent, newValue: any): void => {
    setTabValue(newValue.value);
  };


  // --- Passkey Login Hook Integration ----------------------------------------
  // Provides loading, success message, error and the login function
  const { loading: passkeyLoading, loginWithPasskey } = usePasskeyLogin();

  return (
    <Stack spacing={4}>
      <Stack spacing={3}>

        <Stack spacing={4}>
          {/* --- Passkey Login Button --- */}
          <AtomTabs
        id="2fa-tabs"
        value={tabValue}
        onTabChange={handleTabChange}
        centered={true}
        tabsData={[
          {
            label: t('auth:continueWithPasskey'),
            value: 0,
            tabContentData: <Box sx={{ width: '100%', mx: 'auto' }}>
              <AtomButton
            id="continue-with-passkey"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            label={t('auth:continueWithPasskey')}
            disabled={passkeyLoading} // disable while passkey login is in progress
            onClick={async () => {
              const jwt = await loginWithPasskey(); // trigger passkey login
              if (jwt) {
                // Refresh auth state to update user context
                router.refresh();
                // Navigate to dashboard
                router.push(paths.dashboard.overview);
              } else {
                logger.debug('[SignInForm] No JWT received, login failed');
              }
            }}
          />
            </Box>
          },
          {
            label: t('auth:continueWith2fa'),
            value: 1,
            tabContentData: <SignUpForm isLoginForm={true} />
          }
        ]}
      />
        </Stack>
      </Stack>
    </Stack>
  );
}
