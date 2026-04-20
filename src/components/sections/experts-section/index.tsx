'use client';

/**
 * ExpertsSection Component
 * ========================
 * Displays team/experts in a grid layout (2 rows x 4 columns).
 *
 * Layout:
 * - Grid of expert cards showing only name and position
 * - No carousel, no extra text
 */
import { Box, Grid } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import { memo } from 'react';

import AtomTypography from '@/components/atoms/typography';
import { yieldzBase, yieldzNeutral, yieldzPrimary } from '@/styles/theme/colors';

// =============================================================================
// Types
// =============================================================================

export interface Expert {
  id: string;
  name: string;
  title: string;
  imageSrc?: string;
  isTextCard?: boolean;
  subtitle?: string;
}

interface ExpertsSectionProps {
  experts: Expert[];
}

// =============================================================================
// Constants
// =============================================================================

const HEADING_WORDS_WHITE = ['LEARN', 'EARN', 'GROW'];
const HEADING_WORDS_CYAN = ['WITH', 'YLDZ'];

/** Section container styles */
const SECTION_SX: SxProps<Theme> = {
  width: '100%',
  backgroundColor: 'background.default',
  p: { xs: 3, md: 5 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

/** Content wrapper with max width */
const CONTENT_WRAPPER_SX: SxProps<Theme> = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: { xs: 3, md: 4 },
  alignItems: 'center',
};

/** Heading container styles */
const HEADING_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  width: { xs: '100%' },
  textAlign: 'center',
  flexWrap: { xs: 'wrap' },
  gap: { xs: 2, md: 2 },
};

/** Main heading styles - "LEARN EARN GROW" */
const HEADING_WHITE_SX: SxProps<Theme> = {
  fontWeight: 600,
  color: yieldzBase.white,
  textTransform: 'uppercase',
};

/** Main heading styles - "WITH YLDZ" (pixelated/digital style) */
const HEADING_CYAN_SX: SxProps<Theme> = {
  fontWeight: 600,
  color: yieldzPrimary[500],
  textTransform: 'uppercase',
};

/** Subheading styles */
const SUBHEADING_SX: SxProps<Theme> = {
  fontWeight: 600,
  color: yieldzBase.white,
  textAlign: 'center',
};

/** Description styles */
const DESCRIPTION_SX: SxProps<Theme> = {
  fontWeight: 400,
  color: yieldzNeutral[400],
  textAlign: 'center',
  lineHeight: 1.6,
};

/** Grid container styles */
const GRID_CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  mt: { xs: 2, md: 3 },
};

/** Expert card container */
const EXPERT_CARD_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  height: '100%',
};

/** Expert image container with rounded corners - no background */
const EXPERT_IMAGE_CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  aspectRatio: '1',
  borderRadius: '12px',
  overflow: 'hidden',
  position: 'relative',
  // No background color - images should be transparent
};

/** Expert info container */
const EXPERT_INFO_LABEL_SX: SxProps<Theme> = {
  letterSpacing: "2px",
  fontWeight: 600,
  color: yieldzNeutral[400],
};
const EXPERT_INFO_TITLE_SX: SxProps<Theme> = {
  fontWeight: 600,
  color: yieldzBase.white,
  display: 'flex',
  flexDirection: 'column',
};
// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Expert Card Component
 * Displays individual expert information
 */
interface ExpertCardProps {
  expert: Expert;
}

const ExpertCard = memo(function ExpertCard({ expert }: Readonly<ExpertCardProps>) {
  // Render text-only card (e.g., "Strategic Advisors")
  if (expert.isTextCard) {
    return (
      <Box sx={EXPERT_CARD_SX}>
        {/* Text Card Container - same style as image container, no background */}
        <Box
          sx={{
            ...EXPERT_IMAGE_CONTAINER_SX,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
          }}
        >
          <AtomTypography variant="body6" sx={EXPERT_INFO_TITLE_SX}>{expert.name}</AtomTypography>
          {expert.subtitle && (
            <AtomTypography variant="label2" sx={EXPERT_INFO_LABEL_SX}>
              {expert.subtitle}
            </AtomTypography>
          )}
        </Box>
      </Box>
    );
  }

  // Render regular expert card with image
  return (
    <Box sx={EXPERT_CARD_SX}>
      {/* Expert Image - from persons folder, no background */}
      <Box sx={EXPERT_IMAGE_CONTAINER_SX}>
        <Image
          src={expert.imageSrc ?? '/assets/persons/yldz-person.png'}
          alt={expert.name}
          fill
          style={{ objectFit: 'contain' }}
          sizes="(max-width: 768px) 280px, 300px"
        />
      </Box>

      {/* Expert Info - Only Name and Position */}
      <Box sx={EXPERT_INFO_TITLE_SX}>
        <AtomTypography variant="body6" sx={EXPERT_INFO_TITLE_SX}>{expert.name}</AtomTypography>
        <AtomTypography variant="label3" mt={2} sx={EXPERT_INFO_LABEL_SX}>
          {expert.title}
        </AtomTypography>
      </Box>
    </Box>
  );
});

// =============================================================================
// Main Component
// =============================================================================

function ExpertsSection({ experts }: Readonly<ExpertsSectionProps>): React.JSX.Element {
  return (
    <Box sx={SECTION_SX}>
      <Box sx={CONTENT_WRAPPER_SX}>
        {/* Main Heading - "LEARN EARN GROW WITH YLDZ" */}
        <Box sx={HEADING_CONTAINER_SX}>
          {HEADING_WORDS_WHITE.map((word) => (
            <AtomTypography key={word} variant="display4" sx={HEADING_WHITE_SX}>
              {word}
            </AtomTypography>
          ))}
          {HEADING_WORDS_CYAN.map((word) => (
            <AtomTypography key={word} variant="display4" sx={HEADING_CYAN_SX} fontType="tickerbit">
              {word}
            </AtomTypography>
          ))}
        </Box>

        {/* Subheading - "Experts Driving Bitcoin Innovation" */}
        <AtomTypography variant="h2" sx={SUBHEADING_SX}>Experts Driving Bitcoin Innovation</AtomTypography>

        {/* Description */}
        <AtomTypography variant="body4" sx={DESCRIPTION_SX}>
          From digital assets to self-custody yield, our team designs the Yieldz ecosystem with <br /> expertise, and
          transparency at its core.
        </AtomTypography>

        {/* Grid Layout - 2 rows x 4 columns using MUI Grid */}
        <Grid container spacing={3} sx={GRID_CONTAINER_SX}>
          {experts.map((expert) => (
            <Grid key={expert.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <ExpertCard expert={expert} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default memo(ExpertsSection);
