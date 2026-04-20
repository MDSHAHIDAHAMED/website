'use client';

import { Box, Stack } from '@mui/material';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { CornerContainer } from 'yldzs-components';

import WithdrawDialog from '@/components/molecules/withdraw-dialog';
import { useGetUnlockAmount } from '@/hooks/stable-coin/use-get-unlock-amount';
import { useTokenBalance } from '@/hooks/stable-coin/use-token-balance';
import { DEFAULT_DISPLAY_VALUES } from '@/constants/investment-card';
import { CashFlowChartSection } from '@/components/sections/cash-flow-chart-section';
import { InvestmentsListingSection } from '@/components/sections/investments-listing-section';
import { PortfolioActionsSection } from '@/components/sections/portfolio-actions-section';
import { PortfolioAllocationChartSection } from '@/components/sections/portfolio-allocation-chart-section';
import { PortfolioSummarySection } from '@/components/sections/portfolio-summary-section';
import TokenChartSection from '@/components/sections/token-chart-section';
import TransactionsListingSection from '@/components/sections/transactions-listing-section';
import { SOCKET_EVENTS } from '@/constants';
import useSocketEvents from '@/hooks/use-socket-events';
import { logger } from '@/lib/default-logger';
import { getPortfolioAssetsSummary, type PortfolioAssetsSummaryData } from '@/services/portfolio';
import { handleServiceError } from '@/utils/error-handler';
import { formatNumberWithTwoDecimals } from '@/utils/number-format';

/** YLDZ token address from env (same source as investment-card / sell-tab) */
const YIELDZ_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_YIELDZ_TOKEN_MANAGEMENT as `0x${string}` | undefined) ?? undefined;
/** Registry (RegD) address from env */
const REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_REGD_UNLOCK_AMOUNT as `0x${string}` | undefined) ?? undefined;
/** Compliance module address from env */
const COMPLIANCE_ADDRESS = (process.env.NEXT_PUBLIC_MODULAR_COMPLIANCE_ADDRESS as `0x${string}` | undefined) ?? undefined;

