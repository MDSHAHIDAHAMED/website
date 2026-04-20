'use client';

/**
 * FeaturedTokenCard Component
 * ===========================
 * Displays a featured token with key metrics and status.
 * Uses CornerContainer for consistent styling with triangle corners.
 */
import { FEATURED_CARD_SX, TOKEN_INFO_ROW_SX, type FeaturedToken } from '@/constants/token-explorer';
import { Box, type SxProps, type Theme } from '@mui/material';
import Image from 'next/image';
import React, { memo, useCallback } from 'react';

import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
import YieldsBadge from '@/components/atoms/yields-badge';
import { paths } from '@/paths';
import { yieldzNeutral, yieldzPrimary } from '@/styles/theme/colors';
import { useRouter } from 'next/navigation';

// =============================================================================
// Types
// =============================================================================

interface FeaturedTokenCardProps {
  token: FeaturedToken;
  /** Badge type: 'simple' for text with background, 'badge' for YieldsBadge component */
  badgeType?: 'simple' | 'badge';
}

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Token Header with logo, name and abbreviation badge
 */
interface TokenHeaderProps {
  name: string;
  status: FeaturedToken['status'];
  badgeType?: 'simple' | 'badge';
}

/** Maps token status to badge variant */
const STATUS_VARIANT_MAP: Record<FeaturedToken['status'], 'green' | 'red' | 'yellow'> = {
  Active: 'green',
  Inactive: 'red',
  Pending: 'yellow',
};

const TokenHeader = memo(function TokenHeader({ name, status, badgeType = 'badge' }: Readonly<TokenHeaderProps>) {
  // Extract abbreviation from token name (e.g., "YLDZ Token" -> "YLDZ")
  const abbreviation = name.split(' ')[0];
  const badgeVariant = STATUS_VARIANT_MAP[status];
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(paths.dashboard.yldzsToken);
  }, [router]);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={handleClick}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'flex-start' }}>
        {/* Square logo container with token.svg image */}
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '8px',
            backgroundColor: 'background.default',
            border: `1px solid ${yieldzPrimary[500]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <Image
            src="/assets/icons/token.svg"
            alt="Token Logo"
            width={24}
            height={24}
            style={{ objectFit: 'contain' }}
          />
        </Box>
        <AtomTypography variant="h4" fontWeight={615}>
          {name}
        </AtomTypography>
      </Box>
      {/* Conditional badge rendering */}
      {badgeType === 'simple' ? (
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: '3px',
            backgroundColor: '#B2CAD1',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <AtomTypography
            sx={{
              color: yieldzNeutral[800],
              textTransform: 'uppercase',
            }}
            variant="overline"
          >
            {abbreviation}
          </AtomTypography>
        </Box>
      ) : (
        <YieldsBadge label={status} variant={badgeVariant} id={`featured-token-card-status-${status}`} />
      )}
    </Box>
  );
});

/**
 * Token Info Row - displays label and value pair
 */
interface InfoRowProps {
  label: string;
  value: string;
}

/** Background image styles for header and APY sections */
export const BACKGROUND_IMAGE_SX: SxProps<Theme> = {
  // bgcolor: 'red',
  backgroundImage: 'url(/assets/backgrounds/feature-bg.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  overflow: 'hidden',
};

/** Pre-merged styles for sections with background image (memoized/cached) */
const CARD_WITH_BACKGROUND_SX: SxProps<Theme> = {
  ...(FEATURED_CARD_SX as object),
  ...(BACKGROUND_IMAGE_SX as object),
};

const InfoRow = memo(function InfoRow({ label, value }: Readonly<InfoRowProps>) {
  return (
    <Box sx={TOKEN_INFO_ROW_SX}>
      <AtomTypography variant="label2" color="text.secondary">
        {label}
      </AtomTypography>
      <AtomTypography variant="caption" color="text.primary">
        {value}
      </AtomTypography>
    </Box>
  );
});

/**
 * APY Display - shows current APY with icon
 */
interface APYDisplayProps {
  apy: string;
}

const APYDisplay = memo(function APYDisplay({ apy }: Readonly<APYDisplayProps>) {
  return (
    <Box
      sx={{
        mt: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}
    >
      <AtomTypography variant="label2" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        CURRENT
      </AtomTypography>
      <Box sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
        <AtomTypography fontType="tickerbit" variant="display3" color="text.primary">
          {apy} <Image src="/assets/icons/boltz.svg" alt="Lightning Icon" width={19} height={25} />
        </AtomTypography>
        <AtomTypography variant="subtitle3" color="text.primary">
          APY
        </AtomTypography>
      </Box>
    </Box>
  );
});

// =============================================================================
// Main Component
// =============================================================================

function FeaturedTokenCard({ token, badgeType = 'badge' }: Readonly<FeaturedTokenCardProps>): React.JSX.Element {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0px'}}>
      <CornerContainer sx={{ ...CARD_WITH_BACKGROUND_SX, borderColor: 'var(--mui-palette-neutral-800)' }} outerSx={{ borderColor : 'var(--mui-palette-neutral-800)'}} showBorder={false}>
        {/* Header */}
        <TokenHeader name={token.name} status={token.status} badgeType={badgeType} />

        {/* Description */}
        <AtomTypography variant="body4" id={`featured-token-card-description-${token.name}`} color="text.secondary">
          {token.description}
        </AtomTypography>
      </CornerContainer>

      <CornerContainer sx={{ ...FEATURED_CARD_SX, borderColor: 'var(--mui-palette-neutral-800)' }} outerSx={{ borderColor : 'var(--mui-palette-neutral-800)'}} showBorder={false}>
        {/* Info Rows */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <InfoRow label="AVAILABILITY" value={token.availability} />
          <InfoRow label="LOCKUP" value={token.lockup} />
          <InfoRow label="UNDERLYING ASSET" value={token.underlyingAsset} />
        </Box>
      </CornerContainer>
      <CornerContainer sx={{ ...CARD_WITH_BACKGROUND_SX, borderColor: 'var(--mui-palette-neutral-800)' }} outerSx={{ borderColor : 'var(--mui-palette-neutral-800)'}} showBorder={false}>
        {/* APY Display */}
        <APYDisplay apy={token.currentAPY} />
      </CornerContainer>
    </Box>
  );
}

export default memo(FeaturedTokenCard);
