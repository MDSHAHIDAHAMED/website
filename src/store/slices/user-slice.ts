import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { logger } from '@/lib/default-logger';

/**
 * User State Interface
 * ======================
 *
 * Manages user-related state including:
 * - expiresAt: Token expiration timestamp
 * - isCreatingUser: Loading state for user creation
 * - createUserError: Error message for user creation failures
 * - inquiryId: KYC inquiry ID received after KYC completion
 * - docuSignCompleted: Flag indicating DocuSign document signing completion
 */
export interface UserState {
  expiresAt: number | null;
  isCreatingUser: boolean;
  createUserError: string | null;
  inquiryId: string | null;
  docuSignCompleted: boolean;
}

const initialState: UserState = {
  expiresAt: null,
  isCreatingUser: false,
  createUserError: null,
  inquiryId: null,
  docuSignCompleted: false,
};

/**
 * User Slice
 * =============
 *
 * Redux slice for managing user state with the following actions:
 * - setExpiresAt: Set expires at state
 * - setInquiryId: Set KYC inquiry ID after completion
 * - resetInquiryId: Reset KYC inquiry ID
 *
 */
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Set expires at state
     * @param state - Current expires at state
     * @param action - Payload containing expires at state
     */
    setExpiresAt: (state, action: PayloadAction<number>) => {
      logger.debug('[Token] Setting expires at:', action.payload);
      state.expiresAt = action.payload;
    },

    /**
     * Reset create user error state
     * @param state - Current user state
     */
    resetCreateUserError: (state) => {
      state.createUserError = null;
    },

    /**
     * Set KYC inquiry ID
     * @param state - Current user state
     * @param action - Payload containing inquiry ID
     */
    setInquiryId: (state, action: PayloadAction<string>) => {
      logger.debug('[KYC] Setting inquiry ID:', action.payload);
      state.inquiryId = action.payload;
    },

    /**
     * Reset KYC inquiry ID
     * @param state - Current user state
     */
    resetInquiryId: (state) => {
      logger.debug('[KYC] Resetting inquiry ID');
      state.inquiryId = null;
    },

    /**
     * Set DocuSign completion status
     * @param state - Current user state
     * @param action - Payload containing completion status
     */
    setDocuSignCompleted: (state, action: PayloadAction<boolean>) => {
      logger.debug('[DocuSign] Setting completion status:', action.payload);
      state.docuSignCompleted = action.payload;
    },

    /**
     * Reset DocuSign completion status
     * @param state - Current user state
     */
    resetDocuSignCompleted: (state) => {
      logger.debug('[DocuSign] Resetting completion status');
      state.docuSignCompleted = false;
    },
  },
});

// Export actions
export const {
  setExpiresAt,
  resetCreateUserError,
  setInquiryId,
  resetInquiryId,
  setDocuSignCompleted,
  resetDocuSignCompleted,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
