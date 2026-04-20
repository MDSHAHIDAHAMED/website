/**
 * Verification Utilities
 * ========================
 *
 * Helper functions for user verification checks (KYC, Accreditation, etc.)
 */

import { APPROVED_ACCREDITATION_STATUS, type VerificationResult } from '@/constants/investment-card';
import { showErrorToast } from '@/utils/toast';

/**
 * Check if user has completed all verification steps
 * @param status - KYC status response from API
 * @param t - Translation function
 * @returns Verification result with error details if failed
 */
export function checkVerificationStatus(
  status: {
    isKYCComplete: boolean;
    isAccreditationAccountCreated: boolean;
    accreditationStatus?: string;
    documentSignedStatus: boolean;
    isOnchainRegistered?: boolean;
  },
  t: (key: string) => string
): VerificationResult {
  if (!status.isKYCComplete) {
    showErrorToast('kyc-pending', t('investment:kycRequired'));
    return { isValid: false, errorKey: 'kyc-pending', errorMessage: t('investment:kycRequired') };
  }

  const isAccreditationComplete =
    status.isAccreditationAccountCreated && status.accreditationStatus === APPROVED_ACCREDITATION_STATUS;
  if (!isAccreditationComplete) {
    showErrorToast('accreditation-pending', t('investment:accreditationRequired'));
    return {
      isValid: false,
      errorKey: 'accreditation-pending',
      errorMessage: t('investment:accreditationRequired'),
    };
  }

  if (!status.documentSignedStatus) {
    showErrorToast('docusign-pending', t('investment:docuSignRequired'));
    return { isValid: false, errorKey: 'docusign-pending', errorMessage: t('investment:docuSignRequired') };
  }

  if (status?.isOnchainRegistered === false) {
    showErrorToast('onchain-pending', t('investment:onchainRequired'));
    return { isValid: false, errorKey: 'onchain-pending', errorMessage: t('investment:onchainRequired') };
  }

  return { isValid: true };
}
