'use client';

import Box from '@mui/material/Box';
import React from 'react';

import { Logo } from '@/components/core/logo';

import { paths } from '@/paths';
import { useRouter } from 'next/navigation';
import CornerContainer from '../corner-container';

/**
 * BackgroundVideo
 * Renders a full-viewport background video (cover). The foreground content
 * is placed above the video, inside a container with 80px padding on all sides.
 *
 * Props:
 * - src: string – public path to the video under `public/`
 * - children: React.ReactNode – content to render over the video
 */
type BackgroundVideoProps = {
  src: string;
  children?: React.ReactNode;
};

/**
 * BackgroundVideo component
 * Renders a full-viewport background video with scrollable content overlay.
 * The video stays fixed while content can scroll when it exceeds viewport height.
 *
 * @param src - Public path to the video file under `public/` directory
 * @param children - Content to render over the video
 */
export function BackgroundVideo({ src, children }: Readonly<BackgroundVideoProps>) {
  const router = useRouter();
  return (
    <Box sx={{ position: 'relative', width: '100%', minHeight: '100svh', overflowY: 'auto', overflowX: 'hidden' }}>
      {/* Video layer - fixed position to stay in place during scroll */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none', // Allow scrolling through video layer
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src={src}
        />
      </Box>

      {/* Foreground content with relative positioning and proper padding */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: '100svh',
          zIndex: 1,
          px: { xs: 2, sm: 3, md: 8 },
          // pb: { xs: 2, sm: 3, md: 6 },
          pt: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 3, sm: 4, md: 6 },
        }}
      >
        {/* Logo section wrapped in CornerContainer */}
        <CornerContainer height="auto">
          <Box
            sx={{
              width: '100%',
              height: '64px',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              bgcolor: 'background.default',
              pl: 4,
            }}
          >
            <Box
              component="button"
              onClick={() => router.push(paths.home)}
              sx={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <Logo width={120} height={20} emblem />
            </Box>
          </Box>
        </CornerContainer>
        {/* Children content wrapped in CornerContainer */}
        <CornerContainer height="auto" sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'var(--mui-palette-background-default)',
              flexDirection: 'column',
              width: '100%',
              flex: 1,
              overflow:{
                xs: 'auto',
                sm: 'auto',
                md: 'hidden',
              },
              minHeight: {
                xs: 'calc(100vh - 130px)',
                sm: 'calc(100vh - 140px)',
                md: 'calc(100vh - 188px)',
              },
              height: '100%',
              // py: 6,
              // px: 6,
              py:{
                xs: 3,
                md: 0,
              }
            }}
          >
            {children}
          </Box>
        </CornerContainer>
      </Box>
    </Box>
  );
}

export default BackgroundVideo;
