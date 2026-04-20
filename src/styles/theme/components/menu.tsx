import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiMenu = {
  defaultProps: { disableScrollLock: true },
  styleOverrides: { 
    paper: {
      backgroundColor: 'var(--mui-palette-neutral-900)', // #111111 - dark background for visibility
      border: '1px solid var(--mui-palette-neutral-700)', // #343434 - visible border
      boxShadow: 'var(--mui-shadows-16)',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    list: { 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '4px', 
      padding: '8px',
      maxHeight: '300px',
      backgroundColor: 'var(--mui-palette-neutral-900)', // #111111
    } 
  },
} satisfies Components<Theme>['MuiMenu'];
