/**
 * Investment Calculations Utilities
 * ===================================
 *
 * Shared calculation functions for investment operations (stable-coin / YLDZ)
 */

/**
 * Calculate investment amounts after fees
 *
 * Calculates the amount user will receive after deducting platform fee.
 *
 * @param amountIn - Original investment amount
 * @param platformFeePercent - Platform fee percentage (default: 1%)
 * @returns Object containing amount after fees and fee amount
 */
export function calculateAmountAfterFees(
  amountIn: string,
  platformFeePercent: number = 1
): { amountAfterFees: number; feeAmount: number } {
  const amount = Number.parseFloat(amountIn) || 0;
  const feeAmount = (amount * platformFeePercent) / 100;
  const amountAfterFees = amount - feeAmount;
  return { amountAfterFees, feeAmount };
}

/**
 * Calculate USDC amount user will receive when selling YLDZ
 * Uses 1:1 peg (1 YLDZ = 1 USDC).
 *
 * @param yieldzAmount - Amount of YLDZ to sell
 * @returns USDC amount user will receive
 */
export function calculateUsdcReceiveAmount(yieldzAmount: string): string {
  const amount = Number.parseFloat(yieldzAmount) || 0;
  // 1 YLDZ = 1 USDC (peg)
  return amount.toFixed(2);
}

/**
 * Extract transaction details from receipt
 *
 * Helper function to process transaction receipt and extract block number and timestamp.
 * Handles bigint conversion and provides fallback timestamp if not available in receipt.
 *
 * @param receipt - Transaction receipt from wagmi (optional)
 * @returns Object containing blockNumber and onChainTimestamp
 */
export function extractReceiptDetails(receipt?: any): { blockNumber?: number; onChainTimestamp: string } {
  let blockNumber: number | undefined;
  let onChainTimestamp: string;

  if (receipt) {
    // Convert blockNumber from bigint to number if needed
    blockNumber = typeof receipt.blockNumber === 'bigint'
      ? Number(receipt.blockNumber)
      : receipt.blockNumber;

    // Get timestamp from receipt if available, otherwise use current time
    // Note: wagmi receipt doesn't include timestamp, so we use current time
    // The backend can fetch the actual block timestamp if needed
    onChainTimestamp = receipt.blockTimestamp
      ? new Date(Number(receipt.blockTimestamp) * 1000).toISOString()
      : new Date().toISOString();
  } else {
    // If no receipt, use current time
    onChainTimestamp = new Date().toISOString();
  }

  return { blockNumber, onChainTimestamp };
}
