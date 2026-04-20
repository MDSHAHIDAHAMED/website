'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  ACCOUNT_TYPE_OPTIONS,
  ACCREDITATION_DEFAULT_VALUES,
  AccreditationFormData,
  accreditationSchema,
  DOMESTIC_OPTIONS,
  DOMICILE_OPTIONS,
  ENTITY_TYPE_OPTIONS
} from '@/constants/networth-accrediation';
import { useUser } from '@/hooks/use-user';
import { checkKYCStatus, KYCStatusResponse } from '@/services/kyc';
import { useDispatch, useSelector, type RootState } from '@/store';
import {
  createPartyAndAccountThunk,
  getAccountInformationThunk,
  uploadAccreditationDocumentThunk,
  type CreatePartyAccountPayload,
} from '@/store/thunks/accreditation-thunk';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

// =============================================================================
// TYPES
// =============================================================================

interface AccountIds {
  partyId: string | null;
  accountId: string | null;
}

interface UseAccreditationReturn {
  // State
  activeStep: number;
  isSubmitting: boolean;
  isLoadingStatus: boolean;
  accreditationFile: File[];
  fileError: string;
  uploadProgress: number; // 0-100 percentage for file upload

  // Form
  methods: ReturnType<typeof useForm<AccreditationFormData>>;

