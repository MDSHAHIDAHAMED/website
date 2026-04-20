'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import AtomTypography from '@/components/atoms/typography';
import { TemporaryHeader } from '@/components/auth/custom/verify-code';
import { usePasskeyRegister } from '@/hooks/use-passkey-register';
import { usePasskeyState } from '@/hooks/use-passkey-state';
import { useUser } from '@/hooks/use-user';
import { paths } from '@/paths';

import AtomButton from '@/components/atoms/button';
import Image from 'next/image';

// -----------------------------------------------------------------------------
// Types & Constants
// -----------------------------------------------------------------------------

interface EnablePasskeyFormProps {
  onSuccess?: () => void;
}


// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function EnablePasskeyForm({ onSuccess }: Readonly<EnablePasskeyFormProps>): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const { loading, registerPasskey } = usePasskeyRegister();
  const { checkSession } = useUser();
  const { setIsPasskeyEnabled } = usePasskeyState();

  // Benefits data from translations
  const PASSKEY_BENEFITS = [
    {
      title: t('passkey:benefit1Title'),
      description: t('passkey:benefit1Description'),
      icon: '/assets/icons/lock.svg',
    },
    {
      title: t('passkey:benefit2Title'),
      description: t('passkey:benefit2Description'),
      icon: '/assets/icons/compatibility.svg',
    },
    {
      title: t('passkey:benefit3Title'),
      description: t('passkey:benefit3Description'),
      icon: '/assets/icons/safety.svg',
    },
  ];

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  /**
   * Handles passkey enablement
   */
  const handleEnablePasskey = React.useCallback(async (): Promise<void> => {
    try {
      const jwt = await registerPasskey();

      if (jwt) {
        // Passkey registered successfully
        // Update user context to mark passkey as enabled
        setIsPasskeyEnabled(true);
        
        // Refresh session to get updated user data
        await checkSession();

        if (onSuccess) {
          onSuccess();
        } else {
          router.push(paths.dashboard.overview);
        }
      }
    } catch (err) {
      // Error is already handled by the hook
      console.error('Passkey registration failed:', err);
    }
  }, [registerPasskey, onSuccess, router, setIsPasskeyEnabled, checkSession]);

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------

  // SUGGESTION: @manas if we are going to repeat the same code for other pages as well, such as Box and Stack, you may go for a custom component and reuse it.
  return (
    <TemporaryHeader>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          minHeight: '100%',
          py: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Stack
          spacing={{ xs: 2, sm: 2 }}
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '540px' },
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: { xs: 'flex-start', sm: 'center' },
          }}
        >
          {/* Title */}
          <AtomTypography variant="h2" color="text.primary" fontWeight={615} sx={{ width: '100%' }}>
            {t('passkey:enableTitle')}
          </AtomTypography>

          {/* Description */}
          <AtomTypography variant="subtitle3" sx={{ color: 'text.secondary', width: '100%' }}>
            {t('passkey:enableDescription')}
          </AtomTypography>

          {/* Benefits List */}
          <Stack spacing={{ xs: 2, sm: 3 }} sx={{ width: '100%', py: { xs: 1, sm: 2 } }}>
            {PASSKEY_BENEFITS.map((benefit, index) => (
              <Box data-testid={`benefit-item-${index}`} key={`benefit-${benefit.title}-${index}`} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {/* Bullet Point */}
                
                <Box sx={{ width: 24, height: 24, display: 'inline-flex', justifyContent: 'flex-start', alignItems: 'center', flexShrink: 0 }}>
                  <Image data-testid={`benefit-bullet-point-${index}`} src={benefit.icon} alt={benefit.title} width={20} height={20} priority />
                </Box>

                {/* Content */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    alignItems: 'flex-start',
                    width: '100%',
                    minWidth: 0,
                  }}
                >
                  <AtomTypography id={`benefit-title-${index}`} variant="body2Bold" sx={{ color: 'text.primary' }}>
                    {benefit.title}
                  </AtomTypography>
                  <AtomTypography id={`benefit-description-${index}`} variant="subtitle3" sx={{ color: 'text.secondary' }}>
                    {benefit.description}
                  </AtomTypography>
                </Box>
              </Box>
            ))}
          </Stack>

          {/* Enable Button */}
          <AtomButton id="enable-passkey" variant="contained" fullWidth onClick={handleEnablePasskey} label={loading ? t('passkey:enablingButton') : t('passkey:enableButton')} disabled={loading} size="large"/>
        </Stack>
      </Box>
    </TemporaryHeader>
  );
}
