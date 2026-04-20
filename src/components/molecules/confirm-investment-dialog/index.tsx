'use client';

/**
 * Confirm Investment Dialog Component
 * ===================================
 * 
 * Modal dialog for confirming investment details before finalizing.
 * Displays payment amount, investment details, and expected returns.
 * 
 * Features:
 * - Dark theme styling matching the design system
 * - Close button using AtomButton component
 * - Investment details breakdown
 * - Expected returns timeline
 * - Confirmation action button
 * - Calculates fees based on entered amount (1% platform fee, 1% network fee)
 * - Fetches "You will receive" values from blockchain balance function
 */

import { AtomButton } from '@/components/atoms/button';
import LottieAnimation from '@/components/atoms/lottie-animation';
import AtomTypography from '@/components/atoms/typography';
import type { PipelineLoadingStatus } from '@/hooks/use-write-with-wait';
import { useLiquidityPoolBalance } from '@/hooks/stable-coin/use-liquidity-pool-balance';
import { YLDZS_COIN_DETAIL } from '@/constants/yldzs-token';
import { yieldzGradient, yieldzNeutral } from '@/styles/theme/colors';
import { Box, Dialog, Divider, Stack, Tooltip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { CurrencyDollar as CurrencyDollarIcon } from '@phosphor-icons/react/dist/ssr/CurrencyDollar';
import { Info as InfoIcon } from '@phosphor-icons/react/dist/ssr/Info';
import Image from 'next/image';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { Address } from 'viem';
import { CornerContainer } from 'yldzs-components';

// =============================================================================
// Types
// =============================================================================

export interface ConfirmInvestmentDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog is closed */
  onClose: () => void;
  /** Callback when confirm button is clicked */
  onConfirm: () => void;
  /** Amount entered by user (as string, e.g., "1000") */
  enteredAmount?: string;
  /** Currency symbol (e.g., "USDC", "USDT") */
  currency?: string;
  /** Current APY percentage (e.g., "~12.50%") */
  currentApy?: string;
  /** Lockup period (e.g., "60 days") */
  lockup?: string;
  /** Network fee percentage (e.g., "1%") */
  networkFee?: string;
  /** Platform fee percentage (e.g., "1%") */
  platformFee?: string;
  /** Instant reward amount (e.g., "99.00 YLDZ") */
  instantReward?: string;
  /** Reward after lockup period (e.g., "99.00 YLDZ") */
  rewardAfterLockup?: string;
  /** Whether to show 60 days lockup indicator */
  showSixtyDays?: boolean;
  /** YLDZ token contract address for blockchain balance fetch */
  yieldzTokenAddress?: Address;
  /** Vault contract address for blockchain balance fetch */
  vaultAddress?: Address;
  /** Whether the transaction is being processed */
  isLoading?: boolean;
  /** Current pipeline phase: awaiting_signature (wallet popup) or processing (on-chain). Used for status text when isLoading. */
  loadingStatus?: PipelineLoadingStatus;
  /** Token in (e.g., "USDC", "USDT") */
  tokenIn?: string;
}

// =============================================================================
// Styles
// =============================================================================

/** Dialog paper styles */
const DIALOG_PAPER_SX: SxProps<Theme> = {
  backgroundColor: yieldzNeutral[950],
  borderRadius: 0,
  minWidth: 500,
  maxWidth: 600,
};

/** Header container styles */
const HEADER_SX: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  px: 3,
  py: 2.5,
  borderBottom: `1px solid ${yieldzNeutral[800]}`,
};

/** Content container styles */
const CONTENT_SX: SxProps<Theme> = {
  p: 5,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

/** Section container styles */
const SECTION_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
};

/** Loading overlay - covers dialog when transaction is in progress */
const LOADING_OVERLAY_SX: SxProps<Theme> = {
  position: 'absolute',
  inset: 0,
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(4px)',
  gap: 3,
};

/** Loading text styles with subtle pulse animation */
const LOADING_TEXT_SX: SxProps<Theme> = {
  animation: 'pulse 2s ease-in-out infinite',
  '@keyframes pulse': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.6 },
  },
};

