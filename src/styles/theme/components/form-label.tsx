import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';
import { yieldzNeutral } from 'yldzs-components';

export const MuiFormLabel = {
  styleOverrides: {
    root: {
      color: 'var(--mui-palette-text-primary)',
      fontSize: '10px', // 10px - matches select box and input label requirements
      fontWeight: 500,
    },
    // Style the asterisk (*) for required fields - using error color from theme
    asterisk: {
      color: `${yieldzNeutral[300]} !important`,
    },
  },
} satisfies Components<Theme>['MuiFormLabel'];
