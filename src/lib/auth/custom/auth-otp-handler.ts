import { logger } from '@/lib/default-logger';
import { mockOtpSignUpApi } from '@/lib/mock/auth';
import { authPostMethod } from '@/services/api';
import endPoints from '@/services/urls';
import { handleServiceError } from '@/utils/error-handler';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import type { TFunction } from 'i18next';

interface OtpHandlerParams {
  email: string | null;
  isMockMode: boolean;
  setOTPMethodId: (id: string | null) => void;
  setOTPEmailValue?: (email: string) => void;
  navigate?: () => void;
  t: TFunction;
  isLoginForm: boolean;
}

/**
 * Common function to send OTP (signup or resend)
 *
 * Handles:
 * - Deciding mock vs real API
 * - Storing method_id
 * - Optional email storage
 * - Toast notifications
 * - Optional navigation
 */
export async function sendOtp({ email, isMockMode, setOTPMethodId, setOTPEmailValue, navigate, t , isLoginForm }: OtpHandlerParams) {
  try {
    const SendOtpURL = isLoginForm ? endPoints.TWO_FA_LOGIN_START : endPoints.SIGN_UP_START;
    const result = isMockMode
      ? await mockOtpSignUpApi(email ?? '')
      : await authPostMethod<{ data: { method_id: string } }>(SendOtpURL, { email });

    if (result.data?.method_id) {
      setOTPMethodId(result.data.method_id);
      if (setOTPEmailValue) setOTPEmailValue(email ?? '');
    }

    showSuccessToast('auth-otp-handler-verification-code-sent', t('auth:verificationCodeSent'));

    if (navigate) navigate();

    return result.data?.method_id;
  } catch (err: any) {
    logger.error('Failed to send verification code:', err);
    const errorMessage = handleServiceError(err, t('auth:failedToSendVerificationCode'));
    showErrorToast('auth-otp-handler-failed-to-send-verification-code', errorMessage);
    return null;
  }
}
