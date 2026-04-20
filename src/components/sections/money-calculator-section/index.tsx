'use client';

/**
 * MoneyCalculatorSection Component
 * =================================
 * Displays investment calculator with calculations and assumptions cards.
 *
 * Layout:
 * - Top: Center aligned heading "FOR THOSE WHO REALLY LIKE MONEY"
 * - Bottom: 2-column layout
 *   - Left: 2 stacked cards (Calculations, Assumptions)
 *   - Right: Chart placeholder
 */
import { Box, } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { motion } from 'motion/react';
import Image from 'next/image';
import { memo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
import { AtomButton } from '@/components/atoms/button';
import { MetricsMarquee } from '@/components/atoms/marquee-item';
import {
  CHART_DATA,
  LEGEND_ITEMS,
  ASSUMPTIONS_METRICS,
  CALCULATIONS_ITEMS,
} from '@/constants/money-calculator';

// =============================================================================
// Constants
// =============================================================================

/** Section container styles */
const SECTION_SX: SxProps<Theme> = {
  width: '100%',
  minHeight: '100vh',
  backgroundColor: 'background.default',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  p: { xs: 2, sm: 3, md: 4, lg: 6 },
};

/** Main content grid */
const CONTENT_GRID_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', lg: '50% 50%' },
  gap: 3,
  width: '100%',
};

/** Card base styles */
const CARD_SX: SxProps<Theme> = {
  position: 'relative',
  overflow: 'hidden',
  p: { xs: 2, md: 3 },
};


/** Content wrapper */
const CONTENT_WRAPPER_SX: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
};

/** Chart container */
const CHART_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  p: 1,
};

/** Card container styles */
const CARD_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
};

/** Card inner container styles */
const CARD_INNER_CONTAINER_SX: SxProps<Theme> = {
  p: { xs: 3, md: 6 },
  position: 'relative',
  overflow: 'hidden',
};

/** Assumptions card inner styles with background */
const ASSUMPTIONS_CARD_INNER_SX: SxProps<Theme> = {
  ...CARD_INNER_CONTAINER_SX,
  minHeight: 300,
  backgroundImage: 'url(/assets/backgrounds/Token_Infob_bg.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

/** Title container styles */
const TITLE_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  mb: 3,
};

/** Title text styles */
const TITLE_TEXT_SX = (subtitle: string): SxProps<Theme> => ({
  mb: subtitle ? 0 : 3,
  fontWeight: 500,
});



/** Investment label styles */
const INVESTMENT_LABEL_SX: SxProps<Theme> = {
  textTransform: 'uppercase',
  mb: 1,
  display: 'block',
};

/** Chart box styles */
const CHART_BOX_SX: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  mt: 2,
};

/** Chart placeholder container styles */
const CHART_PLACEHOLDER_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  height: '100%',
};

/** Chart placeholder inner styles */
const CHART_PLACEHOLDER_INNER_SX: SxProps<Theme> = {
  ...CARD_SX,
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
};

/** Chart background image container styles */
const CHART_BG_IMAGE_CONTAINER_SX: SxProps<Theme> = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
};

/** Chart content wrapper styles */
const CHART_CONTENT_WRAPPER_SX: SxProps<Theme> = {
  ...CHART_CONTAINER_SX,
  position: 'relative',
  zIndex: 1,
};

/** Chart title styles */
const CHART_TITLE_SX: SxProps<Theme> = {
  mb: 1,
  textAlign: 'left',
  width: '100%',
};

/** Legend wrapper styles */
const LEGEND_WRAPPER_SX: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 3,
  mt: 3,
  width: '100%',
  px: 2,
};

/** Chart metrics wrapper styles */
const CHART_METRICS_WRAPPER_SX: SxProps<Theme> = {
  mt: 2,
};

/** Legend item styles */
const LEGEND_ITEM_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
};

/** Legend color box styles */
const LEGEND_COLOR_BOX_SX = (color: string): SxProps<Theme> => ({
  width: 16,
  height: 4,
  backgroundColor: color,
});

