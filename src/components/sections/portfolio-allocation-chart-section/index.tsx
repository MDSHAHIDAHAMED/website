'use client';

/**
 * PortfolioAllocationChartSection Component
 * ==========================================
 * Displays a horizontal stacked bar chart showing portfolio allocation breakdown.
 *
 * Features:
 * - Horizontal stacked bar chart with 4 categories
 * - Custom bar colors with highlighted top section (4px)
 * - Legend with YieldsBadge showing percentages
 * - Loading skeleton
 *
 * @module components/sections/portfolio-allocation-chart-section
 */
import { SOCKET_EVENTS } from '@/constants';
import { useDispatch, useSelector, type RootState } from '@/store';
import { fetchPortfolioBreakdownThunk } from '@/store/thunks/portfolio-thunk';
import { Box, Skeleton, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
import YieldsBadge from '@/components/atoms/yields-badge';
import { BACKGROUND_IMAGE_SX } from '@/components/molecules/featured-token-card';
import useSocketEvents from '@/hooks/use-socket-events';
import { yieldzNeutral } from '@/styles/theme/colors';

// =============================================================================
// Types
// =============================================================================

/**
 * Portfolio allocation data point
 */
export interface PortfolioAllocationDataPoint {
  /** Category name */
  name: string;
  /** BTC Yield percentage */
  btcYield: number;
  /** USDC Deposited percentage */
  usdcDeposited: number;
  /** YLDZ Token percentage */
  yldzToken: number;
  /** YLDZ2 Token percentage */
  yldz2Token?: number;
}

/**
 * Category configuration for chart
 */
interface CategoryConfig {
  key: keyof Omit<PortfolioAllocationDataPoint, 'name'>;
  label: string;
  fill: string;
  stroke: string;
  top: string;
  badgeVariant: 'brand' | 'neutral' | 'yellow' | 'red';
}

// =============================================================================
// Constants
// =============================================================================

/** Chart colors - updated to match design specifications */
const CHART_COLORS = {
  btcYield: {
    fill: '#6DF2FE33', // Light blue/cyan with 20% opacity
    stroke: '#6DF2FE',
    top: '#6DF2FE',
  },
  usdcDeposited: {
    fill: '#FFFFFF33', // White with 20% opacity
    stroke: '#FFFFFF',
    top: '#FFFFFF',
  },
  yldz1Token: {
    fill: '#FFF71933', // Yellow with 20% opacity
    stroke: '#FFF719',
    top: '#FFF719',
  },
  yldz2Token: {
    fill: '#FF5B2333', // Orange with 20% opacity
    stroke: '#FF5B23',
    top: '#FF5B23',
  },
  axis: yieldzNeutral[500],
};

/** Category configurations - ordered: Blue (1), Grey (2), Green/Yellow (3), Orange (4) */
const CATEGORIES: CategoryConfig[] = [
  {
    key: 'btcYield',
    label: 'BTC YIELD',
    ...CHART_COLORS.btcYield,
    badgeVariant: 'brand',
  },
  {
    key: 'usdcDeposited',
    label: 'USDC DEPOSITED',
    ...CHART_COLORS.usdcDeposited,
    badgeVariant: 'neutral',
  },
  {
    key: 'yldzToken',
    label: 'YLDZ TOKEN',
    ...CHART_COLORS.yldz1Token,
    badgeVariant: 'yellow',
  },
  {
    key: 'yldz2Token',
    label: 'YLDZ2 TOKEN',
    ...CHART_COLORS.yldz2Token,
    badgeVariant: 'red',
  },
];

/** Chart dimensions - matches cash flow chart height */
const CHART_HEIGHT = 295;
const BAR_HEIGHT = 280;

/** Mock data for portfolio allocation */
const MOCK_PORTFOLIO_DATA: PortfolioAllocationDataPoint[] = [
  {
    name: 'Portfolio',
    btcYield: 40,
    usdcDeposited: 20,
    yldzToken: 20,
    yldz2Token: 20,
  },
];

// =============================================================================
// Styles
// =============================================================================

/** Main container */
const CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  flex: 1,
  p: { xs: 2, md: 3 },
  ...BACKGROUND_IMAGE_SX,
};

/** Chart wrapper - contains chart and legend side by side */
const CHART_WRAPPER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: 4,
  alignItems: 'stretch',
};

/** Chart container */
const CHART_CONTAINER_SX: SxProps<Theme> = {
  flex: 1,
  height: CHART_HEIGHT,
  position: 'relative',
  minWidth: 0,
};

