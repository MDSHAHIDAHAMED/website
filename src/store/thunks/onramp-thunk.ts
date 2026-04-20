import { createAsyncThunk } from '@reduxjs/toolkit';

import { postMethod } from '@/services/api';
import type {
    InitiateOnrampRequest,
    InitiateOnrampResponse,
    OnrampTransactionData,
} from '@/services/onramp';
import endPoints from '@/services/urls';
import { handleServiceError } from '@/utils/error-handler';

// =============================================================================
// THUNKS
// =============================================================================

/**
 * Initiate Onramp Transaction Thunk
 * =================================
 *
 * Informs the backend about the onramp transaction being initiated.
 * The backend will track the transaction and return a partnerContext
 * that should be used with the Onramper widget.
 *
 * Flow:
 * 1. Validate payload
 * 2. Call POST /transactions/onramp/initiate
 * 3. Return transaction data with partnerContext
 *
 * Called when:
 * - User clicks "Invest Now" button and has no token balance
 * - Before opening the Onramper widget
 *
 * @param payload - InitiateOnrampRequest with wallet address, partnerContext, etc.
 * @returns Promise<OnrampTransactionData>
 */
export const initiateOnrampTransactionThunk = createAsyncThunk<
  OnrampTransactionData,
  InitiateOnrampRequest,
  { rejectValue: string }
>(
  'onramp/initiateTransaction',
  async (payload, { rejectWithValue }) => {
    try {
      // Call backend API to initiate onramp transaction
      const response = await postMethod<InitiateOnrampResponse>(
        endPoints.ONRAMP_INITIATE,
        payload
      );

      // Check for success status
      if (response?.status !== 'success' || !response?.data) {
        throw new Error(response?.message ?? 'Failed to initiate onramp transaction');
      }

      // Return transaction data
      return response.data;
    } catch (err) {
      const errorMessage = handleServiceError(err, 'Failed to initiate onramp transaction');
      return rejectWithValue(errorMessage);
    }
  }
);

