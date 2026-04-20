/**
 * Detail Row Component
 * ====================
 * 
 * Reusable component for displaying label-value pairs in investment details
 */

'use client';

import AtomTypography from '@/components/atoms/typography';
import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import React, { memo } from 'react';

// =============================================================================
// Styles
// =============================================================================

/** Detail row container styles */
const DETAIL_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

// =============================================================================
// Types
// =============================================================================

export interface DetailRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  variant?: 'subtitle2' | 'body4';
}

// =============================================================================
// Component
// =============================================================================

/**
 * Detail Row Component
 * 
 * Displays a label-value pair with optional icon
 * 
 * @param props - Component props
 * @returns Detail row JSX element
 */
export const DetailRow = memo(function DetailRow({
  label,
  value,
  icon,
  variant = 'subtitle2',
}: Readonly<DetailRowProps>): React.JSX.Element {
  return (
    <Box sx={DETAIL_ROW_SX}>
      <AtomTypography variant={variant} color="text.secondary">
        {label}
      </AtomTypography>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {icon}
        <AtomTypography variant={variant} color="text.primary" fontWeight={500}>
          {value}
        </AtomTypography>
      </Stack>
    </Box>
  );
});

