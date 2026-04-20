'use client';

/**
 * Investment Details Hook
 * ========================
 *
 * Computes confirm-dialog summary (you pay, fees, rewards) from form and balance data.
 * Uses pure helpers from investment-details module.
 */

import { PLATFORM_FEE_PERCENT } from '@/constants/investment-card';
import { calculateAmountAfterFees } from '@/utils/stable-coin/calculations';
import { useMemo } from 'react';
import {
  computeBuyDetails,
  computeSellDetails,
  getEmptyInvestmentResult,
} from '@/components/sections/investment-section/investment-card/investment-details';
import type { InvestmentDetailsResult } from '@/components/sections/investment-section/investment-card/investment-details';
import type { TFunction } from 'i18next';

export interface UseInvestmentDetailsParams {
  watchedAmount: string;
  selectedCurrencyValue: string | undefined;
  isSellTab: boolean;
  withdrawFeeAmount: string | undefined;
  withdrawFeePercentage: string | undefined;
  usdcReceiveAmount: string | undefined;
  isWithdrawFeeLoading: boolean;
  lpBalance: number;
  isLpBalanceLoading: boolean;
  lpBalanceError: Error | null;
  vaultAddress: `0x${string}` | undefined;
  yieldzTokenAddress: `0x${string}` | undefined;
  t: TFunction;
}

/**
 * Memoized investment details for confirm dialog (buy/sell summary).
 */
export function useInvestmentDetails({
  watchedAmount,
  selectedCurrencyValue,
  isSellTab,
  withdrawFeeAmount,
  withdrawFeePercentage,
  usdcReceiveAmount,
  isWithdrawFeeLoading,
  lpBalance,
  isLpBalanceLoading,
  lpBalanceError,
  vaultAddress,
  yieldzTokenAddress,
  t,
}: UseInvestmentDetailsParams): InvestmentDetailsResult {
  return useMemo(() => {
    const amountIn = watchedAmount;
    const tokenIn = selectedCurrencyValue;
    const emptyResult = getEmptyInvestmentResult();
    if (!amountIn || !tokenIn) return emptyResult;
    const enteredAmount = Number.parseFloat(amountIn);
    if (Number.isNaN(enteredAmount) || enteredAmount <= 0) return emptyResult;

    if (isSellTab) {
      return computeSellDetails({
        amountIn,
        withdrawFeeAmount,
        withdrawFeePercentage,
        usdcReceiveAmount,
        isWithdrawFeeLoading,
        defaultReward: t('investment:defaultReward'),
      });
    }

    const { amountAfterFees } = calculateAmountAfterFees(amountIn, PLATFORM_FEE_PERCENT);
    return computeBuyDetails({
      amountIn,
      tokenIn,
      lpBalance,
      isLpBalanceLoading,
      lpBalanceError,
      vaultAddress,
      yieldzTokenAddress,
      defaultReward: t('investment:defaultReward'),
      rewardWhenLpUnavailable: `${amountAfterFees.toFixed(2)} YLDZ`,
    });
  }, [
    watchedAmount,
    selectedCurrencyValue,
    isSellTab,
    withdrawFeeAmount,
    withdrawFeePercentage,
    usdcReceiveAmount,
    isWithdrawFeeLoading,
    lpBalance,
    isLpBalanceLoading,
    lpBalanceError,
    vaultAddress,
    yieldzTokenAddress,
    t,
  ]);
}
