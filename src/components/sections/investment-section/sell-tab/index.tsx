/**
 * Sell Tab Component
 * ==================
 *
 * Handles the SELL tab UI and logic for selling YLDZ tokens
 */

'use client';

import { Box } from '@mui/material';
import Image from 'next/image';
import React, { memo, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAccount } from 'wagmi';

import { AtomButton } from '@/components/atoms/button';
import AtomTypography from '@/components/atoms/typography';
import InputWithLabel from '@/components/molecules/input-with-label';
import { yieldzNeutral } from '@/styles/theme/colors';

import { DetailRow } from '@/components/sections/investment-section/detail-row/detail-row';
import { useGetUnlockAmount } from '@/hooks/stable-coin/use-get-unlock-amount';
import { useTokenBalance } from '@/hooks/stable-coin/use-token-balance';
import { useWithdrawFee } from '@/hooks/stable-coin/use-withdraw-fee';
import {
  DEFAULT_DISPLAY_VALUES,
  INPUT_ROW_SX,
  USDC_DECIMALS,
  WITHDRAWAL_PERCENTAGE,
} from '@/constants/investment-card';
import {
  formatUnlockableAmount,
  getAvailableToWithdraw,
  parseAndValidateWithdrawalAmount,
} from '@/utils/stable-coin/withdrawal-formatters';

// =============================================================================
// Types
// =============================================================================

export interface SellTabProps {
  /** YLDZ token contract address */
  yieldzTokenAddress?: `0x${string}`;
  /** Stable token address (e.g. USDC) that user will receive */
  stableTokenAddress?: `0x${string}`;
  /** Vault contract address */
  vaultAddress?: `0x${string}`;
  /** Registry contract address (RegD) */
  registryAddress?: `0x${string}`;
  /** Compliance module address */
  complianceAddress?: `0x${string}`;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Sell Tab Component
 *
 * Displays SELL tab UI with YLDZ token display and sell details
 *
 * @param props - Component props
 * @returns Sell tab JSX element
 */
export const SellTab = memo(function SellTab({
  yieldzTokenAddress,
  stableTokenAddress,
  vaultAddress,
  registryAddress,
  complianceAddress,
}: Readonly<SellTabProps>): React.JSX.Element {
  const { watch, setError } = useFormContext<{
    buyAmount: string;
    sellAmount: string;
    currency: { label: string; value: string };
  }>();
  const { address: walletAddress } = useAccount();

  /**
   * Watch sell amount input for real-time updates
   */
  const sellAmount = watch('sellAmount');

  /**
   * Fetch YLDZ token decimals needed for formatting unlockable amount
   * This hook internally calls ERC20 decimals() to get token decimals
   */
  const { decimals: yieldzDecimals } = useTokenBalance(walletAddress, yieldzTokenAddress, true);

  /**
   * Fetch unlockable amount from registry contract
   * This hook calls getUnlockAmount(compliance, user) to get the amount available for withdrawal
   */
  const {
    unlockableAmount,
    isLoading: isUnlockAmountLoading,
    error: unlockAmountError,
  } = useGetUnlockAmount(registryAddress, complianceAddress, walletAddress);

  /**
   * Fetch withdrawal fee and calculate receive amount from blockchain
   * This hook:
   * 1. Fetches LP balance (stable token balance in vault)
   * 2. Fetches withdrawal fee using getWithdrawfee
   * 3. Calculates receive amount = entered amount - fee
   */
  const {
    receiveAmount: usdcReceiveAmount,
    withdrawFeeAmount: feeAmount,
    withdrawFeeFormatted: feePercentage,
    lpBalanceFormatted,
    isLoading: isFeeLoading,
  } = useWithdrawFee(stableTokenAddress, vaultAddress, sellAmount, USDC_DECIMALS);

  /**
   * Format unlockable amount for display (wei → human-readable with locale)
   */
  const formattedUnlockableAmount = useMemo(
    () => formatUnlockableAmount(unlockableAmount, yieldzDecimals),
    [unlockableAmount, yieldzDecimals]
  );

  /**
   * Available to withdraw: percentage of LP balance (formatted + numeric for validation)
   */
  const availableToWithdraw = useMemo(
    () => getAvailableToWithdraw(lpBalanceFormatted, WITHDRAWAL_PERCENTAGE),
    [lpBalanceFormatted]
  );

  /**
   * Validate that sellAmount doesn't exceed withdrawal percentage of LP balance
   */
  useEffect(() => {
    if (!availableToWithdraw.numeric || availableToWithdraw.numeric <= 0) {
      return;
    }

    const enteredAmount = parseAndValidateWithdrawalAmount(sellAmount);
    if (enteredAmount === null) {
      return;
    }

    if (enteredAmount > availableToWithdraw.numeric) {
      setError(
        'sellAmount',
        {
          type: 'manual',
          message: `Amount cannot exceed ${availableToWithdraw.formatted} USDC (${WITHDRAWAL_PERCENTAGE * 100}% of available liquidity)`,
        },
        { shouldFocus: false }
      );
    }
  }, [sellAmount, availableToWithdraw, setError]);

  return (
    <>
      {/* Amount Input Section */}
      <Box sx={INPUT_ROW_SX}>
        {/* Balance Display - Right Aligned */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%',
            mb: 2,
          }}
        >
          <AtomTypography variant="label2" color="text.secondary">
            BALANCE:
          </AtomTypography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 0.5,
              ml: 1,
            }}
          >
            <Image
              src="/assets/icons/white-logo.svg"
              alt="YLDZ"
              width={14}
              height={14}
            />
            <AtomTypography variant="label2" color="text.primary" fontWeight={500}>
              {(() => {
                if (isUnlockAmountLoading) return DEFAULT_DISPLAY_VALUES.LOADING;
                if (unlockAmountError) return DEFAULT_DISPLAY_VALUES.ZERO;
                return formattedUnlockableAmount;
              })()}
            </AtomTypography>
          </Box>
        </Box>

