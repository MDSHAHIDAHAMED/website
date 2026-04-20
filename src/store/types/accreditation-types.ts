/**
 * Accreditation Types
 * ===================
 * Shared types for accreditation slice and thunks
 */

// =============================================================================
// STATUS TYPES
// =============================================================================


/**
 * Trade Status Type
 * Possible values for trade transaction status
 */
export type TradeStatusType =
  | 'CREATED'
  | 'FUNDED'
  | 'UNWIND PENDING'
  | 'UNWIND SETTLED'
  | 'SETTLED';

/**
 * RR/Principal Approval Status Type
 */
export type ApprovalStatusType = 'Pending' | 'Approved' | 'Disapproved' | 'Under Review';

/**
 * Transaction Type for trades
 */
export type TransactionType =
  | 'ACH'
  | 'WIRE'
  | 'CHECK'
  | 'CREDITCARD'
  | 'TBD'
  | 'IRA'
  | 'EXTERNAL CREDIT CARD'
  | 'EXTERNAL ACH'
  | 'NCPS CUSTODY ACCOUNT';

// =============================================================================
// RESPONSE INTERFACES
// =============================================================================

/**
 * Party and Account Response
 */
export interface PartyAccountResponse {
  partyId: string;
  accountId: string;
  status: string;
  northCapitalPartyId: number;
}

/**
 * Document Upload Response
 */
export interface DocumentUploadResponse {
  documentId: string;
  status: string;
  uploadedAt: string;
}

/**
 * Purchase Details from Create Trade Response
 */
export interface PurchaseDetails {
  tradeId: string;
  transactionId: string;
  transactionAmount: string;
  transactionDate: string;
  transactionStatus: TradeStatusType;
  RRApprovalStatus: ApprovalStatusType | null;
  RRName: string | null;
  RRApprovalDate: string | null;
  PrincipalApprovalStatus: ApprovalStatusType | null;
  PrincipalName: string | null;
  PrincipalDate: string | null;
  closeId: string | null;
  eligibleToClose: 'yes' | 'no';
  notes: string;
}

/**
 * Create Trade Response (Old - kept for backwards compatibility)
 */
export interface CreateTradeResponse {
  tradeId: string;
  transactionId: string;
  transactionAmount: string;
  transactionDate: string;
  transactionStatus: TradeStatusType;
}

/**
 * Send Subscription Document Response (DocuSign URL)
 */
export interface SubscriptionDocResponse {
  signingUrl: string;
}

// =============================================================================
// DOCUSIGN TYPES (New Endpoints)
// =============================================================================

/**
 * DocuSign Start Payload
 * POST /document/sign/start
 */
export interface DocuSignStartPayload {
    type: 'ACH' | 'WIRE';
    units: number | string;
}

/**
 * DocuSign Start Response
 * Response from POST /document/sign/start
 */
export interface DocuSignStartResponse {
  tradeId: string;
  offeringId: string;
  accountId?: string;
  status?: string;
}

/**
 * DocuSign URL Response
 * Response from POST /document/sign/url
 */
export interface DocuSignUrlResponse {
  signingUrl: string;
}

// =============================================================================
// ACCOUNT INFORMATION TYPES
// =============================================================================

/**
 * Account Information Response
 * Response from GET /accreditation/account
 */
export interface AccountInformation {
  // Party Information
  partyId: string;
  userId: number;
  partyCreatedAt: string;
  partyUpdatedAt: string;

  // Account Information
  accountId: string;
  accountCreatedAt: string;
  accountUpdatedAt: string;

  // Personal Information
  firstName: string;
  lastName: string;
  domicile: string;
  dob: string;

  // Primary Address
  primAddress1: string;
  primAddress2: string;
  primCity: string;
  primState: string;
  primZip: string;
  primCountry: string;

  // Contact Information
  emailAddress: string;
  phone: string;
  occupation: string;

  // Party Status
  partyKycStatus: string;
  partyAmlStatus: string;
  partyAmlDate: string | null;

  // Account Details
  accountName: string;
  type: 'INDIVIDUAL' | 'ENTITY';
  entityType: string | null;
  residentType: string;

  // Account Address
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  accountPhone: string;
  taxID: string;

  // Account Status
  accountKycStatus: string;
  accountKycDate: string | null;
  accountAmlStatus: string;
  accountAmlDate: string | null;
  approvalStatus: string;
  accreditedStatus: string;
}

