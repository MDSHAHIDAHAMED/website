'use client';

/**
 * Onramper Dialog Component
 * =========================
 *
 * Dialog component displaying Onramper iframe with loading state support.
 * Shows a skeleton loader while backend API is being called.
 *
 * Security:
 * - Fetches HMAC-SHA256 signature from server for wallet parameters
 * - Signature protects networkWallets/wallets/walletAddressTags from tampering
 *
 * Optimizations:
 * - Memoized skeleton component to prevent re-renders
 * - Static styles extracted as constants (prevents object recreation)
 * - Static configuration values cached at module level
 * - Main component wrapped with React.memo
 * - Signature fetching with automatic cleanup on dialog close
 */
import { Box, Dialog, Skeleton, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import AtomTypography from '@/components/atoms/typography';
import { yieldzNeutral, yieldzPrimary } from '@/styles/theme/colors';
import { fetchOnramperSignature } from '@/utils/onramper';
import Image from 'next/image';
import { AtomButton } from 'yldzs-components';

// =============================================================================
// Types
// =============================================================================

export interface OnramperDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog is closed */
  onClose: () => void;
  /** Optional: Default amount to pre-fill in Onramper */
  amount?: string;
  /** Optional: Selected cryptocurrency symbol (e.g., 'USDC', 'USDT') */
  currency?: string;
  /** Optional: Wallet address where tokens should be sent */
  walletAddress?: string;
  /** Optional: Partner context from backend (preferred) */
  partnerContext?: string;
  /** Optional: Authenticated user ID (fallback for partnerContext generation) */
  authUserId?: string;
  /** Optional: Whether the dialog content is loading (shows skeleton) */
  isLoading?: boolean;
}

// =============================================================================
// Constants
// =============================================================================

/** Widget dimensions */
const WIDGET_WIDTH = '420px';
const WIDGET_HEIGHT = '630px';

/**
 * Maps currency symbols to Onramper crypto identifiers
 * Format: symbol -> onramper_id (e.g., 'USDC' -> 'usdc_ethereum')
 */
const CURRENCY_TO_ONRAMPER_MAP: Readonly<Record<string, string>> = {
  USDC: 'usdc_ethereum',
  USDT: 'usdt_ethereum',
  usdc: 'usdc_ethereum',
  usdt: 'usdt_ethereum',
};

/** Environment variables (cached at module level for performance) */
const ENV_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_ONRAMPER_API_KEY ?? '',
  frontendBaseUrl: process.env.NEXT_PUBLIC_FRONTEND_URL ?? '',
  onramperBaseUrl: process.env.NEXT_PUBLIC_ONRAMPER_URL ?? '',
} as const;

/** Pre-computed base URL without trailing slash */
const NORMALIZED_BASE_URL = ENV_CONFIG.frontendBaseUrl.endsWith('/')
  ? ENV_CONFIG.frontendBaseUrl.slice(0, -1)
  : ENV_CONFIG.frontendBaseUrl;

/** Pre-computed redirect URLs */
const SUCCESS_REDIRECT_URL = `${NORMALIZED_BASE_URL}/dashboard/tokens/yldzs-token?success=true`;
const FAILURE_REDIRECT_URL = `${NORMALIZED_BASE_URL}/dashboard/tokens/yldzs-token?success=false`;

/** Skeleton row keys for info section */
const SKELETON_INFO_ROWS = ['row-1', 'row-2', 'row-3'] as const;

// =============================================================================
// Styles (extracted to prevent object recreation on each render)
// =============================================================================

const SKELETON_CONTAINER_SX: SxProps<Theme> = {
  width: WIDGET_WIDTH,
  height: WIDGET_HEIGHT,
  backgroundColor: yieldzNeutral[900],
  display: 'flex',
  flexDirection: 'column',
  p: 3,
};

const SKELETON_BG_SX: SxProps<Theme> = { bgcolor: yieldzNeutral[800] };

const SKELETON_HEADER_SX: SxProps<Theme> = { mb: 4 };

const SKELETON_INPUT_SX: SxProps<Theme> = {
  bgcolor: yieldzNeutral[800],
  mb: 2,
  borderRadius: 2,
};

const SKELETON_CURRENCY_SX: SxProps<Theme> = {
  bgcolor: yieldzNeutral[800],
  mb: 3,
  borderRadius: 2,
};

const SKELETON_INFO_CONTAINER_SX: SxProps<Theme> = { mb: 4 };

const SKELETON_INFO_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
};

const SKELETON_DIVIDER_SX: SxProps<Theme> = {
  bgcolor: yieldzNeutral[700],
  mb: 3,
};

const SKELETON_PAYMENT_SX: SxProps<Theme> = {
  bgcolor: yieldzNeutral[800],
  mb: 3,
  borderRadius: 2,
};

const SKELETON_SPACER_SX: SxProps<Theme> = { flex: 1 };

const SKELETON_LOADING_CONTAINER_SX: SxProps<Theme> = { mb: 3 };

