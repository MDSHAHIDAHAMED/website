import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

import { logger } from '@/lib/default-logger';

const phoneUtil = PhoneNumberUtil.getInstance();

/**
 * Validates if a phone number is valid using Google's libphonenumber
 * @param phone - The phone number to validate (in international format)
 * @returns true if the phone number is valid, false otherwise
 */
export const isPhoneValid = (phone: string): boolean => {
  try {
    if (!phone || phone.length < 5) {
      return false;
    }
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error_) {
    // Invalid phone number format; treat as invalid
    if (typeof logger.debug === 'function') logger.debug('isPhoneValid parse error', error_);
    return false;
  }
};

/**
 * Gets the phone number type (MOBILE, FIXED_LINE, etc.)
 * @param phone - The phone number to check
 * @returns The phone number type or null if invalid
 */
export const getPhoneNumberType = (phone: string): string | null => {
  try {
    const parsedNumber = phoneUtil.parseAndKeepRawInput(phone);
    const numberType = phoneUtil.getNumberType(parsedNumber);
    return numberType.toString();
  } catch (error_) {
    // Invalid phone number format
    if (typeof logger.debug === 'function') logger.debug('getPhoneNumberType parse error', error_);
    return null;
  }
};

/**
 * Formats a phone number in international format
 * @param phone - The phone number to format
 * @returns Formatted phone number or original if invalid
 */
export const formatPhoneNumber = (phone: string): string => {
  try {
    const parsedNumber = phoneUtil.parseAndKeepRawInput(phone);
    return phoneUtil.format(parsedNumber, PhoneNumberFormat.INTERNATIONAL);
  } catch (error_) {
    // Invalid phone number format, return as-is
    if (typeof logger.debug === 'function') logger.debug('formatPhoneNumber parse error', error_);
    return phone;
  }
};

