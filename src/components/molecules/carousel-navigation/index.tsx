'use client';

/**
 * CarouselNavigation Component
 * ============================
 * Reusable navigation component for carousels with scroll buttons, progress bar, and page indicator.
 * 
 * Follows SOLID principles:
 * - Single Responsibility: Handles only navigation UI and controls
 * - Open/Closed: Extensible through props without modification
 * - Liskov Substitution: Can be used anywhere carousel navigation is needed
 * - Interface Segregation: Clean, focused prop interface
 * - Dependency Inversion: Depends on abstractions (props)
 * 
 * Follows KISS principle: Simple, focused functionality
 * Follows DRY principle: Reusable across the application
 */
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import { memo } from 'react';

import AtomButton from '@/components/atoms/button';
import AtomProgressBar from '@/components/atoms/progress';
import AtomTypography from '@/components/atoms/typography';
import { yieldzBase } from '@/styles/theme/colors';

// =============================================================================
// Types
// =============================================================================

export interface CarouselNavigationProps {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when previous button is clicked */
  onPrevious: () => void;
  /** Callback when next button is clicked */
  onNext: () => void;
  /** Whether the previous button should be disabled */
  isAtStart: boolean;
  /** Whether the next button should be disabled */
  isAtEnd: boolean;
  /** Unique identifier prefix for buttons and progress bar */
  id: string;
  /** Optional custom styles for the container */
  sx?: SxProps<Theme>;
}

// =============================================================================
// Constants
// =============================================================================

/** Navigation container styles */
const NAVIGATION_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
  width: '100%',
};

/** Progress bar container */
const PROGRESS_BAR_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  flex: 1,
  justifyContent: 'center',
  maxWidth: '400px',
};

/** Progress text styles */
const PROGRESS_TEXT_SX: SxProps<Theme> = {
  fontSize: '14px',
  fontWeight: 500,
  color: yieldzBase.white,
  minWidth: '60px',
  textAlign: 'right',
};

/** Button styles */
const BUTTON_SX: SxProps<Theme> = {
  minWidth: 'auto',
  width: '40px',
  height: '40px',
  padding: 0,
};

// =============================================================================
// Component
// =============================================================================

function CarouselNavigation({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  isAtStart,
  isAtEnd,
  id,
  sx,
}: Readonly<CarouselNavigationProps>): React.JSX.Element {
  // Calculate progress percentage
  const progressValue = (currentPage / totalPages) * 100;

  return (
    <Box sx={[NAVIGATION_CONTAINER_SX, ...(Array.isArray(sx) ? sx : [sx])]}>
      {/* Previous Button */}
      <AtomButton
        id={`${id}-prev-button`}
        label={
          <Image
            src="/assets/icons/left-scroll.png"
            alt="Previous"
            width={20}
            height={20}
            style={{ objectFit: 'contain' }}
          />
        }
        onClick={onPrevious}
        disabled={isAtStart}
        variant="contained"
        color="secondary"
        size="small"
        sx={BUTTON_SX}
      />

      {/* Progress Bar */}
      <Box sx={PROGRESS_BAR_CONTAINER_SX}>
        <AtomProgressBar
          id={`${id}-progress-bar`}
          value={progressValue}
          format="percentage"
          showLabel={false}
          visualVariant="lined"
        />
      </Box>

      {/* Progress Text */}
      <AtomTypography sx={PROGRESS_TEXT_SX}>
        {currentPage} OF {totalPages}
      </AtomTypography>

      {/* Next Button */}
      <AtomButton
        id={`${id}-next-button`}
        label={
          <Image
            src="/assets/icons/right-scroll.png"
            alt="Next"
            width={20}
            height={20}
            style={{ objectFit: 'contain' }}
          />
        }
        onClick={onNext}
        disabled={isAtEnd}
        variant="contained"
        color="secondary"
        size="small"
        sx={BUTTON_SX}
      />
    </Box>
  );
}

export default memo(CarouselNavigation);

