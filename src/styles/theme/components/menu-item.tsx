import { listItemIconClasses } from '@mui/material/ListItemIcon';
import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiMenuItem = {
  defaultProps: { disableRipple: true },
  styleOverrides: {
    root: {
      borderRadius: '4px',
      gap: 'var(--ListItem-gap)',
      paddingBlock: 'var(--MenuItem-paddingBlock, 12px)',
      paddingInline: 'var(--MenuItem-paddingInline, 16px)',
      fontSize: '14px',
      lineHeight: '1.5',
      minHeight: '44px',
      color: 'var(--mui-palette-neutral-100)', // #D9D9D9 - light text for visibility
      transition: 'background-color 0.2s ease, color 0.2s ease',
      [`& .${listItemIconClasses.root}`]: { minWidth: 'auto' },
      '&:hover': {
        backgroundColor: 'var(--mui-palette-neutral-800)', // #222222 - visible hover
        color: 'var(--mui-palette-neutral-50)', // #E9E9E9 - brighter on hover
      },
      '&.Mui-selected': {
        backgroundColor: 'var(--mui-palette-neutral-800)', // #222222
        color: 'var(--mui-palette-primary-500)', // #6DF2FE - cyan for selected
        '&:hover': {
          backgroundColor: 'var(--mui-palette-neutral-700)', // #343434 - lighter on hover
          color: 'var(--mui-palette-primary-500)',
        },
      },
      '&.Mui-focusVisible': {
        backgroundColor: 'var(--mui-palette-neutral-800)', // #222222
        color: 'var(--mui-palette-neutral-50)',
      },
    },
  },
} satisfies Components<Theme>['MuiMenuItem'];
