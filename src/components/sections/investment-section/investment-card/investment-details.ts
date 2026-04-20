/**
 * Investment Details – Pure Module
 * ================================
 *
 * Pure functions to compute confirm-dialog summary (you pay, fees, rewards).
 * No React, no hooks. Used by InvestmentCard via useMemo.
 */

import { YLDZS_COIN_DETAIL } from '@/constants/yldzs-token';
import { CURRENT_APY, PLATFORM_FEE_PERCENT } from '@/constants/investment-card';
import { calculateAmountAfterFees } from '@/utils/stable-coin/calculations';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/** Result shape for confirm dialog (matches ConfirmInvestmentDialogProps) */
export interface InvestmentDetailsResult {
  amountIn?: string;
  tokenIn?: string;
  currentApy?: string;
  lockup?: string;
  networkFee?: string;
  platformFee?: string;
  instantReward?: string;
  rewardAfterLockup?: string;
  showSixtyDays: boolean;
}

/** Inputs for SELL-tab details */
export interface SellDetailsParams {
  amountIn: string;
  withdrawFeeAmount: string | undefined;
  withdrawFeePercentage: string | undefined;
  usdcReceiveAmount: string | undefined;
  isWithdrawFeeLoading: boolean;
  defaultReward: string;
}

/** Inputs for BUY-tab details */
export interface BuyDetailsParams {
  amountIn: string;
  tokenIn: string;
  lpBalance: number;
  isLpBalanceLoading: boolean;
  lpBalanceError: Error | null;
  vaultAddress: `0x${string}` | undefined;
  yieldzTokenAddress: `0x${string}` | undefined;
  defaultReward: string;
  /** Pre-computed reward string when LP is unavailable (e.g. "99.00 YLDZ") */
  rewardWhenLpUnavailable: string;
}

// -----------------------------------------------------------------------------
// Pure helpers
// -----------------------------------------------------------------------------

/** Format lockup period for display (e.g. "1 month", "12 months") */
export function formatLockupPeriod(months: number): string {
  if (months === 1) return '1 month';
  return `${months} months`;
}

/** Empty result for invalid / loading states */
export function getEmptyInvestmentResult(): InvestmentDetailsResult {
  return {
    currentApy: undefined,
    lockup: undefined,
    networkFee: undefined,
    platformFee: undefined,
    instantReward: undefined,
    rewardAfterLockup: undefined,
    showSixtyDays: false,
    tokenIn: undefined,
    amountIn: undefined,
  };
}

/** Compute SELL-tab investment details (withdrawal fee, receive amount) */
export function computeSellDetails(params: SellDetailsParams): InvestmentDetailsResult {
  const {
    amountIn,
    withdrawFeeAmount,
    withdrawFeePercentage,
    usdcReceiveAmount,
    isWithdrawFeeLoading,
  } = params;

  let feeDisplay = '<$0.01';
  if (withdrawFeeAmount && withdrawFeePercentage) {
    feeDisplay = `${withdrawFeeAmount} USDC (${withdrawFeePercentage}%)`;
  } else if (withdrawFeePercentage) {
    feeDisplay = `${withdrawFeePercentage}%`;
  }

  return {
    amountIn,
    tokenIn: 'YLDZ',
    currentApy: undefined,
    lockup: undefined,
    networkFee: '<$0.01',
    platformFee: feeDisplay,
    instantReward: isWithdrawFeeLoading ? 'Loading...' : `${usdcReceiveAmount || '0.00'} USDC`,
    rewardAfterLockup: undefined,
    showSixtyDays: false,
  };
}

/** Compute BUY-tab investment details (LP allocation, instant vs delayed reward) */
export function computeBuyDetails(params: BuyDetailsParams): InvestmentDetailsResult {
  const {
    amountIn,
    tokenIn,
    lpBalance,
    isLpBalanceLoading,
    lpBalanceError,
    vaultAddress,
    yieldzTokenAddress,
    rewardWhenLpUnavailable,
  } = params;

  const lockupMonths = YLDZS_COIN_DETAIL.yield_details.lockup_period_months;
  const defaultLockup = formatLockupPeriod(lockupMonths);
  const { feeAmount } = calculateAmountAfterFees(amountIn, PLATFORM_FEE_PERCENT);
  const enteredAmount = Number.parseFloat(amountIn) || 0;
  const totalRewardAfterFee = enteredAmount * (1 - PLATFORM_FEE_PERCENT / 100);

  const isLpUnavailable =
    isLpBalanceLoading || lpBalanceError !== null || !vaultAddress || !yieldzTokenAddress;
  const canAllocateFully = isLpUnavailable || lpBalance >= totalRewardAfterFee;

  if (canAllocateFully) {
    const instantReward = isLpUnavailable ? rewardWhenLpUnavailable : `${totalRewardAfterFee.toFixed(2)} YLDZ`;
    return {
      amountIn,
      tokenIn,
      currentApy: CURRENT_APY,
      lockup: defaultLockup,
      networkFee: '<$0.01',
      platformFee: `$${feeAmount.toFixed(2)}`,
      instantReward,
      rewardAfterLockup: '0 YLDZ',
      showSixtyDays: false,
    };
  }

  const instantAmount = Math.max(0, lpBalance);
  const delayedAmount = Math.max(0, totalRewardAfterFee - lpBalance);
  return {
    amountIn,
    tokenIn,
    currentApy: CURRENT_APY,
    lockup: '60 days',
    networkFee: '<$0.01',
    platformFee: `$${feeAmount.toFixed(2)}`,
    instantReward: `${instantAmount.toFixed(2)} YLDZ`,
    rewardAfterLockup: `${delayedAmount.toFixed(2)} YLDZ`,
    showSixtyDays: true,
  };
}
