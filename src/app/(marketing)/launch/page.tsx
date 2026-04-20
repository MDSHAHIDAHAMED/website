'use client';

/**
 * Launch App Page
 * ===============
 * Page displaying download options for Android and iOS apps.
 * Features:
 * - Gradient background with animated glow effects
 * - Smooth entrance animations
 * - Interactive app store cards with hover effects
 * - Responsive design for all screen sizes
 */
import { getMethod } from '@/services/api';
import endPoints from '@/services/urls';
import { showErrorToast } from '@/utils/toast';
import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { motion } from 'motion/react';
import Image from 'next/image';
import * as React from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
import { BackgroundVideoContainer } from '@/components/atoms/video/background-container';
import Header from '@/components/sections/header';
import { CONTENT_WRAPPER_SX } from '@/components/sections/hero-section';
import { config } from '@/config';
import { yieldzPrimary } from '@/styles/theme';

// =============================================================================
// Types
// =============================================================================

interface AppUrls {
  playStoreUrl?: string;
  iosUrl?: string;
}

interface AppUrlsResponse {
  status: string;
  data: AppUrls;
  message: string;
}

interface AppCardProps {
  readonly icon: string;
  readonly title: string;
  readonly subtitle: string;
  readonly storeName: string;
  readonly url?: string;
  readonly delay?: number;
  readonly onCardClick: (url?: string) => void;
}

// =============================================================================
// Styles
// =============================================================================

/** Page container with gradient background */
const PAGE_CONTAINER_SX: SxProps<Theme> = {
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  p: { xs: 2, sm: 4, md: 6 },
  position: 'relative',
  overflow: 'hidden',
  // Radial gradient background for depth
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '150%',
    height: '150%',
    background: `radial-gradient(ellipse at center, ${yieldzPrimary[950]} 0%, transparent 70%)`,
    pointerEvents: 'none',
    zIndex: 0,
  },
};

/** Main wrapper styles */
const WRAPPER_SX: SxProps<Theme> = {
  p: { xs: 4, sm: 6, md: 8 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: { xs: 4, sm: 5, md: 6 },
  width: '100%',
  position: 'relative',
  zIndex: 1,
  // Subtle inner glow
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60%',
    height: '1px',
    background: `linear-gradient(90deg, transparent 0%, ${yieldzPrimary[500]}40 50%, transparent 100%)`,
  },
};

/** App card base styles */
const APP_CARD_SX: SxProps<Theme> = {
  p: { xs: 3, sm: 4 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  minHeight: { xs: 180, sm: 220 },
  border: 'none',
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
  // Hover glow effect
  '&:hover': {
    boxShadow: `0 20px 60px ${yieldzPrimary[500]}15, 0 8px 24px rgba(0, 0, 0, 0.4)`,
    '& .card-icon': {
      transform: 'scale(1.1)',
    },
    '& .card-glow': {
      opacity: 1,
    },
  },
};

/** Cards container grid */
const CARDS_CONTAINER_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
  gap: { xs: 2, sm: 3 },
  width: '100%',
};

// =============================================================================
// Animation Variants
// =============================================================================

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * App Store Card Component
 * Displays app store icon with hover effects and redirects to respective store
 */
