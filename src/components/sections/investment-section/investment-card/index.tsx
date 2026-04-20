/**
 * Investment Card Component
 * =========================
 *
 * Main container for Buy/Sell investment interface. Orchestrates form,
 * tabs, confirm flow, and onramper flow via hooks and flow components.
 */
'use client';

import type { RootReducersState } from '@/store/root-reducer';
import { Box } from '@mui/material';
import React, { memo, useCallback, useRef } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
import { CornerContainer } from 'yldzs-components';

import { AtomButton } from '@/components/atoms/button';
import AtomTabs, { type CustomTabOptionProps } from '@/components/atoms/tabs';
import VerificationButton, { type VerificationButtonHandle } from '@/components/kyc/verification-button';
import { BuyTab } from '@/components/sections/investment-section/buy-tab';
import { SellTab } from '@/components/sections/investment-section/sell-tab';
import { useUser } from '@/hooks/use-user';
import useWriteWithWait from '@/hooks/use-write-with-wait';
import { useDepositConfig } from '@/hooks/stable-coin/use-deposit-config';
import { useRouter } from 'next/navigation';

import {
  CARD_CONTAINER_SX,
  TAB_CONTAINER_SX,
  TABS,
  type InvestmentCardProps,
} from '@/constants/investment-card';

import { ConfirmFlow } from '@/components/sections/investment-section/investment-card/confirm-flow';
import { OnramperFlow, type OnramperFlowHandle } from '@/components/sections/investment-section/investment-card/onramper-flow';
import { getComplianceAddress, getRegistryAddress } from '@/components/sections/investment-section/investment-card/addresses';
import { useInvestmentCardState } from '@/hooks/stable-coin/use-investment-card-state';
import { useInvestmentForm } from '@/hooks/stable-coin/use-investment-form';
import { useInvestmentBalances } from '@/hooks/stable-coin/use-investment-balances';
import { useInvestmentVerification } from '@/hooks/stable-coin/use-investment-verification';
import { useInvestmentDetails } from '@/hooks/stable-coin/use-investment-details';
import { useCreateDeposit } from '@/hooks/stable-coin/use-create-deposit';
import { useInvestNowHandler } from '@/hooks/stable-coin/use-invest-now-handler';

// =============================================================================
// Component
// =============================================================================

/**
 * Investment Card Component
 *
 * Main container for Buy/Sell investment interface.
 */
