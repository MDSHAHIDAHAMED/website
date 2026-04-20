import { inputBaseClasses } from '@mui/material/InputBase';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import type { Components } from '@mui/material/styles';
 
import { yieldzNeutral } from '../colors';
import type { Theme } from '../types';
 
export const MuiOutlinedInput = {
  defaultProps: { notched: false },
  styleOverrides: {
    root: {
      backgroundColor: 'transparent',
      borderRadius: '0',
      padding: '16px 0',
      height: 'auto',
      minHeight: 'auto',
      border: '0', // Remove default border
      borderTop: '0',
      borderLeft: '0',
      borderRight: '0',
      borderBottom: `1px solid ${yieldzNeutral[700]}`, // #343434 - only bottom border
      boxShadow: 'none',
      transition: 'border-bottom-color 0.2s ease, padding-bottom 0.2s ease',
      '&:hover:not(.Mui-disabled)': {
        borderBottom: `1px solid ${yieldzNeutral[500]}`, // #595959 - lighter on hover
      },
      '&.Mui-focused': {
        borderBottom: `2px solid var(--mui-palette-primary-500)`, // #6DF2FE - cyan on focus, thicker
        paddingBottom: '15px', // Adjust padding to maintain height when border gets thicker
      },
      [`&.${outlinedInputClasses.error}`]: {
        borderBottom: '1px solid var(--mui-palette-error-main)',
      },
      [`&.${outlinedInputClasses.disabled}`]: { 
        opacity: 0.5,
        borderBottom: `1px solid ${yieldzNeutral[800]}`,
      },
    },
    input: {
      height: 'auto',
      padding: '0',
      fontSize: '24px', // Match select box font size
      fontWeight: 400,
      lineHeight: '1.2',
      color: yieldzNeutral[100], // #D9D9D9
      [`label[data-shrink=false]+.${inputBaseClasses.formControl} &`]: {
        '&::placeholder': { opacity: '1 !important' },
      },
    },
    notchedOutline: { display: 'none' },
  },
} satisfies Components<Theme>['MuiOutlinedInput'];