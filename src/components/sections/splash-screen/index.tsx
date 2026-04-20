'use client';

import LottieAnimation from '@/components/atoms/lottie-animation';
import { Box } from '@mui/material';

export default function SplashScreen() {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        minHeight: '60vh',
        overflow: 'hidden'
      }}
    >
      <LottieAnimation width={150} height={150} />
    </Box>
  );
}
