import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { AccreditationStatusType } from '@/services/kyc';
import {
  createPartyAndAccountThunk,
  docuSignGetUrlThunk,
  docuSignStartThunk,
  getAccountInformationThunk,
  uploadAccreditationDocumentThunk,
} from '../thunks/accreditation-thunk';

// Re-export types for convenience
export type {
  AccountInformation,
  DocumentUploadResponse,
  DocuSignStartResponse,
  DocuSignUrlResponse,
  PartyAccountResponse
} from '@/store/types/accreditation-types';

import type { AccountInformation } from '@/store/types/accreditation-types';

/**
 * Accreditation State Interface
 * =============================
 * Manages networth accreditation state including:
 * - Step tracking (current step in the process)
 * - Party/Account creation status
 * - Document upload status
 * - DocuSign flow status (start + get URL)
 * - Loading states for each operation
 * - Error states for each operation
 */
export interface AccreditationState {
  // Step tracking
  currentStep: number;

  // Party/Account creation (Step 1)
  isCreatingAccount: boolean;
  createAccountError: string | null;
  partyId: string | null;
  accountId: string | null;
  northCapitalPartyId: number | null;
  isAccountCreated: boolean;

  // Document upload (Step 2)
  isUploadingDocument: boolean;
  uploadDocumentError: string | null;
  documentId: string | null;
  isDocumentUploaded: boolean;
  uploadProgress: number; // 0-100 percentage

  // DocuSign Start (creates trade)
  isStartingDocuSign: boolean;
  docuSignStartError: string | null;
  tradeId: string | null;
  docuSignOfferingId: string | null;
  docuSignAccountId: string | null;
  docuSignStatus: string | null;
  isTradeCreated: boolean;

  // DocuSign URL
  isFetchingSigningUrl: boolean;
  signingUrlError: string | null;
  signingUrl: string | null;
  signingUrlExpiresInMinutes: number | null;

  // Overall status
  accreditationStatus: AccreditationStatusType;

  // Account Information (GET /accreditation/account)
  accountInformation: AccountInformation | null;
  isLoadingAccountInfo: boolean;
  accountInfoError: string | null;
}

const initialState: AccreditationState = {
  // Step tracking
  currentStep: 0,

  // Party/Account creation (Step 1)
  isCreatingAccount: false,
  createAccountError: null,
  partyId: null,
  accountId: null,
  northCapitalPartyId: null,
  isAccountCreated: false,

  // Document upload (Step 2)
  isUploadingDocument: false,
  uploadDocumentError: null,
  documentId: null,
  isDocumentUploaded: false,
  uploadProgress: 0,

  // DocuSign Start (creates trade)
  isStartingDocuSign: false,
  docuSignStartError: null,
  tradeId: null,
  docuSignOfferingId: null,
  docuSignAccountId: null,
  docuSignStatus: null,
  isTradeCreated: false,

  // DocuSign URL
  isFetchingSigningUrl: false,
  signingUrlError: null,
  signingUrl: null,
  signingUrlExpiresInMinutes: null,

  // Overall status
  accreditationStatus: 'PENDING',

  // Account Information
  accountInformation: null,
  isLoadingAccountInfo: false,
  accountInfoError: null,
};

/**
 * Accreditation Slice
 * ===================
 *
 * Redux slice for managing networth accreditation state with:
 * - Step 1: Create party and account on NorthCapital
 * - Step 2: Upload verification document
 *
 * Uses extraReducers to handle async thunk states
 */
