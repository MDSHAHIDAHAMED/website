'use client';

/**
 * Chart Utilities
 * ================
 * Shared types, constants, styles, and helper functions for chart components.
 * Used by TokenChartSection, YieldChartSection, and other chart-related components.
 *
 * @module lib/chart-utils
 */
import ShowChartIcon from '@mui/icons-material/ShowChart';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import React, { memo } from 'react';

import AtomTypography from '@/components/atoms/typography';
import { yieldzNeutral, yieldzPrimary } from '@/styles/theme/colors';

// =============================================================================
// Types
// =============================================================================

/**
 * Time period configuration for chart selectors
 */
export interface TimePeriod {
  /** Display label */
  label: string;
  /** Number of days for calculation */
  days: number;
}

/**
 * Chart type options
 */
export type ChartType = 'area' | 'line';

/**
 * Generic chart data point structure
 * Can be extended for specific use cases (price, yield, etc.)
 */
export interface BaseChartDataPoint {
  /** UNIX timestamp in milliseconds */
  timestamp: number;
  /** Formatted date string for display */
  dateLabel: string;
}

/**
 * Price chart data point
 */
export interface PriceChartDataPoint extends BaseChartDataPoint {
  /** Price value */
  price: number;
  /** Volume value (optional) */
  volume?: number;
}

/**
 * Yield chart data point
 */
export interface YieldChartDataPoint extends BaseChartDataPoint {
  /** Yield percentage value */
  yield: number;
}

// =============================================================================
// Constants
// =============================================================================

/**
 * Standard time periods for price charts
 * Updated to: 1M, 3M, 6M, 1Y, 5Y, and ALL
 */
export const PRICE_CHART_TIME_PERIODS: readonly TimePeriod[] = [
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
  { label: '5Y', days: 1825 },
  { label: 'ALL', days: 365 },
  // For "ALL", we use a large number but API will handle it
] as const;

/**
 * Time periods for yield charts (includes ALL TIME instead of 1Y)
 */
export const YIELD_CHART_TIME_PERIODS: readonly TimePeriod[] = [
  { label: '1D', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: 'ALL TIME', days: 365 },
] as const;

/** Default time period index (last option - all) */
export const DEFAULT_PERIOD_INDEX = 5;

/** Default chart type */
export const DEFAULT_CHART_TYPE: ChartType = 'area';

/** Maximum data points to display for performance */
export const MAX_DATA_POINTS = 100;

/** Standard chart height in pixels */
export const CHART_HEIGHT = 220;

/**
 * Standard chart colors for price charts (cyan theme)
 */
export const PRICE_CHART_COLORS = {
  stroke: yieldzPrimary[500],
  fillStart: 'rgba(109, 242, 254, 0.3)',
  fillEnd: 'rgba(109, 242, 254, 0.02)',
  grid: yieldzNeutral[800],
  axis: yieldzNeutral[500],
  tooltipBg: yieldzNeutral[900],
  tooltipBorder: yieldzNeutral[700],
  dot: yieldzPrimary[500],
  dotStroke: yieldzNeutral[950],
} as const;

/**
 * Chart colors for yield charts (yellow theme)
 */
export const YIELD_CHART_COLORS = {
  /** Area fill color (Yellow with 10% opacity) */
  fill: 'rgba(255, 247, 25, 0.1)',
  /** Line/stroke color (Yellow/500) */
  stroke: 'rgba(255, 247, 25, 1)',
  /** Dot color (Yellow/500) */
  dot: '#FFF719',
  /** Axis text color (neutral/300) */
  axis: '#A7A7A7',
  /** Dot stroke color */
  dotStroke: yieldzNeutral[950],
  /** Tooltip background */
  tooltipBg: yieldzNeutral[900],
  /** Tooltip border */
  tooltipBorder: yieldzNeutral[700],
} as const;

// =============================================================================
// Styles
// =============================================================================

/**
 * Dotted background section container styles
 * Used as the main wrapper for chart sections
 */
export const CHART_SECTION_CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  borderRadius: 0,
  p: 3,
  bgcolor: 'var(--mui-palette-background-level1)',
  flexDirection: 'column',
  backgroundImage: 'url(/assets/backgrounds/auth.svg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  overflow: 'hidden',
};

/**
 * Header row styles for chart sections
 */
