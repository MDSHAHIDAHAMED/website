'use client';

/**
 * SuranceSection Component
 * ========================
 * Displays a single image section.
 *
 * Layout:
 * - Image only section with responsive sizing
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
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  p: { xs: 2, md: 5 },
};

/** Image container styles */
const IMAGE_CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  maxWidth: '1400px',
  position: 'relative',
  aspectRatio: 'auto',
};

// =============================================================================
// Main Component
// =============================================================================

function SuranceSection(): React.JSX.Element {
  return (
    <Box sx={SECTION_SX}>
      <Box sx={IMAGE_CONTAINER_SX}>
        <Image
          src="/assets/images/surance.png"
          alt="Surance"
          width={1400}
          height={600}
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
          }}
          priority
        />
      </Box>
    </Box>
  );
}

export default memo(SuranceSection);
