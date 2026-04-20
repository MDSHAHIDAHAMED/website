import { getMethod, postMethod } from '@/services/api';
import endPoints from '@/services/urls';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * KYC Inquiry Response - contains Persona configuration
 * Response pattern from /kyc/inquiry endpoint
 */
export interface KYCSessionResponse {
  environmentId: string;
  templateId: string;
  referenceId: string;
}

/**
 * Accreditation Status Types
 * Possible statuses from NorthCapital accreditation process
 */
export type AccreditationStatusType = 'PENDING' | 'NEW_INFO_ADDED' | 'APPROVED' | 'REJECTED' | 'NEED_MORE_INFO';

/**
 * KYC Status Types
 * Possible statuses from Persona KYC process
 */
export type KYCStatusType = 'pending' | 'completed' | 'failed' | 'expired';

/**
 * KYC Status Response - contains KYC, Accreditation, and DocuSign status
 * Response pattern from /users/status endpoint
 * Single API returns all statuses to minimize API calls
 *
 * Flow: KYC (Persona) → Accreditation (NorthCapital) → DocuSign
 */
export interface KYCStatusResponse {
  /** Whether Persona KYC verification is complete */
  isKYCComplete: boolean;
  /** Whether DocuSign document signing is complete */
  isDocuSignComplete: boolean;
  /** Persona KYC status (pending, approved, completed, failed, expired) */
  kycStatus?: KYCStatusType | 'approved';
  /** Whether NorthCapital accreditation account has been created */
  isAccreditationAccountCreated: boolean;
  /** NorthCapital accreditation status */
  accreditationStatus?: AccreditationStatusType;
  /** Persona inquiry ID (if KYC started) */
  inquiryId?: string;
  /** ISO timestamp when KYC was completed */
  completedAt?: string;
  /** Document signed status */
  documentSignedStatus: boolean;
  /** Trade status */
  tradeStatus?: string | null;
  /** Accreditation notes */
  accreditationNotes?: string;
  /** Whether user is on chain */
  isOnchainRegistered?: boolean;
}

// -----------------------------------------------------------------------------
// Mock Data Configuration
// -----------------------------------------------------------------------------

/**
 * Toggle mock mode via environment variable
 * Defaults to TRUE (mock mode) since backend API is not ready yet
 * Set NEXT_PUBLIC_IS_MOCK_MODE=false to use real API when backend is ready
 */
const IS_MOCK_MODE = process.env.NEXT_PUBLIC_IS_MOCK_MODE === 'true';

/**
 * Mock KYC inquiry data
 * Used when backend API is not ready
 * Matches the response pattern from /kyc/inquiry endpoint
 */
const MOCK_KYC_INQUIRY_RESPONSE: KYCSessionResponse = {
  environmentId: 'env_i5bFR6EyYMNLp63Jjg7yZDJKvrBm',
  templateId: 'itmpl_n8ccyKxioMTwb4FDtwVrC5EvwBff',
  referenceId: 'guest',
};

// -----------------------------------------------------------------------------
// API Functions
// -----------------------------------------------------------------------------

/**
 * Fetch KYC inquiry configuration
 * POST /kyc/inquiry
 *
 * Returns Persona configuration needed to initialize KYC verification:
 * - environmentId: Persona environment identifier
 * - templateId: Persona template identifier for the verification flow
 * - referenceId: User reference identifier (e.g., "guest" or user ID)
 *
 * @returns Promise with Persona configuration
 */
export const fetchKYCSession = async (): Promise<KYCSessionResponse> => {
  if (IS_MOCK_MODE) {
    // Simulate network delay for realistic testing
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock response matching the backend API pattern
    return MOCK_KYC_INQUIRY_RESPONSE;
  }

  // Real API call to backend (when IS_MOCK_MODE is false)
  // Backend returns environmentId, templateId, and referenceId for current user
  // Send empty object as payload
  const response = await postMethod<any>(endPoints.KYC_INQUIRY, {});

  // Check if response is wrapped in a data property
  if (response?.data) {
    return response.data as KYCSessionResponse;
  }
  // Return response directly if not wrapped
  return response as KYCSessionResponse;
};

/**
 * Check KYC completion status
 * GET /kyc/status
 *
 * Returns the current KYC completion status for the logged-in user:
 * - isKYCComplete: boolean indicating if KYC is complete
 * - inquiryId: Persona inquiry ID (if completed)
 * - status: Current status (e.g., "completed", "pending", "failed")
 * - completedAt: ISO timestamp when KYC was completed
 *
 * @returns Promise with KYC status information
 */
export const checkKYCStatus = async (): Promise<KYCStatusResponse> => {
  if (IS_MOCK_MODE) {
    // Simulate network delay for realistic testing
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Return mock response - can be toggled for testing different scenarios
    // Step 0: KYC pending (isKYCComplete: false)
    // Step 1: KYC complete, Accreditation pending (isKYCComplete: true, isAccreditationAccountCreated: false)
    // Step 2: Accreditation complete, DocuSign pending (accreditationStatus: 'VERIFIED_ACCREDITED', isDocuSignComplete: false)
    // Step 3: All complete (isDocuSignComplete: true)
    return {
      isKYCComplete: true,
      isDocuSignComplete: true,
      kycStatus: 'pending',
      isAccreditationAccountCreated: true,
      accreditationStatus: 'APPROVED',
      inquiryId: 'inq_test_123456',
      completedAt: new Date().toISOString(),
      documentSignedStatus: true,
      accreditationNotes:'',
      isOnchainRegistered: true
    };
  }

  // Real API call to backend (when IS_MOCK_MODE is false)
  // Backend returns KYC status for current authenticated user
  const response = await getMethod<any>(endPoints.KYC_STATUS);

  // Check if response is wrapped in a data property
  if (response?.data) {
    return response.data as KYCStatusResponse;
  }

  // Return response directly if not wrapped
  return response as KYCStatusResponse;
};

/**
 * Check if using mock mode
 * Follows same pattern as authentication service
 *
 * @returns boolean indicating if mock mode is active
 */
export const isUsingMockData = (): boolean => {
  return IS_MOCK_MODE;
};
