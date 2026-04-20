import { config } from '@/config';
import { Box } from '@mui/material';
import React, { memo } from 'react';

interface BlackBackgroundVideoProps {
  src?: string;
  children: React.ReactNode;
  width?: string;
  height?: string;
}

function BlackBackgroundVideo({ src = config.backgroundVids.boxexBg, children, width = '100%', height = '100svh'     }: Readonly<BlackBackgroundVideoProps>): React.JSX.Element {
  return (
    <Box sx={{ position: 'relative', width: width, minHeight: height, overflowY: 'auto', overflowX: 'hidden' }}>
      {/* Video layer - fixed position to stay in place during scroll */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none', // Allow scrolling through video layer
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src={src}
        />
      </Box>
      {/* Foreground content with relative positioning and proper padding */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: '100%',
          zIndex: 1,
          px: { xs: 2, sm: 3, md: 8 },
          // pb: { xs: 2, sm: 3, md: 6 },
          pt: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 3, sm: 4, md: 6 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default memo(BlackBackgroundVideo);
