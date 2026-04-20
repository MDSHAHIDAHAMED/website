/**
 * Format a number or numeric string to US format with commas
 * @param value - number or numeric string
 * @returns formatted string
 */
export function formatToUS(value: number | string): string {
  if (!value) return '0';

  // Convert string to number if necessary
  const num = typeof value === 'string' ? Number(value.replaceAll(',', '')) : value;

  if (Number.isNaN(num)) return '0';

  // Format number to US locale
  return num.toLocaleString('en-US', { maximumFractionDigits: 18 });
}

/**
 * Format a number to US locale with exactly 2 decimal places.
 * Use for currency/amount display where fixed 2 decimals are required (e.g. withdrawal amounts).
 *
 * @param value - number to format
 * @returns formatted string e.g. "1,234.56"
 */
export function formatNumberWithTwoDecimals(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
