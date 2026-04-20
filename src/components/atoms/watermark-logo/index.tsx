import { Box } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import Image from "next/image";
import { memo } from "react";


/** Watermark dimensions */
export const WATERMARK_DIMENSIONS = {
  width: 250,
  height: 200,
} as const;

/** Watermark container styles */
export const WATERMARK_SX: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  right: '5%',
  transform: 'translateY(-50%)',
  opacity: 0.08,
  pointerEvents: 'none',
  zIndex: 1,
};

/**
 * Watermark Component
 * Renders the optional large watermark logo
 */
export const Watermark = memo(function Watermark({ src = "/assets/logo-emblem--dark.png", sx }: Readonly<{ src?: string, sx?: SxProps<Theme> }>) {
  return (
    <Box sx={{ ...WATERMARK_SX, ...sx }}>
      <Image
        src={src}
        alt="Watermark"
        width={WATERMARK_DIMENSIONS.width}
        height={WATERMARK_DIMENSIONS.height}
        style={{ objectFit: 'contain' }}
      />
    </Box>
  );
});

export default Watermark;