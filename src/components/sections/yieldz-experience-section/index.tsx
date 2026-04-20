'use client';

/**
 * YieldzExperienceSection Component
 * ==================================
 * Two-panel experience section with title and action cards.
 *
 * Layout:
 * - Background image with dark grid pattern
 * - Title at top: "BEGIN YOUR YLDZ EXPERIENCE"
 * - Two horizontal cards below with icons and text
 * - Left card: Join the YLDZ Platform
 * - Right card: Private Access to Exclusive Investments
 */
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import { memo } from 'react';

import AtomTypography from '@/components/atoms/typography';
import { yieldzBase, yieldzPrimary } from '@/styles/theme/colors';

// =============================================================================
// Constants
// =============================================================================

/** Section container styles */
const SECTION_SX: SxProps<Theme> = {
  width: '100%',
  position: 'relative',
  minHeight: { xs: '500px', md: '700px' },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  py: { xs: 4, md: 8 },
};

/** Background image container */
const BACKGROUND_IMAGE_SX: SxProps<Theme> = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
};

/** Content wrapper - positioned above background */
const CONTENT_WRAPPER_SX: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
  width: '100%',
  maxWidth: { xs: '90%', md: '1200px' },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: { xs: 4, md: 6 },
};

/** Title container styles */
const TITLE_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: { xs: 1, md: 2 },
  textAlign: 'center',
};

/** Title text styles - white for "BEGIN YOUR" */
const TITLE_WHITE_SX: SxProps<Theme> = {
  fontSize: { xs: '24px', md: '48px' },
  fontWeight: 600,
  color: yieldzBase.white,
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
};

/** Title text styles - cyan for "YLDZ" and "EXPERIENCE" */
const TITLE_CYAN_SX: SxProps<Theme> = {
  fontSize: { xs: '24px', md: '48px' },
  fontWeight: 600,
  color: yieldzPrimary[500],
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
};

/** Cards container - horizontal layout */
const CARDS_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: { xs: 3, md: 4 },
  width: '100%',
  justifyContent: 'center',
  alignItems: 'stretch',
};

/** Individual card container - simple style */
const CARD_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  padding: { xs: 4, md: 5 },
  minWidth: { xs: '100%', md: '300px' },
  maxWidth: { xs: '100%', md: '400px' },
  width: '100%',
  position: 'relative',
  // Wavy/irregular border using irregular border-radius values
  borderRadius: '24px 18px 28px 20px / 20px 24px 18px 22px',
  backgroundColor: 'transparent',
};

/** Icon container - centered in card */
const ICON_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: { xs: '100px', md: '140px' },
  height: { xs: '100px', md: '140px' },
  position: 'relative',
};

/** Card text styles */
const CARD_TEXT_SX: SxProps<Theme> = {
  fontSize: { xs: '16px', md: '20px' },
  fontWeight: 500,
  color: yieldzBase.white,
  textAlign: 'center',
  lineHeight: 1.4,
};

// =============================================================================
// Data
// =============================================================================

interface ExperienceCard {
  id: string;
  iconSrc: string;
  text: string;
}

const EXPERIENCE_CARDS: ExperienceCard[] = [
  {
    id: 'join-platform',
    iconSrc: '/assets/images/darkarrow.png',
    text: 'Join the Yieldz Platform',
  },
  {
    id: 'private-access',
    iconSrc: '/assets/images/bluephone.png',
    text: 'Private Access to Exclusive Investments',
  },
];

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Experience Card Component
 * Displays icon with background and text
 */
interface ExperienceCardProps {
  card: ExperienceCard;
}

const ExperienceCardComponent = memo(function ExperienceCardComponent({
  card,
}: Readonly<ExperienceCardProps>) {
  return (
    <Box sx={CARD_CONTAINER_SX}>
      {/* Icon - simple display */}
      <Box sx={ICON_CONTAINER_SX}>
        <Image
          src={card.iconSrc}
          alt={card.id}
          fill
          style={{ objectFit: 'contain' }}
        />
      </Box>

      {/* Text */}
      <AtomTypography sx={CARD_TEXT_SX}>{card.text}</AtomTypography>
    </Box>
  );
});

// =============================================================================
// Main Component
// =============================================================================

function YieldzExperienceSection(): React.JSX.Element {
  return (
    <Box sx={SECTION_SX}>
      {/* Background Image */}
      <Box sx={BACKGROUND_IMAGE_SX}>
        <Image
          src="/assets/images/bg.png"
          alt="YLDZ Experience Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </Box>

      {/* Content */}
      <Box sx={CONTENT_WRAPPER_SX}>
        {/* Title */}
        <Box sx={TITLE_CONTAINER_SX}>
          <AtomTypography sx={TITLE_WHITE_SX}>BEGIN YOUR</AtomTypography>
          <AtomTypography sx={TITLE_CYAN_SX}>YIELDZ</AtomTypography>
          <AtomTypography sx={TITLE_CYAN_SX}>EXPERIENCE</AtomTypography>
        </Box>

        {/* Cards */}
        <Box sx={CARDS_CONTAINER_SX}>
          {EXPERIENCE_CARDS.map((card) => (
            <ExperienceCardComponent key={card.id} card={card} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default memo(YieldzExperienceSection);

