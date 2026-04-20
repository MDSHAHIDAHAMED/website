'use client';

import { Box, type SxProps, type Theme } from '@mui/material';
import Image from 'next/image';

import AtomTypography from '@/components/atoms/typography';

interface CompanyLogoProps {
  /**
   * Variant of logo to display
   * @default 'full' - Shows full YLDZ logo
   * @param 'emblem' - Shows only Y emblem logo
   */
  variant?: 'full' | 'emblem';
  /**
   * Show "Holdings Inc." subtitle
   * @default true
   */
  showSubtitle?: boolean;
  /**
   * Custom styles for container
   */
  sx?: SxProps<Theme>;
}

/**
 * Company Logo Component
 * ----------------------
 * Reusable company logo component with variant support
 *
 * Features:
 * - Full logo or emblem variant
 * - Optional subtitle display
 * - Responsive sizing
 * - SOLID principle: Single Responsibility - handles logo display only
 * - DRY: Reusable across application
 */
export default function CompanyLogo({ variant = 'full', showSubtitle = true, sx }: Readonly<CompanyLogoProps>) {
  // Logo configuration based on variant
  const logoConfig = {
    full: {
      src: '/assets/logo-dark.svg',
      alt: 'YLDZ',
      width: 120,
      height: 40,
    },
    emblem: {
      src: '/assets/logo-emblem.svg',
      alt: 'YLDZ Emblem',
      width: 60,
      height: 60,
    },
  };

  const config = logoConfig[variant];

  return (
    <Box sx={sx}>
      <Image src={config.src} alt={config.alt} width={config.width} height={config.height} style={{ objectFit: 'contain' }} />
      {showSubtitle && (
        <AtomTypography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.5,
            fontSize: '0.75rem',
          }}
        >
          Holdings Inc.
        </AtomTypography>
      )}
    </Box>
  );
}

