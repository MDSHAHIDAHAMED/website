import { useCallback, useState } from 'react';

/**
 * Phone input data structure
 */
export interface PhoneInputData {
  countryCode: string;
  phoneNumber: string;
  fullPhone: string;
  countryIso2: string;
}

/**
 * Return type for usePhoneInput hook
 */
export interface UsePhoneInputReturn {
  phoneData: PhoneInputData | null;
  setPhoneData: (data: PhoneInputData) => void;
  handlePhoneChange: (data: PhoneInputData) => void;
  getCountryCode: () => string;
  getPhoneNumber: () => string;
  getFullPhone: () => string;
  getCountryIso2: () => string;
  isPhoneDataAvailable: () => boolean;
  clearPhoneData: () => void;
}

/**
 * Custom hook to manage phone input data
 * 
 * @returns {UsePhoneInputReturn} Phone data and helper functions
 * 
 * @example
 * ```tsx
 * const { phoneData, handlePhoneChange, getCountryCode } = usePhoneInput();
 * 
 * <AtomPhoneInput
 *   name="phoneNumber"
 *   onPhoneChange={handlePhoneChange}
 * />
 * 
 * ```
 */
export const usePhoneInput = (): UsePhoneInputReturn => {
  const [phoneData, setPhoneData] = useState<PhoneInputData | null>(null);

  /**
   * Callback to handle phone input changes
   */
  const handlePhoneChange = useCallback((data: PhoneInputData) => {
    setPhoneData(data);
  }, []);

  /**
   * Get country code (e.g., "+48")
   */
  const getCountryCode = useCallback((): string => {
    return phoneData?.countryCode || '';
  }, [phoneData]);

  /**
   * Get phone number without country code (e.g., "123 456 789")
   */
  const getPhoneNumber = useCallback((): string => {
    return phoneData?.phoneNumber || '';
  }, [phoneData]);

  /**
   * Get full phone number with country code (e.g., "+48 123 456 789")
   */
  const getFullPhone = useCallback((): string => {
    return phoneData?.fullPhone || '';
  }, [phoneData]);

  /**
   * Get country ISO2 code (e.g., "pl")
   */
  const getCountryIso2 = useCallback((): string => {
    return phoneData?.countryIso2 || '';
  }, [phoneData]);

  /**
   * Check if phone data is available
   */
  const isPhoneDataAvailable = useCallback((): boolean => {
    return phoneData !== null;
  }, [phoneData]);

  /**
   * Clear phone data
   */
  const clearPhoneData = useCallback(() => {
    setPhoneData(null);
  }, []);

  return {
    phoneData,
    setPhoneData,
    handlePhoneChange,
    getCountryCode,
    getPhoneNumber,
    getFullPhone,
    getCountryIso2,
    isPhoneDataAvailable,
    clearPhoneData,
  };
};

