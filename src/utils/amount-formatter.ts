/**
 * Amount Formatter Utility
 * ========================
 * Utility functions for formatting monetary and numeric amounts.
 *
 * @module utils/amount-formatter
 */

/**
 * Format Amount Value
 * -------------------
 * Formats a numeric string amount with proper decimal places.
 * Returns '-' if the amount is empty, zero, or invalid.
 *
 * @param amount - The amount string to format
 * @returns Formatted amount string or '-'
 */
export const formatAmountValue = (amount: string | null | undefined): string => {
  if (!amount) return '-';
  const numValue = Number.parseFloat(amount);
  if (Number.isNaN(numValue) || numValue === 0) return '-';
  return numValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
};

