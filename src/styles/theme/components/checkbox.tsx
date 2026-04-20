import type { Components } from '@mui/material/styles';
import * as React from 'react';

import { yieldzNeutral, yieldzPrimary, yieldzSecondary } from '../colors';
import type { Theme } from '../types';

function Icon(): React.JSX.Element {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M8 2C4.68629 2 2 4.68629 2 8V16C2 19.3137 4.68629 22 8 22H16C19.3137 22 22 19.3137 22 16V8C22 4.68629 19.3137 2 16 2H8ZM8 4C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20H16C18.2091 20 20 18.2091 20 16V8C20 5.79086 18.2091 4 16 4H8Z"
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
        d="M8 2C4.68629 2 2 4.68629 2 8V16C2 19.3137 4.68629 22 8 22H16C19.3137 22 22 19.3137 22 16V8C22 4.68629 19.3137 2 16 2H8ZM8 4C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20H16C18.2091 20 20 18.2091 20 16V8C20 5.79086 18.2091 4 16 4H8Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        d="M7.55566 11.7222L10.5186 14.7778L16.4446 8.66669"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IndeterminateIcon(): React.JSX.Element {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M8 2C4.68629 2 2 4.68629 2 8V16C2 19.3137 4.68629 22 8 22H16C19.3137 22 22 19.3137 22 16V8C22 4.68629 19.3137 2 16 2H8ZM8 4C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20H16C18.2091 20 20 18.2091 20 16V8C20 5.79086 18.2091 4 16 4H8Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path d="M8 12H16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export const MuiCheckbox = {
  defaultProps: {
    checkedIcon: <CheckedIcon />,
    color: 'primary',
    disableRipple: true,
    icon: <Icon />,
    indeterminateIcon: <IndeterminateIcon />,
  },
  styleOverrides: {
    root: {
      borderRadius: '8px',
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
      '&.MuiCheckbox-indeterminate': {
        color: yieldzPrimary[500],
      },
    },
  },
} satisfies Components<Theme>['MuiCheckbox'];
