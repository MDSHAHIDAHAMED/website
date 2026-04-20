'use client';

/**
 * MarketDetailsSection Component
 * ==============================
 * Displays key market metrics for a cryptocurrency token.
 *
 * Features:
 * - Market Cap with percentage change
 * - 24h Volume with percentage change
 * - Liquidity ratio
 * - Fully Diluted Valuation
 * - Total/Circulating Supply
 *
 * Uses data from coinDetail Redux state (fetched via CoinGecko API).
 *
 * @module components/sections/market-details-section
 */

import { Box, Grid, Skeleton, Tooltip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import React, { memo, useMemo } from 'react';

import AtomTypography from '@/components/atoms/typography';
import {
  YLDZS_TOKEN_DETAILS,
  type MarketStatMetric,
  type TokenDetailMetric,
} from '@/constants/yldzs-token';
import { useSelector, type RootState } from '@/store';
import { yieldzNeutral, yieldzSecondary } from '@/styles/theme/colors';

// =============================================================================
// Types
// =============================================================================

/**
 * Market metric item configuration
 */
interface MarketMetric {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Formatted value */
  value: string;
  /** Percentage change (optional) */
  change?: number;
  /** Tooltip description */
  tooltip: string;
}

/**
 * Props for MarketDetailsSection component
 */
interface MarketDetailsSectionProps {
  /** Coin ID (used to ensure data matches) */
  coinId?: string;
  /** Whether the section is static (default: false) */
  isStatic?: boolean;
}

// =============================================================================
// Constants & Styles
// =============================================================================

/** Section container styles */
const SECTION_CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  backgroundColor: yieldzNeutral[950],
  borderRadius: 0,
  p: 3,
};

/** Section header styles */
const SECTION_HEADER_SX: SxProps<Theme> = {
  mb: 3,
};

/** Metric card styles */
const METRIC_CARD_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

/** Label with info icon styles */
const LABEL_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
};

/** Skeleton base styles */
const SKELETON_SX: SxProps<Theme> = {
  bgcolor: yieldzNeutral[800],
  borderRadius: 0.5,
};

/** Number of skeleton items to display */
const SKELETON_COUNT = 5;

/** Skeleton dimensions */
const SKELETON_DIMENSIONS = {
  LABEL_WIDTH: 100,
  LABEL_HEIGHT: 16,
  VALUE_WIDTH: 150,
  VALUE_HEIGHT: 32,
  CHANGE_WIDTH: 60,
  CHANGE_HEIGHT: 14,
} as const;

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Format large numbers with appropriate suffixes (K, M, B, T)
 * @param value - Number to format
 * @param prefix - Currency prefix (e.g., '$')
 * @returns Formatted string
 */
function formatLargeNumber(value: number | null | undefined, prefix = '$'): string {
  if (value === null || value === undefined) return 'N/A';

  const absValue = Math.abs(value);

  if (absValue >= 1e12) {
    return `${prefix}${(value / 1e12).toFixed(2)}T`;
  }
  if (absValue >= 1e9) {
    return `${prefix}${(value / 1e9).toFixed(2)}B`;
  }
  if (absValue >= 1e6) {
    return `${prefix}${(value / 1e6).toFixed(2)}M`;
  }
  if (absValue >= 1e3) {
    return `${prefix}${(value / 1e3).toFixed(2)}K`;
  }

  return `${prefix}${value.toFixed(2)}`;
}

/**
 * Format supply number with symbol
 * @param value - Supply amount
 * @param symbol - Token symbol
 * @returns Formatted supply string
 */
