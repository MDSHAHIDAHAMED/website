/**
 * Font Family Constants
 *
 * This file defines the font families used throughout the application.
 * Import these constants to maintain consistency across all typography.
 *
 * @example
 * import { fontFamily } from '@/styles/theme/fonts';
 *
 * // In a component with sx prop
 * <Typography sx={{ fontFamily: fontFamily.ppMori }}>
 *   PP Mori Text
 * </Typography>
 *
 * // Or use font stacks directly
 * <Box sx={{ fontFamily: fontFamily.tickerbit }}>
 *   Tickerbit Text
 * </Box>
 */

/**
 * PP Mori Font Family
 * Primary font for UI elements, body text, and headings
 */
export const PP_MORI =
  '"PP Mori", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"';

/**
 * Tickerbit Font Family
 * Specialized font for numeric displays, tickers, and data-focused content
 */
export const TICKERBIT = '"Tickerbit", "Courier New", Courier, monospace';

/**
 * Font Family Object
 * Use this object to access font families with autocomplete support
 */
export const fontFamily = {
  ppMori: PP_MORI,
  tickerbit: TICKERBIT,
} as const;

/**
 * Font Weights
 * Standardized font weights for consistent typography
 */
export const fontWeight = {
  regular: 400,
  semibold: 500,
  bold: 700,
} as const;

/**
 * Default Font Family
 * Used as the base font throughout the application
 */
export const DEFAULT_FONT_FAMILY = PP_MORI;
