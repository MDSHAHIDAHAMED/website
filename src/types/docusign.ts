/**
 * DocuSign Type Definitions
 * -------------------------
 * TypeScript interfaces for DocuSign integration
 * Simplified to only include types used by services and components
 * 
 * Follows KISS principle - only essential types
 */

/**
 * Request payload for getting DocuSign signing URL from API
 */
export interface DocuSignUrlRequest {
  investorId: string;
  returnUrl: string;
  templateId?: string;
  documentName?: string;
}

/**
 * Document information from DocuSign envelope
 */
export interface DocuSignDocument {
  documentId: string;
  name: string;
  type: string;
  pages?: number;
  order?: number;
}

/**
 * Response from backend containing DocuSign signing URL
 */
export interface DocuSignUrlResponse {
  signingUrl: string;
  envelopeId?: string;
  expiresAt?: string;
  documents?: DocuSignDocument[];
}

/**
 * Request payload for confirming signing completion
 */
export interface DocuSignConfirmRequest {
  envelopeId?: string;
  event?: 'completed' | 'declined' | 'voided';
}

/**
 * Response from backend confirming signing status
 */
export interface DocuSignConfirmResponse {
  success: boolean;
  message?: string;
  envelopeId?: string;
}
