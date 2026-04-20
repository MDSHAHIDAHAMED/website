import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiPopover = {
  // Popovers are used for notifications, filters, profile menus, etc.
  // We give them a dark surface to match the overall dashboard theme
  // and keep them visually consistent with `MuiMenu`.
  defaultProps: { disableScrollLock: true, elevation: 16 },
  styleOverrides: {
    paper: {
      backgroundColor: 'var(--mui-palette-neutral-900)', // #111111 - dark background for better contrast on dark UI
      border: '1px solid var(--mui-palette-neutral-700)', // #343434 - subtle but visible border
      boxShadow: 'var(--mui-shadows-16)',
      borderRadius: '8px',
      overflow: 'hidden',
    },
  },
} satisfies Components<Theme>['MuiPopover'];
