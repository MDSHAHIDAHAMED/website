'use client';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import type { SxProps, Theme } from '@mui/material/styles';
import * as React from 'react';

import AtomTypography from '@/components/atoms/typography';
import { yieldzNeutral } from '@/styles/theme/colors';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
interface OrSeparatorProps {
  /**
   * Text to display in the center of the divider
   * @default "OR"
   */
  label?: string;
  /**
   * Additional styles to apply to the container
   */
  sx?: SxProps<Theme>;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
/**
 * A reusable OR separator component with dividers on both sides.
 * Commonly used to separate alternative options in forms.
 *
 * @param label - The text to display in the center (default: "OR")
 * @param sx - Additional styles to apply to the container
 */
export const OrSeparator: React.FC<OrSeparatorProps> = ({ label = 'OR', sx }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      py: 1,
      ...sx,
    }}
  >
    <Divider sx={{ flex: 1 }} />
    <AtomTypography variant="body2" sx={{ px: 2, color: yieldzNeutral[400] }}>
      {label}
    </AtomTypography>
    <Divider sx={{ flex: 1 }} />
  </Box>
);

export default OrSeparator;
