import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * Passkey State Interface
 * ======================
 * 
 * Manages passkey-related state including:
 * - Passkey enabled status
 * - Loading and error states for passkey operations
 */
export interface PasskeyState {
  isPasskeyEnabled: boolean;
  methodId: string | null;
  phoneNumber: string | null;
  otpEmail: string | null;
  webauthn_registration_id: string | null;
}

const initialState: PasskeyState = {
  isPasskeyEnabled: false,
  methodId: null,
  phoneNumber: null,
  otpEmail: null,
  webauthn_registration_id: null,
};

/**
 * Passkey Slice
 * =============
 * 
 * Redux slice for managing passkey state with the following actions:
 * - setPasskeyEnabled: Set passkey enabled status
 * - passkeyLoading: Set loading state for passkey operations
 * - passkeyError: Set error state for passkey operations
 * - passkeyLoaded: Clear loading and error states
 * - clearPasskeyData: Reset all passkey state
 */
export const passkeySlice = createSlice({
  name: 'passkey',
  initialState,
  reducers: {
    /**
     * Set passkey enabled status
     * @param state - Current passkey state
     * @param action - Payload containing passkey enabled status
     */
    setPasskeyEnabled: (state, action: PayloadAction<boolean>) => {
      state.isPasskeyEnabled = action.payload;
    },
    setMethodId: (state, action: PayloadAction<string | null>) => {
      state.methodId = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string | null>) => {
      state.phoneNumber = action.payload;
    },
    setOTPEmail: (state, action: PayloadAction<string | null>) => {
      state.otpEmail = action.payload;
    },
    setWebauthnRegistrationId: (state, action: PayloadAction<string | null>) => {
      state.webauthn_registration_id = action.payload;
    },
    clearPasskeyData: (state) => {
      state.isPasskeyEnabled = false;
      state.methodId = null;
      state.phoneNumber = null;
      state.otpEmail = null;
      state.webauthn_registration_id = null;
    },
  },
});

// Export actions
export const {
  setPasskeyEnabled,
  setMethodId,
  setPhoneNumber,
  setOTPEmail,
  setWebauthnRegistrationId,
  clearPasskeyData,
} = passkeySlice.actions;

// Export reducer
export default passkeySlice.reducer;