function formatSupply(value: number | null | undefined, symbol: string): string {
  if (value === null || value === undefined) return 'N/A';

  const absValue = Math.abs(value);

  if (absValue >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B ${symbol.toUpperCase()}`;
  }
  if (absValue >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M ${symbol.toUpperCase()}`;
  }
  if (absValue >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K ${symbol.toUpperCase()}`;
  }

  return `${value.toFixed(2)} ${symbol.toUpperCase()}`;
}

/**
 * Format percentage value
 * @param value - Percentage value
 * @returns Formatted percentage string
 */
function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  return `${value.toFixed(2)}%`;
}

// =============================================================================
// Sub-Components
// =============================================================================

interface MetricCardProps {
  metric: MarketMetric;
}

/**
 * Individual metric display card
 * Displays label, value, and optional change percentage
 */
const MetricCard = memo(function MetricCard({ metric }: Readonly<MetricCardProps>): React.JSX.Element {
  // Extract change value for type narrowing
  const changeValue = metric.change;
  const hasChange = typeof changeValue === 'number';
  const isPositive = hasChange && changeValue >= 0;

  return (
    <Box sx={METRIC_CARD_SX}>
      {/* Label with info tooltip */}
      <Box sx={LABEL_ROW_SX}>
        <AtomTypography variant="button2" color="text.secondary">
          {metric.label}
        </AtomTypography>
        <Tooltip title={metric.tooltip} arrow placement="top">
          <Image
            src="/assets/icons/info-circle.svg"
            alt="info"
            width={16}
            height={16}
            style={{ cursor: 'help' }}
          />
        </Tooltip>
      </Box>

      {/* Value */}
      <AtomTypography variant="display3" fontType="tickerbit" color="text.primary">
        {metric.value}
      </AtomTypography>

      {/* Change percentage (if available) */}
      {hasChange && (
        <AtomTypography
          variant="caption"
          sx={{
            color: isPositive
              ? yieldzSecondary.green[500]
              : yieldzSecondary.red[500],
          }}
        >
          {isPositive ? '↑' : '↓'} {Math.abs(changeValue).toFixed(2)}%
        </AtomTypography>
      )}
    </Box>
  );
});

/**
 * Loading skeleton for metric cards
 * Displays placeholder for label, value, and change percentage
 */
const MetricSkeleton = memo(function MetricSkeleton(): React.JSX.Element {
  return (
    <Box sx={METRIC_CARD_SX}>
      <Skeleton
        variant="text"
        width={SKELETON_DIMENSIONS.LABEL_WIDTH}
        height={SKELETON_DIMENSIONS.LABEL_HEIGHT}
        sx={SKELETON_SX}
        animation="wave"
      />
      <Skeleton
        variant="text"
        width={SKELETON_DIMENSIONS.VALUE_WIDTH}
        height={SKELETON_DIMENSIONS.VALUE_HEIGHT}
        sx={SKELETON_SX}
        animation="wave"
      />
      <Skeleton
        variant="text"
        width={SKELETON_DIMENSIONS.CHANGE_WIDTH}
        height={SKELETON_DIMENSIONS.CHANGE_HEIGHT}
        sx={SKELETON_SX}
        animation="wave"
      />
    </Box>
  );
});

// =============================================================================
// Static YLDZ Components
// =============================================================================

export interface StaticMetricCardProps {
  metric: MarketStatMetric | TokenDetailMetric;
  isCenter?: boolean;
  index?: number;
}

/**
 * Static metric card for YLDZ token
 * Displays label, value, and optional change with yield icon support
 */
function StaticMetricCardComponent({ metric, isCenter = false, index = 0 }: Readonly<StaticMetricCardProps>): React.JSX.Element {
  const hasChange = typeof metric.change === 'number';
  const isPositive = hasChange && (metric.change ?? 0) >= 0;
  const isYield = 'isYield' in metric && metric.isYield;

  return (
    <Box sx={{ ...METRIC_CARD_SX, justifyContent: isCenter ? 'center' : 'flex-start', alignItems: isCenter ? 'center' : 'flex-start', width: '100%', paddingBottom: index === 0 && !isCenter ? 1 : 0, borderBottom: index === 0 && !isCenter ? `1px solid ${yieldzNeutral[800]}` : 'none', }}>
      {/* Label with info tooltip */}
      <Box sx={LABEL_ROW_SX}>
        <AtomTypography variant="label3" color="text.secondary">
          {metric.label}
        </AtomTypography>
        <Tooltip title={metric.tooltip} arrow placement="top">
          <Image
            src="/assets/icons/info-circle.svg"
            alt="info"
            width={12}
            height={12}
            style={{ cursor: 'help' }}
          />
        </Tooltip>
      </Box>

      {/* Value with optional yield icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, height: '100%', }}>
        <AtomTypography variant={index < 1 ? 'display3' : 'body3'} fontType={index < 1 ? 'tickerbit' : 'ppMori'} color="text.primary">
          {metric.value}
        </AtomTypography>
        {isYield && (
          <Image src="/assets/icons/boltz.svg" alt="boltz" width={28} height={28} />
        )}
      </Box>

      {/* Change percentage (if available) */}
      {hasChange ? (
        <AtomTypography
          variant="button3"
          sx={{
            color: isPositive
              ? yieldzSecondary.green[500]
              : yieldzSecondary.red[500],

            textAlign: 'center',
          }}
        >
          <Image src={"/assets/icons/chevron-up.svg"} alt="arrow" width={10} height={10} style={{ margin: "0 4px", transform: isPositive ? 'rotate(0deg)' : 'rotate(180deg)' }} />
          {Math.abs(metric.change ?? 0).toFixed(2)}%
        </AtomTypography>
      ) : (
        <AtomTypography variant="button3" color="text.secondary">
          &nbsp;
        </AtomTypography>
      )}
    </Box>
  );
}

export const StaticMetricCard = memo(StaticMetricCardComponent);

/**
 * Reorganize token details into 3 vertical columns
 * Column 1: items 0, 3, 6 | Column 2: items 1, 4, 7 | Column 3: items 2, 5, 8
 */
function getColumnizedTokenDetails(): TokenDetailMetric[][] {
  const columns: TokenDetailMetric[][] = [[], [], []];
  YLDZS_TOKEN_DETAILS.forEach((item, index) => {
    const columnIndex = index % 3;
    columns[columnIndex].push(item);
  });
  return columns;
}

/** Column container styles for vertical layout */
const TOKEN_DETAILS_COLUMN_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  flex: 1,
};

/** Token details row container - 3 columns */
const TOKEN_DETAILS_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 3,
  width: '100%',
  mt: 2
};

/**
 * Static YLDZ Market Details Section
 * Displays market stats and token details in a 3-column vertical layout
 */
const StaticYLDZSSection = memo(function StaticYLDZSSection(): React.JSX.Element {
  // Get token details organized into 3 columns
  const columns = getColumnizedTokenDetails();

  return (
    <Box sx={{ ...SECTION_CONTAINER_SX, p: { xs: 2, sm: 3, md: 5 }, gap: { xs: 2, sm: 3, md: 3 } }}>
      {/* Token Details Section Header */}
      <Box>
        <AtomTypography variant="h4" color="text.primary">
          Token Details
        </AtomTypography>

      </Box>
      {/* Token Details - 3 Vertical Columns */}
      <Box sx={TOKEN_DETAILS_ROW_SX}>
        {columns.map((column) => (
          <Box key={`column-${column[0]?.id ?? 'empty'}`} sx={TOKEN_DETAILS_COLUMN_SX}>
            {column.map((metric, metricIndex) => (
              <StaticMetricCard key={metric.id} metric={metric} index={metricIndex} />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
});

// =============================================================================
// Main Component
// =============================================================================

/**
 * MarketDetailsSection Component
 *
 * Displays a grid of market metrics including:
 * - Market Cap
 * - 24h Volume
 * - Liquidity
 * - Fully Diluted Valuation
 * - Total Supply
 *
 * @param props - Component props
 * @returns Market details section JSX element
 */
/** Memoized selector for coin detail data */
const selectCoinDetailState = (state: RootState) => ({
  coinDetail: state.coingecko.coinDetail,
  isLoadingCoinDetail: state.coingecko.isLoadingCoinDetail,
});

function MarketDetailsSection({
  coinId,
  isStatic = false,
}: Readonly<MarketDetailsSectionProps>): React.JSX.Element {
  // Redux state with memoized selector
  const { coinDetail, isLoadingCoinDetail } = useSelector(selectCoinDetailState);

  /**
   * Build market metrics from coin detail data
   * Note: Hook must be called unconditionally (before early returns)
   */
  const marketMetrics: MarketMetric[] = useMemo(() => {
    if (!coinDetail?.market_data) {
      return [];
    }

    const marketData = coinDetail.market_data;
    const symbol = coinDetail.symbol || '';

    // Calculate liquidity ratio (volume / market cap * 100)
    const marketCap = marketData.market_cap?.usd || 0;
    const volume24h = marketData.total_volume?.usd || 0;
    const liquidityRatio = marketCap > 0 ? (volume24h / marketCap) * 100 : 0;

    return [
      {
        id: 'market_cap',
        label: 'MARKET CAP',
        value: formatLargeNumber(marketData.market_cap?.usd),
        change: marketData.market_cap_change_percentage_24h,
        tooltip: 'Total market value of the cryptocurrency (price × circulating supply)',
      },
      {
        id: 'volume_24h',
        label: 'VOLUME (24H)',
        value: formatLargeNumber(marketData.total_volume?.usd),
        change: marketData.price_change_percentage_24h, // Using price change as proxy for volume trend
        tooltip: 'Total trading volume across all exchanges in the last 24 hours',
      },
      {
        id: 'liquidity',
        label: 'LIQUIDITY',
        value: formatPercentage(liquidityRatio),
        tooltip: 'Liquidity ratio calculated as 24h volume / market cap. Higher values indicate better liquidity.',
      },
      {
        id: 'fdv',
        label: 'FULLY-DILUTED VALUE',
        value: formatLargeNumber(marketData.fully_diluted_valuation?.usd),
        tooltip: 'Market cap if the maximum supply was in circulation (price × max supply)',
      },
      {
        id: 'total_supply',
        label: 'TOTAL SUPPLY',
        value: formatSupply(marketData.total_supply, symbol),
        tooltip: 'Total number of tokens that have been created, minus any that have been burned',
      },
    ];
  }, [coinDetail]);

  // Return static YLDZ section if isStatic is true
  if (isStatic) {
    return <StaticYLDZSSection />;
  }

  // Show loading state
  if (isLoadingCoinDetail) {
    return (
      <Box sx={SECTION_CONTAINER_SX}>
        <Box sx={SECTION_HEADER_SX}>
          <AtomTypography variant="h4" color="text.primary">
            Market Details
          </AtomTypography>
        </Box>
        <Grid container spacing={4}>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <Grid key={`skeleton-${index}`} size={{ xs: 6, sm: 4, md: 2.4 }}>
              <MetricSkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Show empty state if no data
  if (!coinDetail || marketMetrics.length === 0) {
    return (
      <Box sx={SECTION_CONTAINER_SX}>
        <Box sx={SECTION_HEADER_SX}>
          <AtomTypography variant="h4" color="text.primary">
            Market Details
          </AtomTypography>
        </Box>
        <AtomTypography variant="body2" color="text.secondary">
          Market data not available
        </AtomTypography>
      </Box>
    );
  }

  return (
    <Box sx={SECTION_CONTAINER_SX}>
      {/* Section Header */}
      <Box sx={SECTION_HEADER_SX}>
        <AtomTypography variant="h4" color="text.primary">
          Market Details
        </AtomTypography>
      </Box>

      {/* Metrics Grid */}
      <Grid container spacing={4}>
        {marketMetrics.map((metric) => (
          <Grid key={metric.id} size={{ xs: 6, sm: 4, md: 2.4 }}>
            <MetricCard metric={metric} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default memo(MarketDetailsSection);

