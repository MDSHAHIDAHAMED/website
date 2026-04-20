'use client';

/**
 * Hero Section Component
 * ======================
 * Full-screen hero with video background for the marketing landing page.
 * 
 * Layout:
 * - Video background covering full viewport
 * - Header at top (logo, nav, buttons)
 * - Bottom-left: Main headline and description
 * - Bottom-right: Token info and CTA
 */


import {
  
  Box,
 
  Stack,
  
} from '@mui/material';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import AtomButton from '@/components/atoms/button';
import AtomTypography from '@/components/atoms/typography';
import BackgroundVideoContainer from '@/components/atoms/video/background-container';
import { Logo } from '@/components/core/logo';
import { paths } from '@/paths';
import Image from 'next/image';

// =============================================================================
// Constants
// =============================================================================

export const HERO_VIDEO_SRC = '/assets/videos/new_updated_banner.mp4';

export const CONTAINER_SX = {
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
};

export const CONTENT_WRAPPER_SX = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
};

/** Common overlay styles */
const OVERLAY_BASE_SX = {
  position: 'absolute',
  left: 0,
  right: 0,
  pointerEvents: 'none',
  zIndex: 1,
  backdropFilter: 'blur(40px)',
  WebkitBackdropFilter: 'blur(40px)',
};

/** Top gradient overlay - 146px height with gradient blur (40px at top, 0 at bottom) */
export const TOP_OVERLAY_SX = {
  ...OVERLAY_BASE_SX,
  top: 0,
  height: '146px',
  background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.28) 14.74%, rgba(255, 255, 255, 0) 100%)',
  maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
};

/** Bottom gradient overlay - 560px height with gradient blur (0 at top, 40px at bottom) */
export const BOTTOM_OVERLAY_SX = {
  ...OVERLAY_BASE_SX,
  bottom: 0,
  height: '560px',
  background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.37) 70.31%, rgba(255, 255, 255, 0) 100%)',
  maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
};

const MAIN_CONTENT_SX = {
  flex: 1,
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  justifyContent: 'space-between',
  alignItems: { xs: 'stretch', md: 'flex-end' },
  p: { xs: 2, sm: 3, md: 4, lg: 6 },
  mt: 10,
  gap: { xs: 3, md: 4 },
};

const BOTTOM_LEFT_SX = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  maxWidth: { xs: '100%', md: '50%' },
};

const BOTTOM_RIGHT_SX = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: { xs: 'stretch', md: 'flex-end' },
  gap: 2,
  width: { xs: '100%', sm: 425, md: 425 },
};

const TOKEN_CARD_SX = {
  minWidth: { xs: '100%', sm: 280, md: 320 },
};

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Bottom Left Content - Headlines
 */
const BottomLeftContent = memo(function BottomLeftContent() {
  const { t } = useTranslation();

  return (
    <Box sx={BOTTOM_LEFT_SX}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <AtomTypography
          variant="display5"
          sx={{
            whiteSpace: 'pre-line',
            textTransform: 'capitalize',
            fontWeight: 600,
          }}
        >
          {t('hero:headline')}
        </AtomTypography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <AtomTypography
          variant="h4"
          sx={{
            fontWeight: 600,
            maxWidth: 500,
            mt: 1,
          }}
        >
          {t('hero:subtitle')}
        </AtomTypography>
      </motion.div>
    </Box>
  );
});

/**
 * Bottom Right Content - Token Card with CTA
 */
const BottomRightContent = memo(function BottomRightContent() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleExplore = useCallback(() => {
    router.push(paths.dashboard.overview);
  }, [router]);

  return (
    <Box sx={BOTTOM_RIGHT_SX}>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{ width: '100%' }}
      >
        <Box sx={TOKEN_CARD_SX}>
          <Stack spacing="40px" direction="column" alignItems="flex-start" width="100%" height="100%" p={0}>
            {/* Token Info Row */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="stretch"
              width="100%"
              p={0}
            >
              {/* Token Name */}
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', height: '68px', gap: 2.25 }}>
                <AtomTypography
                  variant="subtitle3"
                >
                  Token
                </AtomTypography>
                <Box>
                  <Logo height={16} width={99} emblem />
                </Box>
              </Box>

              {/* APY */}
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', height: '68px', gap: 2.25 }}>
                <AtomTypography
                  variant="subtitle3"
                >
                  Variable APY
                </AtomTypography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <AtomTypography
                    variant="h2"
                  >
                    15.00% <Image src="/assets/icons/boltz.svg" alt="Lightning Icon" width={40} height={40} />
                  </AtomTypography>
                </Stack>
              </Box>
            </Stack>

            {/* CTA Button */}
            <AtomButton
              id="hero-explore-btn"
              variant="transparent"
              label={t('hero:exploreInvestments') || 'EXPLORE INVESTMENTS'}
              onClick={handleExplore}
              fullWidth
              size={'large'}
              color="secondary"
            />
          </Stack>
        </Box>
      </motion.div>
    </Box>
  );
});

// =============================================================================
// Main Component
// =============================================================================

function HeroSection(): React.JSX.Element {
  return (
    <BackgroundVideoContainer
      src={HERO_VIDEO_SRC}
      sx={CONTAINER_SX}
      objectFit="cover"
      showOnMobile
    >
      {/* Top Gradient Overlay */}
      <Box sx={TOP_OVERLAY_SX} />
      {/* Bottom Gradient Overlay with Blur */}
      <Box sx={BOTTOM_OVERLAY_SX} />
      <Box sx={{ ...CONTENT_WRAPPER_SX, position: 'relative', zIndex: 2 }}>
        {/* Main Content Area */}
        <Box sx={MAIN_CONTENT_SX}>
          {/* Bottom Left - Headlines */}
          <BottomLeftContent />
          {/* Bottom Right - Token Card */}
          <BottomRightContent />
        </Box>
      </Box>
    </BackgroundVideoContainer>
  );
}

export default memo(HeroSection);