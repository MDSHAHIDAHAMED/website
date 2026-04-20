import type { Components } from '@mui/material/styles';

import type { Theme } from '@/styles/theme/types';

export const MuiTab = {
  defaultProps: { disableRipple: true },
  styleOverrides: {
    root: {
      minWidth: 'auto',
      paddingInline: 0,
      textTransform: 'uppercase',
      fontSize: '0.875rem',
      fontWeight: 615,
      lineHeight: '1.5',
      textDecoration: 'none',
      cursor: 'pointer',
      padding: '15px 12px',
      borderTop: '1px solid transparent',
      borderBottom: '1px solid transparent',
      color: 'var(--mui-palette-neutral-300)',
      '&:hover': {
        color: 'var(--mui-palette-neutral-25)',
        borderTop: '1px solid transparent',
        borderBottom: '1px solid transparent',
      },
      '&:focus-visible': { outline: '2px solid var(--mui-palette-primary-500)',
        color: 'var(--mui-palette-neutral-25)',
       },
      '&.Mui-selected': {
        border: '0px',
        borderTop: '1px solid var(--mui-palette-primary-500)',
        borderBottom: '1px solid var(--mui-palette-primary-500)',
        backgroundColor: 'rgb(253 253 253 / 5%)',        
        color: 'var(--mui-palette-neutral-25)',
      },
      '&:not(.Mui-selected)': {
        color: 'var(--mui-palette-neutral-300)',
        borderTop: '1px solid var(--mui-palette-neutral-800)',
        borderBottom: '1px solid var(--mui-palette-neutral-800)',
      },
      '&:first-of-type': {
        borderLeft: '1px solid var(--mui-palette-neutral-800)',
      },
      '&:last-of-type': {
        borderRight: '1px solid var(--mui-palette-neutral-800)',
      },
    },
  },
} satisfies Components<Theme>['MuiTab'];