export const accreditationSlice = createSlice({
  name: 'accreditation',
  initialState,
  reducers: {
    /**
     * Set current step
     */
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    /**
     * Set accreditation status from KYC check
     */
    setAccreditationStatus: (
      state,
      action: PayloadAction<{
        isAccountCreated: boolean;
        isDocumentUploaded: boolean;
        accreditationStatus?: AccreditationStatusType;
        accountId?: string;
        partyId?: string;
      }>
    ) => {
      state.isAccountCreated = action.payload.isAccountCreated;
      state.isDocumentUploaded = action.payload.isDocumentUploaded;
      state.accountId = action.payload.accountId || null;
      state.partyId = action.payload.partyId || null;
      state.accreditationStatus = action.payload.accreditationStatus || 'PENDING';

      // Set step based on status
      if (action.payload.isAccountCreated && !action.payload.isDocumentUploaded) {
        state.currentStep = 1; // Skip to document upload
      } else if (action.payload.isAccountCreated && action.payload.isDocumentUploaded) {
        state.currentStep = 2; // Completed
      }
    },

    /**
     * Reset accreditation state
     */
    resetAccreditation: (state) => {
      return initialState;
    },

    /**
     * Reset create account error
     */
    resetCreateAccountError: (state) => {
      state.createAccountError = null;
    },

    /**
     * Reset upload document error
     */
    resetUploadDocumentError: (state) => {
      state.uploadDocumentError = null;
    },

    /**
     * Set upload progress percentage (0-100)
     */
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },

    /**
     * Reset DocuSign start error
     */
    resetDocuSignStartError: (state) => {
      state.docuSignStartError = null;
    },

    /**
     * Reset signing URL error
     */
    resetSigningUrlError: (state) => {
      state.signingUrlError = null;
    },

    /**
     * Clear signing URL (after redirect or cancel)
     */
    clearSigningUrl: (state) => {
      state.signingUrl = null;
      state.signingUrlExpiresInMinutes = null;
    },

    /**
     * Reset DocuSign state (for retry)
     */
    resetDocuSignState: (state) => {
      state.isStartingDocuSign = false;
      state.docuSignStartError = null;
      state.tradeId = null;
      state.docuSignOfferingId = null;
      state.docuSignAccountId = null;
      state.docuSignStatus = null;
      state.isTradeCreated = false;
      state.isFetchingSigningUrl = false;
      state.signingUrlError = null;
      state.signingUrl = null;
      state.signingUrlExpiresInMinutes = null;
    },

    /**
     * Reset account information error
     */
    resetAccountInfoError: (state) => {
      state.accountInfoError = null;
    },

    /**
     * Clear account information
     */
    clearAccountInformation: (state) => {
      state.accountInformation = null;
      state.accountInfoError = null;
    },
  },
  extraReducers: (builder) => {
    // =========================================================================
    // Create Party and Account Thunk (Step 1)
    // =========================================================================
    builder
      .addCase(createPartyAndAccountThunk.pending, (state) => {
        state.isCreatingAccount = true;
        state.createAccountError = null;
      })
      .addCase(createPartyAndAccountThunk.fulfilled, (state, action) => {
        state.isCreatingAccount = false;
        state.partyId = action.payload.partyId;
        state.accountId = action.payload.accountId;
        state.northCapitalPartyId = action.payload.northCapitalPartyId;
        state.isAccountCreated = true;
        state.currentStep = 1; // Move to step 2
      })
      .addCase(createPartyAndAccountThunk.rejected, (state, action) => {
        state.isCreatingAccount = false;
        state.northCapitalPartyId = null;
        state.accountId = null;
        state.partyId = null;
      });

    // =========================================================================
    // Upload Accreditation Document Thunk (Step 2)
    // =========================================================================
    builder
      .addCase(uploadAccreditationDocumentThunk.pending, (state) => {
        state.isUploadingDocument = true;
        state.uploadDocumentError = null;
        state.uploadProgress = 0; // Reset progress on start
      })
      .addCase(uploadAccreditationDocumentThunk.fulfilled, (state, action) => {
        state.isUploadingDocument = false;
        state.uploadProgress = 100; // Set to 100% on complete
        state.documentId = action.payload.documentId;
        state.isDocumentUploaded = true;
        state.currentStep = 2; // Completed
      })
      .addCase(uploadAccreditationDocumentThunk.rejected, (state, action) => {
        state.isUploadingDocument = false;
        state.uploadProgress = 0; // Reset progress on error
      });

    // =========================================================================
    // DocuSign Start Thunk (creates trade)
    // =========================================================================
    builder
      .addCase(docuSignStartThunk.pending, (state) => {
        state.isStartingDocuSign = true;
        state.docuSignStartError = null;
      })
      .addCase(docuSignStartThunk.fulfilled, (state, action) => {
        state.isStartingDocuSign = false;
        state.tradeId = action.payload.tradeId;
        state.docuSignOfferingId = action.payload.offeringId;
        state.docuSignAccountId = action.payload.accountId || null;
        state.docuSignStatus = action.payload.status || null;
        state.isTradeCreated = true;
      })
      .addCase(docuSignStartThunk.rejected, (state, action) => {
        state.isStartingDocuSign = false;
        state.tradeId = null;
        state.docuSignOfferingId = null;
        state.docuSignAccountId = null;
        state.docuSignStatus = null;
        state.isTradeCreated = false;
      });

    // =========================================================================
    // DocuSign Get URL Thunk
    // =========================================================================
    builder
      .addCase(docuSignGetUrlThunk.pending, (state) => {
        state.isFetchingSigningUrl = true;
        state.signingUrlError = null;
        state.signingUrl = null;
      })
      .addCase(docuSignGetUrlThunk.fulfilled, (state, action) => {
        state.isFetchingSigningUrl = false;
        state.signingUrl = action.payload.signingUrl;
      })
      .addCase(docuSignGetUrlThunk.rejected, (state, action) => {
        state.isFetchingSigningUrl = false;
        state.signingUrlError = action.payload ?? 'Failed to get signing URL';
        state.signingUrl = null;
        state.signingUrlExpiresInMinutes = null;
      });

    // =========================================================================
    // Get Account Information Thunk
    // =========================================================================
    builder
      .addCase(getAccountInformationThunk.pending, (state) => {
        state.isLoadingAccountInfo = true;
        state.accountInfoError = null;
      })
      .addCase(getAccountInformationThunk.fulfilled, (state, action) => {
        state.isLoadingAccountInfo = false;
        state.accountInformation = action.payload;
        state.accountInfoError = null;

        // Update related state from account information
        state.partyId = action.payload.partyId;
        state.accountId = action.payload.accountId;
        state.isAccountCreated = true;
        state.accreditationStatus = action.payload.accreditedStatus as AccreditationStatusType;
      })
      .addCase(getAccountInformationThunk.rejected, (state, action) => {
        state.isLoadingAccountInfo = false;
        state.accountInfoError = action.payload ?? 'Failed to fetch account information';
        state.accountInformation = null;
      });
  },
});

// Export actions
export const {
  setCurrentStep,
  setAccreditationStatus,
  resetAccreditation,
  resetCreateAccountError,
  resetUploadDocumentError,
  setUploadProgress,
  resetDocuSignStartError,
  resetSigningUrlError,
  clearSigningUrl,
  resetDocuSignState,
  resetAccountInfoError,
  clearAccountInformation,
} = accreditationSlice.actions;

// Export reducer
export default accreditationSlice.reducer;

