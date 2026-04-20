/**
 * Blockchain Operations
 * ====================
 *
 * Handles execution of blockchain transactions for BUY and SELL operations
 */

import { prepareBuyYieldTokenSteps } from '@/blockchain/buy-yield-token';
import { prepareSellYieldTokenSteps } from '@/blockchain/sell-yield-token';
import { patchMethod, postMethod } from '@/services/api';
import endPoints from '@/services/urls';
import { handleServiceError } from '@/utils/error-handler';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import type { Address } from 'viem';

import { updateDepositAfterTransaction } from '@/utils/stable-coin/deposit-helpers';
import {
  buildUpdateWithdrawalTransactionPayload,
  buildWithdrawalTransactionPayload,
} from '@/utils/stable-coin/transaction-builders';
import { parseAndValidateWithdrawalAmount } from '@/utils/stable-coin/withdrawal-formatters';

// =============================================================================
// Types
// =============================================================================

/** Parameters for executing a BUY transaction */
export interface ExecuteBuyTransactionParams {
  /** Deposit token address (e.g. USDC, USDT) */
  depositTokenAddress: Address;
  /** Human-readable amount */
  humanAmount: string;
  /** User wallet address */
  userAddress: Address;
  /** Order processor contract address */
  orderProcessorAddress: Address;
  /** Current deposit ID */
  depositId: number;
  /** Token symbol */
  tokenIn: string;
  /** LP balance for allocation calculation */
  lpBalance: number;
  /** Whether LP balance is loading */
  isLpBalanceLoading: boolean;
  /** LP balance error if any */
  lpBalanceError: Error | null;
  /** Vault contract address */
  vaultAddress: Address | undefined;
  /** YLDZ token contract address */
  yieldzTokenAddress: Address | undefined;
  /** User ID for metadata */
  userId: string | undefined;
  /** Translation function */
  t: (key: string) => string;
  /** Execute contract pipeline function */
  executeContractPipeline: (params: {
    steps: any[];
    onSuccess: (lastTxHash?: string, lastReceipt?: any) => Promise<void> | void;
    onError: (error: any) => void;
  }) => Promise<void>;
  /** Callback when transaction succeeds */
  onSuccess?: (isWithdrawal?: boolean) => void;
  /** Callback to set submitting state */
  setIsSubmitting: (value: boolean) => void;
  /** Callback to close confirm dialog */
  setIsConfirmDialogOpen: (value: boolean) => void;
  /** Callback to reset deposit ID */
  setCurrentDepositId: (value: number | null) => void;
}

/** Parameters for executing a SELL transaction */
export interface ExecuteSellTransactionParams {
  /** YLDZ token contract address */
  yieldTokenAddress: Address;
  /** Stable token address (e.g. USDC) */
  stableTokenAddress: Address;
  /** Human-readable amount */
  humanAmount: string;
  /** User wallet address */
  userAddress: Address;
  /** Order processor contract address */
  orderProcessorAddress: Address;
  /** USDC receive amount */
  usdcReceiveAmount: string | undefined;
  /** Withdrawal fee amount */
  withdrawFeeAmount: string | undefined;
  /** Stable token asset object */
  stableTokenAsset: { contractAddress: string };
  /** Translation function */
  t: (key: string) => string;
  /** Execute contract pipeline function */
  executeContractPipeline: (params: {
    steps: any[];
    onSuccess: (lastTxHash?: string, lastReceipt?: any) => Promise<void> | void;
    onError: (error: any) => void;
  }) => Promise<void>;
  /** Callback when transaction succeeds */
  onSuccess?: (isWithdrawal?: boolean) => void;
  /** Callback to set submitting state */
  setIsSubmitting: (value: boolean) => void;
  /** Callback to close confirm dialog */
  setIsConfirmDialogOpen: (value: boolean) => void;
  /** Callback to set transaction ID */
  setCurrentTransactionId: (value: number | null) => void;
}

// =============================================================================
// Functions
// =============================================================================

/**
 * Execute BUY transaction (buy YLDZ tokens)
 * Handles the complete flow: prepare steps, execute pipeline, update deposit
 */
export async function executeBuyTransaction(params: ExecuteBuyTransactionParams): Promise<void> {
  const {
    depositTokenAddress,
    humanAmount,
    userAddress,
    orderProcessorAddress,
    depositId,
    tokenIn,
    lpBalance,
    isLpBalanceLoading,
    lpBalanceError,
    vaultAddress,
    yieldzTokenAddress,
    userId,
    t,
    executeContractPipeline,
    onSuccess,
    setIsSubmitting,
    setIsConfirmDialogOpen,
    setCurrentDepositId,
  } = params;

  try {
    // Step 1: Prepare blockchain transaction steps
    const steps = await prepareBuyYieldTokenSteps({
      depositTokenAddress,
      humanAmount,
      userAddress,
      orderProcessorAddress,
    });

    // Step 2: Execute blockchain transactions (approve + buyYieldToken)
    await executeContractPipeline({
      steps,
      onSuccess: async (lastTxHash?: string, lastReceipt?: any) => {
        // Validate transaction hash
        if (!lastTxHash) {
          showErrorToast('invest-tx-hash-missing', t('investment:txHashNotCaptured'));
          setIsSubmitting(false);
          return;
        }

        // Validate deposit ID
        if (!depositId) {
          setIsSubmitting(false);
          return;
        }

        // Extract transaction hash (ensure lowercase as per API requirement)
        const transactionHash = lastTxHash.toLowerCase();
        const enteredAmount = Number.parseFloat(humanAmount);

        // Update deposit with transaction details
        const updateSuccess = await updateDepositAfterTransaction({
          depositId,
          transactionHash,
          lastReceipt,
          tokenIn,
          enteredAmount,
          lpBalance,
          isLpBalanceLoading,
          lpBalanceError,
          vaultAddress,
          yieldzTokenAddress,
          userId,
          t,
        });

        if (updateSuccess) {
          showSuccessToast('invest-deposit-created', t('investment:investmentCompletedSuccessfully'));
          setIsConfirmDialogOpen(false);
          setCurrentDepositId(null);
          // Trigger parent callback to open success dialog (pass false to indicate deposit)
          onSuccess?.(false);
        }
        setIsSubmitting(false);
      },
      onError: () => {
        showErrorToast('invest-blockchain-failed', t('investment:transactionFailed'));
        setIsSubmitting(false);
        // Close confirm dialog when user cancels in MetaMask or transaction fails
        setIsConfirmDialogOpen(false);
        // Reset deposit ID on error
        setCurrentDepositId(null);
      },
    });
  } catch (error) {
    const errorMessage = handleServiceError(error, t('investment:failedToPrepareTransaction'));
    showErrorToast('invest-prepare-failed', errorMessage);
    setIsSubmitting(false);
  }
}

