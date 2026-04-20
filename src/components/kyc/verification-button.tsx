'use client';

/**
 * VerificationButton Component
 * ============================
 * A standalone button that handles the multi-step verification flow:
 * - Step 0: KYC verification via Persona SDK
 * - Step 1: Accreditation via navigation to form
 * - Step 2: DocuSign document signing with dialog
 * - Step 3: Completed state
 *
 * This component ONLY renders a button and the necessary dialogs/containers.
 * No heading, steps, or description UI - those remain in parent components.
 *
 * @example
 * ```tsx
 * <VerificationButton
 *   statusData={kycStatusData}
 *   buttonLabel="COMPLETE KYC"
 *   onComplete={handleComplete}
 *   onCancel={handleCancel}
 *   onError={handleError}
 * />
 * ```
 */

import { AtomButton } from '@/components/atoms/button';
import AtomTypography from '@/components/atoms/typography';
import ConfirmActionModal from '@/components/molecules/confirmation-dialog';
import { paths } from '@/paths';
import {
  fetchKYCSession,
  type AccreditationStatusType,
  type KYCSessionResponse,
  type KYCStatusResponse,
} from '@/services/kyc';
import type { RootState } from '@/store';
import { useDispatch, useSelector } from '@/store';
import { setInquiryId } from '@/store/slices/user-slice';
import {
  docuSignGetUrlThunk,
  docuSignStartThunk,
  type DocuSignStartPayload,
} from '@/store/thunks/accreditation-thunk';
import { handleServiceError } from '@/utils/error-handler';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { Box, Stack, type SxProps, type Theme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CornerContainer } from 'yldzs-components';

// =============================================================================
// Types & Interfaces
// =============================================================================

/** Document item for DocuSign dialog */
interface DocumentItem {
  id: string;
  name: string;
}

/** Verification step identifiers */
export const VERIFICATION_STEPS = {
  KYC: 0,
  ACCREDITATION: 1,
  DOCUSIGN: 2,
  COMPLETED: 3,
} as const;

/** Type for verification steps */
export type VerificationStep = (typeof VERIFICATION_STEPS)[keyof typeof VERIFICATION_STEPS];

/**
 * Imperative handle exposed via ref for programmatic control
 *
 * @example
 * ```tsx
 * const verificationRef = useRef<VerificationButtonHandle>(null);
 *
 * // Trigger verification programmatically with fresh status
 * const handleInvest = async () => {
 *   const freshStatus = await checkKYCStatus();
 *   const result = await verificationRef.current?.triggerVerification(freshStatus);
 *   if (result?.isComplete) {
 *     // Proceed with investment
 *   }
 * };
 *
 * <VerificationButton ref={verificationRef} hideButton statusData={status} buttonLabel="" />
 * ```
 */
export interface VerificationButtonHandle {
  /** 
   * Trigger verification flow based on current step. Returns verification result.
   * @param freshStatus - Optional fresh KYC status to use (avoids stale state issues)
   */
  triggerVerification: (freshStatus?: KYCStatusResponse) => Promise<VerificationTriggerResult>;
  /** 
   * Get current verification step 
   * @param freshStatus - Optional fresh KYC status to use
   */
  getCurrentStep: (freshStatus?: KYCStatusResponse) => VerificationStep;
  /** 
   * Check if all verification steps are completed 
   * @param freshStatus - Optional fresh KYC status to use
   */
  isVerificationComplete: (freshStatus?: KYCStatusResponse) => boolean;
}

/**
 * Result from triggerVerification call
 */
export interface VerificationTriggerResult {
  /** Whether all verification steps are complete */
  isComplete: boolean;
  /** Current step that was triggered (if not complete) */
  currentStep: VerificationStep;
  /** Whether a dialog/navigation was triggered */
  actionTriggered: boolean;
}

