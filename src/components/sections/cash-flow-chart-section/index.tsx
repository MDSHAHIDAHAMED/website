'use client';

/**
 * CashFlowChartSection Component
 * ===============================
 * Displays a bar chart showing cash flow inflows and outflows.
 *
 * Features:
 * - Monthly inflows and outflows bars
 * - Custom bar colors with darker top section
 * - Loading skeleton
 * - Legend showing INFLOWS and OUTFLOWS
 *
 * @module components/sections/cash-flow-chart-section
 */
import { SOCKET_EVENTS } from '@/constants';
import type { CashFlowDataPoint } from '@/services/portfolio';
import { useDispatch, useSelector, type RootState } from '@/store';
import { fetchCashFlowOverviewThunk } from '@/store/thunks/portfolio-thunk';
import { Box, Skeleton, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CornerContainer } from 'yldzs-components';

import AtomTooltip from '@/components/atoms/tooltip';
import AtomTypography from '@/components/atoms/typography';
import { BACKGROUND_IMAGE_SX } from '@/components/molecules/featured-token-card';
import useSocketEvents from '@/hooks/use-socket-events';
import { yieldzNeutral } from '@/styles/theme/colors';

// =============================================================================
// Constants
// =============================================================================

/** Chart colors */
const CHART_COLORS = {
  inflows: {
    fill: 'rgba(109, 242, 254, 0.2)',
    stroke: 'rgba(109, 242, 254, 1)',
    top: 'rgba(109, 242, 254, 1)',
  },
  outflows: {
    fill: 'rgba(111, 111, 111, 0.2)',
    stroke: 'rgba(111, 111, 111, 1)',
    top: 'rgba(111, 111, 111, 1)',
  },
  axis: yieldzNeutral[500],
  grid: yieldzNeutral[700],
};

/** Chart dimensions */
const CHART_HEIGHT = 280;

// =============================================================================
// Styles
// =============================================================================

/** Main container */
const CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  flex: 1,
  height: '100%',
  p: { xs: 2, md: 3 },
  ...BACKGROUND_IMAGE_SX,
};

/** Header row */
const HEADER_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  justifyContent: 'space-between',
  alignItems: { xs: 'flex-start', sm: 'center' },
  mb: 3,
  gap: 2,
};

/** Legend container */
const LEGEND_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 3,
};

/** Legend item */
const LEGEND_ITEM_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

/** Chart container */
const CHART_CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  height: CHART_HEIGHT,
  position: 'relative',
};

/** Skeleton styles */
const SKELETON_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-around',
  height: CHART_HEIGHT,
  px: 4,
  pb: 4,
};

const SKELETON_BAR_SX: SxProps<Theme> = {
  bgcolor: yieldzNeutral[800],
  borderRadius: '4px 4px 0 0',
};

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Legend indicator line
 */
interface LegendIndicatorProps {
  color: string;
}

const LegendIndicator = memo(function LegendIndicator({ color }: Readonly<LegendIndicatorProps>): React.JSX.Element {
  return (
    <Box
      sx={{
        width: 24,
        height: 2,
        backgroundColor: color,
      }}
    />
  );
});

/**
 * Chart loading skeleton
 */
const ChartSkeleton = memo(function ChartSkeleton(): React.JSX.Element {
  const barHeights = [60, 75, 50, 80, 55, 70, 45];

  return (
    <Box sx={SKELETON_CONTAINER_SX}>
      {barHeights.map((height) => (
        <Stack key={`skeleton-group-${height}`} direction="row" spacing={0.5} alignItems="flex-end">
          <Skeleton variant="rectangular" width={28} height={`${height}%`} sx={SKELETON_BAR_SX} animation="wave" />
          <Skeleton variant="rectangular" width={28} height={`${height - 15}%`} sx={SKELETON_BAR_SX} animation="wave" />
        </Stack>
      ))}
    </Box>
  );
});

/**
 * No data empty state
 */
const NoDataState = memo(function NoDataState(): React.JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: CHART_HEIGHT,
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <AtomTypography variant="body1" color="text.secondary">
        No chart data present as of now
      </AtomTypography>
    </Box>
  );
});