/** You pay container with gradient background - base styles */
const YOU_PAY_CONTAINER_BASE_SX: SxProps<Theme> = {
  position: 'relative',
  background: yieldzGradient.cardBackground,
  border: `1px solid ${yieldzNeutral[800]}`,
  borderRadius: 2,
  p: 3,
  overflow: 'hidden',
  transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
  transformStyle: 'preserve-3d',
  cursor: 'pointer',
};

/** Glow overlay that follows mouse - positioned absolutely within container */
const GLOW_OVERLAY_SX: SxProps<Theme> = {
  position: 'absolute',
  width: 200,
  height: 200,
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(109, 242, 254, 0.25) 0%, transparent 70%)',
  pointerEvents: 'none',
  transform: 'translate(-50%, -50%)',
  transition: 'opacity 0.3s ease',
};

/** You pay amount container */
const YOU_PAY_AMOUNT_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  mt: 1,
};

/** Dollar icon container */
const DOLLAR_ICON_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: yieldzNeutral[800],
  border: `1px dashed ${yieldzNeutral[600]}`,
  color: yieldzNeutral[300],
};

/** Detail row container with hover animation */
const DETAIL_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mx: -1.5,
  borderRadius: 1,
  position: 'relative',
  overflow: 'hidden',
  cursor: 'default',
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, transparent 0%, rgba(109, 242, 254, 0.08) 50%, transparent 100%)',
    opacity: 0,
    transform: 'translateX(-100%)',
    transition: 'opacity 0.3s ease, transform 0.5s ease',
  },
  '&:hover': {
    backgroundColor: 'rgba(109, 242, 254, 0.04)',
    transform: 'translateX(4px)',
    p: 0.5,
    '&::before': {
      opacity: 1,
      transform: 'translateX(100%)',
    },
  },
};

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Detail Row Component
 * Displays a label-value pair
 */
interface DetailRowProps {
  label: string;
  value: string | undefined;
  /** Optional tooltip text to show with info icon */
  tooltip?: string;
}

function DetailRow({ label, value, tooltip }: Readonly<DetailRowProps>): React.JSX.Element {
  return (
    <Box sx={DETAIL_ROW_SX}>
      {/* Label section with optional tooltip - positioned above shimmer effect */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, position: 'relative', zIndex: 1 }}>
        <AtomTypography variant="subtitle2" color="text.secondary">
          {label}
        </AtomTypography>
        {tooltip && (
          <Tooltip 
            title={tooltip} 
            arrow 
            placement="top"
            slotProps={{
              tooltip: {
                sx: {
                  bgcolor: yieldzNeutral[800],
                  color: 'text.primary',
                  fontSize: '0.75rem',
                  maxWidth: 280,
                  p: 1.5,
                  '& .MuiTooltip-arrow': {
                    color: yieldzNeutral[800],
                  },
                },
              },
            }}
          >
            <Box sx={{ display: 'flex', cursor: 'pointer' }}>
              <InfoIcon size={14} color={yieldzNeutral[500]} />
            </Box>
          </Tooltip>
        )}
      </Box>
      {/* Value section - positioned above shimmer effect */}
      <AtomTypography variant="subtitle2" color="text.primary" sx={{ position: 'relative', zIndex: 1 }}>
        {value}
      </AtomTypography>
    </Box>
  );
}

// =============================================================================
// Helper Types & Functions
// =============================================================================

/** Investment details return type */
interface InvestmentDetailsResult {
  youPay: string;
  currentApy: string;
  lockup: string;
  networkFee: string;
  platformFee: string;
  instantReward: string;
  rewardAfterLockup: string | undefined;
  showSixtyDays: boolean;
}

/** Default/empty investment details */
const DEFAULT_INVESTMENT_DETAILS: InvestmentDetailsResult = {
  youPay: '—',
  currentApy: '—',
  lockup: '—',
  networkFee: '—',
  platformFee: '—',
  instantReward: '—',
  rewardAfterLockup: undefined,
  showSixtyDays: false,
};