/**
 * VerificationButton Props
 *
 * @param statusData - KYC status response containing verification state
 * @param buttonLabel - Label text displayed on the button
 * @param disabled - Optional flag to disable the button externally
 * @param onComplete - Callback fired when KYC verification completes
 * @param onCancel - Callback fired when KYC verification is cancelled
 * @param onError - Callback fired when an error occurs
 * @param fullWidth - Optional flag to make button full width
 * @param size - Optional button size
 * @param sx - Optional custom styles for the button
 * @param hideButton - Optional flag to hide the button (for programmatic-only usage)
 * @param onVerificationRequired - Callback fired when verification is required (step info provided)
 */
export interface VerificationButtonProps {
  readonly statusData?: KYCStatusResponse | null;
  readonly buttonLabel: string;
  readonly disabled?: boolean;
  readonly onComplete?: (data: { inquiryId: string; status: string; fields?: unknown }) => void;
  readonly onCancel?: () => void;
  readonly onError?: (error: unknown) => void;
  readonly fullWidth?: boolean;
  readonly size?: 'small' | 'medium' | 'large';
  readonly sx?: SxProps<Theme>;
  readonly hideButton?: boolean;
  readonly onVerificationRequired?: (step: VerificationStep, stepName: string) => void;
}

// =============================================================================
// Constants
// =============================================================================

const PERSONA_SCRIPT_URL = 'https://cdn.withpersona.com/dist/persona-v5.1.2.js';

/** Accreditation statuses that allow proceeding to DocuSign */
const APPROVED_ACCREDITATION_STATUSES = new Set<AccreditationStatusType>(['APPROVED']);

/** Static documents list for DocuSign */
const DOCUMENTS_TO_SIGN: DocumentItem[] = [
  { id: 'doc-ppm', name: 'Private Placement Memorandum (PPM)' },
  { id: 'doc-risk-acknowledgment', name: 'Risk & Transfer Restriction Acknowledgment' },
  { id: 'doc-subscription-agreement', name: 'Subscription Agreement' },
];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Calculate current step based on status response
 * @param status - KYC status response from API
 * @returns Current step number (0-3)
 */
export const calculateVerificationStep = (status: KYCStatusResponse): VerificationStep => {
  const isAccreditationApproved =
    status.accreditationStatus && APPROVED_ACCREDITATION_STATUSES.has(status.accreditationStatus);

  // Step 3: All complete
  if (status.isDocuSignComplete || status.documentSignedStatus) {
    return VERIFICATION_STEPS.COMPLETED;
  }

  // Step 2: Accreditation approved, DocuSign pending
  if (status.isAccreditationAccountCreated && isAccreditationApproved) {
    return VERIFICATION_STEPS.DOCUSIGN;
  }

  // Step 1: KYC complete, Accreditation pending
  if (status.isKYCComplete) {
    return VERIFICATION_STEPS.ACCREDITATION;
  }

  // Step 0: KYC pending
  return VERIFICATION_STEPS.KYC;
};

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Document Card Component
 * Displays a single document in the DocuSign dialog
 */