/** Legend text styles */
const LEGEND_TEXT_SX: SxProps<Theme> = {
  fontSize: '10px',
  color: 'grey.400',
  textTransform: 'uppercase',
  fontWeight: 500,
};

/** Main content grid styles */
const MAIN_CONTENT_GRID_SX: SxProps<Theme> = {
  ...CONTENT_GRID_SX,
};

/** Left column styles */
const LEFT_COLUMN_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

/** Calculations grid styles */
const CALCULATIONS_GRID_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
  gap: 4,
  rowGap: 5,
  mb: 2,
};

/** Calculations item container styles */
const CALCULATIONS_ITEM_SX: SxProps<Theme> = {
  position: 'relative',
};

/** Calculations value text styles */
const CALCULATIONS_VALUE_SX: SxProps<Theme> = {
  fontWeight: 400,
};

/** Calculations underline styles */
const CALCULATIONS_UNDERLINE_SX: SxProps<Theme> = {
  position: 'absolute',
  bottom: -8,
  left: 0,
  width: '100%',
  height: '1px',
  backgroundColor: '#343434',
};

/** Assumptions price label styles */
const ASSUMPTIONS_PRICE_LABEL_SX: SxProps<Theme> = {

  mb: 1,
  display: 'block',
};

/** Assumptions price display styles */
const ASSUMPTIONS_PRICE_DISPLAY_SX: SxProps<Theme> = {
  mb: { xs: 3, md: 6 },
  fontWeight: 600,
};

/** Assumptions bottom section styles */
const ASSUMPTIONS_BOTTOM_SECTION_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  gap: { xs: 4, md: 10 },
};

/** Assumptions price section styles */
const ASSUMPTIONS_PRICE_SECTION_SX: SxProps<Theme> = {


};

/** Assumptions bottom align styles */
const ASSUMPTIONS_BOTTOM_SECTION_ALIGN_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: 5,
  justifyContent: 'space-between',
  alignItems: 'center'
};

/** Assumptions bottom title styles */
const ASSUMPTIONS_BOTTOM_TITLE_SX: SxProps<Theme> = {
  mb: 0.5,
  fontWeight: 600,
};

/** Assumptions bottom label styles */
const ASSUMPTIONS_BOTTOM_LABEL_SX: SxProps<Theme> = {
  display: 'block',
  mt: 1,
};

/** Action row container styles */
const ACTION_ROW_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  gap: 2,
  my: 2,
};


/** Heading display text styles */
const HEADING_DISPLAY_SX: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  width: '100% !important',
  mb: 3,
  flexWrap: { xs: 'wrap', md: 'nowrap' },
  gap: { xs: 2, md: 0 },
};

/** Heading subtitle text styles */
const HEADING_SUBTITLE_SX: SxProps<Theme> = {
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  mt: 1,
  mb: 3,
};

/** Subtitle line styles for spread layout */
const SUBTITLE_LINE_SX: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '600px',
  mx: 'auto',
  gap: { xs: 1, md: 0 },
};

/** Subtitle word styles */
const SUBTITLE_WORD_SX: SxProps<Theme> = {
  color: 'text.secondary',
  fontWeight: 500,
  textTransform: 'uppercase',
};

/** Chart background image style */
const CHART_BG_IMAGE_STYLE: React.CSSProperties = {
  objectFit: 'cover',
};

// =============================================================================
// Helper Components & Data
// =============================================================================

/**
 * Custom XAxis Tick Render Function
 * Extracted to avoid nested component definition
 */
const renderXAxisTick = (props: { x?: number; y?: number; payload?: { value: string } }) => {
  const { x, y, payload } = props;
  if (!x || !y || !payload) {
    return <text />;
  }
  return (
    <text x={x} y={y + 20} fill="#666" fontSize={12} textAnchor="middle">
      {payload.value}
    </text>
  );
};

/**
 * Calculations Card Component
 */
