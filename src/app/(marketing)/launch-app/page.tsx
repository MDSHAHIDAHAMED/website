'use client';

/**
 * Launch App Page
 * ===============
 * Page displaying download options for Android and iOS apps.
 *
 * Layout:
 * - CornerContainer as overall wrapper
 * - Animated heading
 * - Two app store cards (Android & iOS)
 */
import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { motion } from 'motion/react';
import Image from 'next/image';
import * as React from 'react';
import { memo, useCallback } from 'react';

import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
import Header from '@/components/sections/header';
import { CONTENT_WRAPPER_SX } from '@/components/sections/hero-section';

// =============================================================================
// Constants
// =============================================================================

/** App store URLs - replace with actual URLs */
const ANDROID_APP_URL = 'https://play.google.com/store';
const IOS_APP_URL = 'https://apps.apple.com';

/** Page container styles */
const PAGE_CONTAINER_SX: SxProps<Theme> = {
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  p: { xs: 2, sm: 4, md: 6 },
  bgcolor: 'background.default',
};

/** Main wrapper styles */
const WRAPPER_SX: SxProps<Theme> = {
  p: { xs: 4, sm: 6, md: 8 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
  width: '100%',
};

/** App card styles */
const APP_CARD_SX: SxProps<Theme> = {
  p: { xs: 3, sm: 4 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  minHeight: 200,
  flex: 1,
  '&:hover': {
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
  },
};

/** Cards container styles */
const CARDS_CONTAINER_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
  gap: { xs: 3, sm: 4 },
  width: '100%',
};

// =============================================================================
// Sub-Components
// =============================================================================

interface AppCardProps {
  icon: string;
  title: string;
  subtitle: string;
  url: string;
  delay?: number;
}

/**
 * App Store Card Component
 * Displays app store icon and redirects to respective store
 */
const AppCard = memo(function AppCard({ icon, title, subtitle, url, delay = 0 }: Readonly<AppCardProps>) {
  const handleClick = useCallback(() => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [url]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
    >
      <CornerContainer sx={APP_CARD_SX} showBorder>
        <Box
          onClick={handleClick}
          sx={{
            textAlign: 'center',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image src={icon} alt={title} width={64} height={64} />

          <AtomTypography variant="h3" sx={{ mt: 3 }}>
            {title}
          </AtomTypography>

          <AtomTypography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </AtomTypography>
        </Box>
      </CornerContainer>
    </motion.div>
  );
});

// =============================================================================
// Main Component
// =============================================================================

function LaunchAppPage(): React.JSX.Element {
  return (
    <Box sx={{ ...CONTENT_WRAPPER_SX, position: 'relative', zIndex: 2 }}>
      <Header hideLaunchButton />

      <Box sx={PAGE_CONTAINER_SX}>
        <CornerContainer sx={WRAPPER_SX} showBorder>
          {/* Animated Heading */}
          <Stack spacing={2} alignItems="center" textAlign="center">
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <AtomTypography
                variant="display2"
                color="primary"
                fontType="tickerbit"
                sx={{
                  whiteSpace: 'pre-line',
                }}
              >
                Get the YIELDZ App
              </AtomTypography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <AtomTypography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                Download our mobile app to access your investments on the go. Available on both Android and iOS
                platforms.
              </AtomTypography>
            </motion.div>
          </Stack>

          {/* App Store Cards */}
          <Box sx={CARDS_CONTAINER_SX}>
            <AppCard
              icon="/assets/icons/wallets.svg"
              title="Android"
              subtitle="Get it on Google Play"
              url={ANDROID_APP_URL}
              delay={0.4}
            />
            <AppCard
              icon="/assets/icons/wallets.svg"
              title="iOS"
              subtitle="Download on the App Store"
              url={IOS_APP_URL}
              delay={0.5}
            />
          </Box>
        </CornerContainer>
      </Box>
    </Box>
  );
}

export default memo(LaunchAppPage);
