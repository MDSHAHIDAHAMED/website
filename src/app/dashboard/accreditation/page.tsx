'use client';

import { Box, IconButton, Stack, Step, StepLabel, Stepper } from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { Check } from '@phosphor-icons/react/dist/ssr/Check';
import * as React from 'react';

import { AtomButton } from '@/components/atoms/button';
import CornerContainer from '@/components/atoms/corner-container';
import AtomPhoneInput from '@/components/atoms/phone-input';
import AtomTypography from '@/components/atoms/typography';
import { FileDropzone, type File } from '@/components/core/file-dropzone';
import DatePickerWithLabel from '@/components/molecules/date-picker-with-label';
import InputWithLabel from '@/components/molecules/input-with-label';
import SelectWithLabel from '@/components/molecules/select-with-label';
import {
  DOCUMENT_REQUIREMENTS,
  FieldConfig,
  FORM_FIELD_STYLES,
  FORM_ROW_STYLES,
  FORM_SECTIONS,
  FULL_WIDTH_FIELD_STYLES,
  SectionConfig,
  STEPS
} from '@/constants/networth-accrediation';
import FormProvider from '@/contexts/form-provider';
import { useAccreditation } from '@/hooks/use-accreditation';
import { usePhoneInput } from '@/hooks/use-phone-input';
import { yieldzNeutral, yieldzPrimary } from '@/styles/theme/colors';

// =============================================================================
// CUSTOM STEPPER ICON
// =============================================================================

/**
 * Custom step icon component compatible with MUI StepLabel
 * Receives active, completed, and icon (step number) from MUI Stepper
 */
interface CustomStepIconProps {
  active?: boolean;
  completed?: boolean;
  icon: React.ReactNode; // MUI passes the step number as 'icon'
}

function CustomStepIcon({ active, completed, icon }: Readonly<CustomStepIconProps>): React.JSX.Element {
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: completed || active ? yieldzPrimary[500] : yieldzNeutral[700],
        color: completed || active ? '#000' : yieldzNeutral[400],
        fontWeight: 600,
        fontSize: '14px',
        transition: 'all 0.3s ease',
      }}
    >
      {completed ? <Check size={18} weight="bold" /> : icon}
    </Box>
  );
}

// =============================================================================
// CONDITIONAL ADDRESS FIELDS (Based on domicile)
// =============================================================================

/** Fields that are always optional (no asterisk) */
const OPTIONAL_FIELDS = new Set(['streetAddress2']);

// =============================================================================
// FIELD RENDERER
// =============================================================================

/**
 * FieldRenderer Component
 * Renders individual form fields based on their type
 * @param field - Field configuration object
 * @param disabled - Whether the field should be disabled (e.g., during form submission)
 */
const FieldRenderer = React.memo(function FieldRenderer({
  field,
  disabled = false
}: {
  field: FieldConfig;
  disabled?: boolean;
}): React.JSX.Element {
  const { handlePhoneChange } = usePhoneInput();

  // Check if this field is always optional (no asterisk)
  const isOptionalField = OPTIONAL_FIELDS.has(field.name);

  // Field is required unless it's in the optional fields list
  const isFieldRequired = !isOptionalField;

  switch (field.type) {
    case 'phone':
      return (
        <AtomPhoneInput
          id={field.name}
          name={field.name}
          placeholder={field.placeholder}
          countryLabel={field.countryLabel}
          phoneLabel={field.phoneLabel}
          defaultCountry="us"
          variant="outlined"
          validatePhone
          required
          disabled={disabled}
          onPhoneChange={handlePhoneChange}
        />
      );
    case 'date':
      return (
        <DatePickerWithLabel
          id={field.name}
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          format={field.format}
          disableFuture={field.disableFuture}
          disablePast={field.disablePast}
          required
          disabled={disabled}
          variant="standard"
        />
      );
    case 'select':
      return (
        <SelectWithLabel
          id={field.name}
          name={field.name}
          label={field.label}
          options={field.options}
          placeholder={field.placeholder}
          required={isFieldRequired}
          disabled={disabled}
          showPersistentLabel={true}
        />
      );
    default:
      return (
        <InputWithLabel
          id={field.name}
          name={field.name}
          label={field.label}
          type={field.type}
          readOnly={field.type === 'email'}
          disabled={disabled}
          variant="standard"
          placeholder={field.placeholder}
          required={isFieldRequired}
        />
      );
  }
});