export const CHART_HEADER_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  mb: 3,
  flexWrap: 'wrap',
  gap: 2,
};

/**
 * Controls row styles (time period selector + chart type toggle)
 */
export const CHART_CONTROLS_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
};

/**
 * Creates chart container styles with specified height
 * @param height - Chart height in pixels (default: CHART_HEIGHT)
 */
export const createChartContainerSx = (height: number = CHART_HEIGHT): SxProps<Theme> => ({
  position: 'relative',
  width: '100%',
  height,
});

/**
 * Time period selector container styles
 */
export const TIME_SELECTOR_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'row',
  p: 0.5,
  borderRadius: 0,
};

/**
 * Creates time period button styles based on active state
 * @param isActive - Whether the button is currently active
 */
export const createTimePeriodButtonSx = (isActive: boolean): SxProps<Theme> => ({
  px: 1.5,
  py: 0.5,
  cursor: 'pointer',
  backgroundColor: isActive ? yieldzNeutral[800] : 'transparent',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: isActive ? yieldzNeutral[800] : yieldzNeutral[900],
  },
});

/**
 * Chart type toggle container styles
 */
export const CHART_TYPE_TOGGLE_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  p: 0.5,
  borderRadius: 0,
};

/**
 * Creates chart type button styles based on active state
 * @param isActive - Whether the button is currently active
 */
export const createChartTypeButtonSx = (isActive: boolean): SxProps<Theme> => ({
  p: 0.75,
  cursor: 'pointer',
  backgroundColor: isActive ? yieldzNeutral[800] : 'transparent',
  transition: 'background-color 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    backgroundColor: isActive ? yieldzNeutral[800] : yieldzNeutral[900],
  },
});

/**
 * Center container styles for loading/error states
 */
export const CHART_CENTER_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: CHART_HEIGHT,
};

/**
 * Tooltip container styles
 */
export const CHART_TOOLTIP_CONTAINER_SX: SxProps<Theme> = {
  backgroundColor: yieldzNeutral[900],
  border: `1px solid ${yieldzNeutral[700]}`,
  borderRadius: 0,
  p: 1.5,
};

// =============================================================================
// Helper Functions - Date Formatting
// =============================================================================

/**
 * Format date for tooltip display based on time period
 * - 1D: Date with time (e.g., "30 Dec, 10:30 AM")
 * - 7D: Day name with date (e.g., "Monday, 30 Dec")
 * - 30D: Full date (e.g., "30 Dec, 2025")
 * - 3M/6M/1Y: Month and Year (e.g., "Dec 2025")
 *
 * @param timestamp - UNIX timestamp in milliseconds
 * @param days - Number of days in the selected period
 * @returns Formatted date string for tooltip
 */
