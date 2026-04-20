'use client';

/**
 * PortfolioActionsSection Component
 * ==================================
 * Displays claimable yield and withdraw options in a horizontal layout.
 *
 * Features:
 * - Claimable yield with CLAIM button
 * - Available to withdraw with WITHDRAW button
 * - Space-between layout with 40px padding
 *
 * @module components/sections/portfolio-actions-section
 */
import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import React, { memo, useCallback } from 'react';

import CornerContainer from '@/components/atoms/corner-container';
import { AtomButton } from '@/components/atoms/button';
import AtomTypography from '@/components/atoms/typography';
import { yieldzNeutral } from '@/styles/theme/colors';

// =============================================================================
// Types
// =============================================================================

export interface PortfolioActionsData {
  /** Claimable yield in BTC */
  claimableYield: string;
  /** Available to withdraw in USDC */
  availableToWithdraw: string;
}

export interface PortfolioActionsSectionProps {
  /** Portfolio actions data */
  data?: PortfolioActionsData;
  /** Callback when WITHDRAW button is clicked */
  onWithdraw?: () => void;
}

// =============================================================================
// Constants
// =============================================================================

/** Default data */
const DEFAULT_DATA: PortfolioActionsData = {
  claimableYield: '0.02225 BTC',
  availableToWithdraw: '1,000.00 USDC',
};

// =============================================================================
// Styles
// =============================================================================

/** Main container */
const CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
};

/** Content layout - space between */
const CONTENT_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  justifyContent: 'space-between',
  alignItems: 'stretch', 
  gap: 0,
  width: '100%',
};

/** Action card container */
const ACTION_CARD_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 3,
  flex: 1,
  height: '100%',
  minHeight: 48, // Ensure consistent height even without button
};

/** Button container - maintains space even when button is hidden */
const BUTTON_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  minWidth: 120, // Reserve space for button
  height: '100%',
};

// =============================================================================
// Sub-Components
// =============================================================================

interface ActionCardProps {
  label: string;
  value: string;
  buttonText: string;
  onAction?: () => void;
  showLeftBorder?: boolean;
}

const ActionCard = memo(function ActionCard({
  label,
  value,
  buttonText,
  onAction,
  showLeftBorder = false,
}: Readonly<ActionCardProps>): React.JSX.Element {
  return (
    <Box
      sx={{
        ...ACTION_CARD_SX,
        borderLeft: showLeftBorder ? `1px solid ${yieldzNeutral[700]}` : 'none',
        pl: showLeftBorder ? { xs: 0, md: 4 } : 0,
        height: '100%',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Label and Value */}
      <Stack gap={1} sx={{ flex: 1 }}>
        <AtomTypography variant="label3" fontType="ppMori" color="text.secondary">
          {label}
        </AtomTypography>
        <AtomTypography variant="button1" fontType="ppMori">
          {value}
        </AtomTypography>
      </Stack>

      {/* Action Button */}
      <Box sx={BUTTON_CONTAINER_SX}>
        {onAction && (
          <AtomButton
            id={`${label}-btn`}
            size="medium"
            variant="contained"
            onClick={onAction}
            color="primary"
            label={buttonText}
            // disabled
            endIcon={<Image src="/assets/icons/right-scroll.png" alt="arrow-right" width={16} height={16} />}
          />
        )}
      </Box>
    </Box>
  );
});

// =============================================================================
// Main Component
// =============================================================================

/**
 * PortfolioActionsSection - Displays claimable yield and withdraw options
 */
function PortfolioActionsSectionComponent({
  data = DEFAULT_DATA,
  onWithdraw,
}: Readonly<PortfolioActionsSectionProps>): React.JSX.Element {
  const handleWithdraw = useCallback(() => {
    onWithdraw?.();
  }, [onWithdraw]);

  return (
    // <CornerContainer sx={{ ...CONTAINER_SX, border: 'none' }} showBorder={false} outerSx={{ border: 'none' }}>
      <Box sx={CONTENT_SX}>
        {/* Claimable Yield */}
        <CornerContainer
          showBorder={false}
          showGradient={true}
          sx={{
            p: '40px',
            height: '100%',
          }}
          outerSx={{ border: 'none', flex: 1, display: 'flex' }}
        >
          <ActionCard label="AVERAGE EARNED YIELD" value={data.claimableYield} buttonText="CLAIM" />
        </CornerContainer>

        {/* Available to Withdraw */}
        <CornerContainer
          showBorder={false}
          showGradient={true}
          sx={{
            p: '40px',
            height: '100%',
          }}
          outerSx={{ border: 'none', flex: 1, display: 'flex' }}
        >
          <ActionCard
            label="AVAILABLE TO WITHDRAW"
            value={data.availableToWithdraw}
            buttonText="WITHDRAW"
            onAction={handleWithdraw}
          />
        </CornerContainer>
      </Box>
    // </CornerContainer>
  );
}

export const PortfolioActionsSection = memo(PortfolioActionsSectionComponent);
export default PortfolioActionsSection;
