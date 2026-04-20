import { createAsyncThunk } from '@reduxjs/toolkit';
import i18next from 'i18next';

import { getMethod, postMethod, postMethodWithProgress } from '@/services/api';
import endPoints from '@/services/urls';
import {
  getMockAccountInformationResponse,
  getMockCreateAccountResponse,
  getMockDocuSignStartResponse,
  getMockDocuSignUrlResponse,
  getMockUploadDocumentResponse,
  IS_MOCK_MODE,
} from '@/store/mock/accreditation-mock';
import { setUploadProgress } from '@/store/slices/accreditation-slice';
import type {
  AccountInformation,
  DocumentUploadResponse,
  DocuSignStartPayload,
  DocuSignStartResponse,
  DocuSignUrlResponse,
  PartyAccountResponse,
} from '@/store/types/accreditation-types';
import { handleServiceError } from '@/utils/error-handler';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Party and Account Creation Payload
 * ===================================
 * Data required to create party and account on NorthCapital
 */
export interface CreatePartyAccountPayload {
  // Account Information
  accountRegistration: string;
  type: string;
  domesticYN: string;
  entityType?: string;

  // Personal Information
  firstName: string;
  lastName: string;
  dob: string;
  domicile: string;
  occupation: string;

  // Contact Information
  email: string;
  phone: string;

