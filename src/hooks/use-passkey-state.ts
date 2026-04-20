'use client';

import { useDispatch, useSelector } from '@/store';
import { setMethodId, setOTPEmail, setPasskeyEnabled, setPhoneNumber } from '@/store/slices/passkey-slice';
import { useCallback } from 'react';

/**
 * usePasskeyState Hook
 * ====================
 * 
 * Simple hook that manages passkey state using Redux persistence.
 * This ensures that isPasskeyEnabled state persists across page refreshes.
 * 
 * Features:
 * - Redux-based state management
 * - Persists isPasskeyEnabled across page refreshes
 * - Handles loading and error states
 * - Simple and clean API
 */
export function usePasskeyState() {
  const dispatch = useDispatch();
  
  // Get passkey state from Redux store
  const { isPasskeyEnabled, methodId, phoneNumber, otpEmail } = useSelector((state) => state.passkey);

  /**
   * Set passkey enabled status
   * 
   * @param enabled - Whether passkey is enabled
   */
  const setIsPasskeyEnabled = useCallback((enabled: boolean) => {
    dispatch(setPasskeyEnabled(enabled));
  }, [dispatch]);

  const setOTPMethodId = useCallback((methodId: string | null) => {
    dispatch(setMethodId(methodId));
  }, [dispatch]);

  const setOTPPhoneNumber = useCallback((phoneNumber: string | null) => {
    dispatch(setPhoneNumber(phoneNumber));
  }, [dispatch]);

  const setOTPEmailValue = useCallback((otpEmail: string | null) => {
    dispatch(setOTPEmail(otpEmail));
  }, [dispatch]);

  return {
    // State
    isPasskeyEnabled,
    otpMethodId:methodId,
    phoneNumber,
    otpEmail,
    // Actions
    setIsPasskeyEnabled,
    setOTPMethodId,
    setOTPPhoneNumber,
    setOTPEmailValue,
  };
}
