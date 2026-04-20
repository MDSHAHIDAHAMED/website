'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import AtomAlert from '@/components/atoms/alert';
import AtomButton from '@/components/atoms/button';
import OrSeparator from '@/components/atoms/or-separator';
import RadioCard from '@/components/atoms/radio-card';
import AtomTypography from '@/components/atoms/typography';
import { TemporaryHeader } from '@/components/auth/custom/verify-code';
import { OTP_TYPE } from '@/constants';
import FormProvider from '@/contexts/form-provider';
import { usePasskeyState } from '@/hooks/use-passkey-state';
import { paths } from '@/paths';
import { authPostMethod } from '@/services/api';
import endPoints from '@/services/urls';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
type TwoFactorMethod = 'phone' | 'app';

interface TwoFactorAuthenticationFormProps {
  onContinue?: (method: TwoFactorMethod) => void;
}

interface TemporaryHeaderProps {
  children: React.ReactNode;
}

// -----------------------------------------------------------------------------
// Phone Number Icon
// -----------------------------------------------------------------------------
const PhoneIcon: React.FC = () => (
  <Image src="/assets/icons/phone_no.svg" alt="Phone number" width={12} height={18} />
);

// -----------------------------------------------------------------------------
// Authenticator App Icon
// -----------------------------------------------------------------------------
const AuthAppIcon: React.FC = () => (
  <Image src="/assets/icons/auth_app.svg" alt="Authentication App" width={18} height={18} />
);

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
export const TwoFactorAuthenticationForm: React.FC<TwoFactorAuthenticationFormProps> = ({ onContinue }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setOTPMethodId } = usePasskeyState();

  // Read isLoginForm from URL query parameter
  const isLoginForm = React.useMemo(() => {
    const param = searchParams.get('isLoginForm');
    return param === 'true';
  }, [searchParams]);

  // Form setup with react-hook-form
  type FormValues = {
    method: TwoFactorMethod | '';
  };

  const methods = useForm<FormValues>({
    defaultValues: { method: '' },
  });

  const { watch, setValue, handleSubmit, getValues } = methods;
  const selectedMethod = watch('method') as TwoFactorMethod | '';

  /**
   * Form submission handler
   * Handles navigation or callback based on selected 2FA method
   */
  const onSubmit = React.useCallback(
    async (values: FormValues) => {
      const method = values.method as TwoFactorMethod;
      if (!method) return;

      // Call optional callback
      if (onContinue) {
        onContinue(method);
        return;
      }

      // Redirect based on selected method
      if (method === 'app') {
        if(isLoginForm) {
          router.push(`${paths.auth.custom.verifyCode.totp}?isLoginForm=${isLoginForm}`);
        } else {
          router.push(paths.auth.custom.totpVerification);
        }
      } else if (method === 'phone') {
        if(isLoginForm) {
          const response = await authPostMethod<{ data: { method_id: string } }>(endPoints.TWO_FA_LOGIN_START, {
            type: OTP_TYPE.SMS,
          });
  
          // Save method_id from response
          if (response?.data?.method_id) {
            setOTPMethodId(response.data.method_id);  
            // Redirect to verify-code SMS page
            router.push(`${paths.auth.custom.verifyCode.sms}?isLoginForm=${isLoginForm}`);
          }
          router.push(`${paths.auth.custom.verifyCode.sms}?isLoginForm=${isLoginForm}`);
        } else {
          router.push(paths.auth.custom.verifyPhone);
        }
      }
    },
    [onContinue, router, isLoginForm]
  );

  // Handle Enter key to trigger form submission when an option is selected
  // This works even if RadioCard intercepts the key event
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && selectedMethod) {
        const target = event.target as HTMLElement;
        
        // Only block text inputs and textareas - allow everything else (including radio inputs and labels)
        const isTextInput = target.tagName === 'INPUT' && 
                           (target as HTMLInputElement).type !== 'radio';
        const isTextarea = target.tagName === 'TEXTAREA';
        
        // Trigger form submission for all elements except text inputs and textareas
        if (!isTextInput && !isTextarea) {
          event.preventDefault();
          event.stopPropagation();
          // Directly submit the form with current values
          const values = getValues();
          onSubmit(values);
        }
      }
    };

    // Use capture phase to catch the event before RadioCard handles it
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [selectedMethod, getValues, onSubmit]);

  return (
    <TemporaryHeader>
      <Box sx={{ width: { xs: '80%', sm: '40%' }, my: 2, mx: 'auto' }}>
      <AtomAlert
              type="info"
              id="one-time-process-alert"
              content={{
                heading: '',
                message: t('auth:oneTimeProcessInfo', { 
                  defaultValue: 'Kindly complete the setup in one go and avoid closing the page until it’s finished.' 
                }),
              }}
              isMultiline={true}
            />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          // alignItems: 'center',
          mt: 2,
          justifyContent: 'center',
          width: '100%',
          minHeight: '100%',
        }}
      >
        {/* Info Alert */}
        
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack
            spacing={3}
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', sm: '540px' },
              mx: 'auto',
              px: 5,
              textAlign: 'center',
            }}
          >
            {/* Title */}
            <AtomTypography variant="h2" color='text.primary'>{t('auth:twoFactorAuthentication')}</AtomTypography>

            {/* Subtitle */}
            <AtomTypography variant="subtitle3" sx={{ color: 'text.secondary' }}>
              {t('auth:twoFactorDescription')}
            </AtomTypography>


            {/* Radio Card Options */}
            <Stack spacing={2} marginTop={1.5}>
              {/* Phone Number Option */}
              <RadioCard
                label={t('auth:phoneNumber')}
                description={t('auth:phoneNumberDescription')}
                selected={selectedMethod === 'phone'}
                onClick={() => setValue('method', 'phone')}
                icon={<PhoneIcon />}
                value="phone"
                name="2fa-method"
              />

              {/* OR Divider */}
              <OrSeparator />

              {/* Authentication APP Option */}
              <RadioCard
                label={t('auth:authenticationApp')}
                description={t('auth:authenticationAppDescription')}
                selected={selectedMethod === 'app'}
                onClick={() => setValue('method', 'app')}
                icon={<AuthAppIcon />}
                value="app"
                name="2fa-method"
              />
            </Stack>

            {/* Continue Button */}
            <Box sx={{ width: '100%', mt: 2 }}>
              <AtomButton
                id="continue-2fa"
                variant="contained"
                fullWidth
                size='large'
                type="submit"
                disabled={!selectedMethod}
                label={t('auth:continue').toUpperCase()}
              />
            </Box>
          </Stack>
        </FormProvider>
      </Box>
    </TemporaryHeader>
  );
};