// =============================================================================
// SECTION RENDERER
// =============================================================================

/**
 * SectionRenderer Component
 * Renders a form section with title and fields
 * @param section - Section configuration object
 * @param disabled - Whether all fields in this section should be disabled
 */
const SectionRenderer = React.memo(function SectionRenderer({
  section,
  disabled = false,
}: {
  section: SectionConfig;
  disabled?: boolean;
}): React.JSX.Element {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ mb: 2 }}>
        <AtomTypography variant="h4" color="text.primary" sx={{ fontWeight: 615 }} >
          {section.title}
        </AtomTypography>
      </Box>
      <CornerContainer sx={{ p: 2 }}>
        <Stack spacing={3}>
          {section.fields.map((row, rowIndex) => (
            <Box key={`${section.title}-row-${rowIndex}`} sx={FORM_ROW_STYLES}>
              {row.map((field) => (
                <Box key={field.name} sx={field.fullWidth ? FULL_WIDTH_FIELD_STYLES : FORM_FIELD_STYLES}>
                  <FieldRenderer field={field} disabled={disabled} />
                </Box>
              ))}
              {/* Placeholder for single field rows to maintain grid */}
              {row.length === 1 && !row[0].fullWidth && (
                <Box sx={{ ...FORM_FIELD_STYLES, display: { xs: 'none', md: 'block' } }} />
              )}
            </Box>
          ))}
        </Stack>
      </CornerContainer>
    </Box>
  );
});

// =============================================================================
// STEP 1: ACCOUNT INFORMATION FORM
// =============================================================================

interface Step1Props {
  isSubmitting: boolean;
  onCancel: () => void;
}

const Step1AccountForm = React.memo(function Step1AccountForm({
  isSubmitting,
  onCancel,
}: Step1Props): React.JSX.Element {
  return (
    <Stack spacing={1}>
      {FORM_SECTIONS.map((section) => (
        <SectionRenderer key={section.title} section={section} disabled={isSubmitting} />
      ))}
      <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
        <AtomButton
          id="accreditation-cancel-button"
          label="Cancel"
          variant="contained"
          color="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          size="medium"
        />
        <AtomButton
          id="accreditation-next-button"
          type="submit"
          label={isSubmitting ? 'Creating Account...' : 'Continue'}
          variant="contained"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          size="medium"
        />
      </Stack>
    </Stack>
  );
});

// =============================================================================
// STEP 2: DOCUMENT UPLOAD
// =============================================================================

interface Step2Props {
  files: File[];
  fileError: string;
  isSubmitting: boolean;
  uploadProgress: number; // 0-100 percentage
  showBackButton?: boolean; // Whether to show the back button
  onFilesChange: (files: File[]) => void;
  onRemoveFile: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

const Step2DocumentUpload = React.memo(function Step2DocumentUpload({
  files,
  fileError,
  isSubmitting,
  uploadProgress,
  showBackButton = true,
  onFilesChange,
  onRemoveFile,
  onBack,
  onSubmit,
}: Step2Props): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <CornerContainer sx={{ p: 3 }}>
        <Stack spacing={0}>
          <AtomTypography variant="h5" color="text.primary" sx={{ fontWeight: 615, mb: 2 }}>
            Verification Document
          </AtomTypography>
          <AtomTypography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
            Upload documentation to verify your Accredited Investor status. Accepted documents include{' '}
            <strong>
              W2s, 1099s, tax returns, account statements, or a letter from a licensed CPA, Attorney, or Investment
              Advisor.
            </strong>
          </AtomTypography>
          <AtomTypography variant="subtitle1" color="text.primary">
            Document Requirements:
          </AtomTypography>
          <Stack component="ul" spacing={0.5} sx={{ pl: 2, mb: 3 }}>
            {DOCUMENT_REQUIREMENTS.map((req) => (
              <AtomTypography key={req} component="li" variant="subtitle2" color="text.secondary">
                {req}
              </AtomTypography>
            ))}
          </Stack>
          <FileDropzone
            files={files}
            onFilesChange={onFilesChange}
            onRemove={onRemoveFile}
            error={fileError}
            disabled={isSubmitting}
            multiple={false}
          />


        </Stack>
      </CornerContainer>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        {/* Back Button - Left side */}
        {showBackButton && (
          <AtomButton
            id="accreditation-back-button"
            label="Back"
            variant="contained"
            color="secondary"
            onClick={onBack}
            disabled={isSubmitting}
            size="medium"
          />
        )}

        {/* Submit Button - Right side */}
        <AtomButton
          id="accreditation-submit-button"
          label={isSubmitting ? 'Uploading...' : 'Submit Document'}
          variant="contained"
          onClick={onSubmit}
          disabled={isSubmitting || files.length === 0}
          isLoading={isSubmitting}
          size="medium"
        />
      </Stack>
    </Stack>
  );
});

