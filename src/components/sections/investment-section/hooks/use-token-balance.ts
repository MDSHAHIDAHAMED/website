/**
 * useTokenBalance Hook
 * ====================
 * 
 * Custom hook for fetching and formatting token balance
 */

'use client';

import { useMemo } from 'react';
import type { Address } from 'viem';
import { useBalance } from 'wagmi';

/**
 * Hook return type
 */
export interface UseTokenBalanceReturn {
  /** Formatted balance string for display */
  displayBalance: string;
  /** Raw token balance data */
  tokenBalance: ReturnType<typeof useBalance>['data'];
  /** Whether balance is currently loading */
  isLoading: boolean;
}

/**
 * Custom hook to fetch and format token balance
 * 
 * @param walletAddress - User's wallet address
 * @param tokenAddress - Token contract address (optional)
 * @param isSellTab - Whether this is for SELL tab (adds YIELDZ symbol prefix)
 * @returns Formatted balance and loading state
 */
export function useTokenBalance(
  walletAddress: Address | undefined,
  tokenAddress: Address | undefined,
  isSellTab: boolean = false
): UseTokenBalanceReturn {
  const { data: tokenBalance, isLoading } = useBalance({
    address: walletAddress,
    token: tokenAddress,
    query: {
      enabled: !!walletAddress && !!tokenAddress,
    },
  });

  /**
   * Format balance for display
   * For BUY tab: shows selected asset balance (e.g., "2,500.00")
   * For SELL tab: shows YIELDZ balance with symbol (e.g., "Ⓨ 100.00")
   */
  const displayBalance = useMemo(() => {
    if (isLoading) return 'Loading...';
    if (!tokenBalance) return '0.00';

    // Format with commas for thousands
    const decimals = tokenBalance.decimals ?? 18;
    const divisor = BigInt(10 ** decimals);
    const wholePart = tokenBalance.value / divisor;
    const fractionalPart = tokenBalance.value % divisor;
    const numValue = Number(wholePart) + Number(fractionalPart) / Number(divisor);
    const formatted = numValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // For SELL tab, add YIELDZ symbol prefix
    return isSellTab ? `Ⓨ ${formatted}` : formatted;
  }, [tokenBalance, isLoading, isSellTab]);

  return {
    displayBalance,
    tokenBalance,
    isLoading,
  };
}

