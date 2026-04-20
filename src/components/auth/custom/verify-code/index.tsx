'use client';

import { OTP_LENGTH, OTP_TYPE, RESEND_COOLDOWN_SECONDS } from '@/constants';
import { authPostMethod } from '@/services/api';
import endPoints from '@/services/urls';
import { useDispatch } from '@/store';
import { setExpiresAt } from '@/store/slices/user-slice';
import { handleServiceError } from '@/utils/error-handler';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { AuthResponse } from '@/utils/user-auth';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import AtomButton from '@/components/atoms/button';
import OtpField from '@/components/atoms/otp-field';
import AtomTypography from '@/components/atoms/typography';
import BackgroundVideo from '@/components/atoms/video/background';
import { config } from '@/config';
import { usePasskeyState } from '@/hooks/use-passkey-state';
import { useResendTimer } from '@/hooks/use-resend-timer';
import { useUser } from '@/hooks/use-user';
import { useWalletState } from '@/hooks/use-wallet';
import { sendOtp } from '@/lib/auth/custom/auth-otp-handler';
import { mockOtpVerifyApi } from '@/lib/mock/auth';
import { paths } from '@/paths';
import { storeDeviceFromResponse } from '@/utils/device-manager';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
const IS_MOCK_MODE = process.env.NEXT_PUBLIC_IS_MOCK_MODE === 'true';

interface VerifyCodeFormProps {
  email?: string;
  verificationType?: string; // 'email' | 'sms' | 'totp'
}

interface TemporaryHeaderProps {
  children: React.ReactNode;
}

// -----------------------------------------------------------------------------
// Layout Header (Simple Wrapper)
// -----------------------------------------------------------------------------
/**
 * Temporary header wrapper component that uses BackgroundVideo.
 * Content is scrollable when it exceeds viewport height.
 *
 * @param children - React node(s) to render inside the header container
 */
