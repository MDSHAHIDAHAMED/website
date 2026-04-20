'use client';

/**
 * Investment Card State Hook
 * ==========================
 *
 * Owns tab index, dialog open state, loading flags, and derived tab helpers.
 * Component composes handleTabChange with clearErrors from form hook.
 */

import { type CustomTabOptionProps } from '@/components/atoms/tabs';
import { TABS } from '@/constants/investment-card';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface UseInvestmentCardStateReturn {
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
  isOnramperOpen: boolean;
  setIsOnramperOpen: (open: boolean) => void;
  isConfirmDialogOpen: boolean;
  setIsConfirmDialogOpen: (open: boolean) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  isBalanceLoading: boolean;
  setIsBalanceLoading: (value: boolean) => void;
  isValidating: boolean;
  setIsValidating: (value: boolean) => void;
  isSellTab: boolean;
  isBuyTab: boolean;
  tabsData: CustomTabOptionProps[];
}

/**
 * State and derived values for investment card: tabs, dialogs, loading, deposit id.
 */
export function useInvestmentCardState(): UseInvestmentCardStateReturn {
  const { t } = useTranslation();

  const [activeTabIndex, setActiveTabIndex] = useState<number>(TABS.BUY);
  const [isOnramperOpen, setIsOnramperOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const isSellTab = useMemo(() => activeTabIndex === TABS.SELL, [activeTabIndex]);
  const isBuyTab = useMemo(() => activeTabIndex === TABS.BUY, [activeTabIndex]);

  const tabsData: CustomTabOptionProps[] = useMemo(
    () => [
      { label: t('investment:tabBuy'), value: 'buy' },
      { label: t('investment:tabSell'), value: 'sell' },
    ],
    [t]
  );

  return {
    activeTabIndex,
    setActiveTabIndex,
    isOnramperOpen,
    setIsOnramperOpen,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    isSubmitting,
    setIsSubmitting,
    isBalanceLoading,
    setIsBalanceLoading,
    isValidating,
    setIsValidating,
    isSellTab,
    isBuyTab,
    tabsData,
  };
}