const InvestmentCardComponent = ({ onInvestmentSuccess, onRefetchBalance }: Readonly<InvestmentCardProps>): React.JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const onramperRef = useRef<OnramperFlowHandle>(null);
  const { currentTransaction } = useSelector((state: RootReducersState) => state.onramp);

  const { executeContractPipeline, isLoading: isBlockchainLoading, loadingStatus } = useWriteWithWait();
  const { address: walletAddress } = useAccount();
  const { user } = useUser();
  const { supportedAssets, minimumDepositAmount, isLoading: isLoadingConfig, refreshConfig } = useDepositConfig();

  const state = useInvestmentCardState();
  const {
    isSellTab,
    isBuyTab,
    tabsData,
    setActiveTabIndex,
    setIsConfirmDialogOpen,
    setIsValidating,
    isSubmitting,
    setIsSubmitting,
    isBalanceLoading,
    setIsBalanceLoading,
    isConfirmDialogOpen,
    isValidating,
    isOnramperOpen,
    setIsOnramperOpen,
  } = state;

  const form = useInvestmentForm({
    supportedAssets,
    minimumDepositAmount: minimumDepositAmount ?? undefined,
    isLoadingConfig,
    isSellTab,
    walletAddress,
    router,
  });
  const {
    methods,
    getValues,
    clearErrors,
    defaultCurrency,
    minInvestmentDisplay,
    watchedBuyAmount,
    watchedSellAmount,
    selectedAssetContractAddress,
    validateInvestmentForm,
    watchedAmount,
  } = form;

  const stableTokenAddress = isSellTab
    ? (supportedAssets.find((asset) => asset.symbol === 'USDC')?.contractAddress as `0x${string}` | undefined)
    : undefined;

  const balances = useInvestmentBalances({
    isBuyTab,
    walletAddress,
    selectedAssetContractAddress,
    isSellTab,
    watchedSellAmount,
    stableTokenAddress,
    onRefetchBalance,
  });
  const {
    lpBalance,
    isLpBalanceLoading,
    lpBalanceError,
    tokenDisplayBalance,
    isTokenBalanceLoading,
    getTokenBalanceAsNumber,
    handleRefetchBalance,
    usdcReceiveAmount,
    withdrawFeeAmount,
    withdrawFeePercentage,
    isWithdrawFeeLoading,
    yieldzTokenAddress,
    vaultAddress,
  } = balances;

  const { currentDepositId, setCurrentDepositId, handleCreateDeposit } = useCreateDeposit({
    yieldzTokenAddress,
    vaultAddress,
    lpBalance,
    isLpBalanceLoading,
    lpBalanceError,
    t,
  });

  const verification = useInvestmentVerification({
    walletAddress,
    router,
    setIsValidating,
  });
  const { verificationButtonRef, kycStatusData, handleVerificationCheck, refetchKycStatus } = verification;

  const investmentDetails = useInvestmentDetails({
    watchedAmount,
    selectedCurrencyValue: form.selectedCurrency?.value,
    isSellTab,
    withdrawFeeAmount,
    withdrawFeePercentage,
    usdcReceiveAmount,
    isWithdrawFeeLoading,
    lpBalance,
    isLpBalanceLoading,
    lpBalanceError,
    vaultAddress,
    yieldzTokenAddress,
    t,
  });

  const investNow = useInvestNowHandler({
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
    findSelectedAsset: (tokenIn: string) => {
      const asset = supportedAssets.find((a) => a.symbol === tokenIn);
      if (!asset) return null;
      return asset;
    },
    handleCreateDeposit,
    walletAddress,
    router,
    setIsConfirmDialogOpen,
    setIsValidating,
    isOnramperOpen,
    watchedAmount,
  });
  const { handleInvestNow, buttonLabel } = investNow;

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: CustomTabOptionProps) => {
      const tabIndex = tabsData.findIndex((tab) => tab.value === newValue.value);
      const newTabIndex = Math.max(tabIndex, TABS.BUY);
      setActiveTabIndex(newTabIndex);
      clearErrors();
    },
    [tabsData, setActiveTabIndex, clearErrors]
  );

  const handleConfirmDialogClose = useCallback(() => {
    setIsConfirmDialogOpen(false);
    setCurrentDepositId(null);
    const currentCurrency = getValues('currency') || defaultCurrency;
    methods.reset({
      buyAmount: '',
      sellAmount: '',
      currency: currentCurrency,
    });
    handleRefetchBalance();
  }, [methods, defaultCurrency, getValues, handleRefetchBalance, setIsConfirmDialogOpen, setCurrentDepositId]);

  return (
    <FormProvider {...methods}>
      <CornerContainer sx={{ ...CARD_CONTAINER_SX, position: 'relative', zIndex: 1 }}>
        <Box sx={TAB_CONTAINER_SX}>
          <AtomTabs
            id="investment-tabs"
            value={state.activeTabIndex}
            tabsData={tabsData}
            onTabChange={handleTabChange}
            variant="fullWidth"
            showSection={false}
          />
        </Box>

        {isSellTab ? (
          <SellTab
            yieldzTokenAddress={yieldzTokenAddress}
            stableTokenAddress={
              supportedAssets.find((asset) => asset.symbol === 'USDC')?.contractAddress as `0x${string}` | undefined
            }
            vaultAddress={vaultAddress}
            registryAddress={getRegistryAddress()}
            complianceAddress={getComplianceAddress()}
          />
        ) : (
          <BuyTab
            supportedAssets={supportedAssets}
            minInvestmentDisplay={minInvestmentDisplay}
            onInvestClick={handleInvestNow}
            isSubmitting={isSubmitting}
            isBlockchainLoading={isBlockchainLoading}
            onBalanceLoadingChange={setIsBalanceLoading}
            displayBalance={tokenDisplayBalance}
            isBalanceLoading={isTokenBalanceLoading}
          />
        )}

        <AtomButton
          id={isSellTab ? 'sell-now-btn' : 'invest-now-btn'}
          label={buttonLabel}
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={handleInvestNow}
          disabled={
            isValidating ||
            isSubmitting ||
            isBlockchainLoading ||
            (isBuyTab && isBalanceLoading) ||
            (isBuyTab && (!watchedBuyAmount || watchedBuyAmount.trim() === '')) ||
            (isSellTab && (!watchedSellAmount || watchedSellAmount.trim() === ''))
          }
          isLoading={isValidating}
        />

        <OnramperFlow
          ref={onramperRef}
          walletAddress={walletAddress}
          userId={user?.id}
          partnerContext={currentTransaction?.partnerContext}
          onOpenChange={setIsOnramperOpen}
        />

        <ConfirmFlow
          open={isConfirmDialogOpen}
          onClose={handleConfirmDialogClose}
          getValues={getValues}
          isSellTab={isSellTab}
          walletAddress={walletAddress}
          supportedAssets={supportedAssets}
          executeContractPipeline={executeContractPipeline}
          yieldzTokenAddress={yieldzTokenAddress}
          vaultAddress={vaultAddress}
          usdcReceiveAmount={usdcReceiveAmount}
          withdrawFeeAmount={withdrawFeeAmount}
          lpBalance={lpBalance}
          isLpBalanceLoading={isLpBalanceLoading}
          lpBalanceError={lpBalanceError}
          userId={user?.id}
          onInvestmentSuccess={onInvestmentSuccess}
          loadingStatus={loadingStatus}
          investmentDetails={investmentDetails}
          currentDepositId={currentDepositId}
          setCurrentDepositId={setCurrentDepositId}
          t={t}
          defaultRewardLabel={t('investment:defaultReward')}
          onSubmittingChange={setIsSubmitting}
        />

        <VerificationButton
          ref={verificationButtonRef as React.RefObject<VerificationButtonHandle>}
          hideButton
          statusData={kycStatusData}
          buttonLabel=""
          onComplete={refetchKycStatus}
          onCancel={refetchKycStatus}
          onError={refetchKycStatus}
        />
      </CornerContainer>
    </FormProvider>
  );
};

export const InvestmentCard = memo(InvestmentCardComponent);
