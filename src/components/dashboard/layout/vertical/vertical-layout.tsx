'use client';

import Box from '@mui/material/Box';
import GlobalStyles from '@mui/material/GlobalStyles';
import * as React from 'react';

import AtomRadialGlow from '@/components/atoms/bg-effect';

import { layoutConfig } from '../config';
import { MainNav } from './main-nav';

export interface VerticalLayoutProps {
  children?: React.ReactNode;
}

export function VerticalLayout({ children }: Readonly<VerticalLayoutProps>): React.JSX.Element {
  return (
    <>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-default)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          position: 'relative',
          overflowX: 'hidden',
        }}
      >
        {/* Fixed background glow */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 0,
            pointerEvents: 'none',
            '& > *': {
              position: 'absolute !important',
              top: '-1750px !important',
              left: '-1200px !important',
              transform: 'none !important',
            },
          }}
        >
          <AtomRadialGlow />
        </Box>

        {/* Page layout */}
        <Box
          component="main"
          sx={{
            flex: '1 1 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            px: { xs: 3, md: 8 },
            py: { xs: 3, lg: 2 },
            position: 'relative',
            zIndex: 1, // Keeps it above the glow
          }}
        >
          {/* Wrap both MainNav and children in the same width container */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              flex: '1 1 auto',
            }}
          >
            <MainNav items={layoutConfig.navItems} />
            {children}
          </Box>

          {/* Footer - pushed to bottom */}
         
        </Box>
      </Box>
    </>
  );
}
