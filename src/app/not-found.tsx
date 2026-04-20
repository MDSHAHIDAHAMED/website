import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import type { Metadata } from 'next';
import RouterLink from 'next/link';
import * as React from 'react';

import AtomTypography from '@/components/atoms/typography';
import { TemporaryHeader } from '@/components/auth/custom/verify-code';
import { DynamicLogo } from '@/components/core/logo';
import { config } from '@/config';
import { paths } from '@/paths';

export const metadata = { title: `Not found | ${config.site.name}` } satisfies Metadata;

export default function NotFound(): React.JSX.Element {
  return (
    <TemporaryHeader>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '100%',
          py: '64px',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <DynamicLogo width={220} height={80} emblem/>
            </Box>
            <Stack spacing={1} sx={{ textAlign: 'center' }}>
              <AtomTypography variant="h1" sx={{ textAlign: 'center' }} fontType='tickerbit' color="text.primary">404: The page you are looking for isn&apos;t here</AtomTypography>
              <AtomTypography variant="h5" sx={{ textAlign: 'center' }} fontType='tickerbit' color="text.secondary">
              Either way, noble traveler, return whence you came — the navigation shall guide you home.
              </AtomTypography>
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button component={RouterLink} href={paths.home} variant="contained">
                Back to home.
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>
    </TemporaryHeader>
  );
}
