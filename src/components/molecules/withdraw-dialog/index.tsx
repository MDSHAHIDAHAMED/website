/**
 * Withdraw Dialog Component
 * =========================
 * 
 * Modal dialog for withdrawing funds from portfolio.
 * Supports partial and full withdrawal options.
 * 
 * Features:
 * - Tab selection (Partial/Full Withdrawal)
 * - Available balance and pending amount display
 * - Withdrawal amount input with currency selector
 * - Connected wallet address display
 * - Transaction summary (to be implemented)
 * - Terms and conditions (to be implemented)
 */

'use client';

import { prepareSellYieldTokenSteps } from '@/blockchain/sell-yield-token';
import AtomAlert from '@/components/atoms/alert';
import { AtomButton } from '@/components/atoms/button';
import LottieAnimation from '@/components/atoms/lottie-animation';
import { type TSelectOption } from '@/components/atoms/select-box';
import AtomTabs, { type CustomTabOptionProps } from '@/components/atoms/tabs';
import AtomTooltip from '@/components/atoms/tooltip';
import AtomTypography from '@/components/atoms/typography';
import InputWithLabel from '@/components/molecules/input-with-label';
import SelectWithLabel from '@/components/molecules/select-with-label';
import { DetailRow } from '@/components/sections/investment-section/detail-row/detail-row';
import { useDepositConfig } from '@/hooks/stable-coin/use-deposit-config';
import { useGetUnlockAmount } from '@/hooks/stable-coin/use-get-unlock-amount';
import { useTokenBalance } from '@/hooks/stable-coin/use-token-balance';
import { useWithdrawFee } from '@/hooks/stable-coin/use-withdraw-fee';
import useWriteWithWait from '@/hooks/use-write-with-wait';
import { logger } from '@/lib/default-logger';
import { patchMethod, postMethod } from '@/services/api';
import endPoints from '@/services/urls';
import { yieldzNeutral, yieldzPrimary } from '@/styles/theme/colors';
import { handleServiceError } from '@/utils/error-handler';
import { formatNumberWithTwoDecimals } from '@/utils/number-format';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import {
  parseAndValidateWithdrawalAmount,
  parsePositiveAmount,
} from '@/utils/stable-coin/withdrawal-formatters';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, Checkbox, Dialog, Divider, IconButton, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import React, { useCallback, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { CornerContainer } from 'yldzs-components';

// =============================================================================
// Types
// =============================================================================

export interface WithdrawDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog is closed */
  onClose: () => void;
  /** Available balance in USDC (deprecated - will use blockchain data) */
  availableBalance?: string;
  /** Pending amount in USDC */
  pendingAmount?: string;
  /** Supported currencies for withdrawal */
  currencies?: Array<{ label: string; value: string }>;
  /** Default currency */
  defaultCurrency?: string;
  /** Callback when withdraw is confirmed */
  onConfirm?: (amount: string, currency: string, isFullWithdrawal: boolean) => void;
  /** Whether the transaction is being processed */
  isLoading?: boolean;
  /** YLDZ token contract address (optional, will use env var if not provided) */
  yieldzTokenAddress?: `0x${string}`;
  /** Stable token address (e.g. USDC) that user will receive (optional, will use env var if not provided) */
  stableTokenAddress?: `0x${string}`;
  /** Vault contract address (optional, will use env var if not provided) */
  vaultAddress?: `0x${string}`;
  /** Registry contract address (RegD) (optional, will use env var if not provided) */
  registryAddress?: `0x${string}`;
  /** Compliance module address (optional, will use env var if not provided) */
  complianceAddress?: `0x${string}`;
}

// =============================================================================
// Constants
// =============================================================================

/** Tab identifiers */
const WITHDRAWAL_TABS = {
  PARTIAL: 0,
  FULL: 1,
} as const;

/** Default currencies */
const DEFAULT_CURRENCIES = [
  { label: 'USDC', value: 'USDC' },
  { label: 'USDT', value: 'USDT' },
];

// =============================================================================
// Styles
// =============================================================================

/** Dialog paper styles */
const DIALOG_PAPER_SX: SxProps<Theme> = {
  backgroundColor: yieldzNeutral[950],
  borderRadius: 0,
  minWidth: 600,
  maxWidth: 800,
};

/** Header container styles */
const HEADER_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: 2,
  py: 2,
  borderBottom: `1px solid ${yieldzNeutral[800]}`,
};

/** Content container styles */
const CONTENT_SX: SxProps<Theme> = {
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

/** Section container styles */
const SECTION_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
};

/** Input row container */
const INPUT_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
  alignItems: 'flex-end',
};

/** Full-screen loading overlay - covers entire dialog when processing withdrawal */
const LOADING_OVERLAY_SX: SxProps<Theme> = {
  position: 'absolute',
  inset: 0,
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(4px)',
  gap: 3,
};

