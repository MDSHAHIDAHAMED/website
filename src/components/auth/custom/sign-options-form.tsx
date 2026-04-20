'use client';

import AtomTabs from '@/components/atoms/tabs';
import AtomTypography from '@/components/atoms/typography';
import { SignInForm } from '@/components/auth/custom/sign-in-form';
import { SignUpForm } from '@/components/auth/custom/sign-up-form';
import { DynamicLogo } from '@/components/core/logo';
import { paths } from '@/paths';
import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState, type SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * SignOptionsForm – manages authentication UI flow (sign in / sign up)
 * Uses atomic tabs component for clean tab management
 */
export function SignOptionsForm(): React.JSX.Element {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();

  /** Handles tab switch between "Sign up" and "Log in" */
  const handleTabChange = (_event: SyntheticEvent, newValue: any): void => {
    setTabValue(newValue.value);
  };

  return (
    <Stack spacing={{ xs: 0, sm: 4 }} width="100%">
      {/* --- Logo --- */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 4 }} onClick={() => router.push(paths.home)}>
        <DynamicLogo height={20} width={124} emblem />
      </Box>

      {/* --- Welcome Section --- */}
      <Stack spacing={{xs:4,sm:4,md:2}}>
        <AtomTypography variant="h2" color="text.primary">
          {t('auth:welcomeToYieldz')}
        </AtomTypography>
        <AtomTypography variant="body4" color="text.secondary" sx={{mb:3}}>
          {t('auth:welcomeDescription')}
        </AtomTypography>
      </Stack>

      {/* --- Tabs Section --- */}
      <AtomTabs
        id="authentication-tabs"
        value={tabValue}
        onTabChange={handleTabChange}
        centered={true}
        tabsData={[
          {
            label: t('auth:signUp'),
            value: 0,
            tabContentData: <SignUpForm isLoginForm={false} />
          },
          {
            label: t('auth:logIn'),
            value: 1,
            tabContentData: <SignInForm />
          }
        ]}
      />
    </Stack>
  );
}
