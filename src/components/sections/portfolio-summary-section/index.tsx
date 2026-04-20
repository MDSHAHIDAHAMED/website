'use client';

/**
 * PortfolioSummarySection Component
 * ==================================
 * Displays the portfolio summary with total yield earned.
 *
 * Features:
 * - Fixed height of 390px
 * - "My Portfolio" heading
 * - Total yield earned with USD equivalent
 * - Large BTC value display
 * - Background pattern
 *
 * @module components/sections/portfolio-summary-section
 */
import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import React, { memo } from 'react';
import { CornerContainer } from 'yldzs-components';

import AtomTypography from '@/components/atoms/typography';
import { BackgroundVideoContainer } from '@/components/atoms/video/background-container';
import { config } from '@/config';

// =============================================================================
// Types
// =============================================================================

export interface PortfolioSummaryData {
  /** Total yield earned in BTC */
  yieldBtc: string;
  /** USD equivalent value */
  yieldUsd: string;
}

export interface PortfolioSummarySectionProps {
  /** Portfolio data to display */
  data?: PortfolioSummaryData;
}

// =============================================================================
// Constants
// =============================================================================

/** Default portfolio data */
const DEFAULT_DATA: PortfolioSummaryData = {
  yieldBtc: '1.02225 BTC',
  yieldUsd: '=117871.57 USD',
};

// =============================================================================
// Styles
// =============================================================================

/** Main container - fixed 390px height */
const CONTAINER_SX: SxProps<Theme> = {
  height: 390,
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
};

/** Inner container with padding */
const INNER_CONTAINER_SX: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  p: { xs: 2, md: 3 },
  gap: 2,
};

/** Middle content row */
const MIDDLE_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  justifyContent: 'space-between',
  alignItems: { xs: 'flex-start', sm: 'flex-end' },
  gap: 2,
  width: { xs: '100%', sm: '434px' },
};

// =============================================================================
// Component
// =============================================================================

/**
 * PortfolioSummarySection - Displays portfolio summary with yield
 */
function PortfolioSummarySectionComponent({
  data = DEFAULT_DATA,
}: Readonly<PortfolioSummarySectionProps>): React.JSX.Element {
  return (
    <CornerContainer sx={CONTAINER_SX}>
      <BackgroundVideoContainer src={config.backgroundVids.boxexBg} sx={CONTAINER_SX}>
        {/* Content */}
        <Box sx={INNER_CONTAINER_SX}>
          {/* Header */}
          <AtomTypography variant="h4" fontType="ppMori">
            My Portfolio
          </AtomTypography>

          {/* Spacer to push content to bottom */}
          <Box sx={{ flex: 1 }} />

          {/* Yield Row - Label and USD Value */}
          <Stack sx={MIDDLE_ROW_SX}>
            <AtomTypography variant="body4" fontType="ppMori">
              Total yield earned
            </AtomTypography>
            <AtomTypography variant="body4" fontType="ppMori" color="text.secondary">
              {data.yieldUsd}
            </AtomTypography>
          </Stack>

          {/* Large BTC Value */}
          <Box>
            <AtomTypography variant="display5" color="primary" fontType="tickerbit">
              {data.yieldBtc}
            </AtomTypography>
          </Box>
        </Box>
      </BackgroundVideoContainer>
    </CornerContainer>
  );
}

export const PortfolioSummarySection = memo(PortfolioSummarySectionComponent);
export default PortfolioSummarySection;
