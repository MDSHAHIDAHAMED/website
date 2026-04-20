'use client';

/**
 * TokenChartSection Component
 * ===========================
 * Displays a price chart using Recharts with Area or Line chart options.
 * Fetches real data from CoinGecko Market Chart Range API.
 *
 * Features:
 * - Real-time price data from CoinGecko API
 * - Time period selector (1M, 3M, 6M, 1Y, 5Y, ALL)
 * - Coin filter (BTC, USDC) with URL query parameter sync
 * - Toggle between Area and Line chart
 * - URL query parameters: chartType (always) and token (only when coin filter is shown and selected)
 * - Smooth chart with gradient fill (Area) or clean line (Line)
 * - Custom tooltip showing price and date
 * - Responsive design
 * - Loading and error states
 *
 * @module components/sections/token-chart-section
 */
import { useDispatch, useSelector, type RootState } from '@/store';
import { clearMarketChart } from '@/store/slices/coingecko-slice';
import { clearHoldingsChartData } from '@/store/slices/portfolio-slice';
import { fetchMarketChartRangeThunk } from '@/store/thunks/coingecko-thunk';
import { fetchHoldingsChartThunk } from '@/store/thunks/portfolio-thunk';
import { Box, Skeleton, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { ChartSkeleton } from '@/components/atoms/skeleton/chart-skeleton';
import AtomTypography from '@/components/atoms/typography';
import { SOCKET_EVENTS } from '@/constants';
import useSocketEvents from '@/hooks/use-socket-events';
import {
  CHART_CENTER_CONTAINER_SX,
  CHART_CONTROLS_ROW_SX,
  CHART_HEIGHT,
  CHART_SECTION_CONTAINER_SX,
  CHART_TOOLTIP_CONTAINER_SX,
  ChartTypeToggle,
  CoinFilterSelector,
  CoinFilterType,
  createChartContainerSx,
  DEFAULT_CHART_TYPE,
  DEFAULT_PERIOD_INDEX,
  downsamplePriceData,
  formatAxisValue,
  formatCurrency,
  formatPercentage,
  formatTooltipDate,
  formatVolume,
  formatXAxisTick,
  getCurrentTimestamp,
  getTimestampDaysAgo,
  MAX_DATA_POINTS,
  PRICE_CHART_COLORS,
  PRICE_CHART_TIME_PERIODS,
  TimePeriodSelector,
  type ChartType,
  type PriceChartDataPoint,
} from '@/lib/chart-utils';
import { yieldzNeutral, yieldzPrimary, yieldzSecondary } from '@/styles/theme/colors';

// =============================================================================
// Types
// =============================================================================

/**
 * Props for TokenChartSection component
 */
interface TokenChartSectionProps {
  /** Coin ID to fetch data for (e.g., 'bitcoin', 'ethereum') */
  coinId?: string;
  /** Target currency (default: 'usd') */
  vsCurrency?: string;
  /** Whether to show the coin filter (USDC/BTC) - defaults to false, auto-enabled when useHoldingsData is true */
  showCoinFilter?: boolean;
  /** Callback when coin filter changes */
  onCoinFilterChange?: (coin: CoinFilterType) => void;
  /** Whether to use holdings chart data instead of CoinGecko data (for portfolio page) */
  useHoldingsData?: boolean;
}

// =============================================================================
// Styles
// =============================================================================

/** Header row styles */
const HEADER_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  mb: 3,
};

/** Chart container styles */
const CHART_CONTAINER_SX = createChartContainerSx(CHART_HEIGHT);

/** Skeleton base styles */
const SKELETON_SX: SxProps<Theme> = {
  bgcolor: yieldzNeutral[800],
  borderRadius: 0.5,
};

/** Price header skeleton dimensions */
const HEADER_SKELETON = {
  PRICE_WIDTH: 180,
  PRICE_HEIGHT: 40,
  CHANGE_WIDTH: 120,
  CHANGE_HEIGHT: 24,
} as const;

// =============================================================================
// Selectors
// =============================================================================