const DocumentCard = ({ name }: { name: string }) => (
  <CornerContainer sx={{ p: 2, cursor: 'pointer' }}>
    <Box
      sx={{
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AtomTypography name="document-icon" variant="body2" color="text.secondary">
          📄
        </AtomTypography>
      </Box>
      <AtomTypography name="document-name" variant="body2" fontWeight={500} sx={{ flex: 1 }}>
        {name}
      </AtomTypography>
    </Box>
  </CornerContainer>
);

// =============================================================================
// Main Component
// =============================================================================

/** Step name mapping for callbacks */
const STEP_NAMES: Record<VerificationStep, string> = {
  [VERIFICATION_STEPS.KYC]: 'KYC',
  [VERIFICATION_STEPS.ACCREDITATION]: 'ACCREDITATION',
  [VERIFICATION_STEPS.DOCUSIGN]: 'DOCUSIGN',
  [VERIFICATION_STEPS.COMPLETED]: 'COMPLETED',
};

/**
 * VerificationButton Component
 *
 * A reusable button that handles the complete verification flow:
 * KYC (Persona) → Accreditation (Navigation) → DocuSign (Dialog + Redirect)
 *
 * This component only renders a button and associated dialogs/containers.
 * Parent components should handle step indicators, titles, and descriptions.
 *
 * Supports imperative control via ref for programmatic triggering:
 * - triggerVerification() - Programmatically trigger verification based on current step
 * - getCurrentStep() - Get current verification step
 * - isVerificationComplete() - Check if all steps are complete
 *
 * @param props - VerificationButtonProps
 * @param ref - Optional ref for imperative handle
 * @returns React component with button and dialogs
 */
const VerificationButton = forwardRef<VerificationButtonHandle, VerificationButtonProps>(
  function VerificationButton(
    {
      statusData,
      buttonLabel,
      disabled = false,
      onComplete,
      onCancel,
      onError,
      fullWidth = false,
      size = 'medium',
      sx,
      hideButton = false,
      onVerificationRequired,
    },
    ref
  ) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  // Redux state for DocuSign flow
  const { isStartingDocuSign, isFetchingSigningUrl, signingUrl, tradeId } = useSelector(
    (state: RootState) => state.accreditation
  );

  // =============================================================================
  // Local State
  // =============================================================================

  // Dialog states
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false);
  const [docuSignUrl, setDocuSignUrl] = useState<string | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingConfig, setIsFetchingConfig] = useState(false);

  // Data states
  const [kycConfig, setKycConfig] = useState<KYCSessionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const personaInitializedRef = useRef(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  // =============================================================================
  // Computed Values
  // =============================================================================

  /** Current verification step (0-3) */
  const currentStep = useMemo(() => {
    if (!statusData) return VERIFICATION_STEPS.KYC;
    return calculateVerificationStep(statusData);
  }, [statusData]);

  /** Whether all verification steps are completed */
  const isAllStepsCompleted = currentStep === VERIFICATION_STEPS.COMPLETED;

  // =============================================================================
  // Imperative Handle
  // =============================================================================

  /**
   * Trigger verification flow programmatically
   * Called by parent components to initiate verification based on current step
   * @param freshStatus - Optional fresh KYC status to use (avoids stale state issues)
   * @returns Promise with verification result
   */
  const triggerVerificationFlow = useCallback(
    async (freshStatus?: KYCStatusResponse): Promise<VerificationTriggerResult> => {
      // Calculate step from fresh status if provided, otherwise use current step
      const effectiveStep = freshStatus
        ? calculateVerificationStep(freshStatus)
        : currentStep;

      const isComplete = effectiveStep === VERIFICATION_STEPS.COMPLETED;

      // If all steps are complete, return immediately
      if (isComplete) {
        return {
          isComplete: true,
          currentStep: VERIFICATION_STEPS.COMPLETED,
          actionTriggered: false,
        };
      }

      // Notify parent that verification is required
      onVerificationRequired?.(effectiveStep, STEP_NAMES[effectiveStep]);

      // Trigger the appropriate action based on effective step
      switch (effectiveStep) {
        case VERIFICATION_STEPS.KYC:
          // Open KYC dialog
          setKycDialogOpen(true);
          setError(null);
          setIsFetchingConfig(true);
          setKycConfig(null);
          personaInitializedRef.current = false;
          return {
            isComplete: false,
            currentStep: VERIFICATION_STEPS.KYC,
            actionTriggered: true,
          };

        case VERIFICATION_STEPS.ACCREDITATION:
          // Navigate to accreditation page
          router.push(paths.dashboard.accreditation);
          return {
            isComplete: false,
            currentStep: VERIFICATION_STEPS.ACCREDITATION,
            actionTriggered: true,
          };

        case VERIFICATION_STEPS.DOCUSIGN:
          // Start DocuSign flow and get signing URL
          try {
            const docuSignStartPayload: DocuSignStartPayload = {
              type: 'ACH',
              units: '1',
            };

            await dispatch(docuSignStartThunk(docuSignStartPayload)).unwrap();
            setDocumentsDialogOpen(true);
            return {
              isComplete: false,
              currentStep: VERIFICATION_STEPS.DOCUSIGN,
              actionTriggered: true,
            };
          } catch (err: unknown) {
            const errorMessage = handleServiceError(err, 'Failed to initiate document signing');
            showErrorToast('trade-error', errorMessage);
            return {
              isComplete: false,
              currentStep: VERIFICATION_STEPS.DOCUSIGN,
              actionTriggered: false,
            };
          }

        default:
          return {
            isComplete: true,
            currentStep: VERIFICATION_STEPS.COMPLETED,
            actionTriggered: false,
          };
      }
    },
    [currentStep, router, dispatch, onVerificationRequired]
  );

  /**
   * Expose imperative methods via ref
   */
  useImperativeHandle(
    ref,
    () => ({
      triggerVerification: (freshStatus?: KYCStatusResponse) => triggerVerificationFlow(freshStatus),
      getCurrentStep: (freshStatus?: KYCStatusResponse) => {
        if (freshStatus) {
          return calculateVerificationStep(freshStatus);
        }
        return currentStep;
      },
      isVerificationComplete: (freshStatus?: KYCStatusResponse) => {
        if (freshStatus) {
          return calculateVerificationStep(freshStatus) === VERIFICATION_STEPS.COMPLETED;
        }
        return isAllStepsCompleted;
      },
    }),
    [triggerVerificationFlow, currentStep, isAllStepsCompleted]
  );

  /** Whether the button should be disabled */
  const isButtonDisabled = useMemo(() => {
    // Disabled if explicitly disabled via prop
    if (disabled) return true;

    // Disabled if any dialog is open or loading
    if (kycDialogOpen || documentsDialogOpen || isLoading || isFetchingConfig) return true;

    // Disabled if DocuSign flow or signing URL is being fetched
    if (isStartingDocuSign || isFetchingSigningUrl) return true;

    // Disabled if all steps complete
    if (isAllStepsCompleted) return true;

    return false;
  }, [
    disabled,
    kycDialogOpen,
    documentsDialogOpen,
    isLoading,
    isFetchingConfig,
    isStartingDocuSign,
    isFetchingSigningUrl,
    isAllStepsCompleted,
  ]);

  // =============================================================================
  // KYC (Persona) Handlers
  // =============================================================================

  /**
   * Fetch KYC config when dialog opens
   */
  useEffect(() => {
    if (!kycDialogOpen) return;

    const fetchConfig = async () => {
      try {
        setIsFetchingConfig(true);
        setError(null);
        const config = await fetchKYCSession();
        setKycConfig(config);
      } catch (err: unknown) {
        const errorMessage = handleServiceError(err, 'Failed to fetch KYC configuration');
        console.error('❌ Error fetching KYC config:', err);
        setError(errorMessage);
        onError?.(err);
      } finally {
        setIsFetchingConfig(false);
      }
    };

    fetchConfig();
  }, [kycDialogOpen, onError]);

  /**
   * Initialize Persona SDK when config is ready
   */
  useEffect(() => {
    const isDialogNotReady = !kycDialogOpen || !containerRef.current || !kycConfig;
    const isAlreadyInitializedOrHasError = personaInitializedRef.current || error || isFetchingConfig;
    const shouldSkipInitialization = isDialogNotReady || isAlreadyInitializedOrHasError;

    if (shouldSkipInitialization) return;
    if (scriptRef.current) return;

    personaInitializedRef.current = true;
    setIsLoading(true);

    const script = document.createElement('script');
    script.src = PERSONA_SCRIPT_URL;
    script.async = true;
    script.crossOrigin = 'anonymous';
    scriptRef.current = script;

    script.onload = () => {
      setIsLoading(false);

      // @ts-ignore — Persona script loads globally
      const Persona = globalThis.Persona;
      if (!Persona) {
        setError('Failed to load Persona SDK');
        setIsLoading(true);
        return;
      }

      try {
        const client = new Persona.Client({
          templateId: kycConfig.templateId,
          environmentId: kycConfig.environmentId,
          referenceId: kycConfig.referenceId,
          frameParent: containerRef.current,
          onComplete: async ({ inquiryId, status, fields }: { inquiryId: string; status: string; fields?: unknown }) => {
            handleKYCComplete({ inquiryId, status, fields });
          },
          onCancel: () => handleKYCCancel(),
          onError: (err: unknown) => {
            console.error('⚠️ Persona error:', err);
            onError?.(err);
          },
        });

        client.open();
      } catch (err) {
        setError('Failed to initialize verification');
        setIsLoading(true);
        onError?.(err);
      }
    };

    script.onerror = () => {
      setError('Failed to load verification system');
      setIsLoading(true);
      scriptRef.current = null;
    };

    document.body.appendChild(script);

    return () => {
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
    };
  }, [kycConfig, isFetchingConfig, error, kycDialogOpen, onError]);

  /**
   * Close KYC dialog and cleanup
   */
  const closeKYCDialog = useCallback(() => {
    setKycDialogOpen(false);
    if (scriptRef.current && document.body.contains(scriptRef.current)) {
      scriptRef.current.remove();
      scriptRef.current = null;
    }
    setKycConfig(null);
    setError(null);
    setIsLoading(false);
    setIsFetchingConfig(false);
    personaInitializedRef.current = false;
  }, []);

  /**
   * Handle KYC completion
   * Only shows success toast if status indicates successful completion
   */
  const handleKYCComplete = useCallback(
    (data: { inquiryId: string; status: string; fields?: unknown }) => {
      dispatch(setInquiryId(data.inquiryId));

      // Only show success toast for successful completion status
      if (data.status === 'completed') {
        showSuccessToast('kyc-complete', 'KYC verification completed. Please complete your accreditation.');
        // Update status to reflect KYC completion
        if (statusData) {
          statusData.isKYCComplete = true;
        }
      }

      closeKYCDialog();
      onComplete?.(data);
    },
    [dispatch, closeKYCDialog, onComplete, statusData]
  );

  /**
   * Handle KYC cancellation
   */
  const handleKYCCancel = useCallback(() => {
    closeKYCDialog();
    onCancel?.();
  }, [closeKYCDialog, onCancel]);

  // =============================================================================
  // DocuSign Handlers
  // =============================================================================

  /**
   * Close documents dialog
   */
  const closeDocumentsDialog = useCallback(() => {
    setDocumentsDialogOpen(false);
    setDocuSignUrl(null);
  }, []);

  /**
   * Open DocuSign for document signing
   * Uses the signing URL fetched from Redux state
   */
  const handleOpenDocuSign = useCallback(async () => {
    try {
      // Get DocuSign signing URL if tradeId exists
      if (tradeId) {
        const urlResult = await dispatch(docuSignGetUrlThunk()).unwrap();

        if (urlResult.signingUrl) {
          setDocuSignUrl(urlResult.signingUrl);
          window.open(urlResult.signingUrl, '_blank');
          closeDocumentsDialog();
          return;
        }
      }

      // Fallback to existing URLs in state
      const urlToOpen = docuSignUrl ?? signingUrl;
      if (urlToOpen) {
        window.open(urlToOpen, '_self');
        closeDocumentsDialog();
      } else {
        showErrorToast('signing-error', 'Signing URL not available. Please try again.');
      }
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : 'Failed to get signing URL. Please try again.';
      showErrorToast('docusign-error', errorMessage);
    }
  }, [dispatch, tradeId, docuSignUrl, signingUrl, closeDocumentsDialog]);

  // =============================================================================
  // Main Button Click Handler
  // =============================================================================

  /**
   * Handle main button click based on current step
   */
  const handleButtonClick = useCallback(async () => {
    switch (currentStep) {
      case VERIFICATION_STEPS.KYC:
        // Open KYC dialog
        setKycDialogOpen(true);
        setError(null);
        setIsFetchingConfig(true);
        setKycConfig(null);
        personaInitializedRef.current = false;
        break;

      case VERIFICATION_STEPS.ACCREDITATION:
        // Navigate to accreditation page
        router.push(paths.dashboard.accreditation);
        break;

      case VERIFICATION_STEPS.DOCUSIGN:
        // Start DocuSign flow and get signing URL
        try {
          const docuSignStartPayload: DocuSignStartPayload = {
            type: 'ACH',
            units: '1',
          };

          await dispatch(docuSignStartThunk(docuSignStartPayload)).unwrap();
          setDocumentsDialogOpen(true);
        } catch (err: unknown) {
          const errorMessage = handleServiceError(err, 'Failed to initiate document signing');
          showErrorToast('trade-error', errorMessage);
        }
        break;

      case VERIFICATION_STEPS.COMPLETED:
        // All complete
        showSuccessToast('all-complete', 'All verification steps completed!');
        break;
    }
  }, [currentStep, router, dispatch]);

  // =============================================================================
  // Render Helpers
  // =============================================================================

  /**
   * Render document content for DocuSign dialog
   */
  const renderDocumentContent = useMemo(
    () => (
      <Stack spacing={3}>
        {/* Success Banner */}
        <CornerContainer sx={{ p: 2, borderColor: 'success.light' }}>
          <AtomTypography name="kyc-accreditation-completed" variant="body2" color="success.dark" fontWeight={600}>
            {t('kyc:kycAccreditationCompleted')}
          </AtomTypography>
        </CornerContainer>

        {/* Instructions */}
        <AtomTypography name="kyc-instructions" variant="body4" color="text.primary">
          {t('kyc:docuSignInstructions')}
        </AtomTypography>

        {/* Documents List */}
        <Box>
          <AtomTypography name="documents-to-sign" variant="body2" color="text.primary" fontWeight={600} sx={{ mb: 1.5 }}>
            {t('kyc:documentsToSign')}
          </AtomTypography>
          <Stack spacing={1.5}>
            {DOCUMENTS_TO_SIGN.map((doc) => (
              <DocumentCard key={doc.id} name={doc.name} />
            ))}
          </Stack>
        </Box>

        {/* Sign Button */}
        <AtomButton
          id="open-docusign-button"
          label={t('kyc:openDocuSign')}
          onClick={handleOpenDocuSign}
          variant="contained"
          color="primary"
          fullWidth
          isLoading={isFetchingSigningUrl}
          disabled={isFetchingSigningUrl}
          sx={{ py: 1.5 }}
        />

        {/* Info Note */}
        <CornerContainer sx={{ p: 2 }}>
          <AtomTypography name="documents-info" variant="body4" color="info.dark">
            {t('kyc:docuSignInfoNote')}
          </AtomTypography>
        </CornerContainer>
      </Stack>
    ),
    [handleOpenDocuSign, isFetchingSigningUrl, t]
  );

  // =============================================================================
  // Render
  // =============================================================================

  return (
    <>
      {/* Main Verification Button - conditionally rendered */}
      {!hideButton && (
        <AtomButton
          id="verification-action-button"
          label={buttonLabel}
          onClick={handleButtonClick}
          variant="contained"
          size={size}
          disabled={isButtonDisabled}
          fullWidth={fullWidth}
          isLoading={isLoading || isFetchingConfig || isStartingDocuSign}
          sx={sx}
        />
      )}

      {/* KYC Persona Embed Container */}
      {kycDialogOpen && <Box ref={containerRef} />}

      {/* DocuSign Documents Dialog */}
      <ConfirmActionModal
        open={documentsDialogOpen}
        onClose={closeDocumentsDialog}
        onConfirm={closeDocumentsDialog}
        title="Complete Document Signing"
        description={renderDocumentContent}
        isLoading={false}
      />
    </>
  );
  }
);

export default VerificationButton;

