'use client';

/**
 * YieldTypesSection Component
 * ============================
 * Displays comparison of different yield types in a 4-column grid layout.
 *
 * Layout:
 * - Row 1: 4 cards with label, title, and description
 * - Row 2: 4 cards with label and description (no title)
 */
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import { memo } from 'react';

// =============================================================================
// Constants
// =============================================================================

/** Section container styles */
const SECTION_SX: SxProps<Theme> = {
  width: '100%',
  backgroundColor: 'background.default',
  p: { xs: 2, sm: 3, md: 4, lg: 5 },
};


// =============================================================================
// Main Component
// =============================================================================

function ChartImageSection(): React.JSX.Element {
  return (
    <Box sx={SECTION_SX}>
      <Image
        src="/assets/images/chart_section.png"
        alt="Yield comparison chart"
        width={2000}
        height={2000}
        style={{
          width: "100%",
          height: '100%',
        }}
        priority
      />
    </Box>
  );
}

export default memo(ChartImageSection);

