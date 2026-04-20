'use client';

/**
 * VideoContentCard Component
 * ==========================
 * A reusable card component with video background, play button overlay,
 * and content section with title and description.
 *
 * Features:
 * - Background video with optional overlay image
 * - Centered play button
 * - Title with optional icon
 * - Description text
 * - Click handler for video playback
 * - YouTube video dialog with HTML5 player (downloads disabled)
 *
 * @module components/molecules/video-content-card
 */
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import React, { memo, useCallback, useMemo, useState } from 'react';

import { AtomButton } from '@/components/atoms/button';
import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
import BackgroundVideoContainer from '@/components/atoms/video/background-container';
import { config } from '@/config';
import { yieldzNeutral } from '@/styles/theme/colors';
import ConfirmActionModal from '../confirmation-dialog';

// =============================================================================
// Types
// =============================================================================

/**
 * Props for VideoContentCard component
 */
export interface VideoContentCardProps {
  /** Background video source URL */
  videoSrc: string;
  /** Overlay image source URL (displayed on top of video) */
  overlayImageSrc?: string;
  /** Alt text for overlay image */
  overlayImageAlt?: string;
  /** Title text */
  title: string;
  /** Description text */
  description: string;
  /** Icon source URL (optional) */
  iconSrc?: string;
  /** Click URL - opens in new tab when play button is clicked */
  playUrl?: string;
  /** YouTube video URL (for video dialog) - can be full URL or video ID */
  youtubeUrl?: string;
  /** Custom click handler (overrides playUrl and youtubeUrl) */
  onPlayClick?: () => void;
  /** Custom container styles */
  sx?: SxProps<Theme>;
  /** Whether to show border on corner container */
  showBorder?: boolean;
  /** Whether to show video card */
  isVideoCard?: boolean;
}

// =============================================================================
// Styles
// =============================================================================

/** Card container styles */
const CARD_CONTAINER_SX: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  minWidth: 0,
  width: '100%',
};

/** Video container with play button overlay */
const VIDEO_OVERLAY_CONTAINER_SX: SxProps<Theme> = {
  position: 'relative',
  width: '100%',
  height: { xs: 200, sm: 250, md: 512 },
  borderRadius: 0,
  textAlign: 'center',
  overflow: 'hidden',
  cursor: 'pointer',
  '&:hover .play-button': {
    transform: 'scale(1.1)',
  },
};

/** Background video container styles */
const BG_VIDEO_CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  minHeight: '100%',
};

/** Overlay image styles */
const OVERLAY_IMAGE_SX: SxProps<Theme> = {
  width: { xs: '100%', lg: '262px' },
  height: { xs: '100%', lg: '464px' },
  objectFit: 'cover',
  filter: 'grayscale(100%)',
};

/** Play button overlay styles */
const PLAY_BUTTON_SX: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

/** Content section styles */
const CONTENT_SECTION_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  padding: '40px 24px',
};

/** Title row styles */
const TITLE_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

/** YouTube video iframe container styles */
const YOUTUBE_IFRAME_CONTAINER_SX: SxProps<Theme> = {
  position: 'relative',
  width: '100%',
  paddingBottom: '56.25%', // 16:9 aspect ratio
  height: 0,
  overflow: 'hidden',
  '& iframe': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
};

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Extracts YouTube video ID from various YouTube URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - Direct video ID
 *
 * @param url - YouTube URL or video ID
 * @returns Extracted video ID or null if invalid
 */
