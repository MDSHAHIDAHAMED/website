/**
 * Balance Formatter Utility
 * =========================
 * Utility functions for formatting and truncating balance values for display.
 *
 * @module utils/balance-formatter
 */

/**
 * Truncate Balance String
 * -----------------------
 * Truncates a balance string if it exceeds the maximum length.
 * Shows first N characters followed by ellipsis (...).
 *
 * @param balance - The balance string to truncate (e.g., "1,000,000.00" or "1000000000000000000000000000000000000000")
 * @param maxLength - Maximum length before truncation (default: 12)
 * @returns Truncated balance string with ellipsis if needed
 *
 * @example
 * truncateBalance("1,000,000.00") // Returns "1,000,000.00" (no truncation)
 * truncateBalance("1000000000000000000000000000000000000000") // Returns "1000000000..." (truncated)
 */
export function truncateBalance(balance: string, maxLength: number = 12): string {
  if (!balance || balance.length <= maxLength) {
    return balance;
  }

  // Truncate to maxLength and add ellipsis
  return `${balance.substring(0, maxLength)}...`;
}

/**
 * Check if Balance Should Be Truncated
 * ------------------------------------
 * Determines if a balance string exceeds the maximum display length.
 *
 * @param balance - The balance string to check
 * @param maxLength - Maximum length before truncation (default: 12)
 * @returns True if balance should be truncated, false otherwise
 */
export function shouldTruncateBalance(balance: string, maxLength: number = 12): boolean {
  return balance ? balance.length > maxLength : false;
}
