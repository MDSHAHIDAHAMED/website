'use client';

import {
  BackgroundVideoContainerProps,
  GLASS_OVERLAY_SX,
  VideoLayerProps
} from '@/constants/dashboard-card';
import React, { memo, useMemo } from 'react';
/**
 * BackgroundVideoContainer Component
 * ===================================
 * A reusable component that renders a background video with optional glass effect overlay.
 *
 * Features:
 * - Background video with configurable object-fit
 * - Optional glass effect overlay for content
 * - Mobile visibility toggle
 * - Foreground content layer
 */

import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

// =============================================================================
// Style Constants (Dependency Inversion - abstracted styles)
// =============================================================================

/** Video layer container styles */
const VIDEO_LAYER_BASE_SX: SxProps<Theme> = {
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
};

/** Foreground content container styles */
const FOREGROUND_SX: SxProps<Theme> = {
  position: 'relative',
  width: '100%',
  height: '100%',
  zIndex: 1,
};

/** Base video element styles */
const VIDEO_BASE_STYLES: React.CSSProperties = {
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  userSelect: 'none',
  WebkitUserSelect: 'none',
};

/**
 * Video Layer Component
 * Renders the background video element with the given props
 */
const VideoLayer = memo(function VideoLayer({ src, objectFit, objectPosition, showOnMobile }: Readonly<VideoLayerProps>) {
  const videoLayerSx = useMemo(
    (): SxProps<Theme> => ({
      ...VIDEO_LAYER_BASE_SX,
      display: showOnMobile ? 'block' : { xs: 'none', md: 'block' },
    }),
    [showOnMobile]
  );

  const videoStyles = useMemo(
    (): React.CSSProperties => {
      const styles: React.CSSProperties = {
      ...VIDEO_BASE_STYLES,
      objectFit,
      };
      // Only set objectPosition if explicitly provided
      // Otherwise, let CSS use its natural default (50% 50% = center)
      if (objectPosition) {
        styles.objectPosition = objectPosition;
      }
      return styles;
    },
    [objectFit, objectPosition]
  );

  return (
    <Box sx={videoLayerSx}>
      <video
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        draggable={false}
        preload="metadata"
        onContextMenu={(e) => e.preventDefault()}
        style={videoStyles}
        src={src}
      />
    </Box>
  );
});

/**
 * Glass Overlay Component
 * Renders the glass effect overlay with content
 */
interface ReactNodeProps {
  children: React.ReactNode;
}

const GlassOverlay = memo(function GlassOverlay({ children }: Readonly<ReactNodeProps>) {
  return <Box sx={GLASS_OVERLAY_SX}>{children}</Box>;
});

const ForegroundContent = memo(function ForegroundContent({ children }: Readonly<ReactNodeProps>) {
  return <Box sx={FOREGROUND_SX}>{children}</Box>;
});


// =============================================================================
// Main Component
// =============================================================================
function BackgroundVideoContainer({
  src,
  children,
  sx,
  objectFit = 'cover',
  objectPosition,
  showOnMobile = true,
  glassEffectChildren,
}: Readonly<BackgroundVideoContainerProps>): React.JSX.Element {
  /** Memoized container styles */
  const containerSx = useMemo(
    (): SxProps<Theme> => ({
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      ...(sx as Record<string, unknown>),
    }),
    [sx]
  );

  return (
    <Box sx={containerSx}>
      {/* Video Layer */}
      {/* objectPosition is optional - if not provided, CSS will use its default (center) */}
      <VideoLayer src={src} objectFit={objectFit} objectPosition={objectPosition} showOnMobile={showOnMobile} />

      {/* Glass Effect Overlay (conditional) */}
      {glassEffectChildren && <GlassOverlay>{glassEffectChildren}</GlassOverlay>}

      {/* Foreground Content */}
      <ForegroundContent>{children}</ForegroundContent>
    </Box>
  );
}

// Export memoized component for performance
export default memo(BackgroundVideoContainer);

// Named export for flexibility
export { BackgroundVideoContainer };