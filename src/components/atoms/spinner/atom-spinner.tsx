import { Box } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { common } from '@mui/material/colors';
import React from 'react';

import { type TColor } from '@/types/common';

import Typography from '@mui/material/Typography';

type TVariants = 'determinate' | 'indeterminate';
type TSize = 'small' | 'medium' | 'large' | 'extra-large';

interface SpinnerProps {
  color?: TColor;
  size?: TSize;
  variant?: TVariants;
  isBackdrop?: boolean;
  label?: string;
}

type ReadonlySpinnerProps = Readonly<SpinnerProps>;

const sizeConvertor = (type: TSize = 'medium'): number => {
  let size: number;

  if (type === 'medium') {
    size = 24;
  } else if (type === 'small') {
    size = 20;
  } else if (type === 'large') {
    size = 32;
  } else {
    size = 40;
  }

  return size;
};

function AtomSpinner(props: ReadonlySpinnerProps): React.JSX.Element {
  const { color = 'secondary', isBackdrop = false, label, size = 'medium', variant = 'indeterminate' } = props;

  return (
    <React.Fragment>
      {isBackdrop ? (
        <Backdrop sx={{ color: common.white, zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
          <CircularProgress size={sizeConvertor(size)} variant={variant} disableShrink color={color} thickness={3.6} />
        </Backdrop>
      ) : (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress size={sizeConvertor(size)} color={color} {...props} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {label ? (
              <Typography variant="caption" component="div" id="spinner-text" color="inherit">
                {label}
              </Typography>
            ) : null}
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
}

export default AtomSpinner;