function PortfolioPage(): React.JSX.Element {
  const [portfolioData, setPortfolioData] = useState<PortfolioAssetsSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);

  const { address: walletAddress } = useAccount();

  /**
   * Blockchain "available to withdraw" – same source as sell-tab (useGetUnlockAmount + formatUnits).
   * Use this for the action card so it matches the investment card value.
   */
  const { unlockableAmount, isLoading: isUnlockAmountLoading } = useGetUnlockAmount(
    REGISTRY_ADDRESS,
    COMPLIANCE_ADDRESS,
    walletAddress
  );
  const { decimals: yieldzDecimals } = useTokenBalance(walletAddress, YIELDZ_TOKEN_ADDRESS, true);

  /** Formatted unlockable amount for display (mirrors sell-tab logic) */
  const formattedAvailableToWithdraw = useMemo(() => {
    if (!unlockableAmount || !yieldzDecimals) {
      return DEFAULT_DISPLAY_VALUES.ZERO;
    }
    try {
      const formatted = formatUnits(unlockableAmount, yieldzDecimals);
      const numValue = Number.parseFloat(formatted);
      return formatNumberWithTwoDecimals(numValue);
    } catch {
      return DEFAULT_DISPLAY_VALUES.ZERO;
    }
  }, [unlockableAmount, yieldzDecimals]);

  const fetchPortfolioData = async () => {
    try {
      setIsLoading(true);
      const response = await getPortfolioAssetsSummary();
      if (response.status === 'success' && response.data) {
        setPortfolioData(response.data);
      } else {
        logger.warn('Portfolio assets summary API returned unsuccessful status', { response });
      }
    } catch (error) {
      handleServiceError(error, 'Failed to fetch portfolio data');
    } finally {
      setIsLoading(false);
    }
  };
  /**
   * Fetch portfolio assets summary data
   */
  useEffect(() => {
    fetchPortfolioData();
  }, []);

  /**
   * Format number to display string with commas
   */
  const formatNumber = useCallback((value: number | null | undefined): string => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '0.00';
    }
    return formatNumberWithTwoDecimals(value);
  }, []);

  /**
   * Format total yield earned for display
   */
  const formatTotalYieldEarned = useCallback((value: number | null | undefined): string => {
    const formatted = formatNumber(value);
    return `${formatted} BTC`;
  }, [formatNumber]);

  /**
   * Format total yield earned USD equivalent
   */
  const formatTotalYieldEarnedUsd = useCallback((value: number | null | undefined): string => {
    const formatted = formatNumber(value);
    return `=${formatted} USD`;
  }, [formatNumber]);

  /**
   * Format claimable yield for display
   */
  const formatClaimableYield = useCallback((value: number | null | undefined): string => {
    const formatted = formatNumber(value);
    return `${formatted} BTC`;
  }, [formatNumber]);

  /**
   * Format available to withdraw for display
   */
  const formatAvailableToWithdraw = useCallback((value: number | null | undefined): string => {
    const formatted = formatNumber(value);
    return `${formatted} USDC`;
  }, [formatNumber]);

  /**
   * Handle withdraw button click - open withdraw dialog
   */
  const handleWithdraw = useCallback(() => {
    setIsWithdrawDialogOpen(true);
  }, []);

  /**
   * Handle withdraw dialog close
   */
  const handleWithdrawDialogClose = useCallback(() => {
    setIsWithdrawDialogOpen(false);
  }, []);

  /**
   * Handle withdraw confirmation
   */
  const handleWithdrawConfirm = useCallback(
    (amount: string, currency: string, isFullWithdrawal: boolean) => {
      logger.debug('Withdraw confirmed', { amount, currency, isFullWithdrawal });
      // Close dialog after processing
      setIsWithdrawDialogOpen(false);
    },
    []
  );
    /**
   * Socket event handler for user verification updates
   * Memoized with fetchUserVerificationStatus as dependency
   */
    const handleSocketVerification = useCallback(
      (socketData: { title?: string; type?: string }) => {
        const isDepositCompleted = 
            socketData?.title?.includes('Deposit Completed') && 
            socketData?.type === 'TRANSACTION_UPDATE';
        if (isDepositCompleted) {
          fetchPortfolioData();
        }
      },
      [fetchPortfolioData]
    );
  
    /**
     * Socket Event Listener
     * Listens for user verification updates and refreshes status
     */
    useSocketEvents({
      autoJoin: true,
      events: {
        [SOCKET_EVENTS.NOTIFICATION_NEW]: handleSocketVerification,
      },
    });

  return (
    <Box sx={{ width: '100%' }}>
      {/* Portfolio Summary - Total yield earned */}
      <PortfolioSummarySection
        data={{
          yieldBtc: isLoading ? 'Loading...' : formatTotalYieldEarned(portfolioData?.totalYieldEarned),
          yieldUsd: isLoading ? 'Loading...' : formatTotalYieldEarnedUsd(portfolioData?.totalYieldEarnedInUSD),
        }}
      />
      <Stack gap={10} mt={3}>
        <CornerContainer outerSx={{ border: 'none' }} sx={{ borderRadius: '0' }}>
          {/* Claimable Yield & Withdraw Actions */}
          <PortfolioActionsSection
            data={{
              claimableYield: isLoading ? 'Loading...' : formatClaimableYield(portfolioData?.averageYieldEarned),
              /* Use blockchain value (same as sell-tab) so it matches investment card; show YLDZ amount */
              availableToWithdraw:
                isUnlockAmountLoading && !unlockableAmount
                  ? 'Loading...'
                  : `${formattedAvailableToWithdraw} YLDZ`,
            }}
            onWithdraw={handleWithdraw}
          />

          {/* Yield Growth Chart */}
          <CornerContainer showBorder={false} outerSx={{ borderTop: 'none' }}>
            <TokenChartSection
              coinId="usd-coin"
              useHoldingsData={true}
            />
          </CornerContainer>
        </CornerContainer>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'column', lg: 'row' },
            gap: 0,
            width: '100%',
            alignItems: 'stretch',
          }}
        >
          {/* Cash Flow Chart */}
          <CashFlowChartSection />

          {/* Portfolio Allocation Chart */}
          <PortfolioAllocationChartSection />
        </Box>

        {/* My Investments Listing */}
        <InvestmentsListingSection />
        {/* My Transactions Listing */}
        <TransactionsListingSection />
      </Stack>

      {/* Withdraw Dialog */}
      <WithdrawDialog
        open={isWithdrawDialogOpen}
        onClose={handleWithdrawDialogClose}
        availableBalance={isLoading ? '0.00' : formatAvailableToWithdraw(portfolioData?.availableToWithdraw)}
        pendingAmount="5000"
        onConfirm={handleWithdrawConfirm}
      />
    </Box>
  );
}

export default memo(PortfolioPage);
