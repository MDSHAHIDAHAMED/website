'use client';

import { Box, CircularProgress, styled, Typography, useTheme } from '@mui/material';
import React, { memo } from 'react';

interface GradientCircularSpinnerProps {
  text?: string;
  thickness?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const defaultProps = {
  thickness: 8,
  size: 'md' as const,
};

const sizeMap = {
  sm: 20,
  md: 24,
  lg: 32,
  xl: 46,
};

const SpinnerWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledCircularProgress = styled(CircularProgress)(() => ({
  '& svg circle': {
    stroke: 'url(#my_gradient)',
    strokeLinecap: 'round',
  },
}));

const GradientCircularSpinner: React.FC<GradientCircularSpinnerProps> = memo(
  ({ text, thickness = defaultProps.thickness, size = defaultProps.size }) => {
    const spinnerSize = sizeMap[size];
    const theme = useTheme();
    return (
      <SpinnerWrapper>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="60%" stopColor={theme.palette.primary.dark} />
              <stop offset="100%" stopColor={theme.palette.common.white} />
            </linearGradient>
          </defs>
        </svg>
        <StyledCircularProgress size={spinnerSize} thickness={thickness} />
        {text ? (
          <Typography variant="body2" color="text.secondary">
            {text}
          </Typography>
        ) : null}
      </SpinnerWrapper>
    );
  }
);

GradientCircularSpinner.displayName = 'GradientCircularSpinner';

export default GradientCircularSpinner;