function extractYouTubeVideoId(url: string | undefined): string | null {
  if (!url) return null;

  // If it's already just a video ID (no special characters except alphanumeric, dash, underscore)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  // Match various YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(url);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Generates YouTube embed URL with HTML5 player and download disabled
 *
 * @param videoId - YouTube video ID
 * @returns YouTube embed URL with parameters
 */
function getYouTubeEmbedUrl(videoId: string): string {
  // Parameters:
  // - html5=1: Force HTML5 player
  // - controls=1: Show video controls
  // - modestbranding=1: Reduce YouTube branding
  // - rel=0: Don't show related videos from other channels
  // - disablekb=1: Disable keyboard controls (helps prevent downloads)
  // - fs=1: Allow fullscreen
  return `https://www.youtube.com/embed/${videoId}?html5=1&controls=1&modestbranding=1&rel=0&fs=1`;
}

// =============================================================================
// Component
// =============================================================================

/**
 * VideoContentCard Component
 *
 * A reusable card with video background, play button, and content section.
 * When isVideoCard is true and youtubeUrl is provided, clicking play opens
 * a confirmation dialog with YouTube video player.
 *
 * @param props - Component props
 * @returns VideoContentCard JSX element
 */
function VideoContentCard({
  videoSrc,
  overlayImageSrc,
  overlayImageAlt = 'Video thumbnail',
  title,
  description,
  iconSrc,
  playUrl,
  youtubeUrl,
  onPlayClick,
  sx,
  showBorder = true,
  isVideoCard = false,
}: Readonly<VideoContentCardProps>): React.JSX.Element {
  // Dialog state management
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  /**
   * Extract YouTube video ID from youtubeUrl prop, playUrl, or config
   * Priority: youtubeUrl > playUrl > config.social.youtubeVideo
   * When isVideoCard is true, defaults to config.social.youtubeVideo if no prop is provided
   */
  const youtubeVideoId = useMemo(() => {
    // Priority order: youtubeUrl prop > playUrl prop > config.social.youtubeVideo
    const url = youtubeUrl || playUrl || config.social.youtubeVideo;
    return extractYouTubeVideoId(url);
  }, [youtubeUrl, playUrl]);

  /**
   * Generate YouTube embed URL if video ID is available
   * Must use embed format (youtube.com/embed/VIDEO_ID) not watch format                          
   */
  const youtubeEmbedUrl = useMemo(() => {
    if (!youtubeVideoId) return null;
    return getYouTubeEmbedUrl(youtubeVideoId);
  }, [youtubeVideoId]);

  /**
   * Handle play button click
   * - If isVideoCard and youtubeUrl/playUrl is YouTube, open dialog
   * - Otherwise, call custom handler or open URL in new tab
   */
  const handlePlayClick = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();

      // Highest priority: custom handler
      if (onPlayClick) {
        onPlayClick();
        return;
      }

      // If it's a video card and YouTube video exists → open dialog
      if (isVideoCard && youtubeEmbedUrl) {
        setIsDialogOpen(true);
      }
    },
    [onPlayClick, isVideoCard, youtubeEmbedUrl]
  );

  /**
   * Handle dialog close
   */
  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  // Merge custom styles with default styles
  const containerSx: SxProps<Theme> = sx ? [CARD_CONTAINER_SX, sx].flat() : CARD_CONTAINER_SX;

  return (
    <CornerContainer sx={{ ...containerSx, border: 'none' }} showBorder={false} outerSx={{ border: 'none' }}>
      {/* Video Container with Play Button */}
      <BackgroundVideoContainer src={videoSrc} sx={BG_VIDEO_CONTAINER_SX}>
        <Box sx={VIDEO_OVERLAY_CONTAINER_SX}>
          {/* Overlay Image */}
          {overlayImageSrc && (
            <Box
              component="img"
              src={overlayImageSrc}
              alt={overlayImageAlt}
              sx={OVERLAY_IMAGE_SX}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}

          {/* Play Button Overlay */}
          {isVideoCard && (
            <AtomButton
              id="play-button"
              variant="contained"
              color="secondary"
              size="small"
              label="PLAY"
              sx={PLAY_BUTTON_SX}
              onClick={handlePlayClick}
              endIcon={<PlayArrowIcon sx={{ color: yieldzNeutral[50], fontSize: 20 }} />}
            />
          )}
        </Box>
      </BackgroundVideoContainer>

      {/* Content Section: Title + Description */}
      <CornerContainer sx={{ ...CONTENT_SECTION_SX, border: 'none' }} showBorder={false} showGradient={true} outerSx={{ border: 'none' }}>
        {/* Title with Icon */}
        <Box sx={TITLE_ROW_SX}>
          {iconSrc && <Image src={iconSrc} alt="Icon" width={32} height={32} />}
          <AtomTypography variant="h4" color="text.primary">
            {title}
          </AtomTypography>
        </Box>

        {/* Description */}
        <AtomTypography variant="body4" color="text.secondary">
          {description}
        </AtomTypography>
      </CornerContainer>

      {/* YouTube Video Dialog */}
      {isVideoCard && youtubeEmbedUrl ? (
        <ConfirmActionModal
          open={isDialogOpen}
          onClose={handleDialogClose}
          onConfirm={handleDialogClose}
          title={title}
          maxWidth="lg"
          description={
            <Box sx={YOUTUBE_IFRAME_CONTAINER_SX}>
              <iframe
                src={youtubeEmbedUrl}
                title={`${title} - YouTube Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  // Additional styles to prevent downloads
                  pointerEvents: 'auto',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}
              />
            </Box>
          }
        />
      ) : null}
    </CornerContainer>
  );
}

export default memo(VideoContentCard);
