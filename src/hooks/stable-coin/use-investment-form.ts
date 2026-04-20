'use client';

/**
 * Investment Form Hook
 * ====================
 *
 * Owns react-hook-form setup, schema, default currency, validation, and watched values.
 * Resets form default currency when config loads.
 */

import { ETH_ADDRESS_LENGTH } from '@/constants/stable-coin';
import { paths } from '@/paths';
import { showErrorToast } from '@/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getInvestmentSchema } from '@/components/sections/investment-section/investment-card/investment-schema';
import type { UseFormReturn } from 'react-hook-form';

export interface InvestmentFormValues {
  buyAmount: string;
  sellAmount: string;
  currency: { label: string; value: string };
}

export interface UseInvestmentFormParams {
  supportedAssets: Array<{ symbol: string; contractAddress?: string }>;
  minimumDepositAmount: string | undefined;
  isLoadingConfig: boolean;
  isSellTab: boolean;
  walletAddress: `0x${string}` | undefined;
  router: AppRouterInstance;
}

export interface UseInvestmentFormReturn {
  methods: UseFormReturn<InvestmentFormValues>;
  getValues: UseFormReturn<InvestmentFormValues>['getValues'];
  trigger: UseFormReturn<InvestmentFormValues>['trigger'];
  watch: UseFormReturn<InvestmentFormValues>['watch'];
  clearErrors: UseFormReturn<InvestmentFormValues>['clearErrors'];
  selectedCurrency: { label: string; value: string } | undefined;
  watchedBuyAmount: string;
  watchedSellAmount: string;
  watchedAmount: string;
  defaultCurrency: { label: string; value: string };
  minInvestmentDisplay: string;
  validateInvestmentForm: () => Promise<boolean>;
  selectedAssetContractAddress: `0x${string}` | undefined;
}

/**
 * Form setup, watched values, validation, and selected asset address for investment card.
 */
export function useInvestmentForm({
  supportedAssets,
  minimumDepositAmount,
  isLoadingConfig,
  isSellTab,
  walletAddress,
  router,
}: UseInvestmentFormParams): UseInvestmentFormReturn {
  const { t } = useTranslation();

  const defaultCurrency = useMemo(() => {
    const firstAsset = supportedAssets[0];
    if (firstAsset) {
      return { label: firstAsset.symbol, value: firstAsset.symbol };
    }
    const fallbackCurrency = t('investment:defaultCurrency');
    return { label: fallbackCurrency, value: fallbackCurrency };
  }, [supportedAssets, t]);

  const minInvestmentDisplay = useMemo(() => {
    if (isLoadingConfig) return t('investment:loading');
    if (!minimumDepositAmount) return t('investment:notAvailable');
    return `${minimumDepositAmount} ${t('investment:defaultCurrency')}`;
  }, [isLoadingConfig, minimumDepositAmount, t]);

  const methods = useForm<InvestmentFormValues>({
    resolver: zodResolver(getInvestmentSchema(t, minimumDepositAmount ?? undefined) as never),
    defaultValues: {
      buyAmount: '',
      sellAmount: '',
      currency: defaultCurrency,
    },
    mode: 'onChange',
  });

  const { getValues, trigger, watch, clearErrors } = methods;
  const selectedCurrency = watch('currency');
  const watchedBuyAmount = watch('buyAmount');
  const watchedSellAmount = watch('sellAmount');
  const watchedAmount = isSellTab ? watchedSellAmount : watchedBuyAmount;

  const selectedAssetContractAddress = useMemo(() => {
    if (!selectedCurrency?.value || !supportedAssets.length) return undefined;
    const symbol = selectedCurrency.value;
    const asset = supportedAssets.find(
      (a) => a.symbol.toUpperCase() === symbol.toUpperCase()
    );
    const addr = asset?.contractAddress;
    if (!addr || !addr.startsWith('0x') || addr.length !== ETH_ADDRESS_LENGTH) {
      return undefined;
    }
    return addr as `0x${string}`;
  }, [selectedCurrency, supportedAssets]);

  useEffect(() => {
    if (!isLoadingConfig && defaultCurrency && !selectedCurrency) {
      methods.reset(
        {
          buyAmount: '',
          sellAmount: '',
          currency: defaultCurrency,
        },
        { keepDefaultValues: false }
      );
    }
  }, [isLoadingConfig, defaultCurrency, methods, selectedCurrency]);

  const validateInvestmentForm = useCallback(async (): Promise<boolean> => {
    const fieldToValidate = isSellTab ? 'sellAmount' : 'buyAmount';
    const formData = getValues();
    const amountValue = isSellTab ? formData.sellAmount : formData.buyAmount;

    if (!amountValue || amountValue.trim() === '') {
      await trigger(fieldToValidate);
      return false;
    }

    const isValid = await trigger(fieldToValidate);
    if (!isValid) {
      return false;
    }

    if (!walletAddress) {
      showErrorToast('invest-wallet-not-connected', t('investment:connectWalletToProceed'));
      router.push(paths.dashboard.profile);
      return false;
    }

    return true;
  }, [trigger, walletAddress, t, isSellTab, getValues]);

  return {
    methods,
    getValues,
    trigger,
    watch,
    clearErrors,
    selectedCurrency,
    watchedBuyAmount,
    watchedSellAmount,
    watchedAmount,
    defaultCurrency,
    minInvestmentDisplay,
    validateInvestmentForm,
    selectedAssetContractAddress,
  };
}
