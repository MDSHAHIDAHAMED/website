'use client';

import { Box } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * AtomRadialGlow
 * A glowing elliptical conic gradient effect
 */
interface AtomRadialGlowProps {
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
}

const AtomRadialGlow = ({
  width = 2262,
  height = 2194,
  rotation = 50.66,
  opacity = 0.46,
}: AtomRadialGlowProps) => {
  return (
    <Box
      component={motion.div}
      animate={{
        rotate: [rotation, rotation + 360],
      }}
      transition={{
        duration: 40,
        repeat: Infinity,
        ease: 'linear',
      }}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width,
        height,
        opacity,
        borderRadius: '50% / 48%',
        background: `conic-gradient(
          from 180.47deg at 44.21% 0.63%,
          #FFFFFF 0deg,
          rgba(255, 255, 255, 0.25) 16.93deg,
          rgba(255, 255, 255, 0.2) 30.46deg,
          rgba(255, 255, 255, 0) 41.38deg,
          rgba(255, 255, 255, 0.2) 348.77deg,
          rgba(255, 255, 255, 0.8) 353.26deg,
          rgba(255, 255, 255, 0.5) 360deg
        )`,
        filter: 'blur(119px)',
        mixBlendMode: 'plus-lighter',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default AtomRadialGlow;
