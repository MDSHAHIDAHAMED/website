'use client';

/**
 * SubHeroSection Component
 * ========================
 * Video background section with three stat cards at the bottom.
 *
 * Layout:
 * - Full-width video background
 * - Three CornerContainer stat cards positioned at bottom
 */
import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { motion } from 'motion/react';
import Image from 'next/image';
import { memo } from 'react';

import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
import BackgroundVideoContainer from '@/components/atoms/video/background-container';
import { Logo } from '@/components/core/logo';

// =============================================================================
// Constants
// =============================================================================

const SUB_HERO_VIDEO_SRC = '/assets/videos/Sub-Hero-Section.mp4';

/** Container styles for the section */
const CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  height: { xs: '72vh', sm: '92vh', md: '80vh', lg: '75vh' },
  overflow: 'hidden',
  position: 'relative',
  objectFit: 'cover',
};

/** Content wrapper styles */
const CONTENT_WRAPPER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: { lg: 'flex-end' },
  height: '100%',
  width: '100%',
  p: { xs: 2, sm: 3, md: 4, lg: 6 },
};

/** Stats row container styles - equal width and height grid */
const STATS_ROW_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
  gridAutoRows: '1fr', // Ensures equal row heights
  gap: { xs: 2, md: 0 },
  width: '100%',
  height: '300px',
  alignItems: 'center',
  // Make grid items square-ish by setting aspect ratio via child styles
  '& > *': {
    height: '100%',
  },
};

/** Individual stat card styles */
const STAT_CARD_SX: SxProps<Theme> = {
  p: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: 3,
  height: '100%',
  width: '100%',
};

/** Background image styles for header and APY sections */
const BACKGROUND_IMAGE_SX: SxProps<Theme> = {
  bgcolor: 'var(--mui-palette-background-level1)',
  backgroundImage: 'url(/assets/backgrounds/feature-bg.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  overflow: 'hidden',
};


// =============================================================================
// Types
// =============================================================================

interface StatCardData {
  id: string;
  title: string;
  value: string;
  valueType: 'text' | 'logo' | 'percentage';
  icon?: string;
  isLogo?: boolean;
}

// =============================================================================
// Data
// =============================================================================

const STAT_CARDS: StatCardData[] = [
  {
    id: 'digital-assets',
    title: 'DIGITAL ASSETS ON\nTHIS PLANET',
    value: '18.4 M',
    valueType: 'text',
    isLogo: false,
  },
  {
    id: 'yield-equal',
    title: 'NOT ALL YIELD IS\nCREATED EQUAL',
    value: '',
    valueType: 'logo',
    isLogo: false,
  },
  {
    id: 'zero-can-do',
    title: 'ZERO CAN DO THIS',
    value: '15.54%',
    valueType: 'percentage',
    icon: '/assets/icons/btc.svg',
    isLogo: true,
  },
];

// =============================================================================
// Sub-Components
// =============================================================================

interface StatCardProps {
  data: StatCardData;
}

const StatCard = memo(function StatCard({ data }: Readonly<StatCardProps>) {
  const renderValue = () => {
    switch (data.valueType) {
      case 'logo':
        return <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}><Logo height={66} width={330} emblem /></Box>;
      case 'percentage':
        return (
          <Stack direction="row" alignItems="center" justifyContent="flex-end" textAlign="right" spacing={1} position="relative">
            <AtomTypography variant="display1" fontType="tickerbit">
              {data.value}
            </AtomTypography>
            {data.isLogo && <Image src={"/assets/icons/yieldz.svg"} alt="Yield Icon" width={80} height={80} />}
            {data.icon && <Image src={data.icon} alt="Yield Icon" width={80} height={80} style={{ position: 'absolute', top: '-60px', right: '44px' }} />}
          </Stack>
        );
      default:
        return (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <AtomTypography variant="display1" fontType="tickerbit" sx={{ textAlign: 'right' }}>
              {data.value}
            </AtomTypography>
          </Box>
        );
    }
  };

  return (
    <CornerContainer sx={{ ...STAT_CARD_SX, ...BACKGROUND_IMAGE_SX }} showBorder outerSx={{ border: 'none' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          p: { xs: 2, md: 3 },
          gap: 2,
        }}
      >
        {/* Title */}
        <AtomTypography
          variant="h3"
          sx={{
            whiteSpace: 'pre-line',
          }}
        >
          {data.title}
        </AtomTypography>

        {/* Subtitle for percentage card */}
        {data.valueType === 'percentage' && (
          <AtomTypography variant="caption" color="text.secondary" sx={{ textAlign: 'left', fontSize: '15px', }}>
            Variable <br /> Yield in BTC
          </AtomTypography>
        )}

        {/* Value */}
        <Box sx={{ mt: 'auto', }}>{renderValue()}</Box>
      </Box>
    </CornerContainer>
  );
});

// =============================================================================
// Main Component
// =============================================================================

function SubHeroSection(): React.JSX.Element {
  return (
    <BackgroundVideoContainer src={SUB_HERO_VIDEO_SRC} sx={CONTAINER_SX} objectFit="cover" objectPosition="top" showOnMobile>
      <Box sx={CONTENT_WRAPPER_SX}>
        {/* Stats Cards Row */}
        <Box sx={STATS_ROW_SX}>
          {STAT_CARDS.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: 'easeOut',
              }}
              style={{ height: '100%' }}
            >
              <StatCard data={card} />
            </motion.div>
          ))}
        </Box>
      </Box>
    </BackgroundVideoContainer>
  );
}

export default memo(SubHeroSection);