        {/* Input Field and Token Display Row */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            gap: 2,
            alignItems: 'flex-end',
            pb: 3,
            borderBottom: `1px solid ${yieldzNeutral[800]}`,
          }}
        >
          {/* Amount Input Field */}
          <Box sx={{ flex: 1 }}>
            <InputWithLabel
              id="investment-amount"
              name="sellAmount"
              label="YOU PAY"
              variant="standard"
              placeholder="0.00"
              type="text"
              numericOnly
              required
            />
          </Box>

          {/* YLDZ Token Display (disabled button) */}
          <Box>
            <AtomButton
              id="yieldz-token-display"
              label="YIELDZ"
              variant="contained"
              color="secondary"
              size="medium"
              fullWidth
              startIcon={
                <Image
                  src="/assets/icons/white-logo.svg"
                  alt="YLDZ"
                  width={18}
                  height={18}
                />
              }
              // disabled
              sx={{
                height: '30px',
                cursor: 'not-allowed',
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Transaction Details */}
      <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <DetailRow
          label="You'll receive"
          value={isFeeLoading ? DEFAULT_DISPLAY_VALUES.LOADING : `${usdcReceiveAmount} USDC`}
          icon={<Image src="/assets/icons/USDC.svg" alt="USDC" width={14} height={14} />}
        />
        <DetailRow label="Fixed APY" value="12.50% → 0.00%" />
        <DetailRow
          label="Fee"
          value={(() => {
            if (isFeeLoading) return DEFAULT_DISPLAY_VALUES.LOADING;
            if (feeAmount && feePercentage) return `${feeAmount} USDC (${feePercentage}%)`;
            if (feePercentage) return `${feePercentage}%`;
            return DEFAULT_DISPLAY_VALUES.MIN_FEE;
          })()}
        />
      </Box>
    </>
  );
});
