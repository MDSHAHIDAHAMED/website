/**
 * Dashboard Card Constants
 * ========================
 * Types, interfaces, and configuration for dashboard cards.
 * Follows SOLID principles - centralized configuration for extensibility.
 */

import type { SxProps, Theme } from '@mui/material';

// =============================================================================
// Types & Interfaces
// =============================================================================

/**
 * Card variant types
 * Open/Closed: Add new variants here without modifying component logic
 */
export type CardVariant = 'mining' | 'token';

/**
 * Metric Item Interface
 * Defines structure for fleet efficiency metrics in the marquee
 */
export interface MetricItem {
  /** Unique identifier for React keys */
  id: string;
  /** Display label for the metric */
  label: string;
  /** Display value for the metric */
  value: string;
}

/**
 * Variant Display Configuration
 * Defines how each card variant renders its content
 */
export interface VariantDisplayConfig {
  /** Translation key for the label text */
  labelKey: string;
  /** Static value to display (or translation key) */
  value: string;
  /** Whether to show lightning icon */
  showIcon: boolean;
  /** Icon to display (if showIcon is true) */
  icon?: string;
}

/**
 * Mining Cost Card Props Interface
 * Single Responsibility: Only defines what the component needs
 */
export interface MiningCostCardProps {
  /**
   * Variant type of the card
   * @default 'mining' - Shows mining cost
   * @param 'token' - Shows token performance with percentage
   */
  variant?: CardVariant;

  /**
   * Show logo at the top of the card
   * @default true
   */
  showLogo?: boolean;

  /**
   * Subtitle text below the logo
   * @default undefined - No subtitle
   */
  logoSubtitle?: string;

  /**
   * Show large watermark logo in background
   * @default false
   */
  showWatermark?: boolean;

  /**
   * Fleet efficiency metrics for the marquee
   */
  fleetMetrics?: MetricItem[];
  /**
   * Variant configuration for the card
   */
  variantConfig: VariantDisplayConfig;
}

// =============================================================================
// Variant Configurations (Open/Closed Principle)
// =============================================================================

// =============================================================================
// Style Constants (Dependency Inversion - abstracted styles)
// =============================================================================

/** Main card container styles */
export const CARD_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  height: '100%',
};

/** Top section container styles */
export const TOP_SECTION_SX: SxProps<Theme> = {
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
};

/** Base gradient background layer styles */
export const GRADIENT_LAYER_SX: SxProps<Theme> = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  zIndex: 0,
};

/** Radial overlay layer styles */
export const RADIAL_LAYER_SX: SxProps<Theme> = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0.3,
  pointerEvents: 'none',
  zIndex: 1,
};

/** Content wrapper styles */
export const CONTENT_WRAPPER_SX: SxProps<Theme> = {
  position: 'relative',
  zIndex: 2,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

/** Main content section styles */
export const MAIN_CONTENT_SX: SxProps<Theme> = {
  mb: 4,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  mt: 4,
};

/** Label typography styles */
export const LABEL_SX: SxProps<Theme> = {
  mb: 1,
};

/** Value with icon container styles */
export const VALUE_ICON_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

/** Value typography styles */
export const VALUE_SX: SxProps<Theme> = {
  letterSpacing: '-0.02em',
};

/** Icon wrapper styles */
export const ICON_WRAPPER_SX: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
};

/** Bottom section (marquee) container styles */
export const BOTTOM_SECTION_SX: SxProps<Theme> = {
  backgroundColor: 'common.black',
  py: 1.5,
  px: 2,
  overflow: 'hidden',
};

/** Marquee content container styles */
export const MARQUEE_CONTENT_SX: SxProps<Theme> = {
  display: 'flex',
  gap: 4,
  alignItems: 'center',
};

/** Metric set container styles */
export const METRIC_SET_SX: SxProps<Theme> = {
  display: 'inline-flex',
  gap: 4,
  pt: 2,
};

/** Individual metric item styles */
export const METRIC_ITEM_SX: SxProps<Theme> = {
  display: 'inline-flex',
  flexDirection: 'column',
  minWidth: 150,
};

/** Metric label styles */
export const METRIC_LABEL_SX: SxProps<Theme> = {
  mb: 0.25,
  lineHeight: 1.2,
};

/** Metric value styles */
export const METRIC_VALUE_SX: SxProps<Theme> = {
  lineHeight: 1.2,
};

// =============================================================================
// Configuration Constants
// =============================================================================

/** Logo dimensions */
export const LOGO_DIMENSIONS = {
  width: 120,
  height: 40,
} as const;



/** Marquee set IDs for duplicating content */
export const MARQUEE_SET_IDS = ['set1', 'set2', 'set3', 'set4'] as const;

/**
 * Object fit options for the video element
 */
export type ObjectFitType = 'cover' | 'fill' | 'contain' | 'none' | 'scale-down';

/**
 * BackgroundVideoContainer Props Interface
 */
export interface BackgroundVideoContainerProps {
  /** Public path to the video file under `public/` directory */
  src: string;
  /** Content to render over the video */
  children?: React.ReactNode;
  /** Additional styles for the container */
  sx?: SxProps<Theme> | Record<string, unknown>;
  /** Object fit style for the video (default: 'cover') */
  objectFit?: ObjectFitType;
  /** Object position for the video (default: 'center') */
  objectPosition?: string;
  /** Whether to show the video on mobile devices (default: true) */
  showOnMobile?: boolean;
  /** Content to render in the glass effect overlay */
  glassEffectChildren?: React.ReactNode;
}

/**
 * Video Layer Component
 * Renders the background video element
 */
export interface VideoLayerProps {
  src: string;
  objectFit: ObjectFitType;
  objectPosition?: string;
  showOnMobile: boolean;
}

/** Glass effect overlay styles */
export const GLASS_OVERLAY_SX: SxProps<Theme> = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  width: '100%',
  height: '40%',
  zIndex: 0.5,
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  p: { xs: 3, sm: 4, md: 5 },
  gap: 3,
};
