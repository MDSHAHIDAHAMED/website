import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiLink = { 
  defaultProps: { underline: 'hover' },
  styleOverrides: {
    root: {
      textDecoration: 'none',
      cursor: 'pointer',
    },
  },
} satisfies Components<Theme>['MuiLink'];
