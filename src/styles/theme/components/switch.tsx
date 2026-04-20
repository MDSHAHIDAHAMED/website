import type { Components } from '@mui/material/styles';
import { yieldzBase, yieldzNeutral, yieldzPrimary, yieldzSecondary } from '../colors';
import type { Theme } from '../types';

export const MuiSwitch = {
  defaultProps: { color: 'primary', disableRipple: true },
  styleOverrides: {
    root: {
      width: 52,
      height: 28,
      padding: 0,
      marginLeft: '-12px',
      marginRight: '-12px',
      position: 'relative',

      /**
       * Hover state - only when switch is OFF (unchecked)
       * Border and thumb turn white
       * No hover effect when switch is ON
       */
      '&:hover:not(:has(.Mui-checked)):not(:has(.Mui-disabled))': {
        '& .MuiSwitch-track': {
          borderColor: yieldzBase.white,
        },
        '& .MuiSwitch-thumb': {
          color: yieldzBase.white,
        },
      },

      /**
       * Focus state - outer border only on keyboard navigation (Tab)
       * Not on mouse click
       */
      '&:has(.Mui-focusVisible)': {
        outline: `2px solid ${yieldzSecondary.blue.focus}`,
        outlineOffset: '6px',
        borderRadius: '6px',
      },

      '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 4,
        transitionDuration: '300ms',

        // Default unchecked thumb
        color: yieldzNeutral[400],

        '&.Mui-checked': {
          transform: 'translateX(24px)',
          color: yieldzPrimary[500],
          '& + .MuiSwitch-track': {
            backgroundColor: 'transparent',
            borderColor: yieldzPrimary[500],
            opacity: 1,
          },
          '&:active .MuiSwitch-thumb': {
            color: yieldzPrimary[600],
          },
          '&.Mui-disabled': {
            color: yieldzNeutral[600],
            '& + .MuiSwitch-track': {
              backgroundColor: 'transparent',
              borderColor: yieldzNeutral[600],
              opacity: 0.5,
            },
          },
        },

        // Pressed state - unchecked
        '&:active:not(.Mui-checked) .MuiSwitch-thumb': {
          color: yieldzNeutral[500],
        },

        '&.Mui-disabled .MuiSwitch-thumb': {
          color: yieldzNeutral[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
          backgroundColor: 'transparent',
          borderColor: yieldzNeutral[600],
        },

        // Remove default hover background
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },

      '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 20,
        height: 20,
        borderRadius: '30%',
        boxShadow: 'none',
        transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      },

      '& .MuiSwitch-track': {
        borderRadius: '8px',
        backgroundColor: 'transparent',
        border: `2px solid ${yieldzNeutral[700]}`,
        opacity: 1,
        transition:
          'border-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms ease-in-out',
        pointerEvents: 'none',
      },

      '& .MuiSwitch-input': {
        left: 0,
        width: '100%',
        height: '100%',
      },
    },
  },
} satisfies Components<Theme>['MuiSwitch'];

