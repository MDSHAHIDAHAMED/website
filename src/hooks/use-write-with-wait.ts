/**
 * useWriteWithWait Hook
 * =====================
 * 
 * Custom hook for executing blockchain contract transactions in a pipeline.
 * Handles sequential execution of multiple contract calls with optional receipt waiting.
 * 
 * Features:
 * - Sequential transaction execution
 * - Optional receipt waiting per step
 * - Custom handlers for each step
 * - Automatic tracking of last transaction hash and receipt
 * - Comprehensive error handling
 * 
 * @returns Object containing executeContractPipeline function and loading state
 */

import { toast } from '@/components/core/toaster';
import { config } from '@/contexts/wallet/chain';
import { TAddressType } from '@/types/blockchain';
import { showErrorToast } from '@/utils/toast';
import { waitForTransactionReceipt } from '@wagmi/core';
import { useCallback, useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';

/** Pipeline phase for UI: idle, awaiting wallet signature, or waiting for on-chain confirmation */
export type PipelineLoadingStatus = 'idle' | 'awaiting_signature' | 'processing';

/**
 * Step configuration for contract execution pipeline
 */
interface ContractStep {
  /** Step name for logging/error messages */
  name: string;
  /** Contract call configuration */
  contractConfig: {
    address: TAddressType;
    abi: any;
    functionName: string;
    args: any[];
  };
  /** Whether to wait for transaction receipt */
  waitForReceipt?: boolean;
  /** Custom handler called after step execution */
  customHandler?: (txHash: string, receipt?: any) => Promise<void>;
  /** Number of confirmations to wait for (default: 1) */
  confirmations?: number;
}

/**
 * Pipeline configuration interface
 */
interface IWriteContractsPipeline {
  /** Array of contract execution steps */
  steps: ContractStep[];
  /** Success callback with last transaction hash and receipt (can be async) */
  onSuccess?: (lastTxHash?: string, lastReceipt?: any) => void | Promise<void>;
  /** Error callback */
  onError?: (error: any) => void;
}

/**
 * Hook for executing contract transaction pipelines
 */
const useWriteWithWait = () => {
  const { writeContractAsync } = useWriteContract();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<PipelineLoadingStatus>('idle');
  const { isConnected } = useAccount();

  /**
   * Execute contract transactions in sequence
   * Tracks status: awaiting_signature (wallet popup) then processing (on-chain confirmation).
   *
   * @param params - Pipeline configuration
   * @returns Promise that resolves when all steps complete
   */
  const executeContractPipeline = useCallback(
    async ({ steps, onSuccess, onError }: IWriteContractsPipeline): Promise<void> => {
      // Validate wallet connection before starting
      if (!isConnected) {
        toast.dismiss();
        showErrorToast('wallet-not-connected', 'Wallet not connected');
        return;
      }

      setIsLoading(true);
      setLoadingStatus('awaiting_signature');
      let lastTxHash: string | undefined;
      let lastReceipt: any;

      try {
        // Execute each step sequentially
        for (const step of steps) {
          // User must confirm in wallet (MetaMask etc.)
          setLoadingStatus('awaiting_signature');
          const txHash = await writeContractAsync(step.contractConfig);
          lastTxHash = txHash;

          let receipt: any;

          // Wait for on-chain confirmation if requested
          if (step.waitForReceipt) {
            setLoadingStatus('processing');
            receipt = await waitForTransactionReceipt(config, {
              hash: txHash,
              confirmations: step?.confirmations ?? 1,
            });

            // Validate receipt status
            if (receipt.status === 'reverted') {
              throw new Error(`${step.name} transaction failed with reverted status.`);
            }

            // Store receipt only if we waited for it
            lastReceipt = receipt;
          } else {
            // Clear receipt if this step doesn't wait for it
            // This ensures we only pass receipt from the last step that waited
            lastReceipt = undefined;
          }

          // Execute custom handler if provided
          if (step.customHandler) {
            await step.customHandler(txHash, receipt);
          }
        }

        // Call success callback with last transaction details
        // Handle both sync and async callbacks
        if (onSuccess) {
          await onSuccess(lastTxHash, lastReceipt);
        }
      } catch (error: any) {
        // Format error message with BigInt handling
        const errorMessage = JSON.stringify(
          {
            message: error?.message,
            ...error,
          },
          (key, value) => (typeof value === 'bigint' ? value.toString() : value),
          2
        );

        // Call error callback if provided
        if (onError) {
          onError(errorMessage);
        }
      } finally {
        // Always reset loading state and status
        setIsLoading(false);
        setLoadingStatus('idle');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isConnected, writeContractAsync]
  );

  return { executeContractPipeline, isLoading, loadingStatus };
};

export default useWriteWithWait;
