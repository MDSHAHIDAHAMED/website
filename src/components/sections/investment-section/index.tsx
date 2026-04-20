/**
 * InvestmentSection Component
 * ===========================
 * 
 * Main section component that displays investment card and holdings card.
 * 
 * Features:
 * - Buy/Sell investment interface
 * - Holdings display with earnings
 * 
 * @module components/sections/investment-section
 */

'use client';

import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import React, { memo } from 'react';
import { HoldingsCard } from './holdings-card';
import { InvestmentCard } from './investment-card';

// =============================================================================
// Types
// =============================================================================

export interface InvestmentSectionProps {
  /** Callback to open success dialog after investment transaction completes */
  onInvestmentSuccess?: () => void;
  /** Callback to register refetch function - receives refetch function that can be called when success dialog closes */
  onRefetchBalance?: (refetchFn: (() => void) | null) => void;
}

// =============================================================================
// Styles
// =============================================================================

/** Main section container - vertical layout */
const SECTION_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

// =============================================================================
// Main Component
// =============================================================================

/**
 * InvestmentSection Component
 *
 * Displays investment card and holdings card in a vertical layout.
 *
 * @param props - Component props
 * @returns Investment section JSX element
 */
function InvestmentSection({ onInvestmentSuccess, onRefetchBalance }: Readonly<InvestmentSectionProps>): React.JSX.Element {
  return (
    <Box sx={SECTION_CONTAINER_SX}>
      {/* Investment Card - Buy/Sell */}
      <InvestmentCard onInvestmentSuccess={onInvestmentSuccess} onRefetchBalance={onRefetchBalance} />

      {/* Holdings Card */}
      <HoldingsCard />
    </Box>
  );
}

export default memo(InvestmentSection);
