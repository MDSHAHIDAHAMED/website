'use client';

/**
 * YieldComparisonSection Component
 * =================================
 * Displays yield comparison with a bar chart showing 10-year compounded returns.
 *
 * Layout:
 * - Left: "YIELD THAT OUTPACES INFLATION" with animated pig icon
 * - Right: Bar chart showing different yield types
 */
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { motion } from 'motion/react';
import Image from 'next/image';
import { memo, useState } from 'react';

import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
import { CHART_DATA, TEXT_ROW_1, TEXT_ROW_2 } from '@/constants/yield-comparison';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';
// =============================================================================
// Constants
// =============================================================================

/** Container styles for the section */
const SECTION_SX: SxProps<Theme> = {
  width: '100%',
  minHeight: '100%',
  backgroundColor: 'background.default',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  p: { xs: 2, sm: 3, md: 4, lg: 6 },
};

/** Main content wrapper */
const CONTENT_WRAPPER_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', lg: '1fr 1.5fr' },
  gap: 3,
  width: '100%',
  maxWidth: '100%',
};

/** Left panel styles */
const LEFT_PANEL_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: 4,
  py: 4,
};

/** Right panel styles */
const RIGHT_PANEL_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  p: { xs: 3, md: 4 },
};


/** Text rows container */
const TEXT_ROWS_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: 0,
};

/** Tooltip container styles */
const TOOLTIP_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 0.5,
  p: 1.5,
  backgroundColor: 'rgba(0, 0, 0, 0.95)',
  borderRadius: 1,
  border: '1px solid',
  borderColor: 'grey.800',
  minWidth: 220,
  boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
};

/** Tooltip icon wrapper styles */
const TOOLTIP_ICON_WRAPPER_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  mb: 0.25,
};

/** Tooltip BTC icon container styles */
const TOOLTIP_BTC_ICON_SX: SxProps<Theme> = {
  width: 24,
  height: 24,
  position: 'relative',
  flexShrink: 0,
};

/** Tooltip title styles */
const TOOLTIP_TITLE_SX: SxProps<Theme> = {
  color: 'common.white',
  lineHeight: 1.2,
};

/** Tooltip subtitle styles */
const TOOLTIP_SUBTITLE_SX: SxProps<Theme> = {
  pl: 0,
  width: '60%',
};

/** Headline container styles */
const HEADLINE_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 0,
};

/** Image container styles */
const IMAGE_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  my: 3,
  position: 'relative',
  width: '100%',
  height: { xs: 150, md: 200 },
};

/** Text rows wrapper styles */
const TEXT_ROWS_WRAPPER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  maxWidth: '500px',
  mx: 'auto',
};

/** Right panel container styles */
const RIGHT_PANEL_CONTAINER_SX: SxProps<Theme> = {
  ...RIGHT_PANEL_SX,
  position: 'relative',
  overflow: 'hidden',
  backgroundImage: 'url(/assets/backgrounds/noise_bg.svg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

/** Content wrapper inner styles */
const CONTENT_WRAPPER_INNER_SX: SxProps<Theme> = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  height: '100%',
};

/** Chart header styles */
const CHART_HEADER_SX: SxProps<Theme> = {
  fontWeight: 600,
  color: 'common.white',
  mb: 4,
  opacity: 0.8,
};

/** Chart area container styles */
const CHART_AREA_SX: SxProps<Theme> = {
  position: 'relative',
  flex: 1,
  width: '100%',
  minHeight: 300,
};

/** Legend container styles */
const LEGEND_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  justifyContent: 'center',
  gap: { xs: 1, sm: 4 },
  mt: 2,
};

/** Legend item styles */
const LEGEND_ITEM_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

/** Legend color box styles */
const LEGEND_COLOR_BOX_SX = (color: string): SxProps<Theme> => ({
  width: 20,
  height: 4,
  backgroundColor: color,
});

/** Legend text styles */
const LEGEND_TEXT_SX: SxProps<Theme> = {
  fontSize: '10px',
  color: 'grey.500',
  fontWeight: 600,
};


// =============================================================================
// Sub-Components
// =============================================================================

const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const lines = payload.value.split('\n');

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line: string, index: number) => (
        <text
          key={`${line}-${index}`}
          x={0}
          y={index * 12}
          dy={16}
          textAnchor="middle"
          fill="#9e9e9e"
          fontSize={'10px'}
          fontWeight={600}
        >
          {line}
        </text>
      ))}
    </g>
  );
};