// =============================================================================
// LOADING STATE
// =============================================================================

const LoadingState = React.memo(function LoadingState(): React.JSX.Element {
  return (
    <Box
      sx={{
        py: 4,
        px: { xs: 2, md: 2 },
        bgcolor: 'background.default',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Box
          sx={{
            width: 40,
            height: 40,
            border: `3px solid ${yieldzNeutral[700]}`,
            borderTopColor: yieldzPrimary[500],
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
        <AtomTypography variant="subtitle2" color="text.secondary">
          Checking accreditation status...
        </AtomTypography>
      </Stack>
    </Box>
  );
});

// =============================================================================
// PAGE HEADER
// =============================================================================

interface PageHeaderProps {
  activeStep: number;
  onBack: () => void;
}

const PageHeader = React.memo(function PageHeader({ activeStep, onBack }: PageHeaderProps): React.JSX.Element {
  const subtitle = activeStep === 0
    ? 'Step 1: Complete your account information'
    : 'Step 2: Upload your verification document';

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
      <IconButton onClick={onBack} sx={{ color: 'text.primary' }}>
        <ArrowLeft size={24} />
      </IconButton>
      <Stack>
        <AtomTypography variant="h5" color="text.primary" sx={{ fontWeight: 615 }}>
          Accreditation Verification
        </AtomTypography>
        <AtomTypography variant="subtitle2" color="text.secondary">
          {subtitle}
        </AtomTypography>
      </Stack>
    </Stack>
  );
});

// =============================================================================
// PROGRESS STEPPER
// =============================================================================

interface ProgressStepperProps {
  activeStep: number;
}

const ProgressStepper = React.memo(function ProgressStepper({ activeStep }: ProgressStepperProps): React.JSX.Element {
  return (
    <Box sx={{ mb: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {STEPS.map((label, index) => (
          <Step key={label} completed={activeStep > index}>
            <StepLabel
              StepIconComponent={CustomStepIcon}
              sx={{
                '& .MuiStepLabel-label': {
                  color: activeStep >= index ? 'text.primary' : 'text.secondary',
                  fontWeight: activeStep === index ? 600 : 400,
                  mt: 1,
                  fontSize: '14px',
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
});

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * AccreditationPage Component
 *
 * A two-step stepper form for NorthCapital accreditation:
 * - Step 1: Fill account & personal information -> Create party/account via API
 * - Step 2: Upload verification document -> Submit document via API
 */
export default function AccreditationPage(): React.JSX.Element {
  const {
    activeStep,
    isSubmitting,
    isLoadingStatus,
    accreditationFile,
    fileError,
    uploadProgress,
    methods,
    handleStep1Submit,
    handleStep2Submit,
    handleFilesChange,
    handleRemoveFile,
    handleBack,
    handleCancel,
  } = useAccreditation();

  if (isLoadingStatus) {
    return <LoadingState />;
  }

  return (
    <Box sx={{ py: 4, minHeight: '100vh' }}>
      <PageHeader activeStep={activeStep} onBack={handleCancel} />
      <ProgressStepper activeStep={activeStep} />

      {activeStep === 0 ? (
        <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleStep1Submit)}>
          <Step1AccountForm isSubmitting={isSubmitting} onCancel={handleCancel} />
        </FormProvider>
      ) : (
        <Step2DocumentUpload
          files={accreditationFile}
          fileError={fileError}
          isSubmitting={isSubmitting}
          uploadProgress={uploadProgress}
          onFilesChange={handleFilesChange}
          onRemoveFile={handleRemoveFile}
          onBack={handleBack}
          onSubmit={handleStep2Submit}
        />
      )}
    </Box>
  );
}
