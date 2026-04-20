'use client';

/**
 * Investment Verification Hook
 * =============================
 *
 * Owns KYC status, verification button ref, and handleVerificationCheck.
 * Used for KYC, Accreditation, DocuSign flow before invest/sell.
 */

import {
  VERIFICATION_STEPS,
  type VerificationButtonHandle,
} from '@/components/kyc/verification-button';
import { paths } from '@/paths';
import { checkKYCStatus, type KYCStatusResponse } from '@/services/kyc';
import { showErrorToast } from '@/utils/toast';
import { checkVerificationStatus } from '@/utils/stable-coin/verification';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface UseInvestmentVerificationParams {
  walletAddress: `0x${string}` | undefined;
  router: AppRouterInstance;
  setIsValidating: (value: boolean) => void;
}

export interface UseInvestmentVerificationReturn {
  verificationButtonRef: React.RefObject<VerificationButtonHandle | null>;
  kycStatusData: KYCStatusResponse | null;
  handleVerificationCheck: () => Promise<boolean>;
  /** Callback for VerificationButton onComplete, onCancel, onError */
  refetchKycStatus: () => void;
}

/**
 * KYC/verification state and handlers for investment card.
 */
export function useInvestmentVerification({
  walletAddress,
  router,
  setIsValidating,
}: UseInvestmentVerificationParams): UseInvestmentVerificationReturn {
  const { t } = useTranslation();
  const verificationButtonRef = useRef<VerificationButtonHandle>(null);
  const [kycStatusData, setKycStatusData] = useState<KYCStatusResponse | null>(null);

  const refetchKycStatus = useCallback(() => {
    checkKYCStatus().then(setKycStatusData);
  }, []);

  const handleVerificationCheck = useCallback(async (): Promise<boolean> => {
    const freshStatus = await checkKYCStatus();
    setKycStatusData(freshStatus);

    if (!walletAddress) {
      setIsValidating(false);
      router.push(paths.dashboard.profile);
      showErrorToast('wallet-not-connected', t('investment:connectWalletToProceed'));
      return false;
    }

    const verification = checkVerificationStatus(freshStatus, t);

    if (verification.isValid) {
      return true;
    }



    if (verification.errorKey === 'onchain-pending') {
      showErrorToast(verification.errorKey, verification.errorMessage!);
      return false;
    }

    if (verificationButtonRef.current) {
      const result = await verificationButtonRef.current.triggerVerification(freshStatus);

      if (result.isComplete) {
        return true;
      }

      if (!result.actionTriggered) {
        const stepMessages: Record<number, string> = {
          [VERIFICATION_STEPS.KYC]: t('investment:kycRequired'),
          [VERIFICATION_STEPS.ACCREDITATION]: t('investment:accreditationRequired'),
          [VERIFICATION_STEPS.DOCUSIGN]: t('investment:docuSignRequired'),
        };
        const message = stepMessages[result.currentStep];
        if (message) {
          showErrorToast(verification.errorKey!, message);
        }
      }

      return false;
    }

    showErrorToast(verification.errorKey!, verification.errorMessage!);
    return false;
  }, [t, walletAddress, router, setIsValidating]);

  return {
    verificationButtonRef,
    kycStatusData,
    handleVerificationCheck,
    refetchKycStatus,
  };
}
