'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, FormControl, Link, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z as zod } from 'zod';

import AtomButton from '@/components/atoms/button';
import AtomTypography from '@/components/atoms/typography';
import InputWithLabel from '@/components/molecules/input-with-label';
import FormProvider from '@/contexts/form-provider';
import { usePasskeyState } from '@/hooks/use-passkey-state';
import { sendOtp } from '@/lib/auth/custom/auth-otp-handler';
import { paths } from '@/paths';


// -----------------------------------------------------------------------------
// Environment flag to switch mock/real API
// -----------------------------------------------------------------------------
const IS_MOCK_MODE = process.env.NEXT_PUBLIC_IS_MOCK_MODE === 'true';

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------


export function SignUpForm({ isLoginForm }: { readonly isLoginForm: boolean }): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  const { setOTPEmailValue, setOTPMethodId } = usePasskeyState();

  // Form validation schema
  const schema = zod.object({
    email: zod
      .string()
      .min(1, { message: t('validations:emailRequired') })
      .email(),
  });

  type FormValues = zod.infer<typeof schema>;

  // ---------------------------------------------------------------------------
  // Form Setup
  // ---------------------------------------------------------------------------
  const methods = useForm<FormValues>({
    defaultValues: { email: '' },
    resolver: zodResolver(schema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  /**
   * Email-based signup handler
   *
   * Handles:
   * - OTP signup API call (mock or real)
   * - Method ID storage for verification
   * - Toast notifications
   * - Navigation to verification page
   */
  // -----------------------------------------------------------------------------
  // Email-based signup handler
  // -----------------------------------------------------------------------------
  const onSubmit = React.useCallback(
    async (values: FormValues) => {
      setIsPending(true);
      setOTPEmailValue(values.email);
      await sendOtp({
        email: values.email,
        isMockMode: IS_MOCK_MODE,
        setOTPMethodId,
        setOTPEmailValue,
        navigate: () => router.push(`${paths.auth.custom.verifyCode.email}?isLoginForm=${isLoginForm}`),
        t,
        isLoginForm: isLoginForm,
      });
      setIsPending(false);
    },
    [router, setOTPMethodId, setOTPEmailValue, t]
  );
  // ---------------------------------------------------------------------------
  // Render Helpers
  // ---------------------------------------------------------------------------

  /** Renders the email input field with validation */
  const renderEmailField = (): React.JSX.Element => (
    <Controller
      control={control}
      name="email"
      render={({ field }) => (
        <FormControl error={Boolean(errors.email)}>
          <InputWithLabel
            label={t('auth:emailAddress')}
            {...field}
            id="email-sign-up"
            name="email"
            type="email"
            variant="standard"
            placeholder={t('placeHolder:email')}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
        </FormControl>
      )}
    />
  );

  // ---------------------------------------------------------------------------
  // Component UI
  // ---------------------------------------------------------------------------
  return (
    <>
      <Stack spacing="40px">
        {/* Email Signup Form */}
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '40px', width: '100%' }}>
            {renderEmailField()}

            {/* Submit button */}
            <AtomButton
              id="sign-up-form-submit-button"
              disabled={isPending}
              type="submit"
              variant="contained"
              size="large"
              label={isPending ? t('auth:sending') : t('auth:continue')}
            />

            {/* Sign-in redirect & Terms */}
          </Box>
        </FormProvider>
      </Stack>
      {!isLoginForm && (
      <Stack spacing={1} sx={{ mt: 2 }}>
        <AtomTypography
          variant="body4"
          color="text.secondary"
          id="sign-up-form-terms-of-service"
          sx={{ textAlign: 'center', width: '100%' }}
        >
          {t('auth:bySigningUpAgree')}{' '}
          <Link
            href={paths.termsOfService}
            sx={{ textDecoration: 'none', cursor: 'pointer' }}
            color="text.primary"
          >
            {t('auth:termsOfService')}
          </Link>{' '}
          {t('auth:and')}{' '}
          <Link
            href={paths.privacyPolicy}
            sx={{ textDecoration: 'none', cursor: 'pointer' }}
            color="text.primary"
          >
            {t('auth:privacyPolicy')}
          </Link>
          .
          </AtomTypography>
        </Stack>
      )}
    </>
  );
}