export const TemporaryHeader: React.FC<TemporaryHeaderProps> = ({ children }) => (
  <BackgroundVideo src={config.backgroundVids.boxexBg}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        flex: 1, // Fill remaining space from parent flex container
        bgcolor: 'background.default',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </Box>
  </BackgroundVideo>
);

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
export const VerifyCodeForm: React.FC<VerifyCodeFormProps> = ({ email = '', verificationType = OTP_TYPE.EMAIL }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, isLoading: contextLoading } = useUser();
  const {
    setIsPasskeyEnabled,
    setOTPMethodId,
    otpMethodId,
    otpEmail,
    phoneNumber,
    setOTPEmailValue,
    setOTPPhoneNumber,
  } = usePasskeyState();
  const { disconnect } = useWalletState('ethereum'); // ⬅️ wallet disconnect function
  const [otp, setOtp] = React.useState<string | null>(null);
  const dispatch = useDispatch();
  const [clientError, setClientError] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);
  const { resendTimer, start: startResendTimer, reset: resetResendTimer } = useResendTimer();

  // Read isLoginForm from URL query parameter
  const isLoginForm = React.useMemo(() => {
    const param = searchParams.get('isLoginForm');
    return param === 'true';
  }, [searchParams]);

  const otpType = verificationType;

  // Timer handled by useResendTimer

  // ---------------------------------------------------------------------------
  // Handler: Verify OTP
  // ---------------------------------------------------------------------------
  const handleVerifyCode = React.useCallback(
    async (inputOtp?: string | null) => {
      if (isPending) return;
      const otpToVerify = inputOtp ?? otp;
      const VerifyOtpURL = isLoginForm ? endPoints.TWO_FA_LOGIN_FINISH : endPoints.SIGN_UP_FINISH;

      // 1. Basic validation
      if (otpToVerify && otpToVerify.length !== OTP_LENGTH) {
        setClientError(`Please enter a valid ${OTP_LENGTH}-digit code`);
        return;
      }
      if (!otpMethodId && otpType !== OTP_TYPE.TOTP) {
        showErrorToast('verify-code-session-expired', 'Verification session expired. Please sign up again.');
        router.push(paths.auth.custom.signIn);
        return;
      }

      setIsPending(true);
      setClientError(null);

      try {
        // Disconnect wallet if connected (cleanup before login completion)
        // Only disconnect on login, not on signup
        if (isLoginForm) {
          try {
            await disconnect();
          } catch (disconnectError) {
            // Log but don't block login if wallet disconnect fails
            // eslint-disable-next-line no-console
            console.warn('[VerifyCode] Wallet disconnect failed:', disconnectError);
          }
        }
        // 2. API call (mock or real)
        const rawResponse = IS_MOCK_MODE
          ? await mockOtpVerifyApi(otpMethodId, otpToVerify)
          : await authPostMethod<AuthResponse>(VerifyOtpURL, {
              ...(otpType !== OTP_TYPE.TOTP && { method_id: otpMethodId }),
              code: otpToVerify ?? '',
              type: otpType,
            });

        // 3. Success → update user + redirect
        if (rawResponse?.data?.session) {
          let successMessage: string;
          if (otpType === OTP_TYPE.EMAIL) {
            successMessage = 'Email verified successfully!';
          } else if (otpType === OTP_TYPE.SMS) {
            successMessage = 'SMS verified successfully!';
          } else {
            successMessage = 'Code verified successfully!';
          }
          showSuccessToast('verify-code-success', successMessage);

          // Set expiresAt in Redux store
          // Convert from seconds (Unix timestamp) to milliseconds
          if (rawResponse.data.session.expires_at) {
            const expiresAt = rawResponse.data.session.expires_at; // Convert seconds to milliseconds
            dispatch(setExpiresAt(expiresAt));
          }

          // Store device info from response for future authenticated requests
          if (rawResponse.data.device) {
            storeDeviceFromResponse(rawResponse.data.device);
          }

          setOTPMethodId(null);
          setOTPEmailValue(null);
          setIsPasskeyEnabled(false);
          setOTPPhoneNumber(null);
          setUser({
            ...rawResponse.data.user,
            id: rawResponse.data.user.user_id,
          });

          if (otpType === OTP_TYPE.TOTP || otpType === OTP_TYPE.SMS) {
            if (isLoginForm) {
              setIsPasskeyEnabled(true);
              router.push(`${paths.dashboard.overview}`);
            } else {
              router.push(paths.auth.custom.enablePasskey);
            }
          } else {
            router.push(`${paths.auth.custom.twoFactorAuthentication}?isLoginForm=${isLoginForm}`); // redirect to 2FA setup page
          }
        } else {
          showErrorToast('verify-code-failed', 'Verification failed. Please try again.');
        }
      } catch (err: any) {
        const message = handleServiceError(err, 'Invalid or expired OTP. Please try again.');
        showErrorToast('verify-code-invalid-or-expired', message);
      } finally {
        setIsPending(false);
      }
    },
    [
      otp,
      otpMethodId,
      otpType,
      setOTPEmailValue,
      setOTPMethodId,
      setUser,
      router,
      setIsPasskeyEnabled,
      setOTPPhoneNumber,
      dispatch,
      isLoginForm,
      disconnect,
    ]
  );

  // ---------------------------------------------------------------------------
  // Handler: Resend OTP
  // ---------------------------------------------------------------------------
  const handleResendCode = React.useCallback(async () => {
    setIsPending(true);
    try {
      let newMethodId: string | null = null;

      if (otpType === OTP_TYPE.EMAIL) {
        // Email resend
        if (!otpEmail) {
          showErrorToast('verify-code-missing-email-context', 'Missing email context. Please sign up again.');
          return;
        }
        newMethodId = await sendOtp({
          email: otpEmail,
          isMockMode: IS_MOCK_MODE,
          setOTPMethodId,
          t,
          isLoginForm: isLoginForm,
        });
      } else if (otpType === OTP_TYPE.SMS) {
        // SMS resend
        if (!phoneNumber) {
          showErrorToast('verify-code-missing-phone-number-context', 'Missing phone number context. Please try again.');
          return;
        }
        const response = await authPostMethod<{
          data: {
            method_id: string;
          };
        }>(isLoginForm ? endPoints.TWO_FA_LOGIN_START : endPoints.TWO_FACTOR_AUTH_SESSION, {
          type: OTP_TYPE.SMS,
          value: phoneNumber,
        });
        newMethodId = response?.data?.method_id ?? null;
        if (newMethodId) {
          setOTPMethodId(newMethodId);
        }
      } else if (otpType === OTP_TYPE.TOTP) {
        // TOTP doesn't support resend
        showErrorToast(
          'verify-code-totp-cannot-be-resent',
          'TOTP codes cannot be resent. Please use your authenticator app.'
        );
        return;
      }

      // 2. Invalidate old OTP session
      setOtp(null);
      setClientError(null);
      if (newMethodId) {
        setOTPMethodId(newMethodId);
      }

      // 3. Start cooldown
      startResendTimer(RESEND_COOLDOWN_SECONDS);
    } catch (err: any) {
      const message = handleServiceError(err, 'Failed to resend OTP. Please try again.');
      showErrorToast('verify-code-failed-to-resend', message);
    } finally {
      setIsPending(false);
    }
  }, [otpType, otpEmail, phoneNumber, setOTPMethodId, t, isLoginForm]);

  // ---------------------------------------------------------------------------
  // Handler: On OTP input change
  // ---------------------------------------------------------------------------
  const handleOtpChange = React.useCallback(
    (value: string) => {
      setOtp(value);
      setClientError(null);
      if (value.length === OTP_LENGTH) handleVerifyCode(value);
    },
    [handleVerifyCode]
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  // SUGGESTION: @manas if we are going to repeat the same code for other pages as well, such as Box and Stack, you may go for a custom component and reuse it.
  return (
    <TemporaryHeader>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: '100%', // Ensure full height for centering
        }}
      >
        <Stack
          spacing={2}
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '540px' },
            mx: 'auto',
            px: 5,
            textAlign: 'center',
          }}
        >
          <AtomTypography variant="h2" color="text.primary" fontWeight={615}>
            {t('auth:enterVerificationCode')}
          </AtomTypography>

          <AtomTypography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            {otpType === OTP_TYPE.EMAIL && t('auth:verificationCodeDescription', { email: email || otpEmail })}
            {otpType === OTP_TYPE.SMS &&
              t('auth:verificationCodeDescriptionSMS', { phoneNumber: phoneNumber || 'your phone' })}
            {otpType === OTP_TYPE.TOTP && t('auth:verificationCodeDescriptionTOTP')}
          </AtomTypography>

          <Box sx={{ width: '100%', mt: 2 }}>
            <OtpField
              length={OTP_LENGTH}
              onChangeOTP={handleOtpChange}
              isNumberInput
              autoFocus
              error={!!clientError}
              helperText={clientError || ''}
              name="verification-code"
            />
          </Box>

          {/* Resend OTP section */}
          <AtomTypography
            variant="subtitle2"
            sx={{ color: 'text.secondary', display: otpType === OTP_TYPE.TOTP ? 'none' : 'block' }}
          >
            {t('auth:didntReceiveCode')}{' '}
            <Link
              component="button"
              onClick={handleResendCode}
              disabled={isPending || contextLoading || resendTimer > 0}
              sx={{
                textDecoration: 'underline',
                textDecorationStyle: 'dashed',
                textDecorationColor: resendTimer > 0 ? 'text.disabled' : 'primary.main',
                textUnderlineOffset: '4px',
                cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                color: resendTimer > 0 ? 'text.disabled' : 'primary.main',
                ml: 0.5,
                '&:hover': {
                  textDecorationStyle: resendTimer > 0 ? 'dashed' : 'solid',
                },
              }}
            >
              {resendTimer > 0
                ? t('auth:resendCodeWithTimer', {
                    minutes: Math.floor(resendTimer / 60),
                    seconds: (resendTimer % 60).toString().padStart(2, '0'),
                  })
                : t('auth:resendCode')}
            </Link>
          </AtomTypography>

          {/* Verify Code Button with proper alignment and spacing */}
          {otp && otp.length === OTP_LENGTH && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <AtomButton
                id="verify-code"
                variant="contained"
                fullWidth
                onClick={() => handleVerifyCode(otp)}
                disabled={isPending}
                label={isPending || contextLoading ? t('auth:verifying') : t('auth:verifyCode')}
                size="large"
              />
            </Box>
          )}
        </Stack>
      </Box>
    </TemporaryHeader>
  );
};
