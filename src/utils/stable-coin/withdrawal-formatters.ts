/**
 * Withdrawal Formatters & Validation
 * ===================================
 *
 * Pure helpers for SELL tab: format unlockable amount and compute available-to-withdraw
 * with validation. Keeps validation/formatting logic out of the component.
 */

import { DEFAULT_DISPLAY_VALUES } from '@/constants/investment-card';
import { formatNumberWithTwoDecimals } from '@/utils/number-format';
import { formatUnits } from 'viem';

/** Result of available-to-withdraw calculation: formatted string and numeric value */
export interface AvailableToWithdrawResult {
  formatted: string;
  numeric: number;
}

/**
 * Compute available-to-withdraw amount from LP balance and withdrawal percentage.
 * Validates input and returns zero values for invalid/missing data.
 *
 * @param lpBalanceFormatted - LP balance as formatted string (e.g. from useWithdrawFee)
 * @param withdrawalPercentage - Fraction of LP that can be withdrawn (e.g. 0.7 for 70%)
 * @returns Object with formatted string for display and numeric value for validation
 */
export function getAvailableToWithdraw(
  lpBalanceFormatted: string | undefined,
  withdrawalPercentage: number
): AvailableToWithdrawResult {
  if (!lpBalanceFormatted) {
    return { formatted: DEFAULT_DISPLAY_VALUES.ZERO, numeric: 0 };
  }

  try {
    const lpBalanceNum = Number.parseFloat(lpBalanceFormatted);
    if (Number.isNaN(lpBalanceNum) || lpBalanceNum <= 0) {
      return { formatted: DEFAULT_DISPLAY_VALUES.ZERO, numeric: 0 };
    }

    const withdrawableAmount = lpBalanceNum * withdrawalPercentage;
    const formatted = formatNumberWithTwoDecimals(withdrawableAmount);

    return { formatted, numeric: withdrawableAmount };
  } catch {
    return { formatted: DEFAULT_DISPLAY_VALUES.ZERO, numeric: 0 };
  }
}

/**
 * Format unlockable amount (bigint from contract) for display.
 * Uses token decimals and locale formatting. Returns default zero string on invalid/missing input.
 *
 * @param unlockableAmount - Raw amount from getUnlockAmount (wei)
 * @param decimals - Token decimals (e.g. from useTokenBalance)
 * @returns Formatted string for display (e.g. "1,234.56") or default zero
 */
export function formatUnlockableAmount(
  unlockableAmount: bigint | undefined,
  decimals: number | undefined
): string {
  if (unlockableAmount === undefined || unlockableAmount === null || decimals === undefined) {
    return DEFAULT_DISPLAY_VALUES.ZERO;
  }

  try {
    const formatted = formatUnits(unlockableAmount, decimals);
    const numValue = Number.parseFloat(formatted);
    return formatNumberWithTwoDecimals(numValue);
  } catch {
    return DEFAULT_DISPLAY_VALUES.ZERO;
  }
}

// =============================================================================
// Validation helpers (shared by SELL/withdrawal flows)
// =============================================================================

/**
 * Parse and validate withdrawal/sell amount from user input.
 * Strips commas, parses to number; returns null if empty, NaN, or <= 0.
 * Use for a single source of truth when validating "entered amount" in SELL/withdrawal flows.
 *
 * @param amountStr - Raw or comma-stripped amount string (e.g. "1,234.56" or "1234.56")
 * @returns Parsed numeric amount if valid, null otherwise
 */
export function parseAndValidateWithdrawalAmount(amountStr: string | undefined): number | null {
  const cleaned = amountStr?.replaceAll(',', '')?.trim() ?? '';
  if (!cleaned) return null;
  const num = Number.parseFloat(cleaned);
  if (Number.isNaN(num) || num <= 0) return null;
  return num;
}

/**
 * Parse optional amount string into a positive number for payloads (e.g. usdcReceiveAmount, withdrawFeeAmount).
 * Returns null if value is missing, NaN, or <= 0.
 *
 * @param value - Optional string amount (e.g. from hooks)
 * @returns Parsed positive number if valid, null otherwise
 */
export function parsePositiveAmount(value: string | undefined): number | null {
  if (value === undefined || value === null || value === '') return null;
  const num = Number.parseFloat(value);
  if (Number.isNaN(num) || num <= 0) return null;
  return num;
}
