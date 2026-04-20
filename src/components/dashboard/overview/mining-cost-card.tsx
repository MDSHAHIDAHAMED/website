'use client';

/**
 * Mining Cost Card Component
 * ==========================
 * Displays mining cost or token performance with fleet efficiency metrics.
 *
 */

import CornerContainer from '@/components/atoms/corner-container';
import { MetricsMarquee } from '@/components/atoms/marquee-item';
import AtomTypography from '@/components/atoms/typography';
import Watermark from '@/components/atoms/watermark-logo';
import { Logo } from '@/components/core/logo';
import {
  CARD_CONTAINER_SX,
  CONTENT_WRAPPER_SX,
  GRADIENT_LAYER_SX,
  ICON_WRAPPER_SX,
  LABEL_SX,
  LOGO_DIMENSIONS,
  MAIN_CONTENT_SX,
  type MiningCostCardProps,
  RADIAL_LAYER_SX,
  TOP_SECTION_SX,
  VALUE_ICON_CONTAINER_SX,
  VALUE_SX,
  VariantDisplayConfig,
} from '@/constants/dashboard-card';
import { yieldzGradient } from '@/styles/theme';
import { Box } from '@mui/material';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

// =============================================================================
// Sub-Components (Single Responsibility Principle)
// =============================================================================

/**
 * Background Layers Component
 * Renders the gradient background layers for the card
 */
const BackgroundLayers = memo(function BackgroundLayers() {
  return (
    <>
      {/* Base gradient background */}
      <Box sx={{ ...GRADIENT_LAYER_SX, background: yieldzGradient.cardBackground }} />
      {/* Radial overlay */}
      <Box sx={{ ...RADIAL_LAYER_SX, background: yieldzGradient.cardRadial }} />
    </>
  );
});


/**
 * Logo Section Component
 * Renders the logo and optional subtitle
 */
interface LogoSectionProps {
  subtitle?: string;
}

const LogoSection = memo(function LogoSection({ subtitle }: Readonly<LogoSectionProps>) {
  return (
    <>
      <Logo width={LOGO_DIMENSIONS.width} height={LOGO_DIMENSIONS.height} emblem />
      {subtitle && (
        <AtomTypography variant="subtitle3" color="text.secondary">
          {subtitle}
        </AtomTypography>
      )}
    </>
  );
});

/**
 * Variant Content Component
 * Renders the main content based on card variant
 * Open/Closed: Uses config object for extensibility
 */
interface VariantContentProps {
  variant: 'mining' | 'token';
  variantConfig: VariantDisplayConfig;
}

const VariantContent = memo(function VariantContent({ variant, variantConfig }: Readonly<VariantContentProps>) {
  const { t } = useTranslation();

  // Determine if label should be translated or used directly
  const label = variantConfig.labelKey.includes(':') ? t(variantConfig.labelKey) : variantConfig.labelKey;

  return (
    <Box sx={MAIN_CONTENT_SX}>
      <AtomTypography variant="label3" color="text.secondary" sx={LABEL_SX}>
        {label}
      </AtomTypography>

      {variantConfig.showIcon ? (
        <Box sx={VALUE_ICON_CONTAINER_SX}>
          <AtomTypography variant="h2" sx={VALUE_SX}>
            {variantConfig.value}
          </AtomTypography>
          <Box component="span" sx={ICON_WRAPPER_SX}>
            {variantConfig.icon}
          </Box>
        </Box>
      ) : (
        <AtomTypography variant="h2">{variantConfig.value}</AtomTypography>
      )}
    </Box>
  );
});




// =============================================================================
// Main Component
// =============================================================================

/**
 * Mining Cost Card Component
 *
 * @example
 * ```tsx
 * <MiningCostCard
 *   variant="mining"
 *   showLogo
 *   logoSubtitle="Holdings Inc."
 *   showWatermark={false}
 *   fleetMetrics={metrics}
 * />
 * ```
 */
function MiningCostCard({
  variant = 'mining',
  showLogo = true,
  logoSubtitle,
  showWatermark = false,
  fleetMetrics,
  variantConfig,
}: Readonly<MiningCostCardProps>): React.JSX.Element {
  return (
    <Box sx={CARD_CONTAINER_SX}>
      {/* Top Section: Logo and Main Content */}
      <CornerContainer showBorder={false} sx={TOP_SECTION_SX}>
        {/* Background Layers */}
        <BackgroundLayers />

        {/* Optional Watermark */}
        {showWatermark && <Watermark />}

        {/* Content Wrapper */}
        <Box sx={CONTENT_WRAPPER_SX}>
          {/* Optional Logo Section */}
          {showLogo && <LogoSection subtitle={logoSubtitle} />}

          {/* Variant-specific Content */}
          <VariantContent variant={variant} variantConfig={variantConfig} />
        </Box>
      </CornerContainer>

      {/* Bottom Section: Metrics Marquee */}
      <MetricsMarquee metrics={fleetMetrics} />
    </Box>
  );
}

// Export memoized component for performance
export default memo(MiningCostCard);