const SKELETON_SPINNER_SX: SxProps<Theme> = {
  width: 32,
  height: 32,
  border: `3px solid ${yieldzNeutral[700]}`,
  borderTopColor: yieldzPrimary[500],
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

const SKELETON_BUTTON_SX: SxProps<Theme> = {
  bgcolor: yieldzNeutral[800],
  borderRadius: 2,
};

/** Dialog paper props for consistent styling */
const DIALOG_PAPER_PROPS = {
  sx: {
    overflow: 'visible',
    borderRadius: 2,
    position: 'relative',
  },
} as const;

/** Close button styles - positioned at top right corner outside the dialog */
const CLOSE_BUTTON_SX: SxProps<Theme> = {
  position: 'absolute',
  bottom: -40,
  left: '50%',
  transform: 'translateX(-50%)',
  color: yieldzNeutral[100],
  width: 32,
  height: 32,
  zIndex: 1,
};

/** Iframe styles (extracted to prevent recreation) */
const IFRAME_STYLE: React.CSSProperties = {
  border: 'none',
  display: 'block',
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Build the Onramper iframe URL with all required parameters.
 * Uses pre-computed constants for better performance.
 *
 * @param amount - Amount to pre-fill
 * @param currency - Selected cryptocurrency symbol (e.g., 'USDC', 'USDT')
 * @param walletAddress - User's wallet address
 * @param partnerContext - Partner context for tracking
 * @param authUserId - Authenticated user ID
 * @param signature - HMAC-SHA256 signature for wallet parameters (optional)
 * @returns Complete Onramper URL with query parameters
 */
function buildOnramperUrl(
  amount?: string,
  currency?: string,
  walletAddress?: string,
  partnerContext?: string,
  authUserId?: string,
  signature?: string
): string {
  const defaultCrypto = (currency && CURRENCY_TO_ONRAMPER_MAP[currency]) || 'usdc_ethereum';

  // Build all parameters in URLSearchParams for proper encoding
  // apiKey should be early in the parameter list
  const params = new URLSearchParams({
    apiKey: ENV_CONFIG.apiKey,
    mode: 'buy',
    defaultCrypto,
    onlyCryptos: 'usdc_ethereum,usdt_ethereum',
    successRedirectUrl: SUCCESS_REDIRECT_URL,
    failureRedirectUrl: FAILURE_REDIRECT_URL,
    redirectAtCheckout: 'false',
    // Theming parameters (colors are 6-digit hex without '#')
    themeName: 'dark',
    containerColor: '141416',
    primaryColor: '075353',
    secondaryColor: '363434',
    cardColor: '272727',
    primaryTextColor: 'ffffff',
    secondaryTextColor: 'ffffff',
    primaryBtnTextColor: '6df2fe',
    borderRadius: '0',
    wgBorderRadius: '1.91',
  });

  // Add optional parameters only if they have values
  if (amount) params.set('defaultAmount', amount);
  if (walletAddress) params.set('networkWallets', `ethereum:${walletAddress}`);
  if (partnerContext) params.set('partnerContext', partnerContext);
  if (authUserId) params.set('authUserId', authUserId);
  if (signature) params.set('signature', signature);

  return `${ENV_CONFIG.onramperBaseUrl}?${params.toString()}`;
}

// =============================================================================
// Skeleton Component (Memoized)
// =============================================================================

/**
 * Loading skeleton component for OnramperDialog.
 * Displays a skeleton UI mimicking the Onramper widget layout.
 * Fully memoized - only renders once since it has no props.
 */
const OnramperLoadingSkeleton = memo(function OnramperLoadingSkeleton(): React.JSX.Element {
  return (
    <Box sx={SKELETON_CONTAINER_SX}>
      {/* Header skeleton */}
      <Stack spacing={2} alignItems="center" sx={SKELETON_HEADER_SX}>
        <Skeleton variant="circular" width={48} height={48} sx={SKELETON_BG_SX} />
        <Skeleton variant="text" width={180} height={28} sx={SKELETON_BG_SX} />
        <Skeleton variant="text" width={240} height={20} sx={SKELETON_BG_SX} />
      </Stack>

      {/* Amount input skeleton */}
      <Skeleton variant="rounded" width="100%" height={56} sx={SKELETON_INPUT_SX} />

      {/* Currency selector skeleton */}
      <Skeleton variant="rounded" width="100%" height={56} sx={SKELETON_CURRENCY_SX} />

      {/* Info rows skeleton */}
      <Stack spacing={1.5} sx={SKELETON_INFO_CONTAINER_SX}>
        {SKELETON_INFO_ROWS.map((rowKey) => (
          <Box key={rowKey} sx={SKELETON_INFO_ROW_SX}>
            <Skeleton variant="text" width={100} height={20} sx={SKELETON_BG_SX} />
            <Skeleton variant="text" width={80} height={20} sx={SKELETON_BG_SX} />
          </Box>
        ))}
      </Stack>

      {/* Divider */}
      <Skeleton variant="rectangular" width="100%" height={1} sx={SKELETON_DIVIDER_SX} />

      {/* Payment method skeleton */}
      <Skeleton variant="rounded" width="100%" height={64} sx={SKELETON_PAYMENT_SX} />

      {/* Spacer */}
      <Box sx={SKELETON_SPACER_SX} />

      {/* Loading text with spinner */}
      <Stack spacing={1} alignItems="center" sx={SKELETON_LOADING_CONTAINER_SX}>
        <Box sx={SKELETON_SPINNER_SX} />
        <AtomTypography variant="subtitle2" color="text.secondary">
          Preparing payment gateway...
        </AtomTypography>
      </Stack>

      {/* Button skeleton */}
      <Skeleton variant="rounded" width="100%" height={48} sx={SKELETON_BUTTON_SX} />
    </Box>
  );
});

// =============================================================================
// Main Component (Memoized)
// =============================================================================

/**
 * Onramper Dialog Component
 *
 * Displays the Onramper fiat-to-crypto widget in a dialog.
 * Shows a loading skeleton while the backend API is being called.
 * Fetches HMAC-SHA256 signature from server to protect wallet parameters.
 *
 * @param props - Component props
 * @returns Dialog with Onramper iframe or loading skeleton
 */
export const OnramperDialog = memo(function OnramperDialog({
  open,
  onClose,
  amount,
  currency,
  walletAddress,
  partnerContext,
  authUserId,
  isLoading = false,
}: Readonly<OnramperDialogProps>): React.JSX.Element {
  // Signature state - null means not fetched, string means fetched successfully
  const [signature, setSignature] = useState<string | null>(null);
  // Track if signature fetch has been attempted (success or failure)
  const [signatureFetchAttempted, setSignatureFetchAttempted] = useState(false);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  /**
   * Single effect to handle signature fetching and cleanup.
   * - Fetches signature when dialog opens with a wallet address
   * - Resets state when dialog closes or wallet changes
   * - Tracks fetch attempt to prevent showing iframe before signature is ready
   */
  useEffect(() => {
    // Mark component as mounted
    isMountedRef.current = true;

    // Reset and exit early if dialog is closed
    if (!open) {
      setSignature(null);
      setSignatureFetchAttempted(false);
      return;
    }

    // No wallet address - no signature needed, mark as attempted
    if (!walletAddress) {
      setSignature(null);
      setSignatureFetchAttempted(true);
      return;
    }

    // Reset states before fetching new signature
    setSignature(null);
    setSignatureFetchAttempted(false);

    // Fetch signature for wallet address
    const fetchSignatureAsync = async (): Promise<void> => {
      try {
        const networkWallets = `ethereum:${walletAddress}`;
        const result = await fetchOnramperSignature({ networkWallets });

        // Only update state if still mounted
        if (isMountedRef.current) {
          if (result) {
            setSignature(result.signature);
          } else {
            console.warn('Onramper: Failed to fetch signature, widget may reject the transaction');
            setSignature(null);
          }
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error('Error fetching Onramper signature:', error);
          setSignature(null);
        }
      } finally {
        // Mark fetch as attempted regardless of success/failure
        if (isMountedRef.current) {
          setSignatureFetchAttempted(true);
        }
      }
    };

    fetchSignatureAsync();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [open, walletAddress]);

  /**
   * Build Onramper iframe URL with query parameters including signature.
   * Memoized to prevent URL rebuilding on every render.
   */
  const onramperUrl = useMemo(
    () => buildOnramperUrl(amount, currency, walletAddress, partnerContext, authUserId, signature ?? undefined),
    [amount, currency, walletAddress, partnerContext, authUserId, signature]
  );

  // Determine if skeleton should be shown:
  // - External loading state is true
  // - Amount is not yet available
  // - Signature fetch not yet attempted (when wallet address is provided)
  const showSkeleton = isLoading || !amount || !signatureFetchAttempted;

  /**
   * Handle dialog close - prevents closing on backdrop click
   * Only allows closing via the close button
   */
  const handleDialogClose = useCallback(
    (_event: object, reason: 'backdropClick' | 'escapeKeyDown') => {
      // Prevent closing on backdrop click or escape key
      if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
        return;
      }
      onClose();
    },
    [onClose]
  );

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth={false}
      PaperProps={DIALOG_PAPER_PROPS}
      disableEscapeKeyDown
    >
      {/* Close button */}
      <AtomButton
          id="close-onramper-dialog"
          label={<Image src="/assets/icons/cross-button.svg" alt="Close" width={20} height={20} />}
          onClick={onClose}
          variant="text"
          color="secondary"
          size="small"
          sx={{
            minWidth: 'auto',
            width: 32,
            height: 32,
            p: 0,
            ...CLOSE_BUTTON_SX,
          }}
        />

      {showSkeleton ? (
        <OnramperLoadingSkeleton />
      ) : (
        <iframe
          key={onramperUrl}
          src={onramperUrl}
          title="Onramper Widget"
          height={WIDGET_HEIGHT}
          width={WIDGET_WIDTH}
          style={IFRAME_STYLE}
          allow="accelerometer; autoplay; camera; gyroscope; payment; microphone"
        />
      )}
    </Dialog>
  );
});

export default OnramperDialog;
