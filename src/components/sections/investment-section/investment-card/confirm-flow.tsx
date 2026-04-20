'use client';

/**
 * Confirm Investment Flow
 * =======================
 *
 * Encapsulates confirm-dialog state and handlers (handleConfirmInvestment,
 * handleConfirmDialogClose, calculateReward). Renders ConfirmInvestmentDialog.
 * Parent owns open/onClose and currentDepositId; this component owns
 * isSubmitting and transaction-id state.
 */

import { logger } from '@/lib/default-logger';
import React, { useCallback, useEffect, useState } from 'react';
import ConfirmInvestmentDialog from '@/components/molecules/confirm-investment-dialog';
import type { PipelineLoadingStatus } from '@/hooks/use-write-with-wait';
import { showErrorToast } from '@/utils/toast';
import type { ExecuteBuyTransactionParams } from '@/utils/stable-coin/blockchain-operations';
import { executeBuyTransaction, executeSellTransaction } from '@/utils/stable-coin/blockchain-operations';
import { calculateAmountAfterFees } from '@/utils/stable-coin/calculations';
import type { InvestmentDetailsResult } from '@/components/sections/investment-section/investment-card/investment-details';
import { NETWORK_FEE_PERCENT, PLATFORM_FEE_PERCENT } from '@/constants/investment-card';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ConfirmFlowProps {
  open: boolean;
  onClose: () => void;
  getValues: () => { buyAmount: string; sellAmount: string; currency: { value: string } };
  isSellTab: boolean;
  walletAddress: `0x${string}` | undefined;
  supportedAssets: Array<{ symbol: string; contractAddress?: string }>;
  executeContractPipeline: ExecuteBuyTransactionParams['executeContractPipeline'];
  yieldzTokenAddress: `0x${string}` | undefined;
  vaultAddress: `0x${string}` | undefined;
  usdcReceiveAmount: string | undefined;
  withdrawFeeAmount: string | undefined;
  lpBalance: number;
  isLpBalanceLoading: boolean;
  lpBalanceError: Error | null;
  userId: string | undefined;
  onInvestmentSuccess?: (isWithdrawal?: boolean) => void;
  loadingStatus: PipelineLoadingStatus | undefined;
  investmentDetails: InvestmentDetailsResult;
  currentDepositId: number | null;
  setCurrentDepositId: (id: number | null) => void;
  t: (key: string) => string;
  defaultRewardLabel: string;
  /** Notify parent when submitting state changes (for main button disabled / BuyTab) */
  onSubmittingChange?: (value: boolean) => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ConfirmFlow({
  open,
  onClose,
  getValues,
  isSellTab,
  walletAddress,
  supportedAssets,
  executeContractPipeline,
  yieldzTokenAddress,
  vaultAddress,
  usdcReceiveAmount,
  withdrawFeeAmount,
  lpBalance,
  isLpBalanceLoading,
  lpBalanceError,
  userId,
  onInvestmentSuccess,
  loadingStatus,
  investmentDetails,
  currentDepositId,
  setCurrentDepositId,
  t,
  defaultRewardLabel,
  onSubmittingChange,
}: Readonly<ConfirmFlowProps>): React.JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState<number | null>(null);

  const setSubmitting = useCallback(
    (value: boolean) => {
      setIsSubmitting(value);
      onSubmittingChange?.(value);
    },
    [onSubmittingChange]
  );

  const handleConfirmDialogClose = useCallback(() => {
    setSubmitting(false);
    setCurrentDepositId(null);
    setCurrentTransactionId(null);
    onClose();
  }, [onClose, setCurrentDepositId, setSubmitting]);

  /** Computes reward after fees for a given deduction percent (e.g. 2 for 2%). */
  const calculateReward = useCallback(
    (deductionPercent: number): string => {
      const amountIn = isSellTab ? getValues().sellAmount : getValues().buyAmount;
      if (!amountIn) return defaultRewardLabel;
      const enteredAmount = Number.parseFloat(amountIn);
      if (Number.isNaN(enteredAmount) || enteredAmount <= 0) return defaultRewardLabel;
      const { amountAfterFees } = calculateAmountAfterFees(amountIn, deductionPercent);
      return `${amountAfterFees.toFixed(2)} YLDZ`;
    },
    [getValues, isSellTab, defaultRewardLabel]
  );

  /** Total fee deduction percent (platform + network) used for reward calculation. */
  const deductionPercent = PLATFORM_FEE_PERCENT + NETWORK_FEE_PERCENT;

  /** Log sell-flow transaction id and reward context when dialog is open (debug/trace). */
  useEffect(() => {
    if (open && currentTransactionId !== null) {
      const rewardPreview = calculateReward(deductionPercent);
      logger.debug('[ConfirmFlow] currentTransactionId', { currentTransactionId, rewardPreview });
    }
  }, [open, currentTransactionId, calculateReward, deductionPercent]);

  const handleConfirmInvestment = useCallback(async () => {
    const formData = getValues();
    const amountIn = isSellTab ? formData.sellAmount : formData.buyAmount;
    const tokenIn = formData.currency.value;

    if (!walletAddress) {
      showErrorToast('invest-wallet-not-connected', t('investment:connectWalletToProceed'));
      return;
    }

    if (isSellTab) {
      const orderProcessorAddress = process.env.NEXT_PUBLIC_BUY_STABLE_COIN_ORDER_PROCESSOR;
      if (!orderProcessorAddress) {
        showErrorToast('invest-config-error', t('investment:orderProcessorNotConfigured'));
        return;
      }
      if (!yieldzTokenAddress) {
        showErrorToast('invest-config-error', t('investment:yieldzTokenNotConfigured') || 'YLDZ token address not configured');
        return;
      }
      const stableTokenAsset = supportedAssets.find((a) => a.symbol === 'USDC');
      if (!stableTokenAsset?.contractAddress) {
        showErrorToast('invest-asset-error', t('investment:assetContractNotFound'));
        return;
      }
      const stableAsset = { contractAddress: stableTokenAsset.contractAddress };
      setSubmitting(true);
      await executeSellTransaction({
        yieldTokenAddress: yieldzTokenAddress,
        stableTokenAddress: stableAsset.contractAddress as `0x${string}`,
        humanAmount: amountIn,
        userAddress: walletAddress,
        orderProcessorAddress: orderProcessorAddress as `0x${string}`,
        usdcReceiveAmount,
        withdrawFeeAmount,
        stableTokenAsset: stableAsset,
        t,
        executeContractPipeline,
        onSuccess: onInvestmentSuccess,
        setIsSubmitting,
        setIsConfirmDialogOpen: onClose,
        setCurrentTransactionId,
      });
      return;
    }

    const orderProcessorAddress = process.env.NEXT_PUBLIC_BUY_STABLE_COIN_ORDER_PROCESSOR;
    if (!orderProcessorAddress) {
      showErrorToast('invest-config-error', t('investment:orderProcessorNotConfigured'));
      return;
    }
    const selectedAsset = supportedAssets.find((a) => a.symbol === tokenIn);
    if (!selectedAsset?.contractAddress) {
      showErrorToast('invest-asset-error', t('investment:assetContractNotFound'));
      return;
    }
    if (!currentDepositId) {
      showErrorToast('invest-deposit-missing', t('investment:depositNotCreated'));
      return;
    }
    setSubmitting(true);
    await executeBuyTransaction({
      depositTokenAddress: selectedAsset.contractAddress as `0x${string}`,
      humanAmount: amountIn,
      userAddress: walletAddress,
      orderProcessorAddress: orderProcessorAddress as `0x${string}`,
      depositId: currentDepositId,
      tokenIn,
      lpBalance,
      isLpBalanceLoading,
      lpBalanceError,
      vaultAddress,
      yieldzTokenAddress,
      userId,
      t,
      executeContractPipeline,
      onSuccess: onInvestmentSuccess,
      setIsSubmitting: setSubmitting,
      setIsConfirmDialogOpen: onClose,
      setCurrentDepositId,
    });
  }, [
    getValues,
    isSellTab,
    walletAddress,
    supportedAssets,
    executeContractPipeline,
    yieldzTokenAddress,
    vaultAddress,
    usdcReceiveAmount,
    withdrawFeeAmount,
    lpBalance,
    isLpBalanceLoading,
    lpBalanceError,
    userId,
    currentDepositId,
    onInvestmentSuccess,
    onClose,
    setCurrentDepositId,
    t,
  ]);

  return (
    <ConfirmInvestmentDialog
      open={open}
      onClose={handleConfirmDialogClose}
      onConfirm={handleConfirmInvestment}
      enteredAmount={investmentDetails.amountIn}
      tokenIn={investmentDetails.tokenIn}
      currentApy={investmentDetails.currentApy}
      lockup={investmentDetails.lockup}
      networkFee={investmentDetails.networkFee}
      platformFee={investmentDetails.platformFee}
      instantReward={investmentDetails.instantReward}
      rewardAfterLockup={investmentDetails.rewardAfterLockup}
      showSixtyDays={investmentDetails.showSixtyDays}
      isLoading={isSubmitting}
      loadingStatus={loadingStatus}
    />
  );
}
