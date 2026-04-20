/**
 * Deposit Helpers
 * ===============
 *
 * Helper functions for creating and updating deposit records
 */

import {
  NETWORK_FEE_PERCENT,
  PLATFORM_FEE_PERCENT,
  type BuildUpdateDepositPayloadParams,
  type CreateDepositParams,
  type UpdateDepositParams,
} from '@/constants/investment-card';
import { createDeposit, updateDeposit, type DepositRequest, type UpdateDepositRequest } from '@/services/deposits';
import { handleServiceError } from '@/utils/error-handler';
import { showErrorToast } from '@/utils/toast';
import type { Address } from 'viem';

import { calculateAmountAfterFees } from './calculations';

/**
 * Calculate fees for a given amount using utility function
 * @param enteredAmount - The investment amount
 * @returns Object containing platform fee, network fee, and total reward after platform fee
 */
export function calculateFees(enteredAmount: number) {
  const { feeAmount: platformFeeAmount, amountAfterFees: totalRewardAfterFee } = calculateAmountAfterFees(
    enteredAmount.toString(),
    PLATFORM_FEE_PERCENT
  );
  const networkFeeAmount = enteredAmount * (NETWORK_FEE_PERCENT / 100);

  return {
    platformFeeAmount,
    networkFeeAmount,
    totalRewardAfterFee,
  };
}

/**
 * Calculate allocation type and amounts based on liquidity pool balance
 * Consolidated function that handles both allocation calculation and type determination
 * @param totalRewardAfterFee - Total reward after fees
 * @param lpBalance - Current liquidity pool balance
 * @param isLpBalanceLoading - Whether LP balance is loading
 * @param lpBalanceError - LP balance error if any
 * @param vaultAddress - Vault contract address
 * @param yieldzTokenAddress - YLDZ token contract address
 * @param includeType - Whether to include allocationType in result (default: true)
 * @returns Object containing allocationType (if includeType), amountOut, and pendingTokenAmount
 */
export function calculateAllocation(
  totalRewardAfterFee: number,
  lpBalance: number,
  isLpBalanceLoading: boolean,
  lpBalanceError: Error | null,
  vaultAddress: Address | undefined,
  yieldzTokenAddress: Address | undefined,
  includeType: boolean = true
) {
  const isLpUnavailable = isLpBalanceLoading || lpBalanceError || !vaultAddress || !yieldzTokenAddress;
  const hasSufficientLp = !isLpUnavailable && lpBalance >= totalRewardAfterFee;
  const hasPartialLp = !isLpUnavailable && lpBalance > 0 && lpBalance < totalRewardAfterFee;

  if (isLpUnavailable || hasSufficientLp) {
    // FULL allocation: LP balance is sufficient or unavailable (assume full)
    return {
      ...(includeType && { allocationType: 'FULL' as const }),
      amountOut: totalRewardAfterFee.toFixed(2),
      pendingTokenAmount: undefined,
    };
  }

  if (hasPartialLp) {
    // PARTIAL allocation: LP balance is insufficient but available
    const instantAmount = Math.max(0, lpBalance);
    const delayedAmount = Math.max(0, totalRewardAfterFee - lpBalance);
    return {
      ...(includeType && { allocationType: 'PARTIAL' as const }),
      amountOut: instantAmount > 0 ? instantAmount.toFixed(2) : undefined,
      pendingTokenAmount: delayedAmount > 0 ? delayedAmount.toFixed(2) : undefined,
    };
  }

  // PENDING allocation: LP balance is 0 or not available
  return {
    ...(includeType && { allocationType: 'PENDING' as const }),
    amountOut: undefined,
    pendingTokenAmount: totalRewardAfterFee.toFixed(2),
  };
}

/**
 * Build update deposit payload with transaction details
 * @param params - Object containing all required parameters
 * @param yieldzTokenAddress - YLDZ token contract address
 * @param userId - User ID for metadata
 * @returns Update deposit request payload
 */