/** Memoized selector for market chart state */
const selectMarketChartState = (state: RootState) => ({
  marketChart: state.coingecko.marketChart,
  isLoadingMarketChart: state.coingecko.isLoadingMarketChart,
  marketChartError: state.coingecko.marketChartError,
});

/** Memoized selector for holdings chart state */
const selectHoldingsChartState = (state: RootState) => ({
  holdingsChartData: state.portfolio.holdingsChartData,
  isLoadingHoldingsChart: state.portfolio.isHoldingsChartLoading,
  holdingsChartError: state.portfolio.holdingsChartError,
});

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Price Header Skeleton
 * Displays skeleton for price and change percentage while loading
 */
const PriceHeaderSkeleton = memo(function PriceHeaderSkeleton(): React.JSX.Element {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Skeleton
        variant="text"
        width={HEADER_SKELETON.PRICE_WIDTH}
        height={HEADER_SKELETON.PRICE_HEIGHT}
        sx={SKELETON_SX}
        animation="wave"
      />
      <Skeleton
        variant="text"
        width={HEADER_SKELETON.CHANGE_WIDTH}
        height={HEADER_SKELETON.CHANGE_HEIGHT}
        sx={SKELETON_SX}
        animation="wave"
      />
    </Stack>
  );
});

/**
 * Custom tooltip component for the price chart
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: PriceChartDataPoint }>;
}

const CustomTooltip = memo(function CustomTooltip({ active, payload }: Readonly<CustomTooltipProps>) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0];
  const volume = data.payload.volume;

  return (
    <Box sx={CHART_TOOLTIP_CONTAINER_SX}>
      <AtomTypography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        {data.payload.dateLabel}
      </AtomTypography>
      <AtomTypography variant="body2" fontType="tickerbit" sx={{ color: yieldzPrimary[500] }}>
        {formatCurrency(data.value)}
      </AtomTypography>
      {volume !== undefined && (
        <AtomTypography variant="body2" fontType="tickerbit" sx={{ display: 'block', mt: 0.5 }}>
          Vol: {formatVolume(volume)}
        </AtomTypography>
      )}
    </Box>
  );
});

// =============================================================================
// Main Component
// =============================================================================

/**
 * TokenChartSection Component
 *
 * Displays a price chart with real data from CoinGecko API:
 * - Current price and percentage change header
 * - Time period selector
 * - Chart type toggle (Area / Line)
 * - Recharts visualization
 * - Custom tooltip
 *
 * @param props - Component props
 * @returns Chart section JSX element
 */
