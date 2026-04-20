/**
 * Holdings Card Component
 * ========================
 * 
 * Displays user's token holdings and earnings
 * Fetches data from portfolio/assets-summary API endpoint
 */

'use client';

import AtomTypography from '@/components/atoms/typography';
import { DetailRow } from '@/components/sections/investment-section/detail-row/detail-row';
import { logger } from '@/lib/default-logger';
import { getPortfolioAssetsSummary, type PortfolioAssetsSummaryData } from '@/services/portfolio';
import { yieldzNeutral } from '@/styles/theme/colors';
import { handleServiceError } from '@/utils/error-handler';
import { formatNumberWithTwoDecimals } from '@/utils/number-format';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CornerContainer } from 'yldzs-components';

// =============================================================================
// Styles
// =============================================================================

/** Card container styles */
const CARD_CONTAINER_SX: SxProps<Theme> = {
  backgroundColor: yieldzNeutral[950],
  p: 5,
  width: '100%',
  gap: 4,
};

/** Holdings value row */
const HOLDINGS_VALUE_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  mb: 3,
  mt: 1.5
};

// =============================================================================
// Component
// =============================================================================

/**
 * Holdings Card Component
 * 
 * Displays user's token holdings and earnings
 * Fetches data from portfolio/assets-summary API endpoint
 * 
 * @returns Holdings card JSX element
 */
export const HoldingsCard = memo(function HoldingsCard(): React.JSX.Element {
  const { t } = useTranslation('investment');
  const [portfolioData, setPortfolioData] = useState<PortfolioAssetsSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch portfolio assets summary data from API
   */
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setIsLoading(true);
        const response = await getPortfolioAssetsSummary();
        if (response.status === 'success' && response.data) {
          setPortfolioData(response.data);
          logger.debug('Portfolio assets summary fetched successfully for holdings card', { data: response.data });
        } else {
          logger.warn('Portfolio assets summary API returned unsuccessful status', { response });
        }
      } catch (error) {
        const errorMessage = handleServiceError(error, 'Failed to fetch portfolio data');
        logger.error('Failed to fetch portfolio assets summary for holdings card', { error, errorMessage });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  /**
   * Format number to display string with commas and 2 decimal places
   */
  const formatNumber = useCallback((value: number | null | undefined): string => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '0.00';
    }
    return formatNumberWithTwoDecimals(value);
  }, []);

  /**
   * Format holdings (remainingDeposits) for display
   */
  const formatHoldings = useCallback((value: number | null | undefined): string => {
    return formatNumber(value);
  }, [formatNumber]);

  /**
   * Format BTC earnings (totalYieldEarned) for display
   */
  const formatBtcEarnings = useCallback((value: number | null | undefined): string => {
    const formatted = formatNumber(value);
    return `${formatted} BTC`;
  }, [formatNumber]);

  /**
   * Format USD value (totalYieldEarned in USD) for display
   */
  const formatUsdValue = useCallback((value: number | null | undefined): string => {
    const formatted = formatNumber(value);
    return `$${formatted}`;
  }, [formatNumber]);

  /** Display values from API data; show loading text from locales while fetching */
  const holdingsValue = isLoading
    ? t('loading')
    : formatHoldings(portfolioData?.remainingDeposits);

  const btcEarningsValue = isLoading
    ? t('loading')
    : formatBtcEarnings(portfolioData?.totalYieldEarned);

  const usdValue = isLoading
    ? t('loading')
    : formatUsdValue(portfolioData?.remainingDeposits);

  return (
    <CornerContainer sx={{ ...CARD_CONTAINER_SX, gap: 3 }}>
      {/* Header */}
      <AtomTypography variant="h4" color="text.primary">
        Your Holdings
      </AtomTypography>

      {/* Token Balance - using remainingDeposits from API */}
      <Box sx={HOLDINGS_VALUE_SX}>
        <Image src="/assets/logo-emblem.png" alt="YLDZ" width={20} height={20} />
        <AtomTypography variant="display3" fontType="tickerbit" color="text.primary">
          {holdingsValue}
        </AtomTypography>
      </Box>

      {/* Earnings Details */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* BTC Earnings - using totalYieldEarned from API */}
        <DetailRow
          label="BTC Earnings"
          variant="body4"
          value={btcEarningsValue}
          icon={<Image src="/assets/logo-btc.svg" alt="BTC" width={14} height={14} />}
        />
        {/* USD Value - using remainingDeposits (same as holdings value) */}
        <DetailRow variant="body4" label="USD Value" value={usdValue} />
      </Box>
    </CornerContainer>
  );
});