const AppCard = memo(function AppCard({ icon, title, subtitle, storeName, url, delay = 0, onCardClick }: AppCardProps) {
  return (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1 }}>
      <CornerContainer sx={APP_CARD_SX} showBorder outerSx={{ height: '100%' }}>
        {/* Background glow effect on hover */}
        <Box
          className="card-glow"
          sx={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: `radial-gradient(circle at center, ${yieldzPrimary[500]}08 0%, transparent 50%)`,
            opacity: 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }}
        />

        <Box
          onClick={() => onCardClick(url)}
          sx={{
            textAlign: 'center',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Icon with scale animation on hover */}
          <Box
            className="card-icon"
            sx={{
              transition: 'transform 0.3s ease',
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: '20px',
                background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.05)',
                mb: 2,
              }}
            >
              <Image src={icon} alt={title} width={56} height={56} />
            </Box>
          </Box>

          {/* Store name badge */}
          <AtomTypography
            variant="h6"
            color="text.primary"
            sx={{
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            {storeName}
          </AtomTypography>

          {/* Subtitle text */}
          <AtomTypography
            variant="body2"
            color="text.secondary"
            sx={{
              opacity: 0.7,
            }}
          >
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

/**
 * Launch App Page
 * Displays download options for Android and iOS mobile apps
 */
function LaunchAppPage(): React.JSX.Element {
  const [appUrls, setAppUrls] = useState<AppUrls | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);

  /**
   * Fetch app URLs on mount
   * Implements the /launch endpoint logic:
   * - Fetches URLs from API
   * - Detects device type (Android/iOS/Desktop)
   * - Redirects based on device type using fetched URLs
   */
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await getMethod<AppUrlsResponse>(endPoints.APP_URLS);
        const urls = response?.data;
        setAppUrls(urls);
      } catch (error: any) {
        console.error('Error fetching app URLs:', error);
      }
    };
    fetchUrls();
  }, [hasRedirected]);

  useEffect(() => {
    if (!appUrls) return;
    if (hasRedirected) return;

    const ua = navigator.userAgent || '';

    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);

    setHasRedirected(true);

    // Android
    if (isAndroid && appUrls.playStoreUrl) {
      globalThis.location.replace(appUrls.playStoreUrl);
      return;
    }

    // iOS
    if (isIOS && appUrls.iosUrl) {
      globalThis.location.replace(appUrls.iosUrl);
    }
  }, [appUrls, hasRedirected]);

  // Handle app card click - opens store URL or shows error
  const handleAppCardClick = useCallback((url?: string) => {
    if (url) {
      globalThis.open(url, '_blank', 'noopener,noreferrer');
    } else {
      showErrorToast('app-url-not-found', 'App download link is currently unavailable');
    }
  }, []);

  // Memoized app cards data
  const appCards = useMemo(
    () => [
      {
        icon: '/assets/icons/playstore.png',
        title: 'Android',
        storeName: 'Google Play',
        subtitle: 'Get it on Play Store',
        url: appUrls?.playStoreUrl,
      },
      {
        icon: '/assets/icons/app-store.png',
        title: 'iOS',
        storeName: 'App Store',
        subtitle: 'Download for iPhone',
        url: appUrls?.iosUrl,
      },
    ],
    [appUrls]
  );

  return (
    <>
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }}>
        <Header hideLaunchButton />
      </Box>

      <BackgroundVideoContainer src={config.backgroundVids.boxexBg} sx={PAGE_CONTAINER_SX}>
        <Box sx={CONTENT_WRAPPER_SX}>
          <CornerContainer sx={WRAPPER_SX} showBorder>
            {/* Animated Heading Section */}
            <Stack spacing={2} alignItems="center" textAlign="center">
              <motion.div variants={itemVariants}>
                <AtomTypography
                  variant="display2"
                  color="text.primary"
                  fontType="tickerbit"
                  sx={{
                    whiteSpace: 'pre-line',
                    lineHeight: 1.2,
                  }}
                >
                  Get the{' '}
                  <Box
                    component="span"
                    sx={{
                      color: 'primary.main',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -4,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        background: `linear-gradient(90deg, ${yieldzPrimary[500]} 0%, transparent 100%)`,
                      },
                    }}
                  >
                    YLDZ
                  </Box>{' '}
                  App
                </AtomTypography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <AtomTypography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    opacity: 0.8,
                    lineHeight: 1.6,
                  }}
                >
                  Access your investments anytime, anywhere. Download our mobile app for a seamless experience on
                  Android and iOS.
                </AtomTypography>
              </motion.div>
            </Stack>

            {/* App Store Cards */}
            <Box sx={CARDS_CONTAINER_SX}>
              {appCards.map((card) => (
                <AppCard
                  key={card.title}
                  icon={card.icon}
                  title={card.title}
                  storeName={card.storeName}
                  subtitle={card.subtitle}
                  url={card.url}
                  onCardClick={handleAppCardClick}
                />
              ))}
            </Box>
          </CornerContainer>
        </Box>
      </BackgroundVideoContainer>
    </>
  );
}

export default memo(LaunchAppPage);
