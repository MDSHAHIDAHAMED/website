'use client';

/**
 * PersonaKYC Component
 * ====================
 * Multi-step verification flow UI: KYC (Persona) → Accreditation (NorthCapital) → DocuSign
 *
 * This component handles the step display and configuration.
 * Actual verification functionality is delegated to VerificationButton.
 *
 * Steps:
 * - Step 0: KYC verification pending
 * - Step 1: KYC complete, Accreditation pending
 * - Step 2: Accreditation complete (approved), DocuSign pending
 * - Step 3: All complete
 */
import type { AccreditationStatusType } from '@/services/kyc';
import { Box, SxProps, Theme } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { KYCButtonCard } from '@/components/kyc/kyc-button-card';
import VerificationButton, {
  calculateVerificationStep,
  VERIFICATION_STEPS,
} from '@/components/kyc/verification-button';
import { PersonaKYCProps, StepConfig } from '@/constants';

// =============================================================================
// Constants
// =============================================================================

/** Total number of verification steps */
const TOTAL_STEPS = VERIFICATION_STEPS.COMPLETED;

/** Accreditation statuses that allow proceeding to DocuSign */
const APPROVED_ACCREDITATION_STATUSES: AccreditationStatusType[] = ['APPROVED'];

/** Accreditation pending status */
const ACCREDITATION_PENDING_STATUS = 'PENDING';

/** Step configurations for each verification stage */
const STEP_CONFIGS: Record<number, StepConfig> = {
  [VERIFICATION_STEPS.KYC]: {
    title: 'Complete KYC',
    description: 'Complete your identity verification to proceed with the investment process.',
    buttonLabel: 'COMPLETE KYC',
  },
  [VERIFICATION_STEPS.ACCREDITATION]: {
    title: 'Complete Accreditation',
    description: 'Your KYC verification is complete. Please complete your accreditation to proceed.',
    buttonLabel: 'COMPLETE ACCREDITATION',
  },
  [VERIFICATION_STEPS.DOCUSIGN]: {
    title: 'Sign Documents',
    description: 'Your accreditation is approved. Please sign the required documents to proceed.',
    buttonLabel: 'SIGN DOCUMENTS',
  },
  [VERIFICATION_STEPS.COMPLETED]: {
    title: 'Verification Completed',
    description:
      'You have completed all verification and signing requirements. Thank you! You are now able to trade on the Yieldz platform.',
    buttonLabel: 'COMPLETED',
  },
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Check if accreditation is in a pending/processing state
 * @param status - Accreditation status
 * @returns True if accreditation is pending
 */
const isAccreditationPending = (status?: AccreditationStatusType): boolean => {
  return status === ACCREDITATION_PENDING_STATUS;
};

// =============================================================================
// Main Component
// =============================================================================

/**
 * PersonaKYC Component
 *
 * Renders the multi-step verification UI with:
 * - Step progress indicator
 * - Step title and description
 * - VerificationButton for handling all verification actions
 *
 * @param props - PersonaKYCProps
 * @returns KYC verification card with step UI and action button
 */
export default function PersonaKYC({ onComplete, onCancel, onError, statusData }: Readonly<PersonaKYCProps>) {
  const { t } = useTranslation();

  // =============================================================================
  // Computed Values
  // =============================================================================

  /** Current verification step (0-3) */
  const currentStep = useMemo(() => {
    if (!statusData) return VERIFICATION_STEPS.KYC;
    return calculateVerificationStep(statusData);
  }, [statusData]);

  /** Current step configuration */
  const stepConfig = useMemo(() => STEP_CONFIGS[currentStep], [currentStep]);

  /** Whether all verification steps are completed */
  const isAllStepsCompleted = currentStep === TOTAL_STEPS;

  /** Whether current step is the accreditation step */
  const isAccreditationStep = currentStep === VERIFICATION_STEPS.ACCREDITATION;

  /** Dynamic description for pending accreditation */
  const displayDescription = useMemo(() => {
    // Only apply custom logic for accreditation step
    if (isAccreditationStep) {
      // If accreditation account is created
      if (statusData?.isAccreditationAccountCreated) {
        // If status is PENDING, prompt to complete accreditation
        if (isAccreditationPending(statusData?.accreditationStatus)) {
          return t('kyc:kycCompleteAccreditationPending');
        }
        // If accreditation step 1 is done but documents pending
        return t('kyc:accreditationStep1CompleteDocumentsPending');
      }
    }
    return stepConfig.description;
  }, [isAccreditationStep, statusData, stepConfig.description, t]);

  // =============================================================================
  // Styles
  // =============================================================================

  /** KYC card wrapper styles */
  const KYC_WRAPPER_SX: SxProps<Theme> = {
    width: '100%',
    maxWidth: { xs: '100%', sm: '450px', md: '500px' },
  };

  // =============================================================================
  // Render
  // =============================================================================

  return (
    <Box sx={KYC_WRAPPER_SX}>
      {/* Main KYC Card with Step UI */}
      <KYCButtonCard
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        title={stepConfig.title}
        description={displayDescription}
        buttonLabel={stepConfig.buttonLabel}
        disabled={isAllStepsCompleted}
        // Custom button slot using VerificationButton
        customButton={
          <VerificationButton
            statusData={statusData}
            buttonLabel={stepConfig.buttonLabel}
            disabled={isAllStepsCompleted}
            onComplete={onComplete}
            onCancel={onCancel}
            onError={onError}
            size="medium"
          />
        }
      />
    </Box>
  );
}