export function formatTooltipDate(timestamp: number, days: number): string {
  const date = new Date(timestamp);

  if (days <= 1) {
    // 1D: Date with time (e.g., "30 Dec, 10:30 AM")
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${day} ${month}, ${time}`;
  }

  if (days <= 7) {
    // 7D: Day name with date (e.g., "Monday, 30 Dec")
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${dayName}, ${day} ${month}`;
  }

  if (days <= 30) {
    // 30D: Full date (e.g., "30 Dec, 2025")
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  // 3M/6M/1Y: Month and Year (e.g., "Dec 2025")
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${month} ${year}`;
}

/**
 * Format timestamp for X-axis tick label (compact version)
 * - 1D: Time only (e.g., "10:30")
 * - 7D: Day name short (e.g., "MON")
 * - 30D: Date (e.g., "30 DEC")
 * - 3M/6M/1Y: Month, Year (e.g., "DEC 2025")
 *
 * @param timestamp - UNIX timestamp in milliseconds
 * @param days - Number of days in the selected period
 * @returns Formatted tick label string
 */
export function formatXAxisTick(timestamp: number, days: number): string {
  const date = new Date(timestamp);

  if (days <= 1) {
    // 1D: Time only (e.g., "10:30")
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  if (days <= 7) {
    // 7D: Day name short (e.g., "MON")
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  }

  if (days <= 30) {
    // 30D: Date (e.g., "30 DEC")
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    return `${day} ${month}`;
  }

  // 3M/6M/1Y: Month, Year (e.g., "DEC 2025")
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = date.getFullYear();
  return `${month} ${year}`;
}

// =============================================================================
// Helper Functions - Currency & Percentage Formatting
// =============================================================================

/**
 * Format currency value for display
 * @param value - Numeric value to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  }).format(value);
}

/**
 * Format currency value for Y-axis (compact with K/M suffix)
 * @param value - Numeric value to format
 * @returns Formatted compact currency string (e.g., "$1.2M", "$500K")
 */
export function formatAxisValue(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

/**
 * Format volume value for display (compact with K/M/B suffix)
 * @param value - Volume value
 * @returns Formatted volume string (e.g., "$1.2B", "$500M", "$10K")
 */
export function formatVolume(value: number | undefined): string {
  if (value === undefined || value === null) return '--';
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

/**
 * Format percentage value for display
 * @param value - Percentage value
 * @returns Formatted percentage string with sign (e.g., "+5.25%", "-2.30%")
 */
export function formatPercentage(value: number): string {
  // Handle edge cases: Infinity, -Infinity, and NaN
  if (!Number.isFinite(value)) {
    return '0.00%';
  }
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(5)}%`;
}

/**
 * Format yield value for Y-axis
 * @param value - Yield percentage value
 * @returns Formatted yield string (e.g., "12.50%")
 */
export function formatYieldAxisTick(value: number): string {
  if (value === 0) return '0';
  return `${value.toFixed(5)}%`;
}

// =============================================================================
// Helper Functions - Timestamp Utilities
// =============================================================================

/**
 * Get UNIX timestamp for a date N days ago
 * @param days - Number of days ago
 * @returns UNIX timestamp in seconds
 */
export function getTimestampDaysAgo(days: number): number {
  const now = new Date();
  const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return Math.floor(past.getTime() / 1000);
}

/**
 * Get current UNIX timestamp
 * @returns UNIX timestamp in seconds
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

// =============================================================================
// Helper Functions - Data Processing
// =============================================================================

/**
 * Downsample price chart data array to target length for performance
 * @param data - Original data array of [timestamp, price] tuples
 * @param targetLength - Target number of data points
 * @param days - Number of days for date formatting
 * @param volumeData - Optional volume data array of [timestamp, volume] tuples
 * @returns Downsampled array of PriceChartDataPoint
 */
export function downsamplePriceData(
  data: [number, number][],
  targetLength: number,
  days: number,
  volumeData?: [number, number][]
): PriceChartDataPoint[] {
  if (data.length === 0) return [];

  // Create a volume lookup map for efficient access by index
  // Since volume timestamps align with price timestamps, we use index-based lookup
  const getVolumeByIndex = (idx: number): number | undefined => {
    if (!volumeData || idx >= volumeData.length) return undefined;
    return volumeData[idx][1];
  };

  if (data.length <= targetLength) {
    return data.map(([timestamp, price], idx) => ({
      timestamp,
      price,
      volume: getVolumeByIndex(idx),
      dateLabel: formatTooltipDate(timestamp, days),
    }));
  }

  const step = data.length / targetLength;
  const result: PriceChartDataPoint[] = [];

  for (let i = 0; i < targetLength; i++) {
    const idx = Math.floor(i * step);
    const [timestamp, price] = data[idx];
    result.push({
      timestamp,
      price,
      volume: getVolumeByIndex(idx),
      dateLabel: formatTooltipDate(timestamp, days),
    });
  }

  return result;
}

/**
 * Process yield data into chart-ready format
 * @param rawData - Array of [timestamp, yieldValue] tuples
 * @param days - Number of days for date formatting
 * @returns Array of YieldChartDataPoint
 */
export function processYieldData(rawData: Array<[number, number]>, days: number): YieldChartDataPoint[] {
  return rawData.map(([timestamp, yieldValue]) => ({
    timestamp,
    yield: yieldValue,
    dateLabel: formatXAxisTick(timestamp, days),
  }));
}

// =============================================================================
// Shared Sub-Components
// =============================================================================

interface TimePeriodSelectorProps {
  /** Currently active period index */
  activeIndex: number;
  /** Callback when a period is selected */
  onSelect: (index: number) => void;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Time periods to display (defaults to PRICE_CHART_TIME_PERIODS) */
  periods?: readonly TimePeriod[];
}

/**
 * Time Period Selector Component
 * Displays selectable time period buttons (1D, 7D, 30D, etc.)
 */
export const TimePeriodSelector = memo(function TimePeriodSelector({
  activeIndex,
  onSelect,
  disabled = false,
  periods = PRICE_CHART_TIME_PERIODS,
}: Readonly<TimePeriodSelectorProps>): React.JSX.Element {
  return (
    <Box sx={{ ...TIME_SELECTOR_CONTAINER_SX }}>
      {periods.map((period, index) => (
        <Box
          key={period.label}
          sx={{
            ...createTimePeriodButtonSx(index === activeIndex),
            opacity: disabled ? 0.5 : 1,
            pointerEvents: disabled ? 'none' : 'auto',
          }}
          onClick={() => onSelect(index)}
        >
          <AtomTypography
            variant="caption"
            sx={{
              color: index === activeIndex ? yieldzPrimary[500] : yieldzNeutral[400],
              fontSize: '11px',
              fontWeight: index === activeIndex ? 600 : 400,
            }}
          >
            {period.label}
          </AtomTypography>
        </Box>
      ))}
    </Box>
  );
});

// =============================================================================
// Coin Filter Component
// =============================================================================

/** Available coin filter options */
export type CoinFilterType = 'USDC' | 'BTC';

/** Coin filter options */
export const COIN_FILTER_OPTIONS: readonly CoinFilterType[] = ['USDC', 'BTC'] as const;

interface CoinFilterSelectorProps {
  /** Currently active coin filter */
  activeCoin: CoinFilterType;
  /** Callback when a coin is selected */
  onSelect: (coin: CoinFilterType) => void;
  /** Whether the selector is disabled */
  disabled?: boolean;
}

/**
 * Coin Filter Selector Component
 * Displays selectable coin filter buttons (USDC, BTC)
 * Only renders when coinFilter prop is true in parent
 */
export const CoinFilterSelector = memo(function CoinFilterSelector({
  activeCoin,
  onSelect,
  disabled = false,
}: Readonly<CoinFilterSelectorProps>): React.JSX.Element {
  return (
    <Box sx={TIME_SELECTOR_CONTAINER_SX}>
      {COIN_FILTER_OPTIONS.map((coin) => (
        <Box
          key={coin}
          sx={{
            ...createTimePeriodButtonSx(coin === activeCoin),
            opacity: disabled ? 0.5 : 1,
            pointerEvents: disabled ? 'none' : 'auto',
          }}
          onClick={() => onSelect(coin)}
        >
          <AtomTypography
            variant="caption"
            sx={{
              color: coin === activeCoin ? yieldzPrimary[500] : yieldzNeutral[400],
              fontSize: '11px',
              fontWeight: coin === activeCoin ? 600 : 400,
            }}
          >
            {coin}
          </AtomTypography>
        </Box>
      ))}
    </Box>
  );
});

// =============================================================================
// Chart Type Toggle Component
// =============================================================================

interface ChartTypeToggleProps {
  /** Currently active chart type */
  activeType: ChartType;
  /** Callback when chart type is selected */
  onSelect: (type: ChartType) => void;
  /** Whether the toggle is disabled */
  disabled?: boolean;
}

/**
 * Chart Type Toggle Component
 * Displays toggle buttons for Area and Line chart types
 */
export const ChartTypeToggle = memo(function ChartTypeToggle({
  activeType,
  onSelect,
  disabled = false,
}: Readonly<ChartTypeToggleProps>): React.JSX.Element {
  return (
    <Box sx={CHART_TYPE_TOGGLE_CONTAINER_SX}>
      {/* Area Chart Button */}
      <Box
        sx={{
          ...createChartTypeButtonSx(activeType === 'area'),
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
        }}
        onClick={() => onSelect('area')}
        title="Area Chart"
      >
        <StackedLineChartIcon
          sx={{
            fontSize: 32,
            color: activeType === 'area' ? yieldzPrimary[500] : yieldzNeutral[400],
          }}
        />
      </Box>

      {/* Line Chart Button */}
      <Box
        sx={{
          ...createChartTypeButtonSx(activeType === 'line'),
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
        }}
        onClick={() => onSelect('line')}
        title="Line Chart"
      >
        <ShowChartIcon
          sx={{
            fontSize: 32,
            color: activeType === 'line' ? yieldzPrimary[500] : yieldzNeutral[400],
          }}
        />
      </Box>
    </Box>
  );
});
