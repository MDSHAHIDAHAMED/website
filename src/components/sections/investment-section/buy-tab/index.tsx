/**
 * Buy Tab Component
 * =================
 *
 * Handles the BUY tab UI and logic for purchasing YLDZ tokens.
 * Uses locale keys for labels/text and section constants for static values.
 */

'use client';

import AtomTooltip from '@/components/atoms/tooltip';
import AtomTypography from '@/components/atoms/typography';
import InputWithLabel from '@/components/molecules/input-with-label';
import SelectWithLabel from '@/components/molecules/select-with-label';
import { useTokenBalance } from '@/hooks/stable-coin/use-token-balance';
import type { SupportedAsset } from '@/services/deposits';
import { yieldzNeutral } from '@/styles/theme/colors';
import { truncateBalance, shouldTruncateBalance } from '@/utils/balance-formatter';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { Info as InfoIcon } from '@phosphor-icons/react/dist/ssr/Info';
import Image from 'next/image';
import React, { memo, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { DetailRow } from '@/components/sections/investment-section/detail-row/detail-row';
import {
  DEFAULT_INVESTMENT_DETAILS,
  EMBLEM_ICON_SIZE,
  ETH_ADDRESS_LENGTH,
  STABLE_TOKEN_ICON_PATH,
  TOKEN_ICON_SIZE,
  TRUNCATE_BALANCE_MAX_LENGTH,
  YLDZ_EMBLEM_PATH,
} from '@/constants/stable-coin';
import { INPUT_ROW_SX, PLATFORM_FEE_PERCENT } from '@/constants/investment-card';

// =============================================================================
// Styles
// =============================================================================

/** Balance header row (label + value, right-aligned) */
const BALANCE_HEADER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: '100%',
  mb: 2,
};

/** Balance value + icon inner row */
const BALANCE_INNER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 0.75,
  ml: 1,
};

/** Tooltip content (icon + full balance text) */
const TOOLTIP_CONTENT_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
};

/** Tooltip trigger (truncated balance + info icon) */
const TOOLTIP_TRIGGER_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  cursor: 'pointer',
  maxWidth: '200px',
};

/** Truncated balance typography (ellipsis) */
const TRUNCATED_BALANCE_SX: SxProps<Theme> = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

/** Input + currency selector row */
const INPUT_CURRENCY_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  gap: 2,
  alignItems: 'flex-start',
  pb: 3,
  borderBottom: `1px solid ${yieldzNeutral[800]}`,
};

/** Investment details list container */
const DETAILS_LIST_SX: SxProps<Theme> = {
  mb: 3,
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
};

/** Tooltip slot styles (background, arrow, padding) */
const TOOLTIP_SLOT_SX = {
  bgcolor: yieldzNeutral[800],
  color: 'text.primary' as const,
  fontSize: '0.75rem',
  maxWidth: 400,
  p: 1.5,
  '& .MuiTooltip-arrow': { color: yieldzNeutral[800] },
};

// =============================================================================
// Types
// =============================================================================

