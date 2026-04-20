'use client';

/**
 * Create Deposit Hook
 * ===================
 *
 * Owns deposit creation via createDepositRecord and currentDepositId state.
 * Parent uses setCurrentDepositId in handleConfirmDialogClose to reset.
 */

import { createDepositRecord } from '@/utils/stable-coin/deposit-helpers';
import { useCallback, useState } from 'react';
import type { TFunction } from 'i18next';

export interface UseCreateDepositParams {
  yieldzTokenAddress: `0x${string}` | undefined;
  vaultAddress: `0x${string}` | undefined;
  lpBalance: number;
  isLpBalanceLoading: boolean;
  lpBalanceError: Error | null;
  t: TFunction;
}

/**
 * Creates deposit record and updates currentDepositId. Returns deposit id or null.
 */
export function useCreateDeposit({
  yieldzTokenAddress,
  vaultAddress,
  lpBalance,
  isLpBalanceLoading,
  lpBalanceError,
  t,
}: UseCreateDepositParams): {
  currentDepositId: number | null;
  setCurrentDepositId: (id: number | null) => void;
  handleCreateDeposit: (
    selectedAsset: { id: number },
    amountIn: string,
    enteredAmount: number,
    walletAddress: string,
    isBuy: boolean
  ) => Promise<number | null>;
} {
  const [currentDepositId, setCurrentDepositId] = useState<number | null>(null);

  const handleCreateDeposit = useCallback(
    async (
      selectedAsset: { id: number },
      amountIn: string,
      enteredAmount: number,
      walletAddress: string,
      isBuy: boolean
    ): Promise<number | null> => {
      if (!walletAddress || !yieldzTokenAddress) {
        return null;
      }

      const depositId = await createDepositRecord({
        selectedAsset,
        amountIn,
        enteredAmount,
        walletAddress,
        yieldzTokenAddress,
        isBuy,
        lpBalance,
        isLpBalanceLoading,
        lpBalanceError,
        vaultAddress,
        t,
      });

      setCurrentDepositId(depositId);
      return depositId;
    },
    [yieldzTokenAddress, lpBalance, isLpBalanceLoading, lpBalanceError, vaultAddress, t]
  );

  return {
    currentDepositId,
    setCurrentDepositId,
    handleCreateDeposit,
  };
}
