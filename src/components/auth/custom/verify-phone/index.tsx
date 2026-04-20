'use client';

import { OTP_TYPE } from '@/constants';
import { authPostMethod } from '@/services/api';
import endPoints from '@/services/urls';
import { handleServiceError } from '@/utils/error-handler';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import AtomButton from '@/components/atoms/button';
import AtomPhoneInput from '@/components/atoms/phone-input';
import AtomTypography from '@/components/atoms/typography';
import { TemporaryHeader } from '@/components/auth/custom/verify-code';
import { usePasskeyState } from '@/hooks/use-passkey-state';
import { usePhoneInput } from '@/hooks/use-phone-input';
import { paths } from '@/paths';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
interface VerifyPhoneFormData {
  phoneNumber: string;
}

interface VerifyPhoneFormProps {
  onContinue?: (data: VerifyPhoneFormData) => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
export const VerifyPhoneForm: React.FC<VerifyPhoneFormProps> = ({ onContinue }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = React.useState(false);
  const { setOTPMethodId, setOTPPhoneNumber } = usePasskeyState();

  // Read isLoginForm from URL query parameter
  const isLoginForm = React.useMemo(() => {
    const param = searchParams.get('isLoginForm');
    return param === 'true';
  }, [searchParams]);

  // Use custom phone input hook
  const { phoneData, handlePhoneChange, getFullPhone, isPhoneDataAvailable } = usePhoneInput();

  const methods = useForm<VerifyPhoneFormData>({
    mode: 'onChange',
    defaultValues: {
      phoneNumber: '',
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const onSubmit = React.useCallback(
    async (data: VerifyPhoneFormData) => {
      if (isPending) return;

      // Call optional callback first
      if (onContinue) {
        onContinue(data);
        return;
      }

      if (!isPhoneDataAvailable()) {
        showErrorToast('verify-phone-phone-data-not-available', t('auth:phoneDataNotAvailable') || 'Phone data not available. Please enter a valid phone number.');
        return;
      }

      setIsPending(true);

      try {
        // Get full phone number and clean it (remove spaces)
        const phoneValue = getFullPhone().replaceAll(' ', '');
        setOTPPhoneNumber(phoneValue);

        // Call API to start SMS verification
        const smsEndpoint = isLoginForm ? endPoints.TWO_FA_LOGIN_START : endPoints.TWO_FACTOR_AUTH_SESSION;
        const response = await authPostMethod<{ data: { method_id: string } }>(smsEndpoint, {
          type: OTP_TYPE.SMS,
          value: phoneValue,
        });

        // Save method_id from response
        if (response?.data?.method_id) {
          setOTPMethodId(response.data.method_id);
          showSuccessToast('verify-phone-sms-code-sent', t('auth:smsCodeSent') || 'SMS verification code sent successfully!');

          // Redirect to verify-code SMS page
          router.push(`${paths.auth.custom.verifyCode.sms}?isLoginForm=${isLoginForm}`);
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (err: any) {
        const message = handleServiceError(
          err,
          t('auth:failedToSendSMS') || 'Failed to send SMS verification code. Please try again.'
        );
        showErrorToast('verify-phone-failed-to-send-sms', message);
      } finally {
        setIsPending(false);
      }
    },
    [isPending, onContinue, isPhoneDataAvailable, getFullPhone, setOTPMethodId, setOTPPhoneNumber, router, t, isLoginForm]
  );

  return (
    <TemporaryHeader>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: '100%',
        }}
      >
        <Stack
          spacing={1}
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '540px' },
            mx: 'auto',
            px: 5,
            // textAlign: 'center',
          }}
        >
          {/* Title */}
          <AtomTypography color='text.primary' fontWeight={615} variant="h2">{t('auth:verifyPhoneNumber')}</AtomTypography>

          {/* Subtitle */}
          <AtomTypography variant="subtitle3" sx={{ color: 'text.secondary' }}>
            {t('auth:verifyPhoneDescription')}
          </AtomTypography>

          {/* Form */}
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2} marginTop={1.5}>
                {/* Phone Number Input */}
                <AtomPhoneInput
                  id="phone-number"
                  name="phoneNumber"
                  placeholder={t('placeHolder:phoneNumber')}
                  defaultCountry="us"
                  variant="outlined"
                  disabled={isPending}
                  required
                  validatePhone
                  disableCountryGuess
                  countryLabel={t('auth:country')}
                  phoneLabel={t('auth:phone')}
                  onPhoneChange={handlePhoneChange}
                />

                {/* Continue Button */}
                <Box sx={{ width: '100%', mt: 2 }}>
                  <AtomButton
                    id="continue-verify-phone"
                    variant="contained"
                    fullWidth
                    type="submit"
                    disabled={!isValid || isPending}
                    isLoading={isPending}
                    label={isPending ? t('auth:sending') : t('auth:continue')}
                    size='large'
                  />
                </Box>
              </Stack>
            </form>
          </FormProvider>
        </Stack>
      </Box>
    </TemporaryHeader>
  );
};

export default VerifyPhoneForm;
