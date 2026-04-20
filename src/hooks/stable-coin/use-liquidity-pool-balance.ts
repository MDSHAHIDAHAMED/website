/**
 * useLiquidityPoolBalance Hook
 * ============================
 *
 * Custom hook for fetching liquidity pool balance using balanceOf function.
 * Used to determine how much can be paid instantly vs after lockup period.
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
 * Converts raw token balance and decimals to a number.
 * Shared helper to avoid duplicating formatUnits + parseFloat logic.
 */
function balanceToNumber(balance: bigint, decimals: number): number {
  return Number.parseFloat(formatUnits(balance, decimals));
}

/**
 * Hook return type
 */
export interface UseLiquidityPoolBalanceReturn {
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
  /** Balance as a number (human-readable) */
  balanceAsNumber: number;
}

/**
 * Custom hook to fetch liquidity pool balance from vault.
 * Uses readContract to call ERC20 balanceOf to check vault's token balance.
 *
 * @param tokenAddress - Token contract address (YLDZ token address) (optional)
 * @param vaultAddress - Vault contract address to check balance of (optional)
 * @returns Formatted balance, raw balance, and loading state
 */
export function useLiquidityPoolBalance(
  tokenAddress: Address | undefined,
  vaultAddress: Address | undefined
): UseLiquidityPoolBalanceReturn {
  const { t } = useTranslation();

  /**
   * Read balance and decimals in parallel via useReadContracts.
   * balanceOf is called for vault address on the token contract.
   */
  const contracts = useMemo(() => {
    if (!tokenAddress || !vaultAddress) return undefined;

    return [
      {
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf' as const,
        args: [vaultAddress],
      },
      {
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'decimals' as const,
      },
    ] as const;
  }, [tokenAddress, vaultAddress]);

  const { data: contractResults, isLoading, error } = useReadContracts({
    contracts,
    query: {
      enabled: !!tokenAddress && !!vaultAddress,
      retry: 2,
    },
  });

  const rawTokenBalance = contractResults?.[0]?.result;
  const decimals = contractResults?.[1]?.result;

  /**
   * Keep last known balance/decimals to avoid showing 0 during refetches or transient errors.
   * Stored values update only when we have a valid, non-loading result.
   */
  const lastKnownBalanceRef = useRef<bigint | undefined>(undefined);
  const lastKnownDecimalsRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isLoading && rawTokenBalance !== undefined) {
      lastKnownBalanceRef.current = rawTokenBalance;
    }
    if (!isLoading && decimals !== undefined) {
      lastKnownDecimalsRef.current = decimals;
    }
  }, [rawTokenBalance, decimals, isLoading]);

  const tokenBalance = rawTokenBalance ?? lastKnownBalanceRef.current;
  const effectiveDecimals = decimals ?? lastKnownDecimalsRef.current;

  /**
   * Balance as number for comparisons.
   * When tokenBalance is undefined, uses last known balance only if effectiveDecimals is defined (same as original flow).
   */
  const balanceAsNumber = useMemo(() => {
    if (tokenBalance === undefined) {
      if (
        lastKnownBalanceRef.current !== undefined &&
        effectiveDecimals !== undefined
      ) {
        return balanceToNumber(lastKnownBalanceRef.current, effectiveDecimals);
      }
      return 0;
    }
    if (tokenBalance === BigInt(0)) return 0;
    if (!effectiveDecimals) return 0;
    return balanceToNumber(tokenBalance, effectiveDecimals);
  }, [tokenBalance, effectiveDecimals]);

  /**
   * Formatted balance for UI. Uses locale keys for loading and zero states.
   */
  const displayBalance = useMemo(() => {
    if (tokenBalance === undefined) return t('investment:loading');
    if (tokenBalance === BigInt(0) || !effectiveDecimals) return t('investment:zeroBalance');

    const num = balanceToNumber(tokenBalance, effectiveDecimals);
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [tokenBalance, effectiveDecimals, t]);

  return {
    displayBalance,
    tokenBalance,
    decimals: effectiveDecimals,
    isLoading,
    error: error as Error | null,
    balanceAsNumber,
  };
}
