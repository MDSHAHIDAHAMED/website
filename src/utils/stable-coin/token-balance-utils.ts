/**
 * Token Balance Utilities
 * =======================
 *
 * Pure helpers for converting token balance (bigint) to human-readable number.
 * No React. Used by investment-card balance hooks.
 */

const DEFAULT_DECIMALS = 18;

/**
 * Converts a token balance (bigint) to a number using the given decimals.
 * Returns 0 when balance is undefined, during initial load, or when balance is zero.
 *
 * @param balance - Token balance as bigint (raw from contract)
 * @param decimals - Token decimals (default 18)
 * @param isBalanceLoading - When true and balance is undefined, returns 0 (first load)
 * @returns Balance as a number for display/calculation
 */
export function bigintBalanceToNumber(
  balance: bigint | undefined,
  decimals: number = DEFAULT_DECIMALS,
  isBalanceLoading?: boolean
): number {
  if (isBalanceLoading && balance === undefined) {
    return 0;
  }
  if (balance === undefined) {
    return 0;
  }
  if (balance === BigInt(0)) {
    return 0;
  }
  const divisor = BigInt(10 ** decimals);
  const wholePart = balance / divisor;
  const fractionalPart = balance % divisor;
  return Number(wholePart) + Number(fractionalPart) / Number(divisor);
}