const CustomTooltip = ({ active, payload, hoveredBar }: any) => {
  if (active && payload?.length && hoveredBar === payload[0]?.payload?.name) {
    return (
      <Box sx={TOOLTIP_CONTAINER_SX}>
        {/* Title with Bitcoin Icon */}
        <Box sx={TOOLTIP_ICON_WRAPPER_SX}>
          <Box sx={TOOLTIP_BTC_ICON_SX}>
            <Image
              src="/assets/icons/btc.svg"
              alt="BTC"
              fill
              style={{ objectFit: 'contain' }}
            />
          </Box>
          <AtomTypography variant="body2" sx={TOOLTIP_TITLE_SX}>
            Return of Capital
          </AtomTypography>
        </Box>

        {/* Subtitle */}
        <AtomTypography variant="caption" sx={TOOLTIP_SUBTITLE_SX}>
          (&quot;ROC&quot;) tax deferred distributions in BTC
        </AtomTypography>
      </Box>
    );
  }
  return null;
};

// =============================================================================
// Main Component
// =============================================================================

function YieldComparisonSection(): React.JSX.Element {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  return (
    <Box sx={SECTION_SX}>
      <Box sx={CONTENT_WRAPPER_SX}>
        {/* Left Panel - Headline */}
        <CornerContainer sx={LEFT_PANEL_SX} showBorder>
          {/* Headline Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Box sx={HEADLINE_CONTAINER_SX}>
              <AtomTypography variant="display4" style={{ fontWeight: 600 }}>
                NOT ALL YIELD
              </AtomTypography>
              <AtomTypography
                variant="display4"
                color="primary.main"
                fontType="tickerbit"
              >
                IS
              </AtomTypography>
              <AtomTypography
                variant="display4"
                color="primary.main"
                fontType="tickerbit"
              >
                EQUALS
              </AtomTypography>
            </Box>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <Box sx={IMAGE_CONTAINER_SX}>
              <Image
                src="/assets/outpaces-inflation.png"
                alt="outpaces-inflation-image"
                fill
                style={{ objectFit: 'contain' }}
              />
            </Box>
          </motion.div>

          {/* Text Rows */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <Box sx={TEXT_ROWS_WRAPPER_SX}>
              <Box sx={TEXT_ROWS_SX}>
                {TEXT_ROW_1.map((text) => (
                  <AtomTypography
                    key={text}
                    variant="body2"
                    sx={{
                      color: text === 'ONE' ? 'primary.main' : '',
                      textAlign: 'center',
                    }}
                  >
                    {text}
                  </AtomTypography>
                ))}
              </Box>
              <Box sx={TEXT_ROWS_SX}>
                {TEXT_ROW_2.map((text) => (
                  <AtomTypography
                    key={text}
                    variant="body2"
                    sx={{
                      color: text === 'ASSET' || text === 'YIELD' ? 'primary.main' : '',
                      textAlign: 'center',
                    }}
                  >
                    {text}
                  </AtomTypography>
                ))}
              </Box>
            </Box>
          </motion.div>
        </CornerContainer>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          <CornerContainer sx={RIGHT_PANEL_CONTAINER_SX} showBorder>
            {/* Content Wrapper */}
            <Box sx={CONTENT_WRAPPER_INNER_SX}>
              {/* Header */}
              <AtomTypography variant="h4" sx={CHART_HEADER_SX}>
                20 Year Compounded Return Profile $10K/year over 20 Years
              </AtomTypography>

              {/* Chart Area */}
              <Box sx={CHART_AREA_SX}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={CHART_DATA}
                    margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
                    barGap={8}
                  >
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={<CustomXAxisTick />}
                      interval={0}
                      height={60}
                    />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      content={<CustomTooltip hoveredBar={hoveredBar} />}
                      cursor={false}
                    />
                    <ReferenceLine y={15} stroke="#6DF2FE" strokeWidth={1} opacity={0.2} />

                    <Bar
                      dataKey="capital"
                      stackId="a"
                      fill="#1F4E56"
                      barSize={100}
                      onMouseEnter={(data) => setHoveredBar(data.name)}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                    <Bar
                      dataKey="debasement"
                      stackId="a"
                      fill="#1F4E56"
                      barSize={100}
                      onMouseEnter={(data) => setHoveredBar(data.name)}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                    <Bar
                      dataKey="cagr"
                      stackId="a"
                      fill="#6DF2FE"
                      barSize={100}
                      onMouseEnter={(data) => setHoveredBar(data.name)}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              {/* Legend */}
              <Box sx={LEGEND_CONTAINER_SX}>
                <Box sx={LEGEND_ITEM_SX}>
                  <Box sx={LEGEND_COLOR_BOX_SX('info.main')} />
                  <AtomTypography variant="caption" sx={LEGEND_TEXT_SX}>
                    YIELD WITH A CAGR (FUTURE STAKING OF YLDZ = YIELD STACKING)
                  </AtomTypography>
                </Box>
                <Box sx={LEGEND_ITEM_SX}>
                  <Box sx={LEGEND_COLOR_BOX_SX('#1F4E56')} />
                  <AtomTypography variant="caption" sx={LEGEND_TEXT_SX}>
                    US DOLLAR DEBASEMENT
                  </AtomTypography>
                </Box>
              </Box>
            </Box>
          </CornerContainer>
        </motion.div>
      </Box>
    </Box>
  );
}

export default memo(YieldComparisonSection);