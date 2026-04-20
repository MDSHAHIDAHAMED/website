'use client';

import { OTP_TYPE } from '@/constants';
import { authPostMethod } from '@/services/api';
import endPoints from '@/services/urls';
import { handleServiceError } from '@/utils/error-handler';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import AtomButton from '@/components/atoms/button';
import OrSeparator from '@/components/atoms/or-separator';
import AtomTypography from '@/components/atoms/typography';
import { TemporaryHeader } from '@/components/auth/custom/verify-code';
import { paths } from '@/paths';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

// -----------------------------------------------------------------------------
// Types & Constants
// -----------------------------------------------------------------------------

interface TOTPAuthenticatorFormProps {
  onSuccess?: () => void;
  qrCodeUrl?: string;
  manualCode?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TOTPAuthenticatorForm({
  onSuccess,
  qrCodeUrl: initialQrCodeUrl,
  manualCode: initialManualCode,
}: Readonly<TOTPAuthenticatorFormProps>): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string | undefined>(initialQrCodeUrl);
  const [manualCode, setManualCode] = React.useState<string>(initialManualCode || '');
  const [isQrLoading, setIsQrLoading] = React.useState(!initialQrCodeUrl);
  const [qrError, setQrError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch TOTP session on component mount
  React.useEffect(() => {
    const fetchTotpSession = async () => {
      setIsLoading(true);
      setIsQrLoading(true);
      setQrError(false);

      try {
        const response = await authPostMethod<{
          data: {
            qr_code: string;
            secret: string;
          };
        }>(endPoints.TWO_FACTOR_AUTH_SESSION, {
          type: OTP_TYPE.TOTP,
        });

        if (response?.data) {
          // Set QR code (base64 data URL)
          if (response.data.qr_code) {
            setQrCodeUrl(response.data.qr_code);
            // Reset QR loading state so image can render
            setIsQrLoading(true); // Will be set to false when image loads
          }
          // Set secret code
          if (response.data.secret) {
            setManualCode(response.data.secret);
          }
        }
      } catch (err: any) {
        const message = handleServiceError(err, 'Failed to load TOTP authenticator setup. Please try again.');
        showErrorToast('totp-authenticator-error', message);
        setQrError(true);
      } finally {
        setIsLoading(false);
      }
    };

    // Always fetch on mount to get fresh data (unless both are explicitly provided)
    if (!initialQrCodeUrl && !initialManualCode) {
      fetchTotpSession();
    } else if (initialQrCodeUrl && initialManualCode) {
      // Both provided via props, skip fetching
      setIsQrLoading(false);
      setIsLoading(false);
    } else {
      // Partial data provided, fetch the rest
      fetchTotpSession();
    }
  }, []);

  // Handle QR code load
  const handleQrLoad = React.useCallback(() => {
    setIsQrLoading(false);
    setQrError(false);
  }, []);

  const handleQrError = React.useCallback(() => {
    setIsQrLoading(false);
    setQrError(true);
  }, []);

  // Handle copy to clipboard
  const handleCopyCode = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(manualCode);
      showSuccessToast('totp-authenticator-code-copied', 'Code copied to clipboard');
    } catch {
      showErrorToast('totp-authenticator-copy-error', 'Failed to copy code');
    }
  }, [manualCode]);

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------
  return (
    <TemporaryHeader>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: '100%',
          py: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Main Container - 414px × 468px, no border/background, gap 24px */}
        <Stack
          spacing={{ xs: 2, sm: 2 }} // 16px on mobile, 24px on desktop
          sx={{
            width: '414px',
            minHeight: { xs: 'auto', sm: '468px' },
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Title */}
          <AtomTypography variant="h2" sx={{ color: 'text.primary', fontWeight: 615 }}>
            {t('totp:authenticatorTitle')}
          </AtomTypography>

          {/* Description */}
          <AtomTypography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            Scan this QR code with Google Authenticator or similar app:
          </AtomTypography>

          {/* QR Code with Skeleton */}
          <Box
            sx={{
              position: 'relative',
              width: { xs: '150px', sm: '184.6px' },
              height: { xs: '150px', sm: '184.6px' },
              display: 'flex',
              alignItems: 'center',
              marginTop: 1.5,
              justifyContent: 'center',
            }}
          >
            {/* Show skeleton only during API loading or image loading */}
            {(isLoading || (isQrLoading && qrCodeUrl)) && (
              <Skeleton
                variant="rectangular"
                sx={{
                  position: 'absolute',
                  borderRadius: 1,
                  width: '100%',
                  height: '100%',
                }}
              />
            )}
            {/* Show QR code when URL is available - image will load and hide skeleton */}
            {qrCodeUrl && !isLoading && (
              <Box
                component="img"
                src={qrCodeUrl}
                alt="TOTP QR Code"
                onLoad={handleQrLoad}
                onError={handleQrError}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: qrError ? 'none' : 'block',
                  borderRadius: 2,
                }}
              />
            )}
            {/* Show error message only after loading is complete and QR code failed */}
            {qrError && !isLoading && !isQrLoading && !qrCodeUrl && (
              <AtomTypography variant="body2" sx={{ color: 'error.main' }}>
                Failed to load QR code
              </AtomTypography>
            )}
          </Box>

          {/* OR Separator */}
          <OrSeparator />

          {/* Manual Code Section */}
          <Stack spacing={1.5} sx={{ width: '100%', alignItems: 'flex-start' }}>
            <AtomTypography variant="subtitle3" sx={{ color: 'text.secondary' }}>
              {t('totp:manuallyEnterCode')}
            </AtomTypography>
            <AtomTypography variant="label2" sx={{ color: 'text.primary', fontWeight: 500 }}>
              {t('totp:code')}
            </AtomTypography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                width: '100%',
              }}
            >
              <AtomTypography
                variant="body4"
                sx={{
                  flex: 1,
                  wordBreak: 'break-all',
                }}
              >
                {manualCode}
              </AtomTypography>
              <IconButton
                onClick={handleCopyCode}
                sx={{
                  color: 'text.primary',
                  flexShrink: 0,
                  p: 0.5,
                }}
                aria-label="Copy code"
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Stack>
          <AtomButton
            id="totp-authenticator"
            variant="contained"
            fullWidth
            label={t('auth:continue')}
            size="large"
            onClick={() => router.push(paths.auth.custom.verifyCode.totp)}
            sx={{ mt: "6px" }}
          />
        </Stack>

        {/* Continue Button - Below the container */}
      </Box>
    </TemporaryHeader>
  );
}
