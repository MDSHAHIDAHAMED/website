import type { Components } from '@mui/material/styles';

import { yieldzBase, yieldzNeutral, yieldzPrimary, yieldzSecondary } from '../colors';
import type { Theme } from '../types';

// Helper function to get color by severity
const getBorderColorBySeverity = (severity?: 'success' | 'info' | 'warning' | 'error'): string => {
  if (severity === 'success') return yieldzSecondary.green[500];
  if (severity === 'error') return yieldzSecondary.red[500];
  if (severity === 'warning') return yieldzSecondary.orange[500];
  if (severity === 'info') return yieldzPrimary[500]; // Blue/Cyan
  return yieldzNeutral[400];
};

export const MuiAlert = {
  styleOverrides: {
    root: ({ theme, ownerState }) => {
      const borderColor = getBorderColorBySeverity(ownerState.severity);

      return {
        position: 'relative',
        backgroundColor: `${borderColor}15`,
        borderRadius: '0px',
        padding: '14px 18px',
        color: yieldzBase.white,
        overflow: 'visible',

        // Top-left corner bracket
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          width: '16px',
          height: '16px',
          borderTop: `2px solid ${borderColor}`,
          borderLeft: `2px solid ${borderColor}`,
        },

        // Bottom-right corner bracket
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          width: '16px',
          height: '16px',
          borderBottom: `2px solid ${borderColor}`,
          borderRight: `2px solid ${borderColor}`,
        },
      };
    },
    icon: ({ ownerState }) => {
      const borderColor = getBorderColorBySeverity(ownerState.severity);

      return {
        color: borderColor,
        fontSize: '20px',
        marginRight: '12px',
        opacity: 1,
        position: 'relative',

        '& .MuiSvgIcon-root': {
          fontSize: '20px',
        },

        // Bottom-left corner bracket
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: '-16px',
          left: '-20px',
          width: '16px',
          height: '16px',
          borderBottom: `2px solid ${borderColor}`,
          borderLeft: `2px solid ${borderColor}`,
        },
      };
    },
    message: {
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '20px',
      color: yieldzBase.white,
      padding: 0,
      display: 'flex',
      alignItems: 'center',
    },
    action: ({ ownerState }) => {
      const borderColor = getBorderColorBySeverity(ownerState.severity);

      return {
        position: 'relative',
        paddingLeft: '16px',
        marginRight: '-4px',
        paddingTop: 0,
        alignItems: 'center',

        // Top-right corner bracket
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-16px',
          right: '-16px',
          width: '16px',
          height: '16px',
          borderTop: `2px solid ${borderColor}`,
          borderRight: `2px solid ${borderColor}`,
        },

        '& .MuiIconButton-root': {
          color: yieldzNeutral[300],
          padding: '4px',
          '&:hover': {
            backgroundColor: yieldzNeutral[800],
            color: yieldzBase.white,
          },
        },
      };
    },
  },
} satisfies Components<Theme>['MuiAlert'];
