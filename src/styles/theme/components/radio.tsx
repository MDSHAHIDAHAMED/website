import type { Components } from '@mui/material/styles';
import * as React from 'react';

import { yieldzNeutral, yieldzPrimary, yieldzSecondary } from '../colors';
import type { Theme } from '../types';

function Icon(): React.JSX.Element {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function CheckedIcon(): React.JSX.Element {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  );
}

export const MuiRadio = {
  defaultProps: { checkedIcon: <CheckedIcon />, color: 'primary', disableRipple: true, icon: <Icon /> },
  styleOverrides: {
    root: {
      padding: 0,
      color: yieldzNeutral[400],
      transition: 'color 0.2s ease-in-out',
      '&:hover': {
        color: yieldzPrimary[500],
        backgroundColor: 'transparent',
      },
      '&.Mui-focusVisible': {
        color: yieldzPrimary[500],
        outline: `2px solid ${yieldzSecondary.blue.focus}`, // #6388F7
        outlineOffset: '2px',
      },
      '&.Mui-checked': {
        color: yieldzPrimary[500],
        '&:hover': {
          color: yieldzPrimary[500],
          backgroundColor: 'transparent',
        },
      },
      '&.Mui-disabled': {
        color: yieldzNeutral[700],
        opacity: 0.5,
      },
    },
  },
} satisfies Components<Theme>['MuiRadio'];