export function buildUpdateDepositPayload(
  params: BuildUpdateDepositPayloadParams,
  yieldzTokenAddress: Address | undefined,
  userId: string | undefined
): UpdateDepositRequest {
  const {
    transactionHash,
    blockNumber,
    onChainTimestamp,
    tokenIn,
    platformFeeAmount,
    networkFeeAmount,
    allocationType,
    amountOut,
    pendingTokenAmount,
    orderId,
  } = params;

  return {
    // REQUIRED: Transaction hash
    transactionHash,
    // Optional: Amount and token details
    amountOut,
    tokenOut: 'YLDZ',
    ...(yieldzTokenAddress && { tokenOutAddress: yieldzTokenAddress }),
    pendingTokenAmount,
    allocationType,
    // Optional: Fee details
    platformFee: platformFeeAmount.toFixed(2),
    networkFee: networkFeeAmount.toFixed(2),
    networkFeeCurrency: 'ETH', // Network fee is typically paid in ETH
    // Optional: Metadata
    metadata: {
      orderId,
      blockNumber,
      onChainTimestamp,
      tokenIn,
      userId,
      // Legacy fields for backward compatibility
      receiveTokenAmount: amountOut,
      deductedFeeAmount: platformFeeAmount.toFixed(2),
    },
  };
}

/**
 * Create deposit for BUY or SELL tab
 * Unified function that handles both buy and sell deposit creation
 * @param params - Object containing all required parameters for deposit creation
 * @returns Deposit ID if successful, null otherwise
 */
export async function createDepositRecord(params: CreateDepositParams): Promise<number | null> {
  const {
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
  } = params;

  try {
    const { platformFeeAmount, networkFeeAmount, totalRewardAfterFee } = calculateFees(enteredAmount);

    // For buy: calculate allocation with pending tokens
    // For sell: use total reward after fee as amount out
    const { amountOut, pendingTokenAmount } = isBuy
      ? calculateAllocation(
          totalRewardAfterFee,
          lpBalance,
          isLpBalanceLoading,
          lpBalanceError,
          vaultAddress,
          yieldzTokenAddress,
          false
        )
      : { amountOut: totalRewardAfterFee.toFixed(2), pendingTokenAmount: undefined };

    const depositPayload: DepositRequest = {
      assetId: selectedAsset.id,
      amountIn,
      walletAddress,
      amountOut,
      tokenOut: 'YLDZ',
      tokenOutAddress: yieldzTokenAddress,
      ...(isBuy && pendingTokenAmount && { pendingTokenAmount }),
      platformFee: platformFeeAmount.toFixed(2),
      networkFee: networkFeeAmount.toFixed(2),
    };

    const depositResponse = await createDeposit(depositPayload);
    return depositResponse.data.id;
  } catch (error) {
    const errorMessage = handleServiceError(error, t('investment:failedToCreateDeposit'));
    showErrorToast('invest-deposit-failed', errorMessage);
    return null;
  }
}

/**
 * Update deposit after successful blockchain transaction
 * @param params - Object containing all required parameters for deposit update
 * @returns True if update was successful, false otherwise
 */
export async function updateDepositAfterTransaction(params: UpdateDepositParams): Promise<boolean> {
  const {
    depositId,
    transactionHash,
    lastReceipt,
    tokenIn,
    enteredAmount,
    lpBalance,
    isLpBalanceLoading,
    lpBalanceError,
    vaultAddress,
    yieldzTokenAddress,
    userId,
    t,
  } = params;

  try {
    const { extractReceiptDetails } = await import('@/utils/stable-coin/calculations');
    // Extract transaction details from receipt
    const { blockNumber, onChainTimestamp } = extractReceiptDetails(lastReceipt);

    // Calculate fees
    const { platformFeeAmount, networkFeeAmount, totalRewardAfterFee } = calculateFees(enteredAmount);

    // Calculate allocation type and amounts
    const { allocationType, amountOut, pendingTokenAmount } = calculateAllocation(
      totalRewardAfterFee,
      lpBalance,
      isLpBalanceLoading,
      lpBalanceError,
      vaultAddress,
      yieldzTokenAddress,
      true
    ) as {
      allocationType: 'FULL' | 'PARTIAL' | 'PENDING';
      amountOut: string | undefined;
      pendingTokenAmount: string | undefined;
    };

    // Build update payload
    const orderId = depositId.toString();
    const updatePayload = buildUpdateDepositPayload(
      {
        transactionHash,
        blockNumber,
        onChainTimestamp,
        tokenIn,
        platformFeeAmount,
        networkFeeAmount,
        allocationType,
        amountOut,
        pendingTokenAmount,
        orderId,
      },
      yieldzTokenAddress,
      userId
    );

    // Update deposit
    await updateDeposit(depositId, updatePayload);
    return true;
  } catch (error) {
    const errorMessage = handleServiceError(error, t('investment:failedToCreateDeposit'));
    showErrorToast('invest-deposit-update-failed', errorMessage);
    return false;
  }
}