function TokenChartSection({
  coinId = 'usd-coin',
  vsCurrency = 'usd',
  showCoinFilter,
  onCoinFilterChange,
  useHoldingsData = false,
}: Readonly<TokenChartSectionProps>): React.JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Show coin filter only when explicitly enabled or when using holdings data (portfolio page)
  const shouldShowCoinFilter = showCoinFilter ?? useHoldingsData;

  // Redux state with memoized selectors
  const { marketChart, isLoadingMarketChart, marketChartError } = useSelector(selectMarketChartState);
  const { holdingsChartData, isLoadingHoldingsChart, holdingsChartError } = useSelector(selectHoldingsChartState);

  /**
   * Get initial period index from URL or default
   * Returns the index for time period filters (1M, 3M, 6M, 1Y, 5Y, ALL)
   */
  const getInitialPeriodIndex = (): number => {
    const chartTypeParam = searchParams.get('chartType');
    if (chartTypeParam) {
      const periodIndex = PRICE_CHART_TIME_PERIODS.findIndex(
        (period) => period.label.toUpperCase() === chartTypeParam.toUpperCase()
      );
      if (periodIndex !== -1) return periodIndex;
    }
    return DEFAULT_PERIOD_INDEX;
  };

  /**
   * Get initial coin from URL or default
   */
  const getInitialCoin = (): CoinFilterType => {
    const tokenParam = searchParams.get('token');
    if (tokenParam === 'USDC' || tokenParam === 'BTC') {
      return tokenParam as CoinFilterType;
    }
    return 'USDC';
  };

  // Local state for selected time period (UI and API)
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(getInitialPeriodIndex);

  // Local state for chart type (area/line)
  const [chartType, setChartType] = useState<ChartType>(DEFAULT_CHART_TYPE);

  // Local state for coin filter
  const [selectedCoin, setSelectedCoin] = useState<CoinFilterType>(getInitialCoin);

  // Track the last selected time period index for API calls
  // This ensures we fetch data for the correct time period
  const [lastTimePeriodIndex, setLastTimePeriodIndex] = useState(getInitialPeriodIndex);

  // Get selected period configuration
  const selectedPeriod = PRICE_CHART_TIME_PERIODS[selectedPeriodIndex];

  /**
   * Update URL query parameters when filters change
   * - Time periods (1M, 3M, 6M, 1Y, 5Y, ALL) go to chartType
   * - BTC/USDC go to token
   */
  const updateQueryParams = useCallback(
    (timePeriodIndex?: number, coin?: CoinFilterType) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update chartType with time period
      const timePeriodIdx = timePeriodIndex ?? lastTimePeriodIndex;
      if (timePeriodIdx >= 0 && timePeriodIdx < PRICE_CHART_TIME_PERIODS.length) {
        params.set('chartType', PRICE_CHART_TIME_PERIODS[timePeriodIdx].label.toUpperCase());
      }

      // Update token with BTC or USDC
      const selectedToken = coin ?? selectedCoin;
      if (shouldShowCoinFilter && selectedToken) {
        params.set('token', selectedToken);
      } else if (!shouldShowCoinFilter) {
        params.delete('token');
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, lastTimePeriodIndex, selectedCoin, shouldShowCoinFilter]
  );

  // Ref to track the last fetched chart type and token to prevent duplicate API calls
  const lastFetchedChartTypeRef = useRef<string | null>(null);
  const lastFetchedTokenRef = useRef<CoinFilterType | null>(null);
  const lastFetchedPeriodIndexRef = useRef<number | null>(null);

      /**
   * Socket event handler for holdings chart updates
   * Memoized with dispatch and chartType as dependency
   */
      const handleSocketVerification = useCallback(
        (socketData: { title?: string; type?: string }) => {
          const isDepositCompleted = 
              socketData?.title?.includes('Deposit Completed') && 
              socketData?.type === 'TRANSACTION_UPDATE';
          if (isDepositCompleted && useHoldingsData) {
            dispatch(fetchHoldingsChartThunk({ chartType: chartType }));
          }
        },
        [dispatch, chartType]
      );
    
      /**
       * Socket Event Listener
       * Listens for holdings chart updates and refreshes status
       */
      useSocketEvents({
        autoJoin: true,
        events: {
          [SOCKET_EVENTS.NOTIFICATION_NEW]: handleSocketVerification,
        },
      });

  /**
   * Fetch chart data from API
   * Uses holdings endpoint if useHoldingsData is true, otherwise CoinGecko
   * Triggers when time period or token (BTC/USDC) changes
   */
  useEffect(() => {
    const timePeriodIdx = lastTimePeriodIndex;
    const POLLING_INTERVAL_MS = 60000;

    if (useHoldingsData) {
      const chartTypeLabel = PRICE_CHART_TIME_PERIODS[timePeriodIdx].label;
      const currentToken = shouldShowCoinFilter ? selectedCoin : undefined;

      // Skip if we already fetched this exact chart type and token combination
      if (
        lastFetchedChartTypeRef.current === chartTypeLabel &&
        lastFetchedTokenRef.current === currentToken
      ) {
        return;
      }

      // Update refs and fetch
      lastFetchedChartTypeRef.current = chartTypeLabel;
      lastFetchedTokenRef.current = currentToken ?? null;
      lastFetchedPeriodIndexRef.current = timePeriodIdx;

      dispatch(
        fetchHoldingsChartThunk({
          chartType: chartTypeLabel,
          ...(currentToken && { token: currentToken }),
        })
      );

      // Set up polling interval
      const intervalId = setInterval(() => {
        const chartTypeLabel = PRICE_CHART_TIME_PERIODS[lastTimePeriodIndex].label;
        const currentToken = shouldShowCoinFilter ? selectedCoin : undefined;
        dispatch(
          fetchHoldingsChartThunk({
            chartType: chartTypeLabel,
            ...(currentToken && { token: currentToken }),
          })
        );
      }, POLLING_INTERVAL_MS);

      return () => clearInterval(intervalId);
    }

    // CoinGecko data fetching
    if (lastFetchedPeriodIndexRef.current === timePeriodIdx) {
      return;
    }

    lastFetchedPeriodIndexRef.current = timePeriodIdx;
    const periodDays = PRICE_CHART_TIME_PERIODS[timePeriodIdx].days;

    dispatch(
      fetchMarketChartRangeThunk({
        id: coinId,
        vsCurrency,
        from: getTimestampDaysAgo(periodDays),
        to: getCurrentTimestamp(),
      })
    );

    // Set up polling interval
    const intervalId = setInterval(() => {
      const periodDays = PRICE_CHART_TIME_PERIODS[lastTimePeriodIndex].days;
      dispatch(
        fetchMarketChartRangeThunk({
          id: coinId,
          vsCurrency,
          from: getTimestampDaysAgo(periodDays),
          to: getCurrentTimestamp(),
        })
      );
    }, POLLING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [dispatch, useHoldingsData, lastTimePeriodIndex, coinId, vsCurrency, selectedCoin, shouldShowCoinFilter]);

  /**
   * Cleanup Redux state only on component unmount
   */
  useEffect(() => {
    return () => {
      if (useHoldingsData) {
        dispatch(clearHoldingsChartData());
      } else {
        dispatch(clearMarketChart());
      }
    };
  }, [dispatch, useHoldingsData]);

  /**
   * Handle period selection (time period from TimePeriodSelector)
   */
  const handlePeriodSelect = useCallback(
    (index: number) => {
      setSelectedPeriodIndex(index);
      setLastTimePeriodIndex(index);
      updateQueryParams(index);
    },
    [updateQueryParams]
  );

  /**
   * Handle chart type selection (area/line)
   */
  const handleChartTypeSelect = useCallback((type: ChartType) => {
    setChartType(type);
  }, []);

  /**
   * Handle coin filter selection (BTC/USDC)
   */
  const handleCoinFilterSelect = useCallback(
    (coin: CoinFilterType) => {
      setSelectedCoin(coin);
      updateQueryParams(undefined, coin);
      onCoinFilterChange?.(coin);
    },
    [onCoinFilterChange, updateQueryParams]
  );

  /**
   * Sync state with URL query parameters on mount and when URL changes
   * Sets initial query parameters if they're missing (only once on mount)
   */
  const hasInitializedParamsRef = useRef(false);
  useEffect(() => {
    const chartTypeParam = searchParams.get('chartType');
    const tokenParam = searchParams.get('token');

    // Set initial query parameters only once if chartType is missing
    if (!hasInitializedParamsRef.current && !chartTypeParam) {
      hasInitializedParamsRef.current = true;
      updateQueryParams();
      return;
    }

    hasInitializedParamsRef.current = true;

    // Update time period index from URL
    if (chartTypeParam) {
      const periodIndex = PRICE_CHART_TIME_PERIODS.findIndex(
        (period) => period.label.toUpperCase() === chartTypeParam.toUpperCase()
      );
      if (periodIndex !== -1) {
        setLastTimePeriodIndex(periodIndex);
        setSelectedPeriodIndex(periodIndex);
      }
    }

    // Update coin from URL
    if (shouldShowCoinFilter) {
      if (tokenParam === 'USDC' || tokenParam === 'BTC') {
        const coin = tokenParam as CoinFilterType;
        if (coin !== selectedCoin) {
          setSelectedCoin(coin);
          onCoinFilterChange?.(coin);
        }
      } else if (!tokenParam) {
        setSelectedCoin('USDC');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, shouldShowCoinFilter]);

  /**
   * Process chart data for Recharts
   * Uses holdings data if useHoldingsData is true, otherwise CoinGecko data
   */
  const chartData = useMemo(() => {
    if (useHoldingsData) {
      if (!holdingsChartData?.length) return [];

      return holdingsChartData.map((point) => ({
        timestamp: point.date * 1000,
        price: Number.parseFloat(point.balance),
        dateLabel: formatTooltipDate(point.date * 1000, selectedPeriod.days),
      }));
    }

    if (!marketChart?.prices?.length) return [];

    return downsamplePriceData(marketChart.prices, MAX_DATA_POINTS, selectedPeriod.days, marketChart.total_volumes);
  }, [useHoldingsData, holdingsChartData, marketChart, selectedPeriod.days]);

  /**
   * Calculate current price and change
   * For holdings data, shows balance instead of price
   */
  const priceInfo = useMemo(() => {
    if (chartData.length === 0) {
      return {
        currentPrice: '$0.00',
        priceChange: '0.00%',
        isPositive: true,
        showChange: false,
      };
    }

    const startPrice = chartData[0]?.price ?? 0;
    const currentPrice = chartData.at(-1)?.price ?? 0;
    
    // Calculate actual percentage change
    let changePercent = 0;
    let showChange = false;
    
    if (startPrice > 0) {
      // Calculate actual percentage change: ((current - start) / start) * 100
      changePercent = ((currentPrice - startPrice) / startPrice) * 100;
      showChange = Number.isFinite(changePercent) && currentPrice > 0;
    } else if (currentPrice > 0) {
      // Edge case: started at 0 or very small, now has value
      // Use a very small epsilon (0.000001) to calculate percentage without division by zero
      // This gives a meaningful large percentage representing growth from near-zero
      const epsilon = 0.000001;
      changePercent = ((currentPrice - epsilon) / epsilon) * 100;
      showChange = Number.isFinite(changePercent);
    }

    return {
      currentPrice: formatCurrency(currentPrice),
      priceChange: formatPercentage(changePercent),
      isPositive: changePercent >= 0,
      showChange,
    };
  }, [chartData]);

  // Determine loading and error states based on data source
  const isLoading = useHoldingsData ? isLoadingHoldingsChart : isLoadingMarketChart;
  const error = useHoldingsData ? holdingsChartError : marketChartError;

  // Calculate Y-axis domain with padding
  const yAxisDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 100];

    const prices = chartData.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1;

    return [min - padding, max + padding];
  }, [chartData]);

  // X-axis tick formatter
  const xAxisTickFormatter = useCallback(
    (timestamp: number) => formatXAxisTick(timestamp, selectedPeriod.days),
    [selectedPeriod.days]
  );

  // =========================================================================
  // Render Chart Content
  // =========================================================================

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };

    const xAxisProps = {
      dataKey: 'timestamp' as const,
      tickFormatter: xAxisTickFormatter,
      axisLine: false,
      tickLine: false,
      tick: { fill: PRICE_CHART_COLORS.axis, fontSize: 10, fontWeight: 600 },
      tickMargin: 10,
      minTickGap: 50,
    };

    const yAxisProps = {
      domain: yAxisDomain as [number, number],
      tickFormatter: formatAxisValue,
      axisLine: false,
      tickLine: false,
      tick: { fill: PRICE_CHART_COLORS.axis, fontSize: 10, fontWeight: 600 },
      tickMargin: 5,
      width: 60,
    };

    const tooltipProps = {
      content: <CustomTooltip />,
      cursor: {
        stroke: yieldzPrimary[500],
        strokeWidth: 1,
        strokeDasharray: '4 4',
      },
    };

    const activeDotProps = {
      r: 4,
      fill: PRICE_CHART_COLORS.dot,
      stroke: PRICE_CHART_COLORS.dotStroke,
      strokeWidth: 2,
    };

    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <LineChart {...commonProps}>
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip {...tooltipProps} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={PRICE_CHART_COLORS.stroke}
              strokeWidth={2}
              dot={false}
              activeDot={activeDotProps}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    // Default: Area Chart
    return (
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <AreaChart {...commonProps}>
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PRICE_CHART_COLORS.fillStart} />
              <stop offset="100%" stopColor={PRICE_CHART_COLORS.fillEnd} />
            </linearGradient>
          </defs>

          <XAxis {...xAxisProps} />
          <YAxis {...yAxisProps} />
          <Tooltip {...tooltipProps} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={PRICE_CHART_COLORS.stroke}
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={false}
            activeDot={activeDotProps}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  // =========================================================================
  // Render
  // =========================================================================

  /**
   * Render the price content section
   * Extracted from JSX to reduce nested ternary complexity
   */
  const renderPriceContent = (): React.ReactNode => {
    if (isLoading) {
      return <PriceHeaderSkeleton />;
    }
    if (useHoldingsData) {
      return null;
    }
  return (
      <Stack direction="row" alignItems="center" spacing={2}>
            <AtomTypography variant="display3" fontType="tickerbit" color="text.primary">
              {priceInfo.currentPrice}
            </AtomTypography>
            {priceInfo.showChange && (
              <AtomTypography
                variant="subtitle4"
                sx={{
                  color: priceInfo.isPositive ? yieldzSecondary.green[500] : yieldzSecondary.red[500],
                }}
              >
                {priceInfo.isPositive ? '↑' : '↓'} {priceInfo.priceChange} ({selectedPeriod.label})
              </AtomTypography>
            )}
      </Stack>
    );
  };

  return (
    <Box sx={CHART_SECTION_CONTAINER_SX}>
      {/* Header Row */}
      <Box sx={HEADER_ROW_SX}>
        {/* Price Info */}
        <Box>
          {useHoldingsData ? (
            <AtomTypography variant="h4" color="text.primary">
              Yield growth
            </AtomTypography>
          ) : (
            <AtomTypography variant="label3" color="text.secondary">
              PRICE CHART
            </AtomTypography>
          )}
          {renderPriceContent()}
        </Box>

        {/* Controls: Coin Filter (BTC/USDC) + Time Period Selector + Chart Type Toggle */}
        <Box sx={CHART_CONTROLS_ROW_SX}>
          {/* BTC/USDC Coin Filter - Only shown on portfolio page (user holdings) */}
          {shouldShowCoinFilter && (
            <CoinFilterSelector activeCoin={selectedCoin} onSelect={handleCoinFilterSelect} disabled={isLoading} />
          )}
          {/* Time Period Filters: 1M, 3M, 6M, 1Y, 5Y, ALL */}
          <TimePeriodSelector
            activeIndex={selectedPeriodIndex}
            onSelect={handlePeriodSelect}
            disabled={isLoading}
            periods={PRICE_CHART_TIME_PERIODS}
          />
          {/* Chart Type Toggle: Area/Line */}
          <ChartTypeToggle activeType={chartType} onSelect={handleChartTypeSelect} disabled={isLoading} />
        </Box>
      </Box>

      {/* Chart Container */}
      <Box sx={CHART_CONTAINER_SX}>
        {/* Loading State - Chart Skeleton */}
        {isLoading && <ChartSkeleton />}

        {/* Error State */}
        {!isLoading && error && (
          <Box sx={CHART_CENTER_CONTAINER_SX}>
            <AtomTypography variant="body2" color="error">
              {error}
            </AtomTypography>
          </Box>
        )}

        {/* Chart - renders when not loading, no error, and has data */}
        {!isLoading && !error && chartData.length > 0 && renderChart()}

        {/* Empty State */}
        {!isLoading && !error && chartData.length === 0 && (
          <Box sx={CHART_CENTER_CONTAINER_SX}>
            <AtomTypography variant="body2" color="text.secondary">
              No chart data available
            </AtomTypography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default memo(TokenChartSection);