  // Address Information
  streetAddress1: string;
  streetAddress2?: string;
  primCity?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

/**
 * Document Upload Payload
 * =======================
 * Data required to upload accreditation verification document
 */
export interface UploadDocumentPayload {
  file: File;
  documentTitle?: string;
  accountId?: string;
  partyId?: string;
}

// Re-export DocuSign types for convenience
export type { DocuSignStartPayload, DocuSignStartResponse, DocuSignUrlResponse } from '@/store/types/accreditation-types';

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

/**
 * Generic API Response Type
 * =========================
 * Base type for all API responses. Use this with specific data types.
 *
 * @template T - The type of the data payload
 *
 * @example
 * type MyApiResponse = ApiResponse<{ userId: string; name: string }>;
 */
interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

/**
 * Alternative API Response Type (for endpoints using 'success' boolean)
 * Some endpoints use { success: boolean } instead of { status: 'success' | 'error' }
 */
interface ApiResponseAlt<T> {
  success: boolean;
  message: string;
  data: T;
}

// -----------------------------------------------------------------------------
// Specific Data Types
// -----------------------------------------------------------------------------

interface AccountDetail {
  id: number;
  accountId: string;
  northCapitalPartyId: number;
  accreditedStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface CreatePartyAccountData {
  partyId: string;
  accountDetails: AccountDetail[];
}

interface UploadDocumentData {
  documentId: string;
  status: string;
  uploadedAt: string;
}

interface DocuSignStartData {
  tradeId: string;
  offeringId: string;
  accountId?: string;
  status?: string;
}

interface DocuSignUrlData {
  signingUrl: string;
}

// -----------------------------------------------------------------------------
// API Response Types (using generics)
// -----------------------------------------------------------------------------

type CreatePartyAccountApiResponse = ApiResponse<CreatePartyAccountData> & { status: string };

type UploadDocumentApiResponse = { data: UploadDocumentData };

type DocuSignStartApiResponse = ApiResponse<DocuSignStartData>;

type DocuSignUrlApiResponse = ApiResponseAlt<DocuSignUrlData>;

// =============================================================================
// THUNKS
// =============================================================================

/**
 * Create Party and Account Thunk (Step 1)
 * ========================================
 *
 * Creates a party and account on NorthCapital with the provided investor information.
 *
 * Flow:
 * 1. Validate payload
 * 2. Call POST /accreditation/create-account
 * 3. Return partyId, accountId, and status
 *
 * Called when:
 * - User submits Step 1 of the accreditation form
 *
 * @param payload - CreatePartyAccountPayload with investor information
 * @returns Promise<PartyAccountResponse>
 */
export const createPartyAndAccountThunk = createAsyncThunk<
  PartyAccountResponse,
  CreatePartyAccountPayload,
  { rejectValue: string; }
>(
  'accreditation/createPartyAndAccount',
  async (payload, { rejectWithValue }) => {
    try {
      // Use mock data if mock mode is enabled
      if (IS_MOCK_MODE) {
        return await getMockCreateAccountResponse();
      }

      // Real API call
      const response = await postMethod<CreatePartyAccountApiResponse>(
        endPoints.ACCREDITATION_CREATE_ACCOUNT,
        payload
      );
      // Extract data from response
      const data = response?.data ?? response;
      const accountId = data.accountDetails?.[0]?.accountId ?? '';
      const accreditedStatus = data.accountDetails?.[0]?.accreditedStatus ?? 'PENDING';
      const northCapitalPartyId = data.accountDetails?.[0]?.northCapitalPartyId ?? 0;

      return {
        partyId: data.partyId,
        accountId,
        status: accreditedStatus,
        northCapitalPartyId,
      };
    } catch (err) {
      const errorMessage = handleServiceError(err, 'Failed to create party and account');
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Upload Accreditation Document Thunk (Step 2)
 * =============================================
 *
 * Uploads a verification document for accreditation to NorthCapital.
 * Includes upload progress tracking dispatched to Redux store.
 *
 * Flow:
 * 1. Create FormData with file and metadata
 * 2. Call POST /accreditation/upload-document with progress tracking
 * 3. Dispatch progress updates to store
 * 4. Return documentId and status
 *
 * Called when:
 * - User submits Step 2 of the accreditation form (document upload)
 *
 * @param payload - UploadDocumentPayload with file and optional metadata
 * @returns Promise<DocumentUploadResponse>
 */
export const uploadAccreditationDocumentThunk = createAsyncThunk<
  DocumentUploadResponse,
  UploadDocumentPayload,
  { rejectValue: string; }
>(
  'accreditation/uploadDocument',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      // Use mock data if mock mode is enabled
      if (IS_MOCK_MODE) {
        // Simulate upload progress for mock mode
        for (let i = 0; i <= 100; i += 20) {
          dispatch(setUploadProgress(i));
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
        return await getMockUploadDocumentResponse();
      }

      // Create FormData for multipart/form-data upload
      const formData = new FormData();
      formData.append('accreditationFile', payload.file);
      formData.append('documentTitle', payload.documentTitle || i18next.t('accreditation:defaultDocumentTitle'));

      if (payload.accountId) {
        formData.append('accountId', payload.accountId);
      }
      if (payload.partyId) {
        formData.append('partyId', payload.partyId);
      }

      // Real API call with progress tracking
      const response = await postMethodWithProgress<UploadDocumentApiResponse>(
        endPoints.ACCREDITATION_UPLOAD_DOCUMENT,
        formData,
        (progress) => {
          dispatch(setUploadProgress(progress));
        }
      );

      // Handle nested data response
      const data = response?.data || response;

      return {
        documentId: data.documentId,
        status: data.status || 'uploaded',
        uploadedAt: data.uploadedAt || new Date().toISOString(),
      };
    } catch (err) {
      const errorMessage = handleServiceError(err, 'Failed to upload document');
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * DocuSign Start Thunk
 * ====================
 *
 * Creates a trade for an investor, associates the trade with an offering,
 * prepares the subscription document for signing, and returns a tradeId.
 *
 * Endpoint: POST /document/sign/start
 *
 * Flow:
 * 1. Send transaction details (type, units)
 * 2. Backend creates trade and prepares document
 * 3. Return tradeId for next step
 *
 * @param payload - DocuSignStartPayload with transaction details
 * @returns Promise<DocuSignStartResponse>
 */
export const docuSignStartThunk = createAsyncThunk<
  DocuSignStartResponse,
  DocuSignStartPayload,
  { rejectValue: string; }
>(
  'accreditation/docuSignStart',
  async (payload, { rejectWithValue }) => {
    try {
      // Use mock data if mock mode is enabled
      if (IS_MOCK_MODE) {
        return await getMockDocuSignStartResponse(payload);
      }
      // Real API call
      const response = await postMethod<DocuSignStartApiResponse>(
        endPoints.DOCUSIGN_START,
        payload
      );

      // Check for success status
      if (response?.status !== 'success' || !response?.data?.tradeId) {
        throw new Error(response?.message ?? 'Failed to create trade');
      }

      return {
        tradeId: response.data.tradeId,
        offeringId: response.data.offeringId,
        accountId: response.data?.accountId,
        status: response.data?.status,
      };
    } catch (err) {
      const errorMessage = handleServiceError(err, 'Failed to start document signing');
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * DocuSign Get URL Thunk
 * ======================
 *
 * Sends the prepared subscription document to DocuSign and returns signing URL.
 * This is the second step of the DocuSign flow.
 *
 * Endpoint: POST /document/sign/url
 *
 * Flow:
 * 1. Call backend with empty payload (uses session data)
 * 2. Backend sends document to DocuSign
 * 3. Return signing URL for frontend redirect
 *
 * Preconditions:
 * - docuSignStartThunk must be called first to create a trade
 *
 * @returns Promise<DocuSignUrlResponse>
 */
export const docuSignGetUrlThunk = createAsyncThunk<
  DocuSignUrlResponse,
  void,
  { rejectValue: string; }
>(
  'accreditation/docuSignGetUrl',
  async (_, { rejectWithValue }) => {
    try {
      // Use mock data if mock mode is enabled
      if (IS_MOCK_MODE) {
        return await getMockDocuSignUrlResponse();
      }
      // Real API call - empty payload as backend uses session data
      const response = await postMethod<DocuSignUrlApiResponse>(
        endPoints.DOCUSIGN_GET_URL,
        {}
      );

      if (!response?.data?.signingUrl) {
        throw new Error(response?.message ?? 'Failed to get signing URL');
      }

      return {
        signingUrl: response.data.signingUrl,
      };
    } catch (err) {
      const errorMessage = handleServiceError(err, 'Failed to get signing URL');
      return rejectWithValue(errorMessage);
    }
  }
);

// =============================================================================
// API RESPONSE TYPES FOR ACCOUNT INFORMATION
// =============================================================================

type GetAccountInformationApiResponse = ApiResponse<AccountInformation>;

/**
 * Get Account Information Thunk
 * =============================
 *
 * Fetches the account information for the authenticated user.
 * Returns party details, account details, KYC/AML status, and accreditation status.
 *
 * Endpoint: GET /accreditation/account
 *
 * Flow:
 * 1. Call GET /accreditation/account (no payload required)
 * 2. Return account information including party, account, and status details
 *
 * Called when:
 * - User loads the accreditation page to check current status
 * - After completing accreditation steps to refresh status
 *
 * @returns Promise<AccountInformation>
 */
export const getAccountInformationThunk = createAsyncThunk<
  AccountInformation,
  void,
  { rejectValue: string; }
>(
  'accreditation/getAccountInformation',
  async (_, { rejectWithValue }) => {
    try {
      // Use mock data if mock mode is enabled
      if (IS_MOCK_MODE) {
        return await getMockAccountInformationResponse();
      }

      // Real API call
      const response = await getMethod<GetAccountInformationApiResponse>(
        endPoints.ACCREDITATION_GET_ACCOUNT
      );

      // Check for success status
      if (response?.status !== 'success' || !response?.data) {
        throw new Error(response?.message ?? 'Failed to fetch account information');
      }

      return response.data;
    } catch (err) {
      const errorMessage = handleServiceError(err, 'Failed to fetch account information');
      return rejectWithValue(errorMessage);
    }
  }
);

