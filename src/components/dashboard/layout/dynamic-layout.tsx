'use client';

import * as React from 'react';

import { useSettings } from '@/hooks/use-settings';

import DashboardFooter from '@/components/sections/dashboard-footer';
import { Box } from '@mui/material';
import { HorizontalLayout } from './horizontal/horizontal-layout';
import { VerticalLayout } from './vertical/vertical-layout';

export interface DynamicLayoutProps {
  children: React.ReactNode;
}

export function DynamicLayout({ children }: DynamicLayoutProps): React.JSX.Element {
  const { settings } = useSettings();

  return settings.layout === 'horizontal' ? (
    <HorizontalLayout>{children}</HorizontalLayout>
  ) : (
    <>
      <VerticalLayout>{children}</VerticalLayout>
      <Box sx={{ width: '100%', mt: 'auto' }}>
        <DashboardFooter />
      </Box>
    </>
  );
}