/** Legend container */
const LEGEND_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: 3,
  minWidth: { xs: '100%', md: 150 },
};

/** Legend item */
const LEGEND_ITEM_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75,
};

/** Skeleton styles */
const SKELETON_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  height: CHART_HEIGHT,
  gap: 0.5,
};

const SKELETON_BAR_SX: SxProps<Theme> = {
  bgcolor: yieldzNeutral[800],
  borderRadius: 0,
};

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Chart loading skeleton - horizontal bars
 */
const ChartSkeleton = memo(function ChartSkeleton(): React.JSX.Element {
  return (
    <Box sx={SKELETON_CONTAINER_SX}>
      <Skeleton variant="rectangular" sx={{ ...SKELETON_BAR_SX, flex: 4 }} animation="wave" />
      <Skeleton variant="rectangular" sx={{ ...SKELETON_BAR_SX, flex: 2 }} animation="wave" />
      <Skeleton variant="rectangular" sx={{ ...SKELETON_BAR_SX, flex: 2 }} animation="wave" />
      <Skeleton variant="rectangular" sx={{ ...SKELETON_BAR_SX, flex: 1 }} animation="wave" />
    </Box>
  );
});

/**
 * Custom tooltip for the stacked bar chart
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    name: string;
  }>;
}

const CustomTooltip = memo(function CustomTooltip({ active, payload }: Readonly<CustomTooltipProps>) {
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
      {payload.map((entry) => {
        const category = CATEGORIES.find((c) => c.key === entry.dataKey);
        return (
          <Box key={entry.dataKey} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                backgroundColor: category?.stroke ?? yieldzNeutral[500],
                borderRadius: '50%',
              }}
            />
            <AtomTypography variant="label2">
              {category?.label ?? entry.dataKey}: {entry.value}%
            </AtomTypography>
          </Box>
        );
      })}
    </Box>
  );
});

/**
 * Custom bar shape with highlighted top section (4px)
 * For horizontal layout, "top" becomes the left edge
 */
interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  topColor?: string;
}

const CustomBar = memo(function CustomBar({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  fill = '',
  topColor = '',
}: Readonly<CustomBarProps>) {
  const topHeight = 4;
  const gap = 2; // Gap between stacked segments
  // Reduce width by gap to create space between segments
  const adjustedWidth = Math.max(0, width - gap);

  return (
    <g>
      {/* Top highlighted section (4px) */}
      <rect x={x} y={y} width={adjustedWidth} height={topHeight} fill={topColor} />
      {/* Main bar body */}
      <rect x={x} y={y + topHeight} width={adjustedWidth} height={Math.max(0, height - topHeight)} fill={fill} />
    </g>
  );
});

/**
 * BTC Yield bar shape function - pre-configured with btcYield colors
 * Defined as stable function reference to avoid re-creation on render
 */
const renderBtcYieldBar = (props: CustomBarProps): React.JSX.Element => (
  <CustomBar {...props} fill={CHART_COLORS.btcYield.fill} topColor={CHART_COLORS.btcYield.top} />
);

/**
 * USDC Deposited bar shape function - pre-configured with usdcDeposited colors
 * Defined as stable function reference to avoid re-creation on render
 */
const renderUsdcDepositedBar = (props: CustomBarProps): React.JSX.Element => (
  <CustomBar {...props} fill={CHART_COLORS.usdcDeposited.fill} topColor={CHART_COLORS.usdcDeposited.top} />
);

/**
 * YLDZ1 Token bar shape function - pre-configured with yldz1Token colors
 * Defined as stable function reference to avoid re-creation on render
 */
const renderYldz1TokenBar = (props: CustomBarProps): React.JSX.Element => (
  <CustomBar {...props} fill={CHART_COLORS.yldz1Token.fill} topColor={CHART_COLORS.yldz1Token.top} />
);

/**
 * YLDZ2 Token bar shape function - pre-configured with yldz2Token colors
 * Defined as stable function reference to avoid re-creation on render
 */
const renderYldz2TokenBar = (props: CustomBarProps): React.JSX.Element => (
  <CustomBar {...props} fill={CHART_COLORS.yldz2Token.fill} topColor={CHART_COLORS.yldz2Token.top} />
);

/**
 * Map category keys to their shape render functions
 * Provides stable function references for each bar category
 */
const CATEGORY_SHAPES: Record<string, (props: CustomBarProps) => React.JSX.Element> = {
  btcYield: renderBtcYieldBar,
  usdcDeposited: renderUsdcDepositedBar,
  yldzToken: renderYldz1TokenBar, // yldzToken uses yldz1Token colors
  yldz1Token: renderYldz1TokenBar,
  yldz2Token: renderYldz2TokenBar,
};

