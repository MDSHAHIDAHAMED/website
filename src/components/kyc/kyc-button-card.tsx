'use client';

/**
 * KYCButtonCard Component
 * =======================
 * A reusable card component for displaying verification progress and actions.
 * Used in the multi-step verification flow: KYC → Accreditation → DocuSign
 *
 * Features:
 * - Progress indicator with step tracking
 * - Dynamic button states (active, disabled, completed)
 * - Responsive layout
 * - Theme-consistent styling
 */

import { AtomButton } from '@/components/atoms/button';
import CornerContainer from '@/components/atoms/corner-container';
import AtomProgressBar from '@/components/atoms/progress';
import AtomTypography from '@/components/atoms/typography';
import { Box, type SxProps, type Theme } from '@mui/material';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// =============================================================================
// Types & Interfaces
// =============================================================================

/**
 * Button variant based on current step state
 */
type ButtonVariant = 'active' | 'pending' | 'completed';

/**
 * KYCButtonCard Props Interface
 */
interface KYCButtonCardProps {
  /** Current step number (0-based internally, displayed as 1-based) */
  currentStep?: number;
  /** Total number of steps in the verification flow */
  totalSteps?: number;
  /** Card title text */
  title?: string;
  /** Card description text */
  description?: string;
  /** Button label text */
  buttonLabel?: string;
  /** Callback when button is clicked */
  onButtonClick?: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Optional custom button variant override */
  buttonVariant?: ButtonVariant;
  /** Optional custom button component to render instead of default AtomButton */
  customButton?: React.ReactNode;
}

// =============================================================================
// Constants & Styles
// =============================================================================

/** Container gradient background */
// @narayan please use src\styles\theme\colors.ts for constructing this color ranges, objects, etc. And then use them in src\styles\theme\color-schemes.ts. If any confusion ask from me.
const CONTAINER_BACKGROUND = 'radial-gradient(ellipse at left top, #171717 0%, #171717 55%, #000000 100%, #000000 100%)';

/** Container styles */
const CONTAINER_SX: SxProps<Theme> = {
  background: CONTAINER_BACKGROUND,
  p: { xs: 3, sm: 4, md: 3 },
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  borderRight: 'none',
  borderBottom: 'none',
};

/** Header section styles */
const HEADER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  justifyContent: 'space-between',
  alignItems: { xs: 'flex-start', sm: 'center' },
  gap: { xs: 2, sm: 3 },
};

/** Progress section styles */
const PROGRESS_SECTION_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
};

/** Step indicator styles */
const STEP_INDICATOR_SX: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  flexShrink: 0,
};

/** Step text styles */
const STEP_TEXT_SX: SxProps<Theme> = {
  fontSize: '14px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
};

// =============================================================================
// Component
// =============================================================================

/**
 * KYCButtonCard Component
 *
 * Displays verification progress with a call-to-action button.
 * Automatically adjusts styling based on current step and completion state.
 *
 * @example
 * ```tsx
 * <KYCButtonCard
 *   currentStep={1}
 *   totalSteps={3}
 *   title="Complete Accreditation"
 *   description="Please complete your accreditation verification."
 *   buttonLabel="COMPLETE ACCREDITATION"
 *   onButtonClick={handleClick}
 * />
 * ```
 */
export function KYCButtonCard({
  currentStep = 0,
  totalSteps = 3,
  title,
  description,
  buttonLabel,
  onButtonClick,
  disabled = false,
  customButton,
}: Readonly<KYCButtonCardProps>): React.JSX.Element {
  // ===========================================================================
  // Hooks
  // ===========================================================================

  const { t } = useTranslation();
  // ===========================================================================
  // Computed Values
  // ===========================================================================

  // Localized default values
  const localizedTitle = title ?? t('kyc:completeKyc');
  const localizedDescription = description ?? t('kyc:completeKycDescription');
  const localizedButtonLabel = buttonLabel ?? t('kyc:completeKycButton');

  /**
   * Calculate progress percentage (0-100)
   * Uses 1-based step for display (currentStep + 1)
   */
  const progressValue = useMemo(() => {
    const displayStep = currentStep + 1;
    return Math.min((displayStep / totalSteps) * 100, 100);
  }, [currentStep, totalSteps]);

  /**
   * Display step number (1-based for user-friendly display)
   */
  const displayStep = useMemo(() => Math.min(currentStep + 1, totalSteps), [currentStep, totalSteps]);

  /**
   * Check if all steps are completed
   */
  const isCompleted = useMemo(() => currentStep >= totalSteps, [currentStep, totalSteps]);

  /**
   * Button ID for accessibility and testing
   */
  const buttonId = useMemo(() => {
    const stepName = ['kyc', 'accreditation', 'docusign', 'completed'][currentStep] ?? 'verification';
    return `${stepName}-action-button`;
  }, [currentStep]);

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <CornerContainer height="auto" sx={CONTAINER_SX}>
      {/* Header: Title + Action Button */}
      <Box sx={HEADER_SX}>
        <AtomTypography variant="body5" color="text.primary">
          {localizedTitle}
        </AtomTypography>

        {/* Render custom button if provided, otherwise use default AtomButton */}
        {customButton ?? (
          <AtomButton
            id={buttonId}
            label={localizedButtonLabel}
            onClick={onButtonClick}
            variant="contained"
            size="medium"
            disabled={disabled || isCompleted}
          />
        )}
      </Box>

      {/* Description */}
      <AtomTypography variant="subtitle3" sx={{ color: 'var(--mui-palette-neutral-400)' }}>
        {localizedDescription}
      </AtomTypography>

      {/* Progress Section */}
      <Box sx={PROGRESS_SECTION_SX}>
        {/* Progress Bar */}
        <Box sx={{ flex: 2 }}>
          <AtomProgressBar
            id="verification-progress-bar"
            value={progressValue}
            format="percentage"
            showLabel={false}
            visualVariant="segmented"
          />
        </Box>

        {/* Step Indicator */}
        <Box sx={STEP_INDICATOR_SX}>
          <AtomTypography variant="caption2" color="text.secondary" sx={STEP_TEXT_SX}>
            {t('kyc:step')} {displayStep} {t('kyc:of')} {totalSteps}
          </AtomTypography>
        </Box>
      </Box>
    </CornerContainer>
  );
}

export default KYCButtonCard;
