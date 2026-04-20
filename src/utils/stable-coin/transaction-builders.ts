/**
 * Transaction Payload Builders
 * =============================
 *
 * Helper functions for building transaction payloads for withdrawal (SELL) operations
 */

import type { Address } from 'viem';

import { parsePositiveAmount } from './withdrawal-formatters';

/**
 * Build transaction payload for withdrawal (SELL) transactions
 * @param enteredAmount - Parsed withdrawal amount
 * @param walletAddress - User wallet address
 * @param yieldzTokenAddress - YLDZ token contract address
 * @param usdcReceiveAmount - Amount of USDC user will receive
 * @param withdrawFeeAmount - Withdrawal fee amount
 * @param stableTokenAsset - USDC asset object
 * @returns Transaction payload object
 */
export function buildWithdrawalTransactionPayload(
  enteredAmount: number,
  walletAddress: Address,
  yieldzTokenAddress: Address | undefined,
  usdcReceiveAmount: string | undefined,
  withdrawFeeAmount: string | undefined,
  stableTokenAsset: { contractAddress: string } | undefined
): Record<string, any> {
  const payload: Record<string, any> = {
    type: 'withdrawal',
    walletAddress,
    amountIn: enteredAmount,
    tokenIn: 'YLDZ',
    metadata: {},
  };

  if (yieldzTokenAddress) {
    payload.tokenInAddress = yieldzTokenAddress;
  }

  const amountOutNum = parsePositiveAmount(usdcReceiveAmount);
  if (amountOutNum !== null) {
    payload.amountOut = amountOutNum;
  }

  if (stableTokenAsset?.contractAddress) {
    payload.tokenOut = 'USDC';
    payload.tokenOutAddress = stableTokenAsset.contractAddress;
  }

  const feeAmountNum = parsePositiveAmount(withdrawFeeAmount);
  if (feeAmountNum !== null) {
    payload.platformFee = feeAmountNum.toFixed(2);
  }

  return payload;
}

/**
 * Build update transaction payload for withdrawal transactions
 * @param transactionHash - Transaction hash
 * @param usdcReceiveAmount - Amount of USDC user will receive
 * @param withdrawFeeAmount - Withdrawal fee amount
 * @param stableTokenAsset - USDC asset object
 * @returns Update transaction payload object
 */
export function buildUpdateWithdrawalTransactionPayload(
  transactionHash: string,
  usdcReceiveAmount: string | undefined,
  withdrawFeeAmount: string | undefined,
  stableTokenAsset: { contractAddress: string } | undefined
): Record<string, any> {
  const payload: Record<string, any> = {
    transactionHash: transactionHash.toLowerCase(),
  };

  const amountOutNum = parsePositiveAmount(usdcReceiveAmount);
  if (amountOutNum !== null) {
    payload.amountOut = amountOutNum;
  }

  if (stableTokenAsset?.contractAddress) {
    payload.tokenOut = 'USDC';
    payload.tokenOutAddress = stableTokenAsset.contractAddress;
  }

  const feeAmountNum = parsePositiveAmount(withdrawFeeAmount);
  if (feeAmountNum !== null) {
    payload.platformFee = feeAmountNum.toFixed(2);
  }

  return payload;
}
