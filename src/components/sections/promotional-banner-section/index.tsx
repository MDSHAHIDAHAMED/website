'use client';
 
/**
 * PromotionalBannerSection Component
 * ===================================
 * Three-panel promotional banner with background images and text overlays.
 *
 * Layout:
 * - Three vertical panels stacked
 * - Each panel has a background image
 * - Text positioned at bottom right of each panel
 * - Font size: 32px, weight: 600
 */
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import { memo } from 'react';
 
import AtomTypography from '@/components/atoms/typography';
import { yieldzBase } from '@/styles/theme/colors';
 
// =============================================================================
// Constants
// =============================================================================
 
/** Section container styles */
const SECTION_SX: SxProps<Theme> = {
  width: '100%',
  backgroundColor: 'background.default',
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
};
 
/** Individual panel container styles */
const PANEL_CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  position: 'relative',
  minHeight: { xs: '400px', md: '600px' },
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
};
 
/** Image container styles */
const IMAGE_CONTAINER_SX: SxProps<Theme> = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
};
 
/** Text container styles - positioned at bottom right */
const TEXT_CONTAINER_SX: SxProps<Theme> = {
  backdropFilter: 'blur(3px)',
  position: 'relative',
  zIndex: 1,
  maxWidth: { md: '83%', lg: '35%' },
  p: { xs: 3, md: 5 },
  textAlign: 'right',
};
 
/** Text styles - font size 32, weight 600 */
const TEXT_SX: SxProps<Theme> = {
  fontWeight: 600,
  color: yieldzBase.white,
  whiteSpace: 'pre-line',
  float: 'left',
};
 
// =============================================================================
// Data
// =============================================================================
 
interface PromotionalPanel {
  id: string;
  imageSrc: string;
  text: string;
}
 
const PROMOTIONAL_PANELS: PromotionalPanel[] = [
  {
    id: 'liquidity-problem',
    imageSrc: '/assets/backgrounds/promotional-banner-1.png',
    text: 'Were saying the quiet part out loud.  All tokenization platforms suffer from the exact same problem,  LIQUIDITY.',
  },
  {
    id: 'rwa-tokens',
    imageSrc: '/assets/backgrounds/promotional-banner-3.png',
    text: 'YIELDZ Is solving this liquidity problem by Building a Roadmap to Public Access to private investment through token evolution from Private Offerings to future Public Offerings on a legally compliant platform the way the SEC Intended for the public.',
  },
  {
    id: 'yieldz-solution',
    imageSrc: '/assets/backgrounds/promotional-banner-2.png',
    text: 'We are working on building Real world asset (RWA) Security Tokens on the YIELDZ Platform.  Were accredited &  unaccredited investors will both find: tax advantaged income growth liquidity all backed by real world assets (RWA).',
  },
];
 
// =============================================================================
// Sub-Components
// =============================================================================
 
/**
 * Promotional Panel Component
 * Displays a single panel with background image and text overlay
 */
interface PromotionalPanelProps {
  panel: PromotionalPanel;
}
 
const PromotionalPanel = memo(function PromotionalPanel({ panel }: Readonly<PromotionalPanelProps>) {
  const isLiquidityProblem = panel.id === 'liquidity-problem';
 
  return (
    <Box
      sx={{
        ...PANEL_CONTAINER_SX,
        ...(isLiquidityProblem && {
          minHeight: '100vh',
        }),
      }}
    >
      {/* Background Image */}
      <Box sx={IMAGE_CONTAINER_SX}>
        <Image src={panel.imageSrc} alt={panel.id} fill style={{ objectFit: 'cover' }} priority />
      </Box>
 
      {/* Text Overlay - Bottom Right */}
      <Box sx={TEXT_CONTAINER_SX}>
        <AtomTypography variant="h3" sx={TEXT_SX}>{panel.text}</AtomTypography>
      </Box>
    </Box>
  );
});
 
// =============================================================================
// Main Component
// =============================================================================
 
function PromotionalBannerSection(): React.JSX.Element {
  return (
    <Box sx={SECTION_SX}>
      {PROMOTIONAL_PANELS.map((panel) => (
        <PromotionalPanel key={panel.id} panel={panel} />
      ))}
    </Box>
  );
}
 
export default memo(PromotionalBannerSection);