/**
 * useWithdrawFee Hook
 * ===================
 *
 * Fetches withdrawal fees from blockchain: LP balance and fee from getWithdrawfee.
 * Uses investment.zeroBalance from locale for fallback display values.
 */

'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';
import { formatUnits, parseAbi, parseUnits } from 'viem';
import { useReadContract } from 'wagmi';

// Display decimals for fee/amount formatting (aligned with locale zeroBalance)
const DISPLAY_DECIMALS = 2;

// ===================== ABIs =====================

const ERC20_ABI = parseAbi([
  'function balanceOf(address account) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
]);

const GET_WITHDRAW_FEE_ABI = parseAbi([
  'function getWithdrawfee(uint256 withdrawAmount, uint256 LpBalance) external view returns (uint256 feePlatform)',
]);

// ===================== TYPES =====================

export interface UseWithdrawFeeReturn {
  /** Withdrawal fee as bigint (raw value in basis points: 100n = 1%) */
  withdrawFee: bigint | undefined;
  /** Withdrawal fee percentage formatted as string (e.g., "1.00" for 1%, "1.25" for 1.25%) */
  withdrawFeeFormatted: string;
  /** Withdrawal fee amount in USDC (calculated from entered amount) */
  withdrawFeeAmount: string;
  /** LP balance (stable token balance in vault) as bigint */
  lpBalance: bigint | undefined;
  /** LP balance formatted as human-readable string */
  lpBalanceFormatted: string;
  /** Amount user will receive after fee (entered amount - fee) */
  receiveAmount: string;
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Error if fetch failed */
  error: Error | null;
}

// ===================== HOOK =====================

/**
 * Fetches withdrawal fee from blockchain and computes fee amount / receive amount.
 * Reuses investment.zeroBalance from locale for zero/fallback display.
 *
 * @param stableTokenAddress - Stable token address (e.g. USDC) that user will receive
 * @param vaultAddress - Vault contract address
 * @param withdrawAmountInput - Human-readable withdrawal amount (e.g. "100", "250.75")
 * @param stableTokenDecimals - Stable token decimals (default: 6 for USDC, can be auto-detected)
 * @returns Withdrawal fee, LP balance, receive amount, and loading state
 */
export function useWithdrawFee(
  stableTokenAddress: Address | undefined,
  vaultAddress: Address | undefined,
  withdrawAmountInput: string | undefined,
  stableTokenDecimals: number = 6
): UseWithdrawFeeReturn {
  const { t } = useTranslation('investment');
  const zeroDisplay = t('zeroBalance');

  const { data: decimalsData } = useReadContract({
    address: stableTokenAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: Boolean(stableTokenAddress && stableTokenDecimals === 6),
    },
  });

  const effectiveDecimals = useMemo(() => {
    if (stableTokenDecimals !== 6) return stableTokenDecimals;
    return decimalsData ? Number(decimalsData) : 6;
  }, [stableTokenDecimals, decimalsData]);

  const {
    data: lpBalance,
    isLoading: isLpBalanceLoading,
    error: lpBalanceError,
  } = useReadContract({
    address: stableTokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: vaultAddress ? [vaultAddress] : undefined,
    query: {
      enabled: Boolean(stableTokenAddress && vaultAddress),
      retry: 2,
    },
  });

  // Parsed positive amount (DRY for fee/receive calculations)
  const enteredAmount = useMemo((): number | null => {
    if (!withdrawAmountInput) return null;
    const n = Number.parseFloat(withdrawAmountInput);
    return !Number.isNaN(n) && n > 0 ? n : null;
  }, [withdrawAmountInput]);

  const withdrawAmount = useMemo(() => {
    if (enteredAmount === null || !stableTokenAddress) return undefined;
    try {
      return parseUnits(withdrawAmountInput!, effectiveDecimals);
    } catch {
      return undefined;
    }
  }, [enteredAmount, stableTokenAddress, withdrawAmountInput, effectiveDecimals]);

  const {
    data: withdrawFee,
    isLoading: isWithdrawFeeLoading,
    error: withdrawFeeError,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_WITHDRAW_FEE_STRUCTURE as Address,
    abi: GET_WITHDRAW_FEE_ABI,
    functionName: 'getWithdrawfee',
    args: withdrawAmount && lpBalance ? [withdrawAmount, lpBalance] : undefined,
    query: {
      enabled: Boolean(vaultAddress && withdrawAmount && lpBalance),
      retry: 2,
    },
  });

  const feePercentage = useMemo(
    () => (withdrawFee ? Number(withdrawFee) / 100 : 0),
    [withdrawFee]
  );

  const withdrawFeeFormatted = useMemo(
    () => feePercentage.toFixed(DISPLAY_DECIMALS),
    [feePercentage]
  );

  const withdrawFeeAmount = useMemo(() => {
    if (enteredAmount === null) return zeroDisplay;
    const fee = enteredAmount * (feePercentage / 100);
    return fee.toFixed(DISPLAY_DECIMALS);
  }, [enteredAmount, feePercentage, zeroDisplay]);

  const lpBalanceFormatted = useMemo(() => {
    if (!lpBalance) return zeroDisplay;
    try {
      return formatUnits(lpBalance, effectiveDecimals);
    } catch {
      return zeroDisplay;
    }
  }, [lpBalance, effectiveDecimals, zeroDisplay]);

  const receiveAmount = useMemo(() => {
    if (enteredAmount === null) return withdrawAmountInput ?? zeroDisplay;
    const fee = enteredAmount * (feePercentage / 100);
    const receive = enteredAmount - fee;
    return receive > 0 ? receive.toFixed(DISPLAY_DECIMALS) : zeroDisplay;
  }, [enteredAmount, withdrawAmountInput, feePercentage, zeroDisplay]);

  return {
    withdrawFee,
    withdrawFeeFormatted,
    withdrawFeeAmount,
    lpBalance,
    lpBalanceFormatted,
    receiveAmount,
    isLoading: isLpBalanceLoading || isWithdrawFeeLoading,
    error: lpBalanceError ?? withdrawFeeError ?? null,
  };
}