/** Loading text styles with subtle pulse animation */
const LOADING_TEXT_SX: SxProps<Theme> = {
  animation: 'pulse 2s ease-in-out infinite',
  '@keyframes pulse': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.6 },
  },
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Parameters for building withdrawal transaction payload
 */
interface BuildWithdrawalPayloadParams {
  walletAddress: string;
  amountIn: number;
  yieldzTokenAddress: `0x${string}` | undefined;
  usdcReceiveAmount: string;
  stableTokenAddress: string | undefined;
  feeAmount: string;
}

/**
 * Build the initial withdrawal transaction payload for the backend API
 * Uses shared validation helpers for optional amounts (usdcReceiveAmount, feeAmount).
 *
 * @param params - Parameters for building the payload
 * @returns Transaction payload object
 */
function buildWithdrawalPayload(params: BuildWithdrawalPayloadParams): Record<string, any> {
  const { walletAddress, amountIn, yieldzTokenAddress, usdcReceiveAmount, stableTokenAddress, feeAmount } = params;

  const payload: Record<string, any> = {
    type: 'withdrawal',
    walletAddress,
    amountIn,
    tokenIn: 'YLDZ',
    metadata: {},
  };

  if (yieldzTokenAddress) {
    payload.tokenInAddress = yieldzTokenAddress;
  }

  const amountOutNum = parsePositiveAmount(usdcReceiveAmount);
  if (amountOutNum !== null) {
    payload.amountOut = amountOutNum;
  }

  if (stableTokenAddress) {
    payload.tokenOut = 'USDC';
    payload.tokenOutAddress = stableTokenAddress;
  }

  const feeAmountNum = parsePositiveAmount(feeAmount);
  if (feeAmountNum !== null) {
    payload.platformFee = feeAmountNum.toFixed(2);
  }

  return payload;
}

/**
 * Build the update payload for a transaction after blockchain confirmation
 * @param transactionHash - The blockchain transaction hash
 * @param usdcReceiveAmount - Amount to receive in USDC
 * @param stableTokenAddress - USDC contract address
 * @param feeAmount - Platform fee amount
 * @returns Update payload object
 */
