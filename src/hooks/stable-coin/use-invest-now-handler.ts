'use client';

/**
 * Invest Now Handler Hook
 * ========================
 *
 * Orchestrates Invest/Sell Now: verification, validation, balance check,
 * onramper, deposit creation, confirm dialog. Returns handler, button label, and shouldShowBuyUsdc.
 */

import type { OnramperFlowHandle } from '@/components/sections/investment-section/investment-card/onramper-flow';
import { handleServiceError } from '@/utils/error-handler';
import { showErrorToast } from '@/utils/toast';
import { useCallback, useMemo } from 'react';
import { paths } from '@/paths';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export interface UseInvestNowHandlerParams {
  handleVerificationCheck: () => Promise<boolean>;
  validateInvestmentForm: () => Promise<boolean>;
  refreshConfig: () => Promise<void>;
  getValues: () => { buyAmount: string; sellAmount: string; currency: { value: string } };
  isBuyTab: boolean;
  isSellTab: boolean;
  isTokenBalanceLoading: boolean;
  getTokenBalanceAsNumber: () => number;
  onramperRef: React.RefObject<OnramperFlowHandle | null>;
  supportedAssets: Array<{ id: number; symbol: string; contractAddress?: string }>;
  t: (key: string) => string;
  /** Find asset by symbol; show toast and return null if not found */
  findSelectedAsset: (tokenIn: string) => { id: number } | null;
  handleCreateDeposit: (
    selectedAsset: { id: number },
    amountIn: string,
    enteredAmount: number,
    walletAddress: string,
    isBuy: boolean
  ) => Promise<number | null>;
  walletAddress: `0x${string}` | undefined;
  router: AppRouterInstance;
  setIsConfirmDialogOpen: (open: boolean) => void;
  setIsValidating: (value: boolean) => void;
  isOnramperOpen: boolean;
  watchedAmount: string;
}

export interface UseInvestNowHandlerReturn {
  handleInvestNow: () => Promise<void>;
  shouldShowBuyUsdc: boolean;
  buttonLabel: string;
}

/**
 * Invest/Sell Now handler, button label, and "Buy USDC" visibility.
 */
export function useInvestNowHandler({
  handleVerificationCheck,
  validateInvestmentForm,
  refreshConfig,
  getValues,
  isBuyTab,
  isSellTab,
  isTokenBalanceLoading,
  getTokenBalanceAsNumber,
  onramperRef,
  supportedAssets,
  t,
  findSelectedAsset,
  handleCreateDeposit,
  walletAddress,
  router,
  setIsConfirmDialogOpen,
  setIsValidating,
  isOnramperOpen,
  watchedAmount,
}: UseInvestNowHandlerParams): UseInvestNowHandlerReturn {
  const checkBalanceAndOpenOnramper = useCallback(
    async (
      walletBalance: number,
      enteredAmount: number,
      amountIn: string,
      tokenIn: string
    ): Promise<boolean> => {
      if (walletBalance === 0 || enteredAmount > walletBalance) {
        await onramperRef.current?.open(amountIn, tokenIn);
        return true;
      }
      return false;
    },
    [onramperRef]
  );

  const handleInvestNow = useCallback(async () => {
    try {
      setIsValidating(true);

      if (!(await handleVerificationCheck())) {
        setIsValidating(false);
        return;
      }

      if (!(await validateInvestmentForm())) {
        setIsValidating(false);
        return;
      }

      if (!walletAddress) {
        setIsValidating(false);
        router.push(paths.dashboard.profile);
        showErrorToast('wallet-not-connected', t('investment:connectWalletToProceed'));
        return;
      }

      await refreshConfig();

      const formData = getValues();
      const amountIn = isSellTab ? formData.sellAmount : formData.buyAmount;
      const tokenIn = formData.currency.value;

      if (!isBuyTab) {
        setIsConfirmDialogOpen(true);
        return;
      }

      if (isTokenBalanceLoading) {
        setIsValidating(false);
        showErrorToast('balance-loading', t('investment:balanceLoading') || 'Please wait while we check your balance...');
        return;
      }

      const walletBalance = getTokenBalanceAsNumber();
      const enteredAmount = Number.parseFloat(amountIn);
      if (Number.isNaN(enteredAmount) || enteredAmount <= 0) {
        setIsValidating(false);
        return;
      }

      const shouldOpenOnramper = await checkBalanceAndOpenOnramper(
        walletBalance,
        enteredAmount,
        amountIn,
        tokenIn
      );
      if (shouldOpenOnramper) {
        setIsValidating(false);
        return;
      }

      const selectedAsset = findSelectedAsset(tokenIn);
      if (!selectedAsset) {
        showErrorToast('invest-asset-error', t('investment:assetContractNotFound'));
        setIsValidating(false);
        return;
      }

      const depositId = await handleCreateDeposit(selectedAsset, amountIn, enteredAmount, walletAddress, true);
      if (depositId) {
        setIsConfirmDialogOpen(true);
      } else {
        setIsValidating(false);
      }
    } catch (error) {
      const errorMessage = handleServiceError(error, t('investment:failedToProcessInvestment'));
      showErrorToast('invest-process-failed', errorMessage);
    } finally {
      setIsValidating(false);
    }
  }, [
    handleVerificationCheck,
    validateInvestmentForm,
    refreshConfig,
    getValues,
    isBuyTab,
    isSellTab,
    isTokenBalanceLoading,
    getTokenBalanceAsNumber,
    checkBalanceAndOpenOnramper,
    findSelectedAsset,
    handleCreateDeposit,
    walletAddress,
    router,
    setIsConfirmDialogOpen,
    setIsValidating,
    t,
  ]);

  const shouldShowBuyUsdc = useMemo(() => {
    if (isOnramperOpen) return true;
    if (isBuyTab && watchedAmount && walletAddress) {
      const enteredAmount = Number.parseFloat(watchedAmount);
      const walletBalance = getTokenBalanceAsNumber();
      if (!Number.isNaN(enteredAmount) && enteredAmount > 0) {
        return walletBalance === 0 || enteredAmount > walletBalance;
      }
    }
    return false;
  }, [isOnramperOpen, isBuyTab, watchedAmount, walletAddress, getTokenBalanceAsNumber]);

  const buttonLabel = useMemo(() => {
    if (isSellTab) return t('investment:sell');
    if (shouldShowBuyUsdc) return t('investment:buyUsdc');
    return t('investment:investNow');
  }, [isSellTab, shouldShowBuyUsdc, t]);

  return {
    handleInvestNow,
    shouldShowBuyUsdc,
    buttonLabel,
  };
}