const CalculationsCard = memo(function CalculationsCard(): React.JSX.Element {

  return (
    <Box sx={CARD_CONTAINER_SX}>
      <CornerContainer sx={ASSUMPTIONS_CARD_INNER_SX} showBorder>
        <Box sx={CONTENT_WRAPPER_SX}>
          <Box sx={TITLE_CONTAINER_SX}>
            <AtomTypography variant="h3" sx={TITLE_TEXT_SX('')}>
              Calculations
            </AtomTypography>
          </Box>

          <Box sx={CALCULATIONS_GRID_SX}>
            {CALCULATIONS_ITEMS.map((item) => (
              <Box key={item.title} sx={CALCULATIONS_ITEM_SX}>
                <AtomTypography variant="caption" color="grey.500" sx={INVESTMENT_LABEL_SX}>
                  {item.title}
                </AtomTypography>
                <AtomTypography variant="body4" sx={CALCULATIONS_VALUE_SX}>{item.value}</AtomTypography>
                <Box sx={CALCULATIONS_UNDERLINE_SX} />
              </Box>
            ))}
          </Box>
        </Box>
      </CornerContainer>
    </Box>
  );
});

/**
 * Action Row Component
 */
const ActionRow = memo(function ActionRow(): React.JSX.Element {
  return (
    <Box sx={ACTION_ROW_SX}>
      {/* Calculate Button with custom styling */}
      <Box>
        <AtomButton
          variant="contained"
          color="primary"
          id="calculate-btn"
          label="CALCULATE"
          fullWidth
        />

      </Box>

      {/* Newsletter Button with Brackets */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

        <AtomButton
          variant="transparent"
          color="primary"
          id="newsletter-btn"
          label="SIGN UP TO NEWSLETTER"
          fullWidth
        />
      </Box>
    </Box>
  );
});

/**
 * Assumptions Card Component
 */
const AssumptionsCard = memo(function AssumptionsCard(): React.JSX.Element {
  return (
    <Box sx={CARD_CONTAINER_SX}>
      <CornerContainer sx={ASSUMPTIONS_CARD_INNER_SX} showBorder>
        <Box sx={CONTENT_WRAPPER_SX}>
          <Box sx={ASSUMPTIONS_BOTTOM_SECTION_ALIGN_SX}>
            <Box sx={ASSUMPTIONS_BOTTOM_SECTION_SX}>
              <Box sx={ASSUMPTIONS_PRICE_SECTION_SX}>
                <AtomTypography variant="body4" color="grey.500" sx={ASSUMPTIONS_PRICE_LABEL_SX}>
                  CURRENT BITCOIN PRICE
                </AtomTypography>
                <AtomTypography variant="h1" sx={ASSUMPTIONS_PRICE_DISPLAY_SX}>
                  $93,428
                </AtomTypography>
              </Box>

              <Box sx={ASSUMPTIONS_PRICE_SECTION_SX}>
                <AtomTypography variant="h3" sx={ASSUMPTIONS_BOTTOM_TITLE_SX}>Your Assumptions</AtomTypography>
                <AtomTypography variant="body4" color="grey.500" sx={ASSUMPTIONS_BOTTOM_LABEL_SX}>HISTORICAL BTC CAGR</AtomTypography>
              </Box>
            </Box>
            <Image style={{ width: 'auto', height: '100%' }} width={250} height={250} src="/assets/icons/BTC_dull.svg" alt="BTC" />
          </Box>
        </Box>
      </CornerContainer>

      {/* Metrics Slider */}
      <MetricsMarquee metrics={ASSUMPTIONS_METRICS} />
    </Box>
  );
});

/**
 * CagrChart Component
 */
const CagrChart = memo(function CagrChart() {
  return (
    <Box sx={CHART_BOX_SX}>
      <ResponsiveContainer >
        <BarChart data={CHART_DATA} margin={{ top: 20, right: 5, left: 0, bottom: 30 }}>
          <CartesianGrid vertical={false} stroke="#1A1A1A" />
          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            ticks={['YEAR 1', 'YEAR 5', 'YEAR 10', 'YEAR 15', 'YEAR 20']}
            tick={renderXAxisTick}
            interval={0}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#666' }}
            domain={[0, 16000000]}
            width={40}
            ticks={[0, 2000000, 4000000, 6000000, 8000000, 10000000, 12000000, 14000000, 16000000]}
            tickFormatter={(value) => {
              if (value === 0) return '0';
              const millions = value / 1000000;
              return `$${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
            }}
          />
          <Tooltip
            cursor={false}
            contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <Bar dataKey="treasury" stackId="a" fill="#333333" barSize={24} />
          <Bar dataKey="dividend" stackId="a" fill="#FFFFFF" />
          <Bar dataKey="growth" stackId="a" fill="#132D32" />
          <Bar dataKey="strc" stackId="a" fill="#2D6A73" />
          <Bar dataKey="dollars" stackId="a" fill="#48A9B6" />
          <Bar dataKey="btc" stackId="a" fill="#6DF2FE" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
});

/**
 * Chart Placeholder Component
 */
const ChartPlaceholder = memo(function ChartPlaceholder() {
  return (
    <Box sx={CHART_PLACEHOLDER_CONTAINER_SX}>
      <CornerContainer sx={CHART_PLACEHOLDER_INNER_SX} showBorder>
        {/* Background Image */}
        <Box sx={CHART_BG_IMAGE_CONTAINER_SX}>
          <Image
            src="/assets/backgrounds/chart-bg2.png"
            alt="Chart Background"
            fill
            style={CHART_BG_IMAGE_STYLE}
          />
        </Box>

        <Box sx={CHART_CONTENT_WRAPPER_SX}>
          {/* Title */}
          <AtomTypography variant="h4" sx={CHART_TITLE_SX}>
            Dollar Yield Vs BTC Yield With A CAGR Calculator
          </AtomTypography>

          {/* Chart */}
          <CagrChart />

          {/* Legend */}
          <Box sx={LEGEND_WRAPPER_SX}>
            {LEGEND_ITEMS.map((item) => (
              <Box key={item.label} sx={LEGEND_ITEM_SX}>
                <Box sx={LEGEND_COLOR_BOX_SX(item.color)} />
                <AtomTypography variant="caption" sx={LEGEND_TEXT_SX}>
                  {item.label}
                </AtomTypography>
              </Box>
            ))}
          </Box>
        </Box>
      </CornerContainer>
      {/* Metrics Slider */}
      <Box sx={CHART_METRICS_WRAPPER_SX}>
        <MetricsMarquee metrics={ASSUMPTIONS_METRICS} />
      </Box>
    </Box>
  );
});

function MoneyCalculatorSection(): React.JSX.Element {
  return (
    <Box sx={SECTION_SX}>
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ width: '100%' }}
      >


        <Box sx={HEADING_DISPLAY_SX}>
          {["DOLLAR", "YIELD", "VS"].map((word: string) => (
            <AtomTypography variant="display4" key={word} sx={{ fontWeight: 600 }}>
              {word}
            </AtomTypography>
          ))}

          {
            ["BTC", "YIELD"].map((word: string) => (
              <AtomTypography variant="display4" fontType='tickerbit' color='primary.main' key={word}>
                {word}
              </AtomTypography>
            ))
          }

        </Box>

        <Box sx={HEADING_SUBTITLE_SX}>
          <Box sx={SUBTITLE_LINE_SX}>
            {["For", "Those", "Who", "Really", "Like", "Money"].map((word: string) => (
              <AtomTypography variant="h6" key={word} sx={SUBTITLE_WORD_SX}>
                {word}
              </AtomTypography>
            ))}
          </Box>
        </Box>

      </motion.div >

      {/* Main Content Grid */}
      < Box sx={MAIN_CONTENT_GRID_SX} >
        {/* Left Column - Stacked Cards */}
        < Box sx={LEFT_COLUMN_SX} >
          <CalculationsCard />
          <ActionRow />
          <AssumptionsCard />
        </Box >

        {/* Right Column - Chart */}
        < ChartPlaceholder />
      </Box >
    </Box >
  );
}

export default memo(MoneyCalculatorSection);