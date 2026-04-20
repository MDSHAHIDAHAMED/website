import type { Components } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';

import { fontFamily } from '../fonts';
import type { Theme } from '../types';

export const MuiTableHead = {
  styleOverrides: {
    root: {
      [`& .${tableCellClasses.root}`]: {
        backgroundColor: 'var(--mui-palette-background-level1)',
        color: 'var(--mui-palette-text-secondary)',
        fontSize: '10px',
        fontWeight: 615,
        lineHeight: '10px',
        letterSpacing: '6%',
        fontFamily: fontFamily.ppMori,
        textTransform: 'uppercase',
      },
    },
  },
} satisfies Components<Theme>['MuiTableHead'];
