/**
 * Date format constants for the application
 * Used with dayjs and MUI DatePicker
 */

// Display formats (for UI)
export const DATE_FORMATS = {
  /** MM-DD-YYYY (e.g., 01-15-1990) - Default US format */
  US_DATE: 'MM-DD-YYYY',
  /** DD-MM-YYYY (e.g., 15-01-1990) - European format */
  EU_DATE: 'DD-MM-YYYY',
  /** YYYY-MM-DD (e.g., 1990-01-15) - ISO format */
  ISO_DATE: 'YYYY-MM-DD',
  /** MM/DD/YYYY (e.g., 01/15/1990) - US format with slashes */
  US_DATE_SLASH: 'MM/DD/YYYY',
  /** DD/MM/YYYY (e.g., 15/01/1990) - European format with slashes */
  EU_DATE_SLASH: 'DD/MM/YYYY',
  /** MMMM DD, YYYY (e.g., January 15, 1990) - Full month name */
  FULL_DATE: 'MMMM DD, YYYY',
  /** MMM DD, YYYY (e.g., Jan 15, 1990) - Abbreviated month */
  SHORT_DATE: 'MMM DD, YYYY',
} as const;

export type DateFormat = (typeof DATE_FORMATS)[keyof typeof DATE_FORMATS];

// Default format for the application
export const DEFAULT_DATE_FORMAT = DATE_FORMATS.US_DATE;

