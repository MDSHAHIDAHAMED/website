// =============================================================================
// Constants
// =============================================================================



/** Toast notification IDs for deduplication */
export const TOAST_IDS = {
    KYC_COMPLETE: 'kyc-complete',
    KYC_ERROR: 'kyc-error',
    ACCREDITATION_COMPLETE: 'accreditation-complete',
    ACCREDITATION_ERROR: 'accreditation-error',
    DOCUSIGN_COMPLETE: 'docusign-complete',
    DOCUSIGN_ERROR: 'docusign-error',
  } as const;
  
  /** Toast messages */
  export const TOAST_MESSAGES = {
    KYC_COMPLETE: 'Identity verification completed successfully!',
    KYC_ERROR: 'Identity verification failed. Please try again.',
    ACCREDITATION_COMPLETE: 'Accreditation completed successfully!',
    ACCREDITATION_ERROR: 'Accreditation failed. Please try again.',
    DOCUSIGN_COMPLETE: 'Documents signed successfully!',
    DOCUSIGN_ERROR: 'Documents signing failed. Please try again.',
  } as const;