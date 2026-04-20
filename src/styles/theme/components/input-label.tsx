import type { Components } from '@mui/material/styles';
 
import { yieldzNeutral } from '../colors';
import type { Theme } from '../types';
 
export const MuiInputLabel = {
  styleOverrides: {
    root: {
      maxWidth: '100%',
      color: yieldzNeutral[300],
      // Style the asterisk (*) for required fields
      '& .MuiFormLabel-asterisk': {
        color: 'red',
      },
      '&.MuiInputLabel-standard': {
        // Standard variant - floating label behavior
        fontSize: '10px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        transform: 'translate(8px, 15px) scale(1)',
        '&.MuiInputLabel-shrink': {
          transform: 'translate(8px, -16px) scale(1)',
          fontSize: '10px',
        },
      },
      '&:not(.MuiInputLabel-standard)': {
        // For filled and outlined variants with separate labels
        position: 'static',
        transform: 'none',
      },
      '&.Mui-focused': {
        color: yieldzNeutral[300],
      },
    }
  },
} satisfies Components<Theme>['MuiInputLabel'];