'use client';

import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import * as React from 'react';

import CornerContainer from '@/components/atoms/corner-container';
import CustomIconWrapper from '@/components/atoms/custom-icon-wrapper';
import { SignOptionsForm } from '@/components/auth/custom/sign-options-form';
import { GuestGuard } from '@/components/auth/guest-guard';
import { BACKGROUND_VIDEO_SRC } from '@/constants';

export default function Page(): React.JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery('(min-width:1300px)');
  const isMediumScreen = useMediaQuery('(min-width:900px) and (max-width:1299px)');
  return (
    <GuestGuard>
      <Box sx={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        {/* Video Container - Behind the form */}
        <Grid
          container
          sx={{
            height: '100%',
            ...(isMobile && {
              display: 'none',
            }),
          }}
        >
          {/* Empty 4-column section */}
          <Grid
            size={{
              xs: 0,
              sm: 0,
              md: 0,
              lg: 5,
            }}
          />

          {/* Video 8-column section */}
          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 12,
              lg: 7,
            }}
            sx={{
              transformOrigin: 'center center',
              transform: 'rotate(90deg) scale(1.1)',
              userSelect: 'none',
              pointerEvents: 'none',
              // zIndex: 1,
            }}
          >
            <Box sx={{ height: '100%' }}>
              <video
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                disablePictureInPicture
                disableRemotePlayback
                draggable={false}
                preload="metadata"
                onContextMenu={(e) => e.preventDefault()}
                style={{
                  // width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                }}
                src={BACKGROUND_VIDEO_SRC}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Sign Options Form Container - On top of video */}
        <Box
          sx={{
            position: 'absolute',
            top: '0%',
            left: { sm: '0%', md: '5%' },
            ...(isMediumScreen && {
              left: '50%',
              transform: 'translateX(-50%)',
            }),
            minHeight: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            px: { xs: 3, sm: 3, md: 0 },
          }}
        >
          <CornerContainer
            height="auto"
            sx={{
              bgcolor: 'var(--mui-palette-background-level1)',
              flexDirection: 'column',
              backgroundImage: 'url(/assets/backgrounds/auth.svg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',

                width: { sm: '100%', lg: '85%' },
                height: { sm: '100%', lg: '692px' },
                minHeight: '692px',
                mx: 'auto',
                py: 8,
                px: { xs: 5, sm: 5, md: 3, lg: 0 },
              }}
            >
              <SignOptionsForm />
            </Box>
          </CornerContainer>
        </Box>
        {/* Centered icon */}
        {isLargeScreen && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: { md: '80%', lg: '70%' },
              transform: 'translate(-50%, -50%)',
              display: { xs: 'none', sm: 'none', md: 'flex', lg: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
          <CustomIconWrapper>
            <Box
              component="img"
              src="/assets/logo-dark.svg"
              alt="Nested Icon"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: {
                  md: 75,
                  lg: 97.4,
                },
                height: {
                  md: 75,
                  lg: 97.4,
                },
                objectFit: 'contain',
                zIndex: 3,
              }}
            />
          </CustomIconWrapper>
        </Box>
        )}
      </Box>
    </GuestGuard>
  );
}
