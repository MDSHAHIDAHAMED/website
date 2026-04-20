'use client';

/**
 * RiskTakerSection Component
 * ===========================
 * Full-screen section with background image and stat cards at bottom.
 *
 * Layout:
 * - Background image covering full viewport
 * - Heading at top
 * - 3 stat cards at bottom
 */
import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import { memo } from 'react';

import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
import Watermark from '@/components/atoms/watermark-logo';
import { yieldzBase } from '@/styles/theme';

// =============================================================================
// Constants
// =============================================================================

const BACKGROUND_IMAGE_SRC = '/assets/videos/Yieldz Maile Model Vid_01.mp4';

/** Section container with background image */
const SECTION_SX: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  minHeight: { xs: '50vh', md: '50vh', lg: '100vh'},
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  p: { xs: 2, md: 5 },
  overflow: 'hidden',
};


/** Cards container at bottom */
const CARDS_CONTAINER_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
  gap: 0,
  mt: 'auto',
};

/** Individual card styles */
const CARD_SX: SxProps<Theme> = {
  p: { xs: 2, md: 4 },
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  position: 'relative',
  overflow: 'hidden',
};

/** Bottom section of card - right aligned */
const CARD_BOTTOM_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 1,
  mt: 'auto',
};

/** Watermark styles */
const WATERMARK_SX: SxProps<Theme> = {
  position: 'absolute',
  bottom: -20,
  right: -20,
  opacity: 0.1,
  pointerEvents: 'none',
};

// =============================================================================
// Data
// =============================================================================

/** Heading words with highlight for "EQUAL" */
interface HeadingWord {
  text: string;
  highlight: boolean;
}

const HEADING_WORDS: HeadingWord[] = [
  { text: 'NOT', highlight: false },
  { text: 'ALL', highlight: false },
  { text: 'RISK', highlight: false },
  { text: 'IS', highlight: false },
  { text: 'CREATED', highlight: false },
  { text: 'EQUAL', highlight: true },
];

interface CardMetric {
  icon?: string;
  label: string;
  value?: string;
}

interface RiskCard {
  id: string;
  title: string;
  subtitle?: string;
  bottomValue?: {
    value: string;
    icon?: string;
  };
  hasWatermark?: boolean;
}

const RISK_CARDS: RiskCard[] = [
  {
    id: 'volatility',
    title: 'NO ALL YIELD IS CREATED EQUAL',
    subtitle: '',
    bottomValue: {
      value: 'SURANCE',
      icon: '/assets/logo-emblem--dark.png'
    }
  },
  {
    id: 'liquidity',
    title: 'POWERED BY YLDZ YIELD IN BTC',
    subtitle: 'Inside an fully 100% guaranteed insurance wrapper',
    bottomValue: {
      value: '15.54%',
    }
  },
  {
    id: 'yield',
    title: 'WHAT IF YOU COULD DE-RISK YOUR BTC RETURNS?',
    hasWatermark: true,
  },
];

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Metric Row Component
 * Displays icon + label or just label with optional value
 */
interface MetricRowProps {
  metric: CardMetric;
}

const MetricRow = memo(function MetricRow({ metric }: Readonly<MetricRowProps>) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} justifyContent="flex-end">
      {metric.icon && (
        <Image
          src={metric.icon}
          alt={metric.icon}
          width={60}
          height={60}
          style={{ objectFit: 'contain' }}
        />
      )}
      {metric.value && (
        <AtomTypography variant="display5" fontType="tickerbit" color="text.primary">
          {metric.value}
        </AtomTypography>
      )}
    </Stack>
  );
});

/**
 * Risk Card Component
 */
interface RiskCardProps {
  data: RiskCard;
}

const RiskCardComponent = memo(function RiskCardComponent({ data }: Readonly<RiskCardProps>) {
  return (
    <CornerContainer sx={{ ...CARD_SX, position: 'relative' }} showBorder>
      {/* Top Section - Title & Subtitle */}
      <Box>
        <AtomTypography variant="h3">
          {data.title}
        </AtomTypography>
        {data.subtitle && (
          <AtomTypography
            variant="body4"
            sx={{ fontSize: '15px', mt: 1 }}
          >
            {data.subtitle}
          </AtomTypography>
        )}
      </Box>
      {data?.hasWatermark && <Watermark src='/assets/BTC.svg' sx={{ opacity: 1 }} />}

      {/* Bottom Section - Metrics (right aligned) */}
      <Box sx={CARD_BOTTOM_SX}>
        {data.bottomValue && (
          <MetricRow metric={{ label: data.bottomValue.value, value: data.bottomValue.value, icon: data.bottomValue.icon }} />
        )}
      </Box>
    </CornerContainer>
  );
});

// =============================================================================
// Main Component
// =============================================================================

function RiskTakerSection(): React.JSX.Element {
  return (
    <Box sx={SECTION_SX}>
      <Box
        component="video"
        autoPlay
        loop
        muted
        playsInline
        src={BACKGROUND_IMAGE_SRC}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          objectFit: 'cover',
          objectPosition: 'top center',
          zIndex: 0,
        }}
      />

      {/* Heading */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {HEADING_WORDS.map((word) => (
          <AtomTypography
            key={word.text}
            variant="display4"
            fontType={word.highlight ? 'tickerbit' : 'ppMori'}
            mt={2}
            sx={{ color: word.highlight ? 'primary.main' : yieldzBase.black, fontWeight: 600 }}
          >
            {word.text}
          </AtomTypography>
        ))}
      </Box>

      {/* Cards at bottom */}
      {/* <Box sx={CARDS_CONTAINER_SX}>
        {RISK_CARDS.map((card) => (
          <RiskCardComponent key={card.id} data={card} />
        ))}
      </Box> */}
    </Box>
  );
}

export default memo(RiskTakerSection);