/** Platform fee percentage */
const FEE_PERCENT = 1;

/**
 * Format lockup period from months to readable string
 */
function formatLockupPeriod(months: number): string {
  if (months === 12) return '12 months';
  return `${months} month${months > 1 ? 's' : ''}`;
}

/**
 * Calculate reward distribution based on LP balance availability
 */
function calculateRewardDistribution(
  lpBalance: number,
  totalRewardAfterFee: number,
  isLpUnavailable: boolean
): { instantReward: string; rewardAfterLockup: string | undefined; showSixtyDays: boolean } {
  // Full instant payment when LP is unavailable OR has enough balance
  const canPayInstantly = isLpUnavailable || lpBalance >= totalRewardAfterFee;
  
  if (canPayInstantly) {
    return {
      instantReward: `${totalRewardAfterFee.toFixed(2)} YLDZ`,
      rewardAfterLockup: undefined,
      showSixtyDays: false,
    };
  }

  // LP insufficient - split payment (instant from LP, rest after 60 days)
  const instantAmount = Math.max(0, lpBalance);
  const delayedAmount = Math.max(0, totalRewardAfterFee - lpBalance);
  return {
    instantReward: instantAmount > 0 ? `${instantAmount.toFixed(2)} YLDZ` : '—',
    rewardAfterLockup: delayedAmount > 0 ? `${delayedAmount.toFixed(2)} YLDZ` : '—',
    showSixtyDays: true,
  };
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Confirm Investment Dialog Component
 * 
 * @param props - Component props
 * @returns Confirm investment dialog JSX element
 */
export function ConfirmInvestmentDialog({
  open,
  onClose,
  onConfirm,
  enteredAmount,
  currency,
  lockup,
  networkFee,
  platformFee,
  instantReward,
  rewardAfterLockup,
  showSixtyDays,
  currentApy,
  yieldzTokenAddress,
  vaultAddress,
  isLoading = false,
  loadingStatus = 'idle',
  tokenIn,
}: Readonly<ConfirmInvestmentDialogProps>): React.JSX.Element {
  /**
   * Status message for loading overlay: confirm in wallet first, then processing on chain
   */
  const loadingOverlayMessage =
    loadingStatus === 'processing'
      ? 'Processing...'
      : 'Confirm in the wallet...';

  /**
   * Fetch liquidity pool balance from blockchain using balanceOf function
   * This determines how much can be paid instantly vs after lockup period
   */
  const {
    balanceAsNumber: lpBalance,
    isLoading: isLpBalanceLoading,
    error: lpBalanceError,
  } = useLiquidityPoolBalance(yieldzTokenAddress, vaultAddress);

  // ==========================================================================
  // Mouse tracking state for 3D tilt effect on "You pay" container
  // ==========================================================================

  /** Reference to the "You pay" container element */
  const youPayContainerRef = useRef<HTMLDivElement>(null);

  /** Mouse position relative to container center (for glow effect) */
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  /** Current tilt rotation values */
  const [tiltTransform, setTiltTransform] = useState({ rotateX: 0, rotateY: 0 });

  /** Whether mouse is hovering over the container */
  const [isHovering, setIsHovering] = useState(false);

  /**
   * Handle mouse movement over the "You pay" container
   * Calculates tilt angle and glow position based on mouse coordinates
   */
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const container = youPayContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Mouse position relative to container
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate tilt (max ±10 degrees)
    const tiltX = ((mouseY - centerY) / centerY) * -8;
    const tiltY = ((mouseX - centerX) / centerX) * 8;

    setMousePosition({ x: mouseX, y: mouseY });
    setTiltTransform({ rotateX: tiltX, rotateY: tiltY });
  }, []);

  /**
   * Handle mouse enter - enable hover state
   */
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  /**
   * Handle mouse leave - reset tilt and hide glow
   */
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setTiltTransform({ rotateX: 0, rotateY: 0 });
  }, []);

  /**
   * Dynamic styles for the "You pay" container with 3D transform
   */
  const youPayContainerSx = useMemo((): SxProps<Theme> => ({
    ...YOU_PAY_CONTAINER_BASE_SX,
    transform: `perspective(800px) rotateX(${tiltTransform.rotateX}deg) rotateY(${tiltTransform.rotateY}deg) scale(${isHovering ? 1.02 : 1})`,
    boxShadow: isHovering ? '0 15px 35px rgba(0, 0, 0, 0.3), 0 0 30px rgba(109, 242, 254, 0.1)' : 'none',
  }), [tiltTransform.rotateX, tiltTransform.rotateY, isHovering]);

  /**
   * Build result with prop overrides applied to base values
   */
  const applyPropOverrides = useCallback((base: InvestmentDetailsResult): InvestmentDetailsResult => ({
    ...base,
    currentApy: currentApy ?? base.currentApy,
    lockup: lockup ?? base.lockup,
    networkFee: networkFee ?? base.networkFee,
    platformFee: platformFee ?? base.platformFee,
    instantReward: instantReward ?? base.instantReward,
    rewardAfterLockup: rewardAfterLockup ?? base.rewardAfterLockup,
    showSixtyDays: showSixtyDays ?? base.showSixtyDays,
  }), [currentApy, lockup, networkFee, platformFee, instantReward, rewardAfterLockup, showSixtyDays]);

  /**
   * Calculate investment details based on entered amount
   */
  const investmentDetails = useMemo((): InvestmentDetailsResult => {
    // Parse amount - default to 0 if not provided
    const amount = Number.parseFloat(enteredAmount ?? '0');
    const isValidAmount = enteredAmount && !Number.isNaN(amount) && amount > 0;

    // Return defaults with prop overrides for invalid amounts
    if (!isValidAmount) {
      return applyPropOverrides(DEFAULT_INVESTMENT_DETAILS);
    }

    // Calculate fees and reward amounts
    const platformFeeAmount = amount * (FEE_PERCENT / 100);
    const networkFeeAmount = amount * (FEE_PERCENT / 100);
    const totalRewardAfterFee = amount * (1 - FEE_PERCENT / 100);

    // Get lockup period and reward distribution
    const lockupMonths = YLDZS_COIN_DETAIL.yield_details.lockup_period_months;
    const isLpUnavailable = isLpBalanceLoading || !!lpBalanceError || !vaultAddress || !yieldzTokenAddress;
    const rewardDistribution = calculateRewardDistribution(lpBalance, totalRewardAfterFee, isLpUnavailable);

    // Build calculated result
    const calculatedResult: InvestmentDetailsResult = {
      youPay: `${enteredAmount} ${currency ?? ''}`.trim(),
      currentApy: '12.50%',
      lockup: formatLockupPeriod(lockupMonths),
      networkFee: `$${networkFeeAmount.toFixed(2)}`,
      platformFee: `$${platformFeeAmount.toFixed(2)}`,
      instantReward: rewardDistribution.instantReward,
      rewardAfterLockup: rewardDistribution.rewardAfterLockup,
      showSixtyDays: rewardDistribution.showSixtyDays,
    };

    return applyPropOverrides(calculatedResult);
  }, [enteredAmount, currency, lpBalance, isLpBalanceLoading, lpBalanceError, vaultAddress, yieldzTokenAddress, applyPropOverrides]);

  /**
   * Handle Confirm Button Click
   * ===========================
   * Note: Dialog will be closed by the parent component after processing completes
   */
  const handleConfirm = () => {
    onConfirm();
    // Don't close here - let parent handle closing after blockchain/API operations complete
  };

  /**
   * Handle dialog close - only allow closing via close button, not backdrop click
   * @param event - Close event
   * @param reason - Reason for closing ('backdropClick' | 'escapeKeyDown' | 'closeButton')
   */
  const handleDialogClose = useCallback((
    _event: React.SyntheticEvent,
    reason: 'backdropClick' | 'escapeKeyDown'
  ) => {
    // Prevent closing on backdrop click or escape key
    // Only allow closing via the close button (X icon)
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }
    onClose();
  }, [onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: DIALOG_PAPER_SX,
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
      }}
    >
      {/* Loading Overlay - Shows when transaction is in progress */}
      {isLoading && (
        <Box sx={LOADING_OVERLAY_SX}>
          <LottieAnimation width={120} height={120} />
          <AtomTypography
            variant="h5"
            color="text.primary"
            fontType="ppMori"
            sx={LOADING_TEXT_SX}
          >
            {loadingOverlayMessage}
          </AtomTypography>
        </Box>
      )}

      {/* Header */}
      <CornerContainer sx={HEADER_SX}>
        <AtomTypography variant="h4" color="text.primary">
          {investmentDetails.lockup ? 'Confirm investment' : 'Confirm sell'}
        </AtomTypography>
        <AtomButton
          id="close-investment-dialog"
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
          }}
        />
      </CornerContainer>

      {/* Content */}
      <CornerContainer sx={CONTENT_SX} outerSx={{ border:'none' }}>
        {/* You Pay Section - Interactive 3D tilt effect on hover */}
        <Box
          ref={youPayContainerRef}
          sx={youPayContainerSx}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Glow overlay that follows mouse position */}
          <Box
            sx={{
              ...GLOW_OVERLAY_SX,
              left: mousePosition.x,
              top: mousePosition.y,
              opacity: isHovering ? 1 : 0,
            }}
          />
          <AtomTypography variant="subtitle2" color="text.secondary" sx={{ position: 'relative', zIndex: 1 }}>
            You pay
          </AtomTypography>
          <Box sx={{ ...YOU_PAY_AMOUNT_SX, position: 'relative', zIndex: 1 }}>
            <Box sx={DOLLAR_ICON_SX}>
              <CurrencyDollarIcon size={20} weight="fill" />
            </Box>
            <AtomTypography variant="h3" color="text.primary">
              {investmentDetails.youPay}
            </AtomTypography>
          </Box>
        </Box>

        {/* Investment Details Section */}
          <Stack spacing={1} sx={{ p: 3 }}>
            {investmentDetails.currentApy && (
              <DetailRow label="Current APY" value={investmentDetails.currentApy} />
            )}
            {investmentDetails.lockup && (
              <DetailRow label="Lockup" value={investmentDetails.lockup} />
            )}
            <DetailRow label="Network Fee" value={investmentDetails.networkFee} />
            <DetailRow 
              label="Platform Fee" 
              value={investmentDetails.platformFee}
              tooltip={investmentDetails.lockup ? "A 1% platform fee is deducted from your investment amount. Calculation: Investment Amount × 1% = Platform Fee. This fee supports platform operations and maintenance." : "Withdrawal fee calculated from blockchain. This fee is deducted from your withdrawal amount."}
            />
          </Stack>

        <Divider sx={{ borderColor: yieldzNeutral[800], px: 3 }} />

        {/* You'll Receive Section */}
        <Box sx={SECTION_SX }>
          <AtomTypography variant="body4" color="text.secondary" sx={{ mb: 1, px: 1 }}>
            You'll receive
          </AtomTypography>
          <Stack spacing={1} sx={{ px: 3 }}>
            <DetailRow label="Instant" value={investmentDetails.instantReward} />
            {investmentDetails.rewardAfterLockup !== undefined && (
              <DetailRow
                label={investmentDetails.showSixtyDays ? 'In 60 days' : `In ${investmentDetails.lockup}`}
                value={investmentDetails.rewardAfterLockup ?? '0 YLDZ'}
              />
            )}
          </Stack>
        <AtomButton
          id="confirm-investment-btn"
          label={isLoading ? 'PROCESSING...' : 'CONFIRM'}
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleConfirm}
          disabled={isLoading}
        />
        </Box>
      </CornerContainer>
    </Dialog>
  );
}

export default ConfirmInvestmentDialog;

