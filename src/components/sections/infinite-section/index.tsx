'use client';
 
/**
* InfiniteSection Component
* =========================
* Image section with three stat cards below.
* Similar to SubHeroSection but with static image stacked vertically.
*
* Layout:
* - Full-width image at top
* - Three CornerContainer stat cards below the image
*/
import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import { memo } from 'react';
 
import { StatCardData } from '@/app/(marketing)/page';
import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
 
// =============================================================================
// Constants
// =============================================================================
 
 
/** Container styles for the section */
const SECTION_SX: SxProps<Theme> = {
  width: '100%',
  backgroundColor: 'background.default',
  display: 'flex',
  flexDirection: 'column',
  p: { xs: 2, md: 5 },
  mb: 1
};
 
/** Image container styles */
const IMAGE_CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  position: 'relative',
  aspectRatio: '16/9',
  height: { xs: '50vh', md: '500px' },
};
 
/** Content wrapper styles */
const CONTENT_WRAPPER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
};
 
/** Stats row container styles */
const STATS_ROW_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
  width: '100%',
  alignItems: 'stretch',
};
 
/** Individual stat card styles */
const STAT_CARD_SX: SxProps<Theme> = {
  p: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: 1,
  minHeight: '310px',
  width: '100%',
};
 
// =============================================================================
// Sub-Components
// =============================================================================
 
interface StatCardProps {
  data: StatCardData;
}
 
const StatCard = memo(function StatCard({ data }: Readonly<StatCardProps>) {
  const renderValue = () => {
    switch (data.valueType) {
      case 'logo':
        return <Box><Image src="/assets/logo-emblem.svg" alt="Yield Icon" width={335} height={54} /></Box>;
      case 'percentage':
        return (
          <Stack direction="row" alignItems="center" justifyContent="flex-end" textAlign="right" spacing={1}>
            <AtomTypography variant="display5" fontType="tickerbit">
              {data.value}
            </AtomTypography>
 
          </Stack>
        );
      default:
        return (
          <AtomTypography variant="display5" fontType="tickerbit" sx={{ textAlign: 'right' }}>
            {data.value}
          </AtomTypography>
        );
    }
  };
 
  return (
    <CornerContainer
      sx={{
        ...STAT_CARD_SX,
        ...(data.backgroundImage && {
          backgroundImage: `url(${data.backgroundImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'top left',
        }),
      }}
      showBorder
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          p: { xs: 2, md: 3 },
          gap: 1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Title */}
        <AtomTypography
          variant="h3"
          sx={{
            whiteSpace: 'pre-line',
            textTransform: 'uppercase',
          }}
        >
          {data.title}
        </AtomTypography>
 
        {/* Subtitle */}
        {data.subtitle && (
          <AtomTypography
            variant="body4"
            color="text.secondary"
            sx={{
              whiteSpace: 'pre-line',
              color: 'text.primary',
            }}
          >
            {data.subtitle}
          </AtomTypography>
        )}
 
        {/* Value */}
        <Box sx={{ mt: 'auto', textAlign: 'right' }}>
          <AtomTypography variant="display5" fontType="tickerbit" sx={{ textAlign: 'right', fontWeight: 400 }}>
            {renderValue()}
          </AtomTypography>
        </Box>
      </Box>
    </CornerContainer>
  );
});
 
// =============================================================================
// Main Component
// =============================================================================
 
function InfiniteSection({ IMAGE_SRC = '/assets/backgrounds/yldzs-infinite.png', STAT_CARDS, isImage = false }: Readonly<{ IMAGE_SRC: string, STAT_CARDS: StatCardData[], isImage: boolean }>): React.JSX.Element {
  return (
    <Box sx={SECTION_SX}>
      {/* Image Section */}
      <Box sx={{ ...IMAGE_CONTAINER_SX, padding: isImage ? 0 : 6 }}>
        <Image
          src={IMAGE_SRC}
          alt="YLDZ Infinite"
          fill
          style={{ objectFit: isImage ? 'contain' : 'cover' }}
          priority
        />
      </Box>
 
      {/* Cards Section */}
      <Box sx={CONTENT_WRAPPER_SX}>
        <Box sx={STATS_ROW_SX}>
          {STAT_CARDS.map((card) => (
            <StatCard key={card.id} data={card} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
 
export default memo(InfiniteSection);