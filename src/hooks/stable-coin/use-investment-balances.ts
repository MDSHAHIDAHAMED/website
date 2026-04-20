'use client';

/**
 * Investment Balances Hook
 * =========================
 *
 * Owns token balance, LP balance, withdraw fee, and refetch logic.
 * Exposes refetch to parent via onRefetchBalance callback.
 */

import { useLiquidityPoolBalance } from '@/hooks/stable-coin/use-liquidity-pool-balance';
import { useTokenBalance } from '@/hooks/stable-coin/use-token-balance';
import { useWithdrawFee } from '@/hooks/stable-coin/use-withdraw-fee';
import { useCallback, useEffect } from 'react';
import {
  getVaultAddress,
  getYieldzTokenAddress,
} from '@/components/sections/investment-section/investment-card/addresses';
import { bigintBalanceToNumber } from '@/utils/stable-coin/token-balance-utils';

export interface UseInvestmentBalancesParams {
  isBuyTab: boolean;
  walletAddress: `0x${string}` | undefined;
  selectedAssetContractAddress: `0x${string}` | undefined;
  isSellTab: boolean;
  watchedSellAmount: string;
  /** USDC contract address for sell tab (from supportedAssets) */
  stableTokenAddress: `0x${string}` | undefined;
  /** Callback to register refetch function with parent (e.g. when success dialog closes) */
  onRefetchBalance?: ((refetchFn: (() => void) | null) => void);
}

/** USDC decimals for withdraw fee */
const USDC_DECIMALS = 6;

export interface UseInvestmentBalancesReturn {
  lpBalance: number;
  isLpBalanceLoading: boolean;
  lpBalanceError: Error | null;
  tokenDisplayBalance: string | undefined;
  isTokenBalanceLoading: boolean;
  refetchTokenBalance: (() => void) | undefined;
  getTokenBalanceAsNumber: () => number;
  handleRefetchBalance: () => void;
  usdcReceiveAmount: string | undefined;
  withdrawFeeAmount: string | undefined;
  withdrawFeePercentage: string | undefined;
  isWithdrawFeeLoading: boolean;
  yieldzTokenAddress: `0x${string}` | undefined;
  vaultAddress: `0x${string}` | undefined;
}

/**
 * Token balance, LP balance, withdraw fee, and refetch for investment card.
 */
export function useInvestmentBalances({
  isBuyTab,
  walletAddress,
  selectedAssetContractAddress,
  isSellTab,
  watchedSellAmount,
  stableTokenAddress,
  onRefetchBalance,
}: UseInvestmentBalancesParams): UseInvestmentBalancesReturn {
  const yieldzTokenAddress = getYieldzTokenAddress();
  const vaultAddress = getVaultAddress();

  const {
    balanceAsNumber: lpBalance,
    isLoading: isLpBalanceLoading,
    error: lpBalanceError,
  } = useLiquidityPoolBalance(yieldzTokenAddress, vaultAddress);

  const {
    tokenBalance,
    decimals: tokenDecimals,
    isLoading: isTokenBalanceLoading,
    displayBalance: tokenDisplayBalance,
    refetch: refetchTokenBalance,
  } = useTokenBalance(
    isBuyTab ? walletAddress : undefined,
    isBuyTab ? selectedAssetContractAddress : undefined,
    false
  );

  const {
    receiveAmount: usdcReceiveAmount,
    withdrawFeeAmount,
    withdrawFeeFormatted: withdrawFeePercentage,
    isLoading: isWithdrawFeeLoading,
  } = useWithdrawFee(
    stableTokenAddress,
    vaultAddress,
    isSellTab ? watchedSellAmount : undefined,
    USDC_DECIMALS
  );

  const getTokenBalanceAsNumber = useCallback((): number => {
    return bigintBalanceToNumber(tokenBalance, tokenDecimals ?? 18, isTokenBalanceLoading);
  }, [tokenBalance, tokenDecimals, isTokenBalanceLoading]);

  const handleRefetchBalance = useCallback(() => {
    if (isBuyTab && refetchTokenBalance) {
      requestAnimationFrame(() => {
        refetchTokenBalance();
      });
    }
  }, [isBuyTab, refetchTokenBalance]);

  useEffect(() => {
    if (onRefetchBalance) {
      onRefetchBalance(handleRefetchBalance);
    }
    return () => {
      if (onRefetchBalance) {
        onRefetchBalance(null);
      }
    };
  }, [onRefetchBalance, handleRefetchBalance]);

  return {
    lpBalance,
    isLpBalanceLoading,
    lpBalanceError,
    tokenDisplayBalance,
    isTokenBalanceLoading,
    refetchTokenBalance,
    getTokenBalanceAsNumber,
    handleRefetchBalance,
    usdcReceiveAmount,
    withdrawFeeAmount,
    withdrawFeePercentage,
    isWithdrawFeeLoading,
    yieldzTokenAddress,
    vaultAddress,
  };
}
