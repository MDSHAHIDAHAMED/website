'use client';

/**
 * BenefitsSection Component
 * ==========================
 * Displays 4 benefit cards with a CTA button in a single container.
 *
 * Layout:
 * - One CornerContainer (no top padding)
 * - 4 cards horizontally (label + description)
 * - Centered button below cards
 */
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { memo } from 'react';

import AtomButton from '@/components/atoms/button';
import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';

// =============================================================================
// Constants
// =============================================================================

/** Section container styles */
const SECTION_SX: SxProps<Theme> = {
  width: '100%',
  backgroundColor: 'background.default',
  p: { xs: 2, md: 5 },
};

/** Main container - no top padding */
const CONTAINER_SX: SxProps<Theme> = {
  pt: 0,
  border: '0px',
  minHeight: '165px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/** Grid row for 4 equal columns */
const CARDS_ROW_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
};

/** Individual card styles */
const CARD_SX: SxProps<Theme> = {
  p: { xs: 2, md: 4 },
  backgroundImage: 'url(/assets/backgrounds/cardBg.svg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '270px',
  px: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};


/** Button container */
const BUTTON_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',

};

// =============================================================================
// Data
// =============================================================================

interface BenefitCard {
  id: string;
  label: string;
  description: string;
}

const BENEFIT_CARDS: BenefitCard[] = [
  {
    id: 'leverage',
    label: 'Leverage With \nLOW Personal Risk',
    description:
      'When you use our IUL digital asset onramp. Your funds sit inside an IUL – one of the safest, most stable financial instruments in the world.',
  },
  {
    id: 'protection',
    label: 'Base Investment \nProtection Plus BTC Yield',
    description: 'The LOW-risk way to earn BTC yield.',
  },
  {
    id: 'tax-free',
    label: 'Tax Free Distributions with a\n Financial Money Tool Without\n Selling The Bitcoin',
    description:
      'Building liquidity inside a policy to take tax free income in retirement without ever selling the Bitcoin so you can hand your family the Bitcoin and the base investment',
  },
  {
    id: 'death-benefit',
    label: 'Policy Death Benefit \nProtects Your Family',
    description: 'A legacy plan asset and hold your bitcoin in self custody.',
  },
];

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Benefit Card Component
 * Displays label and description
 */
interface BenefitCardProps {
  data: BenefitCard;
}

const BenefitCardComponent = memo(function BenefitCardComponent({
  data,
}: Readonly<BenefitCardProps>) {
  return (
    <CornerContainer sx={CARD_SX}>
      {/* Label */}
      <AtomTypography variant="h4" color="text.primary" sx={{ whiteSpace: 'pre-line' }}>
        {data.label}
      </AtomTypography>

      {/* Description */}
      <AtomTypography variant="body4" color="text.secondary">
        {data.description}
      </AtomTypography>
    </CornerContainer>
  );
});

// =============================================================================
// Main Component
// =============================================================================

function BenefitsSection(): React.JSX.Element {
  return (
    <Box sx={SECTION_SX}>
      {/* Cards Row */}
      <Box sx={CARDS_ROW_SX}>
        {BENEFIT_CARDS.map((card) => (
          <BenefitCardComponent key={card.id} data={card} />
        ))}
      </Box>

      <CornerContainer sx={CONTAINER_SX}>
        {/* Centered Button */}
        <Box sx={BUTTON_CONTAINER_SX}>
          <AtomButton id="schedule-appointment" variant="contained" color="primary" size="large" label="SCHEDULE AN APPOINTMENT" />
        </Box>
      </CornerContainer>
    </Box>
  );
}

export default memo(BenefitsSection);
