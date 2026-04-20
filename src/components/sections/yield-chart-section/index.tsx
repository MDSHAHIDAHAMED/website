'use client';

/**
 * YieldChartSection Component
 * ===========================
 * Displays a yield percentage chart for the YLDZ token.
 * Shows historical yield data with time period selector.
 *
 * Features:
 * - Static yield data visualization
 * - Time period selector (1D, 7D, 30D, 3M, 6M, ALL TIME)
 * - Area chart with gradient fill
 * - Dot markers on data points
 * - Custom tooltip showing yield and date
 *
 * @module components/sections/yield-chart-section
 */

import BoltIcon from '@mui/icons-material/Bolt';
import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import AtomTypography from '@/components/atoms/typography';
import {
  generateYLDZSYieldChartData,
  YLDZS_CURRENT_YIELD,
  YLDZS_YIELD_CHART_CONFIG,
} from '@/constants/yldzs-token';
import {
  CHART_CONTROLS_ROW_SX,
  CHART_HEADER_ROW_SX,
  CHART_SECTION_CONTAINER_SX,
  CHART_TOOLTIP_CONTAINER_SX,
  ChartType,
  ChartTypeToggle,
  createChartContainerSx,
  DEFAULT_CHART_TYPE,
  DEFAULT_PERIOD_INDEX,
  formatXAxisTick,
  formatYieldAxisTick,
  processYieldData,
  TimePeriodSelector,
  YIELD_CHART_TIME_PERIODS,
  type YieldChartDataPoint,
} from '@/lib/chart-utils';
import { yieldzNeutral, yieldzSecondary } from '@/styles/theme/colors';

// =============================================================================
// Styles
// =============================================================================

/** Chart container styles using yield chart height */
const CHART_CONTAINER_SX: SxProps<Theme> = createChartContainerSx(YLDZS_YIELD_CHART_CONFIG.chartHeight);

// =============================================================================
// Sub-Components
// =============================================================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: YieldChartDataPoint }>;
}

/**
 * Custom tooltip for yield chart
 * Displays date and yield percentage
 */
const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
}: Readonly<CustomTooltipProps>): React.JSX.Element | null {
  if (!active || !payload?.length) return null;

  const data = payload[0]?.payload;
  if (!data) return null;
  const date = new Date(data.timestamp);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Box sx={CHART_TOOLTIP_CONTAINER_SX}>
      <AtomTypography variant="caption" color="text.secondary">
        {formattedDate}
      </AtomTypography>
      <AtomTypography variant="subtitle3" color="text.primary" sx={{ mt: 0.5 }}>
        Yield: {data.yield.toFixed(2)}%
      </AtomTypography>
    </Box>
  );
});

// =============================================================================
// Main Component
// =============================================================================

/**
 * YieldChartSection Component
 *
 * Displays a yield percentage chart with:
 * - Current yield header with lightning icon
 * - Time period selector
 * - Chart type toggle (Area / Line)
 * - Area or Line chart visualization
 *
 * @returns Yield chart section JSX element
 */
function YieldChartSection(): React.JSX.Element {
  // Local state for selected time period
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(DEFAULT_PERIOD_INDEX);

  // Local state for chart type
  const [chartType, setChartType] = useState<ChartType>(DEFAULT_CHART_TYPE);

  // Get selected period configuration
  const selectedPeriod = YIELD_CHART_TIME_PERIODS[selectedPeriodIndex];

  /**
   * Handle time period selection
   */
  const handlePeriodSelect = useCallback((index: number) => {
    setSelectedPeriodIndex(index);
  }, []);

  /**
   * Handle chart type selection
   */
  const handleChartTypeSelect = useCallback((type: ChartType) => {
    setChartType(type);
  }, []);

  /**
   * Generate and process chart data based on selected period
   */
  const chartData = useMemo(() => {
    const rawData = generateYLDZSYieldChartData(selectedPeriod.days);
    return processYieldData(rawData, selectedPeriod.days);
  }, [selectedPeriod.days]);

  /**
   * X-axis tick formatter based on period
   */
  const xAxisTickFormatter = useCallback(
    (timestamp: number) => formatXAxisTick(timestamp, selectedPeriod.days),
    [selectedPeriod.days]
  );

  // =========================================================================
  // Render Chart Content
  // =========================================================================

  const renderChart = () => {
    const { colors, strokeWidth, yAxisDomain, yAxisTicks } = YLDZS_YIELD_CHART_CONFIG;

    const commonChartProps = {
      data: chartData,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };

    const xAxisProps = {
      dataKey: 'timestamp' as const,
      tickFormatter: xAxisTickFormatter,
      axisLine: false,
      tickLine: false,
      tick: { fill: colors.axis, fontSize: 10 },
      tickMargin: 10,
      minTickGap: 50,
    };

    const yAxisProps = {
      domain: yAxisDomain,
      ticks: yAxisTicks,
      tickFormatter: formatYieldAxisTick,
      axisLine: false,
      tickLine: false,
      tick: { fill: colors.axis, fontSize: 10 },
      tickMargin: 5,
      width: 60,
    };

    const tooltipProps = {
      content: <CustomTooltip />,
      cursor: {
        stroke: colors.stroke,
        strokeWidth: 1,
        strokeDasharray: '4 4',
      },
    };

    const activeDotProps = {
      r: 5,
      fill: colors.dot,
      stroke: yieldzNeutral[950],
      strokeWidth: 2,
    };

    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart {...commonChartProps}>
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip {...tooltipProps} />
            <Line
              type="monotone"
              dataKey="yield"
              stroke={colors.stroke}
              strokeWidth={strokeWidth}
              dot={false}
              activeDot={activeDotProps}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    // Default: Area Chart
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart {...commonChartProps}>
          <XAxis {...xAxisProps} />
          <YAxis {...yAxisProps} />
          <Tooltip {...tooltipProps} />
          <Area
            type="monotone"
            dataKey="yield"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            fill={colors.fill}
            dot={{
              r: 3,
              fill: colors.dot,
              stroke: colors.dot,
              strokeWidth: 1,
            }}
            activeDot={activeDotProps}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  // =========================================================================
  // Render
  // =========================================================================

  return (
    <Box sx={CHART_SECTION_CONTAINER_SX}>
      {/* Header Row */}
      <Box sx={CHART_HEADER_ROW_SX}>
        {/* Yield Info */}
        <Box>
          <AtomTypography variant="label3" color="text.secondary">
            {YLDZS_CURRENT_YIELD.label}
          </AtomTypography>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <AtomTypography variant="display3" fontType="tickerbit" color="text.primary">
              {YLDZS_CURRENT_YIELD.formatted}
            </AtomTypography>
            <BoltIcon sx={{ color: yieldzSecondary.yellow[500], fontSize: 32 }} />
          </Stack>
        </Box>

        {/* Controls: Time Period Selector + Chart Type Toggle */}
        <Box sx={CHART_CONTROLS_ROW_SX}>
          <TimePeriodSelector
            activeIndex={selectedPeriodIndex}
            onSelect={handlePeriodSelect}
            periods={YIELD_CHART_TIME_PERIODS}
          />
          <ChartTypeToggle
            activeType={chartType}
            onSelect={handleChartTypeSelect}
          />
        </Box>
      </Box>

      {/* Chart Container */}
      <Box sx={CHART_CONTAINER_SX}>
        {renderChart()}
      </Box>
    </Box>
  );
}

export default memo(YieldChartSection);
