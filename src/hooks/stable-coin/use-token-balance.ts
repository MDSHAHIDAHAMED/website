/**
 * useTokenBalance Hook
 * ====================
 * 
 * Custom hook for fetching and formatting token balance
 */

'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';
import { formatUnits, parseAbi } from 'viem';
import { useReadContracts } from 'wagmi';

/**
 * ERC20 ABI for reading balance and decimals
 */
const ERC20_ABI = parseAbi([
  'function balanceOf(address owner) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
]);

/**
 * Hook return type
 */
export interface UseTokenBalanceReturn {
  /** Formatted balance string for display */
  displayBalance: string;
  /** Raw token balance as bigint */
  tokenBalance: bigint | undefined;
  /** Token decimals */
  decimals: number | undefined;
  /** Whether balance is currently loading */
  isLoading: boolean;
  /** Error if balance fetch failed */
  error: Error | null;
  /** Refetch the balance from the blockchain */
  refetch: () => void;
}

/**
 * Custom hook to fetch and format token balance directly from MetaMask
 * Uses readContract to call ERC20 balanceOf function
 * 
 * @param walletAddress - User's wallet address
 * @param tokenAddress - Token contract address (optional)
 * @param isSellTab - Whether this is for SELL tab (adds YLDZ symbol prefix)
 * @returns Formatted balance and loading state
 */
export function useTokenBalance(
  walletAddress: Address | undefined,
  tokenAddress: Address | undefined,
  isSellTab: boolean = false
): UseTokenBalanceReturn {
  /** Reuse locale strings for loading and zero-balance displays */
  const { t } = useTranslation('investment');

  /**
   * Read both balance and decimals in parallel using useReadContracts
   */
  const contracts = useMemo(() => {
    if (!tokenAddress || !walletAddress) return undefined;
    
    return [
      {
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf' as const,
        args: [walletAddress],
      },
      {
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'decimals' as const,
      },
    ] as const;
  }, [tokenAddress, walletAddress]);

  const isQueryEnabled = !!walletAddress && !!tokenAddress;
  
  const { data: contractResults, isLoading, error, refetch } = useReadContracts({
    contracts: contracts,
    query: {
      enabled: isQueryEnabled,
      retry: 2,
      // Ensure fresh data is always fetched, no caching
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
    },
  });

  /**
   * Extract balance and decimals from contract results
   */
  const balanceResult = contractResults?.[0];
  const decimalsResult = contractResults?.[1];
  
  const rawTokenBalance = balanceResult?.result;
  const decimals = decimalsResult?.result;


  /**
   * Preserve last known balance and decimals to prevent showing 0 during refetches or temporary errors
   * Only update the stored values when we have a valid result (not during loading or errors)
   * 
   * CRITICAL: Both balance and decimals must be preserved together because:
   * 1. During refetch, both values can become undefined temporarily
   * 2. The display logic requires both balance AND decimals to format correctly
   * 3. If decimals are missing, the display will show "0.00" even if balance is preserved
   */
  const lastKnownBalanceRef = useRef<bigint | undefined>(undefined);
  const lastKnownDecimalsRef = useRef<number | undefined>(undefined);
  
  useEffect(() => {
    // Only update the stored balance if we have a valid result and we're not loading
    // This prevents overwriting a valid balance with undefined during refetches
    if (!isLoading && rawTokenBalance !== undefined) {
      lastKnownBalanceRef.current = rawTokenBalance;
    }
    
    // Preserve decimals as well - critical for proper formatting during refetch
    if (!isLoading && decimals !== undefined) {
      lastKnownDecimalsRef.current = decimals;
    }
  }, [rawTokenBalance, decimals, isLoading]);

  /**
   * Use the current balance if available, otherwise fall back to last known balance
   * This ensures we don't show 0 when the balance is temporarily unavailable during refetch
   * 
   * IMPORTANT: Always prefer current value, but preserve last known value during loading states
   */
  const tokenBalance = rawTokenBalance ?? lastKnownBalanceRef.current;
  
  /**
   * Use current decimals if available, otherwise fall back to last known decimals
   * This ensures formatting works correctly even during refetch when decimals might be temporarily undefined
   */
  const effectiveDecimals = decimals ?? lastKnownDecimalsRef.current;

  /**
   * Format balance for display using locale strings.
   * BUY tab: selected asset balance (e.g. "2,500.00"); SELL tab: YLDZ with symbol (e.g. "Ⓨ 100.00").
   * Uses effectiveDecimals (preserved during refetch) so we don’t show "0.00" when decimals
   * are briefly undefined.
   */
  const displayBalance = useMemo(() => {
    const zeroDisplay = isSellTab ? t('zeroBalanceYldz') : t('zeroBalance');
    const loadingDisplay = t('loading');

    if (!isQueryEnabled) {
      return zeroDisplay;
    }

    const hasNoBalanceData =
      tokenBalance === undefined && lastKnownBalanceRef.current === undefined;
    if (isLoading && hasNoBalanceData) {
      return loadingDisplay;
    }
    if (tokenBalance === undefined) {
      return isLoading ? loadingDisplay : zeroDisplay;
    }
    if (tokenBalance === BigInt(0)) {
      return t('zeroBalance');
    }
    if (!effectiveDecimals) {
      return isLoading ? loadingDisplay : t('zeroBalance');
    }

    const formatted = formatUnits(tokenBalance, effectiveDecimals);
    const numValue = Number.parseFloat(formatted);
    const formattedWithCommas = numValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return isSellTab ? `Ⓨ ${formattedWithCommas}` : formattedWithCommas;
  }, [tokenBalance, effectiveDecimals, isLoading, isSellTab, isQueryEnabled, t]);

  return {
    displayBalance,
    tokenBalance,
    decimals: effectiveDecimals, // Return effective decimals (preserved during refetch)
    isLoading,
    error: error as Error | null,
    refetch,
  };
}

