/**
 * Accreditation Mock Data
 * =======================
 * Mock responses for accreditation APIs when NEXT_PUBLIC_IS_MOCK_MODE is true
 */

import type {
  AccountInformation,
  DocuSignStartPayload,
  DocuSignStartResponse,
  DocuSignUrlResponse,
  DocumentUploadResponse,
  PartyAccountResponse,
} from '@/store/types/accreditation-types';

/**
 * Check if mock mode is enabled
 */
export const IS_MOCK_MODE = process.env.NEXT_PUBLIC_IS_MOCK_MODE === 'true';

/**
 * Simulated network delay (in milliseconds)
 */
const MOCK_DELAY = 1500;

/**
 * Mock Create Party and Account Response
 * =======================================
 * Simulates the response from NorthCapital party/account creation API
 */
export const MOCK_CREATE_ACCOUNT_RESPONSE = {
  status: 'success',
  data: {
    account: {
      statusCode: '101',
      statusDesc: 'Ok',
      accountDetails: [
        {
          accountId: 'A93265924',
          kycStatus: 'Approved',
          amlStatus: 'Clear',
          accreditedStatus: 'Pending',
          approvalStatus: 'Approved',
        },
      ],
    },
    party: {
      partyId: 'P12345678',
      status: 'created',
    },
  },
};

/**
 * Mock Upload Document Response
 * =============================
 * Simulates the response from document upload API
 */
export const MOCK_UPLOAD_DOCUMENT_RESPONSE = {
  status: 'success',
  data: {
    document: {
      statusCode: '101',
      statusDesc: 'Ok',
      documentDetails: {
        documentId: 'DOC_987654321',
        documentType: 'Accreditation Verification',
        uploadStatus: 'Uploaded',
        verificationStatus: 'Pending',
        uploadedAt: new Date().toISOString(),
      },
    },
  },
};

/**
 * Get mock create party and account response
 * @returns Promise with mock PartyAccountResponse
 */
export const getMockCreateAccountResponse = async (): Promise<PartyAccountResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  const mockData = MOCK_CREATE_ACCOUNT_RESPONSE.data;

  return {
    partyId: mockData.party.partyId,
    accountId: mockData.account.accountDetails[0].accountId,
    status: 'created',
    northCapitalPartyId: 1,
  };
};

/**
 * Get mock upload document response
 * @returns Promise with mock DocumentUploadResponse
 */
export const getMockUploadDocumentResponse = async (): Promise<DocumentUploadResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  const mockData = MOCK_UPLOAD_DOCUMENT_RESPONSE.data;

  return {
    documentId: mockData.document.documentDetails.documentId,
    status: mockData.document.documentDetails.uploadStatus,
    uploadedAt: mockData.document.documentDetails.uploadedAt,
  };
};

// =============================================================================
// DOCUSIGN MOCK DATA
// =============================================================================

/**
 * Mock DocuSign Start Response
 * ============================
 * Simulates the response from POST /document/sign/start
 */
export const MOCK_DOCUSIGN_START_RESPONSE = {
  success: true,
  message: 'Trade created successfully',
  data: {
    tradeId: '789456',
    offeringId: '452077',
    accountId: 'A83481961',
    status: 'PENDING_SIGNATURE',
  },
};

/**
 * Mock DocuSign URL Response
 * ==========================
 * Simulates the response from POST /document/sign/url
 */
export const MOCK_DOCUSIGN_URL_RESPONSE = {
  success: true,
  message: 'DocuSign URL generated successfully',
  data: {
    signingUrl: 'https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=mock123',
    expiresInMinutes: 4320,
  },
};

/**
 * Get mock DocuSign start response
 * @param _payload - DocuSignStartPayload (unused in mock)
 * @returns Promise with mock DocuSignStartResponse
 */
export const getMockDocuSignStartResponse = async (_payload: DocuSignStartPayload): Promise<DocuSignStartResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  return {
    tradeId: `TRADE_${Date.now()}`,
    offeringId: '452077',
    accountId: 'A83481961',
    status: 'PENDING_SIGNATURE',
  };
};

/**
 * Get mock DocuSign URL response
 * @returns Promise with mock DocuSignUrlResponse
 */
export const getMockDocuSignUrlResponse = async (): Promise<DocuSignUrlResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  return {
    signingUrl: `https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=mock-${Date.now()}`,
  };
};

// =============================================================================
// ACCOUNT INFORMATION MOCK DATA
// =============================================================================

/**
 * Mock Account Information Response
 * ==================================
 * Simulates the response from GET /accreditation/account
 */
export const MOCK_ACCOUNT_INFORMATION_RESPONSE: AccountInformation = {
  partyId: 'P44928917',
  userId: 1,
  partyCreatedAt: '2025-12-30T06:56:10.013Z',
  partyUpdatedAt: '2025-12-30T06:56:10.013Z',
  accountId: 'A63337107',
  accountCreatedAt: '2025-12-30T06:56:10.949Z',
  accountUpdatedAt: '2025-12-30T06:56:10.949Z',
  firstName: 'John',
  lastName: 'Doe',
  domicile: 'U.S. Resident',
  dob: '05-19-1985',
  primAddress1: '123 Main St',
  primAddress2: 'Apt 1',
  primCity: 'New York',
  primState: 'NY',
  primZip: '10001',
  primCountry: 'US',
  emailAddress: 'john.doe@example.com',
  phone: '1234567890',
  occupation: 'Engineer',
  partyKycStatus: 'Pending',
  partyAmlStatus: 'Pending',
  partyAmlDate: null,
  accountName: 'John Doe',
  type: 'INDIVIDUAL',
  entityType: null,
  residentType: 'domestic_account',
  address1: '123 Main St',
  address2: 'Apt 1',
  city: 'New York',
  state: 'NY',
  zip: '10001',
  country: 'US',
  accountPhone: '1234567890',
  taxID: '',
  accountKycStatus: 'Pending',
  accountKycDate: null,
  accountAmlStatus: 'Pending',
  accountAmlDate: null,
  approvalStatus: 'Pending',
  accreditedStatus: 'Pending',
};

/**
 * Get mock account information response
 * @returns Promise with mock AccountInformation
 */
export const getMockAccountInformationResponse = async (): Promise<AccountInformation> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  return MOCK_ACCOUNT_INFORMATION_RESPONSE;
};

