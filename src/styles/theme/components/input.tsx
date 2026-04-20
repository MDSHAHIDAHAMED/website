import { inputBaseClasses } from '@mui/material/InputBase';
import type { Components } from '@mui/material/styles';
 
import { yieldzNeutral } from '../colors';
import type { Theme } from '../types';
 
export const MuiInput = {
  styleOverrides: {
    root: {
      marginTop: '20px',
      paddingBottom: '10px',
      '&:before': {
        borderBottom: `1px solid ${yieldzNeutral[700]}`,
        transition: 'border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      },
      '&:hover:not(.Mui-disabled):not(.Mui-error):before': {
        borderBottom: `1px solid ${yieldzNeutral[700]}`,
      },
      '&:after': {
        borderBottom: `2px solid ${yieldzNeutral[700]}`,
        transition: 'transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
      },
      '&.Mui-error:before': {
        borderBottom: '1px solid var(--mui-palette-error-main)',
      },
      '&.Mui-error:after': {
        borderBottom: '2px solid var(--mui-palette-error-main)',
      },
    },
    input: {
      height: 'auto',
      padding: '4px 0 4px 8px',
      fontSize: '14px',
      lineHeight: '1.5',
      [`label[data-shrink=false]+.${inputBaseClasses.formControl} &`]: {
        '&::placeholder': { opacity: '0 !important' },
      },
      [`label[data-shrink=true]+.${inputBaseClasses.formControl} &`]: {
        '&::placeholder': { opacity: '1 !important' },
      },
      '&:-webkit-autofill': {
        marginInline: 0,
        paddingInline: 0,
      },
    },
  },
} satisfies Components<Theme>['MuiInput'];
 
export const MuiTextField = {
  defaultProps: { variant: 'filled' as const },
} satisfies Components<Theme>['MuiTextField'];