  // Handlers
  handleStep1Submit: (data: AccreditationFormData) => Promise<void>;
  handleStep2Submit: () => Promise<void>;
  handleFilesChange: (files: File[]) => void;
  handleRemoveFile: () => void;
  handleBack: () => void;
  handleCancel: () => void;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Transform form data to API payload format
 * Converts select objects to string values
 * Country/State/City are optional for non-US domicile
 */
const transformFormDataToPayload = (data: AccreditationFormData): CreatePartyAccountPayload => ({
  accountRegistration: data.accountRegistration,
  type: String(data.type?.value ?? ''),
  domesticYN: String(data.domesticYN?.value ?? ''),
  entityType: data.entityType?.value ? String(data.entityType.value) : undefined,
  firstName: data.firstName,
  lastName: data.lastName,
  dob: data.dob,
  domicile: String(data.domicile?.value ?? ''),
  occupation: data.occupation,
  email: data.email,
  phone: data.phone,
  primCity: data.city,
  streetAddress1: data.streetAddress1,
  streetAddress2: data.streetAddress2,
  country: data.country?.label || '', // Optional for non-US domicile
  state: data.state?.label || '', // Optional for non-US domicile
  city: data.city || '', // Optional for non-US domicile
  zip: data.zip,
});

/**
 * Find matching option from options array by value
 * Case-insensitive comparison
 */
const findOption = <T extends { value: string | number; }>(
  options: readonly T[],
  value: string | null | undefined
): T | undefined => {
  if (!value) return undefined;
  return options.find((opt) => String(opt.value).toLowerCase() === value.toLowerCase());
};

/** Account info type from Redux state */
type AccountInfo = NonNullable<RootState['accreditation']['accountInformation']>;

/** Form methods type */
type FormMethods = ReturnType<typeof useForm<AccreditationFormData>>;

/**
 * Set simple string fields on the form
 */
const setStringFields = (accountInfo: AccountInfo, methods: FormMethods): void => {
  const opts = { shouldValidate: false };

  methods.setValue('firstName', accountInfo.firstName || '', opts);
  methods.setValue('accountRegistration', accountInfo.accountName || '', opts);
  methods.setValue('lastName', accountInfo.lastName || '', opts);
  methods.setValue('dob', accountInfo.dob || '', opts);
  methods.setValue('occupation', accountInfo.occupation || '', opts);
  methods.setValue('email', accountInfo.emailAddress || '', opts);
  methods.setValue('phone', accountInfo.phone || '', opts);
  methods.setValue('streetAddress1', accountInfo.primAddress1 || accountInfo.address1 || '', opts);
  methods.setValue('streetAddress2', accountInfo.primAddress2 || accountInfo.address2 || '', opts);
  methods.setValue('city', accountInfo.primCity || accountInfo.city || '', opts);
  methods.setValue('zip', accountInfo.primZip || accountInfo.zip || '', opts);
};

/**
 * Set country and state fields as label/value objects
 */
const setLocationFields = (accountInfo: AccountInfo, methods: FormMethods): void => {
  const opts = { shouldValidate: false };
  const countryValue = accountInfo.country || '';
  const stateValue = accountInfo.state || '';

  methods.setValue('country', { label: countryValue, value: countryValue }, opts);
  methods.setValue('state', { label: stateValue, value: stateValue }, opts);
};

/**
 * Set select option fields from account information
 */
const setSelectFields = (accountInfo: AccountInfo, methods: FormMethods): void => {
  const opts = { shouldValidate: false };

  const typeOption = findOption(ACCOUNT_TYPE_OPTIONS, accountInfo.type);
  const domesticOption = findOption(DOMESTIC_OPTIONS, accountInfo.residentType);
  const entityTypeOption = findOption(ENTITY_TYPE_OPTIONS, accountInfo.entityType);
  const domicileOption = findOption(DOMICILE_OPTIONS, accountInfo.domicile);

  if (typeOption) methods.setValue('type', typeOption, opts);
  if (domesticOption) methods.setValue('domesticYN', domesticOption, opts);
  if (entityTypeOption) methods.setValue('entityType', entityTypeOption, opts);
  if (domicileOption) methods.setValue('domicile', domicileOption, opts);
};

/**
 * Prefill form fields from account information
 * Extracted to reduce cognitive complexity of useEffect
 */
const prefillFormFromAccountInfo = (
  accountInfo: AccountInfo,
  methods: FormMethods,
  setAccountIds: React.Dispatch<React.SetStateAction<AccountIds>>
): void => {
  setStringFields(accountInfo, methods);
  setLocationFields(accountInfo, methods);
  setSelectFields(accountInfo, methods);

  // Set account IDs for Step 2
  setAccountIds({
    partyId: accountInfo.partyId,
    accountId: accountInfo.accountId,
  });
};

// =============================================================================
// HOOK
// =============================================================================

/**
 * Custom hook for accreditation page logic
 * Handles form state, API calls, and navigation
 */
export function useAccreditation(): UseAccreditationReturn {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useUser();
  const { t } = useTranslation();

  // Redux state from accreditation slice
  const uploadProgress = useSelector((state: RootState) => state.accreditation.uploadProgress);
  const accountInformation = useSelector((state: RootState) => state.accreditation.accountInformation);
  const [userStatus, setUserStatus] = useState<KYCStatusResponse>(
    { isAccreditationAccountCreated: false, accreditationStatus: 'PENDING', accreditationNotes: '', isDocuSignComplete: false, isKYCComplete: false, kycStatus: 'pending', inquiryId: '', completedAt: '', documentSignedStatus: false });
  // UI State
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Document upload state
  const [accreditationFile, setAccreditationFile] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');

  // Account IDs from Step 1 response (needed for Step 2)
  const [accountIds, setAccountIds] = useState<AccountIds>({
    partyId: null,
    accountId: null,
  });

  // Form initialization with user email prefilled
  const methods = useForm<AccreditationFormData>({
    resolver: zodResolver(accreditationSchema),
    defaultValues: {
      ...ACCREDITATION_DEFAULT_VALUES,
      email: user?.email ?? '',
    },
    mode: 'onBlur',
  });

  // Prefill email when user data becomes available
  useEffect(() => {
    if (user?.email) {
      methods.setValue('email', user.email, { shouldValidate: false });
    }
  }, [user?.email, methods]);

  /**
   * Check accreditation status and fetch account information on mount
   * Skip to Step 2 if account already created, redirect if complete
   */
  useEffect(() => {
    const checkStatus = async () => {
      try {
        setIsLoadingStatus(true);
        const response = await checkKYCStatus();
        setUserStatus(response);
        const accreditationNotes = response.accreditationNotes;
        const status = response.accreditationStatus;
        const isAccreditationAccountCreated = response.isAccreditationAccountCreated;
        const isAccreditationApproved = status === 'APPROVED';

        if (!status) {
          setIsLoadingStatus(false);
          return;
        }

        // Redirect if already complete
        if (isAccreditationAccountCreated && isAccreditationApproved) {
          showSuccessToast('accreditation-complete', t('accreditation:accreditationAlreadySubmitted'));
          router.push('/dashboard');
          return;
        }
        dispatch(getAccountInformationThunk());
        // If account exists, fetch account information to prefill form
        if (isAccreditationAccountCreated) {

          // Skip to Step 2 if account exists and not pending
          setActiveStep(1);
          showSuccessToast(
            'account-exists',
            accreditationNotes ?? t('accreditation:accountAlreadySaved')
          );
        }
      } catch (error) {
        console.error('Error checking accreditation status:', error);
      } finally {
        setIsLoadingStatus(false);
      }
    };

    checkStatus();
  }, [router, dispatch]);

  /**
   * Prefill form fields when account information is fetched
   * Maps API response to form field values
   */
  useEffect(() => {
    if (!accountInformation) return;

    // Prefill form with account information
    prefillFormFromAccountInfo(accountInformation, methods, setAccountIds);
  }, [accountInformation, methods]);

  /**
   * Step 1: Create party and account on NorthCapital
   */
  const handleStep1Submit = useCallback(
    async (data: AccreditationFormData) => {
      if (userStatus?.isAccreditationAccountCreated) {
        setActiveStep(1);
        return;
      }

      setIsSubmitting(true);
      const payload = transformFormDataToPayload(data);
      const resultAction = await dispatch(createPartyAndAccountThunk(payload));

      if (createPartyAndAccountThunk.fulfilled.match(resultAction)) {
        const { partyId, accountId } = resultAction.payload;
        setAccountIds({ partyId, accountId });
        setActiveStep(1);
        showSuccessToast('account-created', 'Account created successfully! Please upload your verification document.');
      } else {
        const errorMessage = resultAction.payload || 'Failed to create account. Please try again.';
        showErrorToast('account-error', errorMessage);
      }

      setIsSubmitting(false);
    },
    [dispatch, userStatus]
  );

  /**
   * Step 2: Upload verification document
   */
  const handleStep2Submit = useCallback(async () => {
    // Validate file
    if (accreditationFile.length === 0) {
      setFileError('Please upload an accreditation verification document');
      return;
    }

    // Validate account IDs exist
    const { partyId, accountId } = accountIds;
    setIsSubmitting(true);

    const resultAction = await dispatch(
      uploadAccreditationDocumentThunk({
        file: accreditationFile[0],
        documentTitle: 'Accreditation Verification Document',
        partyId: partyId ?? undefined,
        accountId: accountId ?? undefined,
      })
    );

    if (uploadAccreditationDocumentThunk.fulfilled.match(resultAction)) {
      showSuccessToast('accreditation-success', 'Document uploaded successfully! Your accreditation is under review.');
      router.push('/dashboard');
    } else {
      const errorMessage = resultAction.payload || 'Failed to upload document. Please try again.';
      showErrorToast('upload-error', errorMessage);
    }

    setIsSubmitting(false);
  }, [accreditationFile, accountIds, dispatch, router]);

  const handleFilesChange = useCallback((files: File[]) => {
    setAccreditationFile(files);
    setFileError('');
  }, []);

  const handleRemoveFile = useCallback(() => {
    setAccreditationFile([]);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep(0);
  }, []);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return {
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
  };
}

