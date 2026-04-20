'use client';
 
import { yieldzNeutral } from '@/styles/theme';
import { Box, type SxProps, type Theme } from '@mui/material';
import React from 'react';
 
interface CornerContainerProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  height?: string | number;
  width?: string | number;
  showBorder?: boolean;
  borderColor?: string;
  outerSx?: SxProps<Theme>;
  cornerRadius?: string | number;
  /** Enable gradient background (same as Token Categories cards) */
  showGradient?: boolean;
}
 
const CornerContainer: React.FC<CornerContainerProps> = ({
  children,
  sx,
  height = '100%',
  width = '100%',
  showBorder = true,
  borderColor = yieldzNeutral[800],
  outerSx,
  cornerRadius = '10px',
  showGradient = false,
}) => {
  // Gradient styles (same as Token Categories cards)
  const gradientStyles: SxProps<Theme> = showGradient
    ? {
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(to right, #171717 0%, #000000 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `conic-gradient(
            from 270deg at 0% 50%,
            rgba(23, 23, 23, 0.8) 0deg,
            rgba(23, 23, 23, 0.6) 90deg,
            rgba(0, 0, 0, 0.4) 180deg,
            rgba(0, 0, 0, 0.8) 270deg,
            rgba(23, 23, 23, 0.4) 360deg
          )`,
          filter: 'blur(119px)',
          mixBlendMode: 'plus-lighter',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }
    : {};

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: '0',
        p: 0,
        m: 0,
        height,
        width,
        ...(showBorder && { border: `1px solid ${borderColor}` }),
        ...outerSx,
      }}
    >
      <Box
        sx={{
          ...(!showGradient && { bgcolor: 'background.default' }),
          borderRadius: cornerRadius,
          height: '100%',
          border: `1px solid ${yieldzNeutral[800]}`,
          width: '100%',
          overflow: 'hidden',
          ...gradientStyles,
          ...sx,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
 
export default CornerContainer;
 