export interface BuyTabProps {
  /** Supported assets from config */
  supportedAssets: SupportedAsset[];
  /** Minimum deposit amount display */
  minInvestmentDisplay: string;
  /** Callback when invest button is clicked */
  onInvestClick: () => void;
  /** Whether form is submitting */
  isSubmitting?: boolean;
  /** Whether blockchain operation is loading */
  isBlockchainLoading?: boolean;
  /** Callback to pass balance loading state to parent */
  onBalanceLoadingChange?: (isLoading: boolean) => void;
  /** Display balance passed from parent (optional - uses own hook if not provided) */
  displayBalance?: string;
  /** Whether balance is loading (from parent) */
  isBalanceLoading?: boolean;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Buy Tab Component
 * 
 * Displays BUY tab UI with currency selector and investment details
 * 
 * @param props - Component props
 * @returns Buy tab JSX element
 */
export const BuyTab = memo(function BuyTab({
  supportedAssets,
  minInvestmentDisplay,
  onBalanceLoadingChange,
  displayBalance: parentDisplayBalance,
  isBalanceLoading: parentIsBalanceLoading,
}: Readonly<BuyTabProps>): React.JSX.Element {
  /** Reuse locale strings for loading and zero-balance displays */
  const { t } = useTranslation('investment');

  const { watch } = useFormContext<{
    buyAmount: string;
    sellAmount: string;
    currency: { label: string; value: string };
  }>();
  const { address: walletAddress } = useAccount();
  const selectedCurrency = watch('currency');
  const amountInput = watch('buyAmount');

  // Determine if balance is controlled by parent
  const isParentControlled = parentDisplayBalance !== undefined;

  /**
   * Calculate "You'll receive" value after deducting platform fee (from constants)
   */
  const youReceiveValue = useMemo(() => {
    if (!amountInput) return t('zeroBalanceYldz');

    const enteredAmount = Number.parseFloat(amountInput);
    if (Number.isNaN(enteredAmount) || enteredAmount <= 0) return t('zeroBalanceYldz');

    const amountAfterFee = enteredAmount * (1 - PLATFORM_FEE_PERCENT / 100);
    return `${amountAfterFee.toFixed(2)} ${t('yldzSymbol')}`;
  }, [amountInput, t]);

  /** Currency options for the select (label/value from supported assets) */
  const currencyOptions = useMemo(
    () => supportedAssets.map((asset: SupportedAsset) => ({ label: asset.symbol, value: asset.symbol })),
    [supportedAssets]
  );

  /** Default/fallback currency; uses first asset or locale default */
  const defaultCurrency = useMemo(() => {
    const first = supportedAssets[0];
    if (first) return { label: first.symbol, value: first.symbol };
    const fallback = t('defaultCurrency');
    return { label: fallback, value: fallback };
  }, [supportedAssets, t]);

  /**
   * Get selected asset contract address for balance fetching
   */
  const selectedAssetContractAddress = useMemo(() => {
    if (!selectedCurrency || !supportedAssets.length) {
      return undefined;
    }

    const asset = supportedAssets.find((asset) => asset.symbol === selectedCurrency.value);
    if (!asset) return undefined;

    const contractAddress = asset.contractAddress;
    if (!contractAddress || !contractAddress.startsWith('0x') || contractAddress.length !== ETH_ADDRESS_LENGTH) {
      return undefined;
    }

    return contractAddress as `0x${string}`;
  }, [selectedCurrency, supportedAssets]);

  /**
   * Fetch token balance for selected currency (only if not controlled by parent)
   */
  const {
    displayBalance: localDisplayBalance,
    isLoading: localIsBalanceLoading,
  } = useTokenBalance(
    isParentControlled ? undefined : walletAddress,
    isParentControlled ? undefined : selectedAssetContractAddress,
    false
  );

  // Use parent values if provided, otherwise use local values
  const displayBalance = isParentControlled ? parentDisplayBalance : localDisplayBalance;
  const isBalanceLoading = isParentControlled ? (parentIsBalanceLoading ?? false) : localIsBalanceLoading;

  /**
   * Truncated balance and whether to show tooltip; uses constant max length.
   * Skips truncation for loading/not-connected placeholders.
   */
  const { truncatedBalance, showBalanceTooltip } = useMemo(() => {
    const isPlaceholder =
      !displayBalance || displayBalance === t('loading') || displayBalance === t('notConnected');
    return {
      truncatedBalance: isPlaceholder ? displayBalance : truncateBalance(displayBalance, TRUNCATE_BALANCE_MAX_LENGTH),
      showBalanceTooltip: !isPlaceholder && shouldTruncateBalance(displayBalance, TRUNCATE_BALANCE_MAX_LENGTH),
    };
  }, [displayBalance, t]);

  /**
   * Notify parent component when balance loading state changes (only when using local hook)
   */
  useEffect(() => {
    if (!isParentControlled) {
      onBalanceLoadingChange?.(isBalanceLoading);
    }
  }, [isParentControlled, isBalanceLoading, onBalanceLoadingChange]);

  /** Resolved balance text: not-connected / loading / actual balance */
  let balanceDisplayText: string;
  if (!walletAddress) {
    balanceDisplayText = t('notConnected');
  } else if (isBalanceLoading) {
    balanceDisplayText = t('loading');
  } else {
    balanceDisplayText = displayBalance;
  }

  return (
    <>
      <Box sx={INPUT_ROW_SX}>
        <Box sx={BALANCE_HEADER_SX}>
          <AtomTypography variant="label2" color="text.secondary">
            {t('balanceLabel')}
          </AtomTypography>
          <Box sx={BALANCE_INNER_SX}>
            <Image
              src={STABLE_TOKEN_ICON_PATH}
              alt={t('stableTokenIconAlt')}
              width={TOKEN_ICON_SIZE}
              height={TOKEN_ICON_SIZE}
              style={{ display: 'block' }}
            />
            {showBalanceTooltip ? (
              <AtomTooltip
                title={
                  <Box sx={TOOLTIP_CONTENT_SX}>
                    <Image
                      src={STABLE_TOKEN_ICON_PATH}
                      alt={t('stableTokenIconAlt')}
                      width={TOKEN_ICON_SIZE}
                      height={TOKEN_ICON_SIZE}
                      style={{ display: 'block' }}
                    />
                    <AtomTypography variant="label3" color="text.primary">
                      {displayBalance}
                    </AtomTypography>
                  </Box>
                }
                placement="top"
                arrow
                slotProps={{ tooltip: { sx: TOOLTIP_SLOT_SX } }}
              >
                <Box sx={TOOLTIP_TRIGGER_SX}>
                  <AtomTypography variant="label2" color="text.primary" fontWeight={500} sx={TRUNCATED_BALANCE_SX}>
                    {truncatedBalance}
                  </AtomTypography>
                  <InfoIcon size={EMBLEM_ICON_SIZE} color={yieldzNeutral[500]} />
                </Box>
              </AtomTooltip>
            ) : (
              <AtomTypography variant="label2" color="text.primary" fontWeight={500}>
                {balanceDisplayText}
              </AtomTypography>
            )}
          </Box>
        </Box>

        <Box sx={INPUT_CURRENCY_ROW_SX}>
          <Box sx={{ flex: 1 }}>
            <InputWithLabel
              id="investment-amount"
              name="buyAmount"
              label={t('youPayLabel')}
              variant="standard"
              placeholder={t('amountPlaceholder')}
              type="text"
              numericOnly
              required
            />
          </Box>
          <Box sx={{ width: 120, mt: 2 }}>
            <SelectWithLabel
              id="currency-select"
              name="currency"
              label=""
              variant="outlined"
              options={currencyOptions}
              placeholder={defaultCurrency.label}
              noLabel
            />
          </Box>
        </Box>
      </Box>

      <Box sx={DETAILS_LIST_SX}>
        <DetailRow
          label={t('youReceiveLabel')}
          value={youReceiveValue}
          icon={<Image src={YLDZ_EMBLEM_PATH} alt={t('yldzIconAlt')} width={EMBLEM_ICON_SIZE} height={EMBLEM_ICON_SIZE} />}
        />
        <DetailRow label={t('fixedApyLabel')} value={DEFAULT_INVESTMENT_DETAILS.fixedApy} />
        <DetailRow label={t('lockupLabel')} value={DEFAULT_INVESTMENT_DETAILS.lockup} />
        <DetailRow label={t('minInvestmentLabel')} value={minInvestmentDisplay} />
        <DetailRow label={t('feeLabel')} value={DEFAULT_INVESTMENT_DETAILS.fee} />
      </Box>
    </>
  );
});