/**
 * Custom tooltip for the bar chart
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    payload: CashFlowDataPoint;
  }>;
  label?: string;
}

const CustomTooltip = memo(function CustomTooltip({ active, payload, label }: Readonly<CustomTooltipProps>) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: yieldzNeutral[900],
        border: `1px solid ${yieldzNeutral[700]}`,
        borderRadius: 1,
        p: 1.5,
      }}
    >
      <AtomTypography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        {label}
      </AtomTypography>
      {payload.map((entry) => (
        <Box key={entry.dataKey} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              backgroundColor: entry.dataKey === 'inflows' ? CHART_COLORS.inflows.stroke : CHART_COLORS.outflows.stroke,
              borderRadius: '50%',
            }}
          />
          <AtomTypography variant="caption">
            {entry.dataKey === 'inflows' ? 'Inflows' : 'Outflows'}: ${entry.value.toLocaleString()}
          </AtomTypography>
        </Box>
      ))}
    </Box>
  );
});

/**
 * Custom bar shape with darker top section
 */
interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  topColor?: string;
}

/**
 * Base custom bar component with highlighted top section
 * Only renders bar and top section when there is actual data (height > 0)
 */
const CustomBar = memo(function CustomBar({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  fill = '',
  topColor = '',
}: Readonly<CustomBarProps>) {
  // Don't render anything if there's no data (height is 0 or negligible)
  if (height <= 0) {
    return null;
  }

  const topHeight = 4;
  const mainHeight = Math.max(0, height - topHeight);

  return (
    <g>
      {/* Main bar body */}
      <rect x={x} y={y + topHeight} width={width} height={mainHeight} fill={fill} />
      {/* Darker top section - only shown when bar has actual height */}
      <rect x={x} y={y} width={width} height={topHeight} fill={topColor} />
    </g>
  );
});

/**
 * Outflows bar shape function - pre-configured with outflows colors
 * Defined as stable function reference to avoid re-creation on render
 */
const renderOutflowsBar = (props: CustomBarProps): React.JSX.Element => (
  <CustomBar {...props} fill={CHART_COLORS.outflows.fill} topColor={CHART_COLORS.outflows.top} />
);

/**
 * Inflows bar shape function - pre-configured with inflows colors
 * Defined as stable function reference to avoid re-creation on render
 */
const renderInflowsBar = (props: CustomBarProps): React.JSX.Element => (
  <CustomBar {...props} fill={CHART_COLORS.inflows.fill} topColor={CHART_COLORS.inflows.top} />
);

// =============================================================================
// Main Component
// =============================================================================

export interface CashFlowChartSectionProps {
  /** Start date for cash flow query (YYYY-MM-DD format) */
  startDate?: string;
  /** End date for cash flow query (YYYY-MM-DD format) */
  endDate?: string;
}

