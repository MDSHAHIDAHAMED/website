import dayjs from "dayjs";

/**
 * Format date to US format (MM/DD/YYYY hh:mm A)
 * @param date - Date string to format
 * @returns Formatted date string in US format or 'N/A' if invalid
 */
export const dateFormatter = (date: string) => {
  return dayjs(date).format('MM/DD/YYYY hh:mm A') || 'N/A';
};