/**
 * Legend item with badge and label
 */
interface LegendItemProps {
  category: CategoryConfig;
  value: number;
}

const LegendItem = memo(function LegendItem({ category, value }: Readonly<LegendItemProps>): React.JSX.Element {
  // Custom badge styling for yldzToken to match #FFF719 color
  const badgeSx = category.key === 'yldzToken' 
    ? {
        borderColor: '#FFF719',
        backgroundColor: 'rgba(255, 247, 25, 0.1)',
        '&::before': {
          backgroundColor: '#FFF719',
        },
      }
    : {};

  return (
    <Box sx={LEGEND_ITEM_SX}>
      <YieldsBadge 
        id={`legend-badge-${category.key}`} 
        variant={category.badgeVariant} 
        label={`${value}%`}
        sx={badgeSx}
      />
      <AtomTypography variant="label2" color="text.secondary">
        {category.label}
      </AtomTypography>
    </Box>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export interface PortfolioAllocationChartSectionProps {
  // No props needed - data comes from Redux
}

function PortfolioAllocationChartSectionComponent(
  _props: Readonly<PortfolioAllocationChartSectionProps>
): React.JSX.Element {
  const dispatch = useDispatch();

  // Get breakdown data from Redux store
  const { breakdownData, isBreakdownLoading } = useSelector((state: RootState) => state.portfolio);

  // Fetch portfolio breakdown on mount
  useEffect(() => {
    dispatch(fetchPortfolioBreakdownThunk());
  }, [dispatch]);

  // Transform API data to chart format
  const chartData: PortfolioAllocationDataPoint[] = useMemo(() => {
    if (breakdownData.length === 0) return MOCK_PORTFOLIO_DATA;

    // Map API response to chart data format
    return breakdownData.map((item) => ({
      name: item.name,
      btcYield: item.Yield,
      usdcDeposited: item.Deposited,
      yldzToken: item.yldzToken,
      yldz2Token: 0, // yldz2Token not available in API response, default to 0
    }));
  }, [breakdownData]);

  const loading = isBreakdownLoading;

  // Get current values for legend
  const currentData = chartData?.length > 0 ? chartData[0] : {
    name: 'Portfolio',
    btcYield: 0,
    usdcDeposited: 0,
    yldzToken: 0,
    yldz2Token: 0,
  };

  /**
   * Socket event handler for portfolio allocation chart updates
   * Memoized with dispatch as dependency
   */
  const handleSocketVerification = useCallback(
    (socketData: { title?: string; type?: string }) => {
      const isDepositCompleted =
        socketData?.title?.includes('Deposit Completed') && socketData?.type === 'TRANSACTION_UPDATE';
      if (isDepositCompleted) {
        dispatch(fetchPortfolioBreakdownThunk());
      }
    },
    [dispatch]
  );

  /**
   * Socket Event Listener
   * Listens for portfolio allocation chart updates and refreshes status
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
      outerSx={{ borderLeft: 'none', height: 'unset' }}
    >
      {/* Title */}
      <AtomTypography variant="h4" fontType="ppMori" sx={{ position: 'relative', zIndex: 1 }}>
        Portfolio
      </AtomTypography>

      {/* Chart and Legend wrapper */}
      <Box sx={{ ...CHART_WRAPPER_SX, position: 'relative', zIndex: 1 }}>
        {/* Chart */}
        <Box sx={CHART_CONTAINER_SX}>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                barSize={BAR_HEIGHT}
                barGap={4}
              >
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />

                {/* Stacked bars for each category */}
                {CATEGORIES.map((category) => (
                  <Bar
                    key={category.key}
                    dataKey={category.key}
                    stackId="portfolio"
                    fill={category.fill}
                    shape={CATEGORY_SHAPES[category.key]}
                  >
                    {chartData.map((dataPoint) => (
                      <Cell key={`${category.key}-${dataPoint.name}`} />
                    ))}
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>

        {/* Legend */}
        <Stack sx={LEGEND_CONTAINER_SX}>
          {CATEGORIES.map((category) => (
            <LegendItem key={category.key} category={category} value={currentData[category.key] ?? 0} />
          ))}
        </Stack>
      </Box>
    </CornerContainer>
  );
}

export const PortfolioAllocationChartSection = memo(PortfolioAllocationChartSectionComponent);
export default PortfolioAllocationChartSection;