function CashFlowChartSectionComponent(): React.JSX.Element {
  const dispatch = useDispatch();

  // Get cash flow data from Redux store
  const { cashFlowData, isCashFlowLoading } = useSelector((state: RootState) => state.portfolio);

  // Fetch cash flow data on mount
  useEffect(() => {
    dispatch(
      fetchCashFlowOverviewThunk({})
    );
  }, [dispatch]);

  const loading = isCashFlowLoading;
  const chartData = cashFlowData;

  // Y-axis domain
  const yAxisDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 4000];
    const allValues = chartData.flatMap((d) => [d.inflows, d.outflows]);
    const max = Math.max(...allValues);
    return [0, Math.ceil(max / 500) * 500 + 500];
  }, [chartData]);

  // Y-axis ticks
  const yAxisTicks = useMemo(() => {
    const [, max] = yAxisDomain;
    const ticks: number[] = [];
    for (let i = 0; i <= max; i += 500) {
      ticks.push(i);
    }
    return ticks;
  }, [yAxisDomain]);

  /**
   * Render chart content based on loading and data state
   * Extracted to reduce nested ternary complexity
   */
  const renderChartContent = (): React.JSX.Element => {
    if (loading) {
      return <ChartSkeleton />;
    }

    if (chartData.length === 0) {
      return <NoDataState />;
    }

    return (
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barCategoryGap="20%" barGap={4}>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: CHART_COLORS.axis, fontSize: 10 }}
            tickMargin={10}
          />
          <YAxis
            domain={yAxisDomain as [number, number]}
            ticks={yAxisTicks}
            axisLine={false}
            tickLine={false}
            tick={{ fill: CHART_COLORS.axis, fontSize: 10 }}
            tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}K`}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />

          {/* Outflows Bar (first/left) */}
          <Bar dataKey="outflows" fill={CHART_COLORS.outflows.fill} radius={[0, 0, 0, 0]} shape={renderOutflowsBar}>
            {chartData.map((dataPoint) => (
              <Cell key={`outflow-${dataPoint.month}`} />
            ))}
          </Bar>

          {/* Inflows Bar (second/right) */}
          <Bar dataKey="inflows" fill={CHART_COLORS.inflows.fill} radius={[0, 0, 0, 0]} shape={renderInflowsBar}>
            {chartData.map((dataPoint) => (
              <Cell key={`inflow-${dataPoint.month}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  /**
   * Socket event handler for cash flow chart updates
   * Memoized with dispatch and startDate, endDate as dependency
   */
  const handleSocketVerification = useCallback(
    (socketData: { title?: string; type?: string }) => {
      const isDepositCompleted =
        socketData?.title?.includes('Deposit Completed') && socketData?.type === 'TRANSACTION_UPDATE';
      if (isDepositCompleted) {
        dispatch(
          fetchCashFlowOverviewThunk({})
        );
      }
    },
    [dispatch]
  );

  /**
   * Socket Event Listener
   * Listens for cash flow chart updates and refreshes status
   */
  useSocketEvents({
    autoJoin: true,
    events: {
      [SOCKET_EVENTS.NOTIFICATION_NEW]: handleSocketVerification,
    },
  });

  return (
    <CornerContainer
      sx={{
        ...CONTAINER_SX,
        border: '1px solid #222222',
        position: 'relative',
        overflow: 'hidden',
        // Radial gradient from top-left: dark (top-left 5%) → light (center-left) → dark (middle-right and bottom-right)
        background: 'radial-gradient(ellipse 180% 140% at top left, #000000 0%, #000000 5%, #171717 20%, #171717 35%, #000000 55%, #000000 100%)',
        // Monotone noise dots overlay
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0 .5 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.12,
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
      showBorder={false}
      borderColor="#222222"
      // outerSx={{ 
      //   borderRight: 'none',
      //   border: '1px solid #222222',
      // }}
    >
      {/* Header */}
      <Box sx={{ ...HEADER_ROW_SX, position: 'relative', zIndex: 1 }}>
        {/* Title */}
        <AtomTypography variant="h4" fontType="ppMori">
          Cash Flow Overview
        </AtomTypography>

        {/* Legend */}
        <Box sx={LEGEND_SX}>
          <Box sx={LEGEND_ITEM_SX}>
            <LegendIndicator color={CHART_COLORS.inflows.stroke} />
            <AtomTooltip title="Total amount of stablecoins deposited" arrow placement="top">
              <Box component="span" sx={{ cursor: 'help' }}>
                <AtomTypography variant="caption" color="text.secondary">
                  INFLOWS
                </AtomTypography>
              </Box>
            </AtomTooltip>
          </Box>
          <Box sx={LEGEND_ITEM_SX}>
            <LegendIndicator color={CHART_COLORS.outflows.stroke} />
            <AtomTooltip title="Total amount of stablecoins withdrawn" arrow placement="top">
              <Box component="span" sx={{ cursor: 'help' }}>
                <AtomTypography variant="caption" color="text.secondary">
                  OUTFLOWS
                </AtomTypography>
              </Box>
            </AtomTooltip>
          </Box>
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ ...CHART_CONTAINER_SX, position: 'relative', zIndex: 1 }}>{renderChartContent()}</Box>
    </CornerContainer>
  );
}

export const CashFlowChartSection = memo(CashFlowChartSectionComponent);
export default CashFlowChartSection;