function buildTransactionUpdatePayload(
  transactionHash: string,
  usdcReceiveAmount: string,
  stableTokenAddress: string | undefined,
  feeAmount: string
): Record<string, any> {
  const payload: Record<string, any> = {
    transactionHash: transactionHash.toLowerCase(),
  };

  if (usdcReceiveAmount) {
    const amountOutNum = Number.parseFloat(usdcReceiveAmount);
    if (!Number.isNaN(amountOutNum) && amountOutNum > 0) {
      payload.amountOut = amountOutNum;
    }
  }

  if (stableTokenAddress) {
    payload.tokenOut = 'USDC';
    payload.tokenOutAddress = stableTokenAddress;
  }

  if (feeAmount) {
    const feeAmountNum = Number.parseFloat(feeAmount);
    if (!Number.isNaN(feeAmountNum) && feeAmountNum > 0) {
      payload.platformFee = feeAmountNum.toFixed(2);
    }
  }

  return payload;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Withdraw Dialog Component
 * 
 * @param props - Component props
 * @returns Withdraw dialog JSX element
 */
export function WithdrawDialog({
  open,
  onClose,
  availableBalance = '0.00',
  pendingAmount = '0.00',
  currencies = DEFAULT_CURRENCIES,
  defaultCurrency = 'USDC',
  onConfirm,
  isLoading = false,
  yieldzTokenAddress,
  stableTokenAddress,
  vaultAddress,
  registryAddress,
  complianceAddress,
}: Readonly<WithdrawDialogProps>): React.JSX.Element {
  const { address: walletAddress } = useAccount();
  const [activeTabIndex, setActiveTabIndex] = useState<number>(WITHDRAWAL_TABS.PARTIAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Setter is used for transaction tracking, value is intentionally unused
  const [_transactionId, setCurrentTransactionId] = useState<number | null>(null);

  const { executeContractPipeline, isLoading: isBlockchainLoading } = useWriteWithWait();

  /**
   * Get contract addresses from props or environment variables
   * These addresses are needed for blockchain interactions
   */
  const effectiveYieldzTokenAddress = useMemo(() => {
    return yieldzTokenAddress ?? (process.env.NEXT_PUBLIC_YIELDZ_TOKEN_MANAGEMENT as `0x${string}` | undefined);
  }, [yieldzTokenAddress]);

  const effectiveVaultAddress = useMemo(() => {
    return vaultAddress ?? (process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}` | undefined);
  }, [vaultAddress]);

  const effectiveRegistryAddress = useMemo(() => {
    return registryAddress ?? (process.env.NEXT_PUBLIC_REGD_UNLOCK_AMOUNT as `0x${string}` | undefined);
  }, [registryAddress]);

  const effectiveComplianceAddress = useMemo(() => {
    return complianceAddress ?? (process.env.NEXT_PUBLIC_MODULAR_COMPLIANCE_ADDRESS as `0x${string}` | undefined);
  }, [complianceAddress]);

  /**
   * Fetch deposit config to get supported assets (for USDC address)
   */
  const { supportedAssets } = useDepositConfig();

  /**
   * Get stable token address from props or find USDC from supported assets
   * This is needed for withdrawal fee calculation
   */
  const effectiveStableTokenAddress = useMemo(() => {
    // If provided as prop, use it
    if (stableTokenAddress) return stableTokenAddress;

    // Try to find USDC from supported assets
    const usdcAsset = supportedAssets.find((asset) => asset.symbol === 'USDC');
    if (usdcAsset?.contractAddress) {
      // Validate contract address format
      if (usdcAsset.contractAddress.startsWith('0x') && usdcAsset.contractAddress.length === 42) {
        return usdcAsset.contractAddress as `0x${string}`;
      }
    }

    // Return undefined if not found (hook will handle gracefully)
    return undefined;
  }, [stableTokenAddress, supportedAssets]);

  /**
   * Fetch YLDZ token decimals needed for formatting unlockable amount
   * This hook internally calls ERC20 decimals() to get token decimals
   */
  const {
    decimals: yieldzDecimals,
  } = useTokenBalance(walletAddress, effectiveYieldzTokenAddress, true);

  /**
   * Fetch unlockable amount from registry contract
   * This hook calls getUnlockAmount(compliance, user) to get the amount available for withdrawal
   * This is the actual available balance from blockchain
   */
  const {
    unlockableAmount,
    isLoading: isUnlockAmountLoading,
    error: unlockAmountError,
  } = useGetUnlockAmount(effectiveRegistryAddress, effectiveComplianceAddress, walletAddress);

  /**
   * Format unlockable amount for display
   * Converts wei value to human-readable format using token decimals
   * Uses 18 decimals as fallback if yieldzDecimals is not available
   */
  const formattedUnlockableAmount = React.useMemo(() => {
    if (!unlockableAmount) {
      return '0.00';
    }

    // Use 18 as default decimals if not available (most ERC20 tokens use 18)
    const decimals = yieldzDecimals ?? 18;

    try {
      const formatted = formatUnits(unlockableAmount, decimals);
      const numValue = Number.parseFloat(formatted);

      // Format with commas for thousands (2 decimal places)
      return formatNumberWithTwoDecimals(numValue);
    } catch (error) {
      console.error('Error formatting unlockable amount:', error);
      return '0.00';
    }
  }, [unlockableAmount, yieldzDecimals]);

  /**
   * Use blockchain unlockable amount as available balance, fallback to prop if blockchain data not available
   */
  const dynamicAvailableBalance = useMemo(() => {
    if (isUnlockAmountLoading) {
      return 'Loading...';
    }
    if (unlockAmountError) {
      // Fallback to prop value if blockchain fetch fails
      return availableBalance;
    }
    return formattedUnlockableAmount;
  }, [formattedUnlockableAmount, isUnlockAmountLoading, unlockAmountError, availableBalance]);


  /**
   * Form management using react-hook-form
   */
  const methods = useForm<{
    withdrawalAmount: string;
    currency: TSelectOption;
    acceptTerms: boolean;
  }>({
    defaultValues: {
      withdrawalAmount: '',
      currency: { label: defaultCurrency, value: defaultCurrency },
      acceptTerms: false,
    },
    mode: 'onChange',
  });

  const { watch, setValue, reset } = methods;
  const withdrawAmount = watch('withdrawalAmount');
  const selectedCurrency = watch('currency');
  const acceptTerms = watch('acceptTerms');

  /**
   * Determine if current tab is FULL withdrawal
   */
  const isFullWithdrawal = useMemo(() => activeTabIndex === WITHDRAWAL_TABS.FULL, [activeTabIndex]);

  /**
   * Tab data for AtomTabs component
   */
  const tabsData: CustomTabOptionProps[] = useMemo(
    () => [
      { label: 'Partial Withdrawal', value: 'partial' },
      { label: 'Full Withdrawal', value: 'full' },
    ],
    []
  );

  /**
   * Handle tab change
   */
  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: CustomTabOptionProps) => {
      const tabIndex = tabsData.findIndex((tab) => tab.value === newValue.value);
      const newTabIndex = Math.max(tabIndex, WITHDRAWAL_TABS.PARTIAL);
      setActiveTabIndex(newTabIndex);

      // If full withdrawal is selected, set amount to available balance from blockchain
      if (newTabIndex === WITHDRAWAL_TABS.FULL) {
        // Remove currency suffix and commas for parsing
        const cleanBalance = dynamicAvailableBalance.replaceAll(/[^\d.]/g, '');
        // Only set if not loading
        if (cleanBalance !== 'Loading...' && !Number.isNaN(Number.parseFloat(cleanBalance))) {
          setValue('withdrawalAmount', cleanBalance);
        }
      } else {
        // Reset amount for partial withdrawal
        setValue('withdrawalAmount', '');
      }
    },
    [tabsData, dynamicAvailableBalance, setValue]
  );

  /**
   * Reset form when dialog closes
   */
  React.useEffect(() => {
    if (!open) {
      reset({
        withdrawalAmount: '',
        currency: { label: defaultCurrency, value: defaultCurrency },
        acceptTerms: false,
      });
      setActiveTabIndex(WITHDRAWAL_TABS.PARTIAL);
    }
  }, [open, reset, defaultCurrency]);

  /**
   * Handle dialog close
   */
  const handleDialogClose = useCallback(
    (_event: React.SyntheticEvent, reason?: 'backdropClick' | 'escapeKeyDown') => {
      // Prevent closing on backdrop click or escape key during loading
      if (isLoading) {
        return;
      }
      if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
        return;
      }
      onClose();
    },
    [onClose, isLoading]
  );

  /**
   * Get effective withdrawal amount (available balance for full withdrawal, entered amount for partial)
   * Uses dynamic blockchain data for available balance
   */
  const effectiveWithdrawAmount = useMemo(() => {
    if (isFullWithdrawal) {
      // For full withdrawal, use available balance from blockchain (remove currency suffix and commas)
      const cleanBalance = dynamicAvailableBalance.replaceAll(/[^\d.]/g, '');
      // Handle loading state
      if (cleanBalance === 'Loading...' || Number.isNaN(Number.parseFloat(cleanBalance))) {
        return '0';
      }
      return cleanBalance;
    }
    // Remove commas from partial withdrawal amount
    const cleanAmount = (withdrawAmount || '0').replaceAll(',', '');
    return cleanAmount;
  }, [isFullWithdrawal, dynamicAvailableBalance, withdrawAmount]);

  /**
   * Fetch withdrawal fee and calculate receive amount from blockchain
   * This hook:
   * 1. Fetches LP balance (stable token balance in vault)
   * 2. Fetches withdrawal fee using getWithdrawfee
   * 3. Calculates receive amount = entered amount - fee
   */
  const {
    receiveAmount: usdcReceiveAmount,
    withdrawFeeAmount: feeAmount,
    withdrawFeeFormatted: feePercentage,
    lpBalanceFormatted,
    isLoading: isFeeLoading,
  } = useWithdrawFee(
    effectiveStableTokenAddress,
    effectiveVaultAddress,
    effectiveWithdrawAmount, // Withdrawal amount (YLDZ amount user enters)
    6 // USDC decimals (default: 6)
  );

  /**
   * Calculate 70% of LP balance for available to withdraw
   * LP balance is in USDC (stable token), so we calculate 70% of it
   * This represents the maximum amount that can be withdrawn based on liquidity pool
   */
  const availableToWithdraw = React.useMemo(() => {
    if (!lpBalanceFormatted) {
      return '0.00';
    }

    try {
      const lpBalanceNum = Number.parseFloat(lpBalanceFormatted);
      if (Number.isNaN(lpBalanceNum) || lpBalanceNum <= 0) {
        return '0.00';
      }

      // Calculate 70% of LP balance
      const withdrawableAmount = lpBalanceNum * 0.7;

      // Format with commas for thousands (2 decimal places)
      return formatNumberWithTwoDecimals(withdrawableAmount);
    } catch (error) {
      console.error('Error calculating available to withdraw:', error);
      return '0.00';
    }
  }, [lpBalanceFormatted]);

  /**
   * Calculate pending amount dynamically
   * Pending Amount = Available Balance - Available to Withdraw
   * 
   * Based on what's actually displayed:
   * - Available Balance label shows: availableToWithdraw (70% of LP balance)
   * - Available to Withdraw label shows: dynamicAvailableBalance (unlockable amount)
   * 
   * So: Pending = Available Balance (availableToWithdraw) - Available to Withdraw (dynamicAvailableBalance)
   * This represents the difference between what's available and what can be withdrawn
   */
  const calculatedPendingAmount = useMemo(() => {
    // Show loading if either value is loading
    if (isUnlockAmountLoading || isFeeLoading) {
      return 'Loading...';
    }

    try {
      // Use the displayed values to match what the user sees
      // Available Balance (displayed) = availableToWithdraw (70% of LP)
      // Available to Withdraw (displayed) = dynamicAvailableBalance (unlockable amount)
      const availableBalanceDisplay = availableToWithdraw;
      const availableToWithdrawDisplay = dynamicAvailableBalance;

      // Skip if either value is still loading
      if (availableBalanceDisplay === 'Loading...' || availableToWithdrawDisplay === 'Loading...') {
        return 'Loading...';
      }

      // Remove commas and parse to numbers
      const availableBalanceNum = Number.parseFloat(availableBalanceDisplay.replaceAll(',', ''));
      const availableToWithdrawNum = Number.parseFloat(availableToWithdrawDisplay.replaceAll(',', ''));

      // Check if values are valid numbers
      if (Number.isNaN(availableBalanceNum) || Number.isNaN(availableToWithdrawNum)) {
        console.warn('Invalid numbers for pending calculation:', {
          availableBalanceDisplay,
          availableToWithdrawDisplay,
        });
        return '0.00';
      }

      // Calculate pending = Available Balance (displayed) - Available to Withdraw (displayed)
      const pendingNum = availableBalanceNum - availableToWithdrawNum;

      // Ensure non-negative
      const pending = Math.max(0, pendingNum);

      // Format with commas for thousands (2 decimal places)
      return formatNumberWithTwoDecimals(pending);
    } catch (error) {
      console.error('Error calculating pending amount:', error);
      return '0.00';
    }
  }, [
    availableToWithdraw,
    dynamicAvailableBalance,
    isUnlockAmountLoading,
    isFeeLoading,
  ]);

  /**
   * Handle confirm button click
   * Executes blockchain transactions for withdrawal (same as sell tab)
   */
  const handleConfirm = useCallback(async () => {
    const amount = effectiveWithdrawAmount;
    if (!amount || Number.parseFloat(amount) <= 0) {
      return;
    }
    if (!acceptTerms) {
      return;
    }

    // Validate wallet connection
    if (!walletAddress) {
      showErrorToast('withdraw-wallet-not-connected', 'Please connect your wallet to proceed');
      return;
    }

    // Get order processor address from environment
    const orderProcessorAddress = process.env.NEXT_PUBLIC_BUY_STABLE_COIN_ORDER_PROCESSOR;
    if (!orderProcessorAddress) {
      showErrorToast('withdraw-config-error', 'Order processor not configured');
      return;
    }

    // Validate YLDZ token address
    if (!effectiveYieldzTokenAddress) {
      showErrorToast('withdraw-config-error', 'YLDZ token address not configured');
      return;
    }

    // Find USDC asset (stable token that user will receive)
    const stableTokenAsset = supportedAssets.find((asset) => asset.symbol === 'USDC');
    if (!stableTokenAsset?.contractAddress) {
      showErrorToast('withdraw-asset-error', 'USDC contract address not found');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create transaction record in backend before starting withdrawal process
      let capturedTransactionId: number | null = null;
      try {
        const enteredAmount = parseAndValidateWithdrawalAmount(amount);
        if (enteredAmount === null) {
          throw new Error('Invalid withdrawal amount');
        }

        // Build transaction payload using helper function
        const transactionPayload = buildWithdrawalPayload({
          walletAddress,
          amountIn: enteredAmount,
          yieldzTokenAddress: effectiveYieldzTokenAddress,
          usdcReceiveAmount,
          stableTokenAddress: stableTokenAsset?.contractAddress,
          feeAmount,
        });

        // Call the transactions API before starting withdrawal
        const transactionResponse = await postMethod<{ status: string; data: { id: number } }>(endPoints.TRANSACTIONS, transactionPayload);

        // Store transaction ID from response for later PATCH call
        if (transactionResponse?.status === 'success' && transactionResponse?.data?.id) {
          capturedTransactionId = transactionResponse.data.id;
          setCurrentTransactionId(capturedTransactionId);
        }
      } catch (transactionError) {
        // Log error but don't block the withdrawal process
        logger.error('Failed to create transaction record', { error: transactionError });
        // Continue with withdrawal process even if API call fails
      }

      // Step 2: Prepare blockchain transaction steps for selling (withdrawal uses same flow as sell)
      const steps = await prepareSellYieldTokenSteps({
        yieldTokenAddress: effectiveYieldzTokenAddress,
        stableTokenAddress: stableTokenAsset.contractAddress as `0x${string}`,
        humanAmount: amount,
        userAddress: walletAddress,
        orderProcessorAddress: orderProcessorAddress as `0x${string}`,
      });

      // Step 3: Execute blockchain transactions (approve yield token if needed + returnYieldToken)
      await executeContractPipeline({
        steps,
        onSuccess: async (lastTxHash?: string, lastReceipt?: any) => {
          // Validate transaction hash
          if (!lastTxHash) {
            logger.error('Transaction hash not captured');
            showErrorToast('withdraw-tx-hash-missing', 'Transaction hash not captured');
            setIsSubmitting(false);
            return;
          }

          // Check receipt status before proceeding
          const isTransactionSuccessful = lastReceipt && lastReceipt.status !== 'reverted';
          const transactionIdToUpdate = capturedTransactionId;
          const shouldUpdateTransaction = isTransactionSuccessful && transactionIdToUpdate;

          if (shouldUpdateTransaction) {
            // Update transaction record with blockchain transaction details
            try {
              const updateTransactionPayload = buildTransactionUpdatePayload(
                lastTxHash,
                usdcReceiveAmount,
                stableTokenAsset?.contractAddress,
                feeAmount
              );
              await patchMethod(endPoints.UPDATE_TRANSACTION(transactionIdToUpdate), updateTransactionPayload);
            } catch (updateTransactionError) {
              logger.error('Failed to update transaction record', { error: updateTransactionError, transactionId: transactionIdToUpdate });
            }
          }

          // Show success message and close dialog
          showSuccessToast('withdraw-transaction-completed', 'Withdrawal completed successfully');
          setCurrentTransactionId(null);
          onClose();
          
          // Call parent callback if provided
          const currencyValue = typeof selectedCurrency === 'object' && selectedCurrency?.value
            ? selectedCurrency.value
            : defaultCurrency;
          onConfirm?.(amount, currencyValue as string, isFullWithdrawal);
          setIsSubmitting(false);
        },
        onError: (error) => {
          logger.error('Withdrawal blockchain transaction failed', { error });
          showErrorToast('withdraw-blockchain-failed', 'Transaction failed');
          setIsSubmitting(false);
          setCurrentTransactionId(null);
        },
      });
    } catch (error) {
      const errorMessage = handleServiceError(error, 'Failed to prepare withdrawal transaction');
      logger.error('Failed to prepare withdrawal transaction', { error });
      showErrorToast('withdraw-prepare-failed', errorMessage);
      setIsSubmitting(false);
    }
  }, [
    effectiveWithdrawAmount,
    selectedCurrency,
    isFullWithdrawal,
    acceptTerms,
    onConfirm,
    defaultCurrency,
    walletAddress,
    effectiveYieldzTokenAddress,
    supportedAssets,
    usdcReceiveAmount,
    feeAmount,
    executeContractPipeline,
    onClose,
  ]);

  /**
   * Format wallet address for display (truncate middle)
   */
  const formattedWalletAddress = useMemo(() => {
    if (!walletAddress) return 'Not connected';
    if (walletAddress.length <= 10) return walletAddress;
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  /**
   * Handle copy wallet address to clipboard
   */
  const handleCopyAddress = useCallback(async () => {
    if (!walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletAddress);
      showSuccessToast('wallet-address-copied', 'Address copied to clipboard');
    } catch {
      showErrorToast('wallet-address-copy-error', 'Failed to copy address');
    }
  }, [walletAddress]);

  /**
   * Currency options for select
   */
  const currencyOptions: TSelectOption[] = useMemo(
    () =>
      currencies.map((currency) => ({
        label: currency.label,
        value: currency.value,
      })),
    [currencies]
  );

  /**
   * Calculate transaction fees and totals using blockchain data
   * Uses dynamic withdrawal fee from blockchain instead of static values
   */
  const transactionSummary = useMemo(() => {
    // Use effective withdrawal amount (available balance for full withdrawal, entered amount for partial)
    const amount = Number.parseFloat(effectiveWithdrawAmount || '0');
    if (Number.isNaN(amount) || amount <= 0) {
      return {
        principalWithdrawal: '0.00',
        interestWithdrawal: '0.00',
        networkFee: '0.00',
        platformFee: '0.00',
        totalReceive: '0.00',
        isLoading: false,
      };
    }

    // Platform fee: Use dynamic fee from blockchain (withdrawFeeAmount)
    // The fee is already calculated in USDC by the useWithdrawFee hook
    const platformFee = Number.parseFloat(feeAmount || '0');

    // Network fee: Currently not available from blockchain, set to 0
    // This can be fetched from transaction gas estimation if needed
    const networkFee = 0;

    // Interest withdrawal: 0 for now (can be calculated from pending rewards)
    const interestWithdrawal = 0;

    // Total receive = principal + interest - network fee - platform fee
    // Or use the receiveAmount directly from useWithdrawFee hook which already calculates this
    const totalReceive = Number.parseFloat(usdcReceiveAmount || '0');

    return {
      principalWithdrawal: amount.toFixed(2),
      interestWithdrawal: interestWithdrawal.toFixed(2),
      networkFee: networkFee.toFixed(2),
      platformFee: platformFee.toFixed(2),
      totalReceive: Math.max(0, totalReceive).toFixed(2),
      isLoading: isFeeLoading,
    };
  }, [effectiveWithdrawAmount, feeAmount, usdcReceiveAmount, isFeeLoading]);

  /** Show full-screen Lottie loader when withdrawal is in progress */
  const isWithdrawing = isLoading || isSubmitting || isBlockchainLoading;

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: { ...DIALOG_PAPER_SX, position: 'relative' },
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
      }}
    >
      {/* Full-screen loading overlay – common Lottie screen loader when processing */}
      {isWithdrawing && (
        <Box sx={LOADING_OVERLAY_SX}>
          <LottieAnimation width={120} height={120} />
          <AtomTypography
            variant="h5"
            color="text.primary"
            fontType="ppMori"
            sx={LOADING_TEXT_SX}
          >
            Confirm in the wallet...
          </AtomTypography>
        </Box>
      )}

      {/* Header */}
      <CornerContainer sx={HEADER_SX}>
        <AtomTypography variant="h4" color="text.primary" fontType="ppMori">
          Withdraw Funds
        </AtomTypography>
        <AtomButton
          id="close-withdraw-dialog"
          label={<Image src="/assets/icons/cross-button.svg" alt="Close" width={20} height={20} />}
          onClick={onClose}
          variant="text"
          color="secondary"
          size="small"
          sx={{
            minWidth: 'auto',
            width: 32,
            height: 32,
            p: 0,
          }}
          disabled={isLoading}
        />
      </CornerContainer>

      {/* Content */}
      <FormProvider {...methods}>
        <CornerContainer sx={CONTENT_SX} outerSx={{ border: 'none' }}>
          {/* Tab Selector */}
          <Box>
            <AtomTabs
              id="withdrawal-tabs"
              value={activeTabIndex}
              tabsData={tabsData}
              onTabChange={handleTabChange}
              variant="fullWidth"
              showSection={false}
            />
          </Box>

          {/* Balance Row - Simple Detail Rows */}
          <Stack spacing={1}>
            <DetailRow
              label="Available Balance:"
              value={
                isFeeLoading
                  ? 'Loading...'
                  : availableToWithdraw
              }
              icon={
                <Image
                  src="/assets/icons/white-logo.svg"
                  alt="YLDZ"
                  width={14}
                  height={14}
                />
              }
            />
            <DetailRow
              label="Available to Withdraw:"
              value={
                isUnlockAmountLoading
                  ? 'Loading...'
                  : dynamicAvailableBalance
              }
              icon={
                <Image
                  src="/assets/icons/white-logo.svg"
                  alt="YLDZ"
                  width={14}
                  height={14}
                />
              }
            />

            <DetailRow
              label="Pending Amount:"
              value={
                isUnlockAmountLoading || isFeeLoading
                  ? 'Loading...'
                  : calculatedPendingAmount
              }
              icon={
                <Image
                  src="/assets/icons/white-logo.svg"
                  alt="YLDZ"
                  width={14}
                  height={14}
                />
              }
            />
          </Stack>

          {/* Info Alert for Pending Amount */}
          <Box>
            <AtomAlert
              type="info"
              id="pending-amount-info-alert"
              content={{
                heading: '',
                message: 'The amount becomes available for withdrawal once the lockup period has ended.',
              }}
            />
          </Box>

          {/* Withdrawal Amount Input Row */}
          {isFullWithdrawal ? (
            // Full Withdrawal: Show balance display
            <Box sx={INPUT_ROW_SX}>
              <Box sx={{ flex: 1 }}>
                <AtomTypography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Withdrawal Amount
                </AtomTypography>
                <AtomTypography variant="h3" color="text.primary">
                  {isUnlockAmountLoading ? 'Loading...' : `${dynamicAvailableBalance} ${defaultCurrency}`}
                </AtomTypography>
              </Box>
              <Box sx={{ width: 150 }}>
                <SelectWithLabel
                  id="withdrawal-currency"
                  name="currency"
                  label=""
                  variant="outlined"
                  options={currencyOptions}
                  placeholder={defaultCurrency}
                  disabled={isLoading}
                  noLabel
                />
              </Box>
            </Box>
          ) : (
            // Partial Withdrawal: Show input field
            <Box sx={INPUT_ROW_SX}>
              <Box sx={{ flex: 1 }}>
                <InputWithLabel
                  id="withdrawal-amount"
                  name="withdrawalAmount"
                  label="Withdrawal Amount"
                  variant="standard"
                  placeholder="0.00"
                  type="text"
                  numericOnly
                  disabled={isLoading}
                  required
                />
              </Box>
              <Box sx={{ width: 150 }}>
                <SelectWithLabel
                  id="withdrawal-currency"
                  name="currency"
                  label=""
                  variant="outlined"
                  options={currencyOptions}
                  placeholder={defaultCurrency}
                  disabled={isLoading}
                  noLabel
                />
              </Box>
            </Box>
          )}

          {/* Withdrawal Destination - Single Detail Row with Copy */}
          {walletAddress && (
            <Stack spacing={1}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <AtomTypography variant="subtitle2" color="text.secondary">
                  Withdrawal Destination
                </AtomTypography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AtomTooltip title={walletAddress} placement="top">
                    <AtomTypography variant="subtitle2" color="text.primary" fontWeight={500} sx={{ cursor: 'help' }}>
                      {formattedWalletAddress}
                    </AtomTypography>
                  </AtomTooltip>
                  <IconButton
                    onClick={handleCopyAddress}
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      p: 0.5,
                      '&:hover': {
                        color: yieldzPrimary[500],
                        backgroundColor: 'rgba(109, 242, 254, 0.1)',
                      },
                    }}
                    aria-label="Copy wallet address"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Stack>
          )}

          {/* Transaction Summary - Simple Detail Rows */}
          <Stack spacing={1}>
            <DetailRow
              label="Principal Withdrawal:"
              value={
                transactionSummary.isLoading
                  ? 'Loading...'
                  : `${transactionSummary.principalWithdrawal} ${defaultCurrency}`
              }
            />
            <DetailRow
              label="Interest Withdrawal:"
              value={`${transactionSummary.interestWithdrawal} ${defaultCurrency}`}
            />
            <DetailRow
              label="Network Fee:"
              value={`${transactionSummary.networkFee} ${defaultCurrency}`}
            />
            <DetailRow
              label="Platform Fee:"
              value={
                (() => {
                  if (transactionSummary.isLoading) {
                    return 'Loading...';
                  }
                  const feeText = `${transactionSummary.platformFee} ${defaultCurrency}`;
                  const percentageText = feePercentage ? ` (${feePercentage}%)` : '';
                  return `${feeText}${percentageText}`;
                })()
              }
            />
          </Stack>

          <Divider sx={{ borderColor: yieldzNeutral[800], px: 3 }} />

          {/* Total You'll Receive – label and value on one line */}
          <Box sx={{ ...SECTION_SX }}>
            <DetailRow
              label="Total You'll Receive"
              value={
                transactionSummary.isLoading
                  ? 'Loading...'
                  : `${transactionSummary.totalReceive} ${defaultCurrency}`
              }
            />
          </Box>

          {/* Fee Explanations - Simple text without boxes */}
          <Stack spacing={1.5}>
            <AtomTypography variant="label1" color="text.secondary" component="div">
              <strong>Network Fee:</strong> A small network fee is required to process your withdrawal transaction on the blockchain.
            </AtomTypography>
            <AtomTypography variant="label1" color="text.secondary" component="div">
              <strong>Platform Fee:</strong> Platform service fee {feePercentage ? `(${feePercentage}%)` : '(dynamic)'} is required to process your withdrawal transaction. This fee is calculated dynamically based on the withdrawal amount and current liquidity pool balance.
            </AtomTypography>
            <AtomTypography variant="label1" color="text.secondary" component="div">
              <strong>Processing Time:</strong> Your withdrawal will be processed within 10-30 minutes and confirmed on the blockchain.
            </AtomTypography>
          </Stack>

          {/* Terms and Conditions - Simple layout without box */}
          <Box>
            <AtomTypography variant="label1" color="text.primary" fontWeight={600} sx={{ mb: 1.5 }}>
              Please accept the terms and conditions.
            </AtomTypography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Checkbox
                checked={acceptTerms}
                onChange={(e) => setValue('acceptTerms', e.target.checked)}
                disabled={isLoading}
                sx={{
                  color: yieldzPrimary[500],
                  '&.Mui-checked': {
                    color: yieldzPrimary[500],
                  },
                  p: 0,
                  mt: 0.5,
                }}
              />
              <AtomTypography variant="body4" color="text.secondary" component="div">
                I acknowledge that I have read and agree to the{' '}
                <Box component="span" sx={{ color: yieldzPrimary[500] }}>
                  withdrawal terms and conditions
                </Box>
                . I understand that blockchain transactions are irreversible and I am responsible for ensuring the accuracy of the destination address.
              </AtomTypography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <AtomButton
              id="cancel-withdraw-btn"
              label="Cancel"
              variant="contained"
              color="secondary"
              size="medium"
              fullWidth
              onClick={onClose}
              disabled={isLoading}
            />
            <AtomButton
              id="confirm-withdraw-btn"
              label="Confirm Withdrawal"
              variant="contained"
              color="primary"
              size="medium"
              fullWidth
              onClick={handleConfirm}
              disabled={isLoading || isSubmitting || isBlockchainLoading || !effectiveWithdrawAmount || Number.parseFloat(effectiveWithdrawAmount) <= 0 || !acceptTerms}
            />
          </Stack>
        </CornerContainer>
      </FormProvider>
    </Dialog>
  );
}

export default WithdrawDialog;
