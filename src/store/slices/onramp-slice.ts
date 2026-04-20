import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { OnrampTransactionData } from '@/services/onramp';
import { initiateOnrampTransactionThunk } from '@/store/thunks/onramp-thunk';

// =============================================================================
// Types
// =============================================================================

/**
 * Onramp state interface
 */
export interface OnrampState {
  /** Current onramp transaction data */
  currentTransaction: OnrampTransactionData | null;
  /** Loading state for initiating transaction */
  isInitiating: boolean;
  /** Error message if any */
  error: string | null;
}

// =============================================================================
// Initial State
// =============================================================================

const initialState: OnrampState = {
  currentTransaction: null,
  isInitiating: false,
  error: null,
};

// =============================================================================
// Slice
// =============================================================================

const onrampSlice = createSlice({
  name: 'onramp',
  initialState,
  reducers: {
    /**
     * Clear current transaction
     */
    clearTransaction: (state) => {
      state.currentTransaction = null;
      state.error = null;
    },
    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Initiate transaction
    builder
      .addCase(initiateOnrampTransactionThunk.pending, (state) => {
        state.isInitiating = true;
        state.error = null;
      })
      .addCase(initiateOnrampTransactionThunk.fulfilled, (state, action: PayloadAction<OnrampTransactionData>) => {
        state.isInitiating = false;
        state.currentTransaction = action.payload;
        state.error = null;
      })
      .addCase(initiateOnrampTransactionThunk.rejected, (state, action) => {
        state.isInitiating = false;
        state.error = action.payload || 'Failed to initiate onramp transaction';
      });
  },
});

// =============================================================================
// Actions
// =============================================================================

export const { clearTransaction, clearError } = onrampSlice.actions;

// =============================================================================
// Selectors
// =============================================================================

export default onrampSlice.reducer;