/**
 * Execute SELL transaction (sell YLDZ tokens for USDC)
 * Handles the complete flow: create transaction record, prepare steps, execute pipeline, update transaction
 */
export async function executeSellTransaction(params: ExecuteSellTransactionParams): Promise<void> {
  const {
    yieldTokenAddress,
    stableTokenAddress,
    humanAmount,
    userAddress,
    orderProcessorAddress,
    usdcReceiveAmount,
    withdrawFeeAmount,
    stableTokenAsset,
    t,
    executeContractPipeline,
    onSuccess,
    setIsSubmitting,
    setIsConfirmDialogOpen,
    setCurrentTransactionId,
  } = params;

  try {
    // Step 1: Create transaction record in backend before starting withdrawal process
    let capturedTransactionId: number | null = null;
    try {
      const enteredAmount = parseAndValidateWithdrawalAmount(humanAmount);
      if (enteredAmount === null) {
        throw new Error('Invalid withdrawal amount');
      }

      // Build transaction payload using helper function
      const transactionPayload = buildWithdrawalTransactionPayload(
        enteredAmount,
        userAddress,
        yieldTokenAddress,
        usdcReceiveAmount,
        withdrawFeeAmount,
        stableTokenAsset
      );

      // Call the transactions API before starting withdrawal
      const transactionResponse = await postMethod<{ status: string; data: { id: number } }>(
        endPoints.TRANSACTIONS,
        transactionPayload
      );

      // Store transaction ID from response for later PATCH call
      if (transactionResponse?.status === 'success' && transactionResponse?.data?.id) {
        capturedTransactionId = transactionResponse.data.id;
        setCurrentTransactionId(capturedTransactionId);
      }
    } catch {
      // Continue with withdrawal process even if API call fails
    }

    // Step 2: Prepare blockchain transaction steps for selling
    const steps = await prepareSellYieldTokenSteps({
      yieldTokenAddress,
      stableTokenAddress,
      humanAmount,
      userAddress,
      orderProcessorAddress,
    });

    // Step 3: Execute blockchain transactions (approve yield token if needed + returnYieldToken)
    await executeContractPipeline({
      steps,
      onSuccess: async (lastTxHash?: string, lastReceipt?: any) => {
        // Validate transaction hash
        if (!lastTxHash) {
          showErrorToast('invest-tx-hash-missing', t('investment:txHashNotCaptured'));
          setIsSubmitting(false);
          return;
        }

        // Check receipt status before proceeding
        const isTransactionSuccessful = lastReceipt && lastReceipt.status !== 'reverted';

        // Use capturedTransactionId from closure to avoid state timing issues
        const transactionIdToUpdate = capturedTransactionId;

        if (isTransactionSuccessful && transactionIdToUpdate) {
          // Update transaction record with blockchain transaction details
          try {
            const updateTransactionPayload = buildUpdateWithdrawalTransactionPayload(
              lastTxHash,
              usdcReceiveAmount,
              withdrawFeeAmount,
              stableTokenAsset
            );
            // Call PATCH API to update transaction with blockchain details
            await patchMethod(endPoints.UPDATE_TRANSACTION(transactionIdToUpdate), updateTransactionPayload);
          } catch {
            // Don't block the process if update fails
          }
        }

        // Show success message and close dialog
        showSuccessToast('sell-transaction-completed', t('investment:investmentCompletedSuccessfully'));
        setIsConfirmDialogOpen(false);
        setCurrentTransactionId(null);
        // Trigger parent callback to open success dialog (pass true to indicate withdrawal)
        onSuccess?.(true);
        setIsSubmitting(false);
      },
      onError: () => {
        showErrorToast('sell-blockchain-failed', t('investment:transactionFailed'));
        setIsSubmitting(false);
        // Close confirm dialog when user cancels in MetaMask or transaction fails
        setIsConfirmDialogOpen(false);
        // Reset transaction ID on error
        setCurrentTransactionId(null);
      },
    });
  } catch (error) {
    const errorMessage = handleServiceError(error, t('investment:failedToPrepareTransaction'));
    showErrorToast('sell-prepare-failed', errorMessage);
    setIsSubmitting(false);
  }
}
