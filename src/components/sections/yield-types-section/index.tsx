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
import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import { memo } from 'react';

import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';

// =============================================================================
// Constants
// =============================================================================

/** Section container styles */
const SECTION_SX: SxProps<Theme> = {
  width: '100%',
  backgroundColor: 'background.default',
  p: { xs: 2, sm: 3, md: 4, lg: 5 },
  py: { xs: 8, sm: 10, md: 12, lg: 16 },
};

/** Grid row for 4 equal columns */
const ROW_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr', xl: 'repeat(4, 1fr)' },
gap: 2,
marginBottom: { xs: 4, sm: 0,},
};

/** Individual card styles */
const CARD_SX: SxProps<Theme> = {
  p: 5,
  display: 'flex',
  flexDirection: 'column',
  gap: 1,

};

/** Label styles (10px, secondary) */
const LABEL_SX: SxProps<Theme> = {

  textTransform: 'uppercase',
};

// =============================================================================
// Data
// =============================================================================

interface YieldCard {
  id: string;
  label: string;
  title?: string;
  titleIcon?: string;
  description: string;
}

interface YieldColumnData {
  id: string;
  top: YieldCard;
  bottom: YieldCard;
}

const YIELD_COLUMNS: YieldColumnData[] = [
  {
    id: 'treasury-col',
    top: {
      id: 'treasury',
      label: 'YIELD BACKED BY',
      title: 'U.S. Treasury Yield',
      description:
        'U.S. ability to repay by printing you, new "freshly printed" dollars.\n\nThe yield source is printing more money out of thin air. Debasing the public to create yield "aka" risk free rate of return.',
    },
    bottom: {
      id: 'treasury-risk',
      label: 'NO RISK OF LOSS',
      description:
        'At the expense of your debasement The "Public Money" option to yield.',
    },
  },
  {
    id: 'bank-col',
    top: {
      id: 'bank',
      label: 'YIELD PRODUCED BY',
      title: 'BANK Yield',
      description:
        'Fractional reserve lending customers deposits into "risky investments" credit cards, comm. real estate.\n\nBusiness start-ups, etc. & U.S. treasuries "aka" the publics access to yield.',
    },
    bottom: {
      id: 'bank-risk',
      label: 'LOW RISK OF LOSS',
      description:
        'At the expense of your debasement. The "Private Money" option to the public yield backed by the ability to print money with risk.',
    },
  },
  {
    id: 'strc-col',
    top: {
      id: 'strc',
      label: 'YIELD PRODUCED BY',
      title: 'STRC Yield',
      description:
        'Issuing shares to new investors. "Dilution yield" yield paid as long as new investors come into the underlying MSTR.\n\nDiluting share holders "ROC yield" the investor class to high performance yield.',
    },
    bottom: {
      id: 'strc-risk',
      label: 'LOW RISK OF LOSS',
      description:
        'Keeps up with debasement or slightly ahead with large liquidity. But needs additional investors to generate the yield to pay previous investors. Yield at the expense of the risk of dilution.',
    },
  },
  {
    id: 'yldz-col',
    top: {
      id: 'yldz',
      label: 'YIELD PRODUCED BY',
      title: 'YLDZ',
      titleIcon: '/assets/icons/BTCdark2.svg',
      description:
        'Data center operations of HPC hashing computation "True ethical yield" never lending your money to others. No ponzi scheme yield mechanics of paying old investors with new investor funds like STRC\'s yield.\n\nA true "roc yield" engine from data center operations.',
    },
    bottom: {
      id: 'yldz-risk',
      label: 'NO RISK OF LOSS',
      description:
        'No debasement, no dilution "private money" yield option from the operations of data center paid in Bitcoin. True yield with a CAGR & assets are held in self-custody by you.',
    },
  },
];
const backgroundImageurl = '/assets/backgrounds/cardBg.svg';
// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Yield Card Component
 * Displays label, optional title, and description
 */
interface YieldCardProps {
  data: YieldCard;
  showTitle?: boolean;
  backgroundImage?: string;
  minHeight?: string;
  descriptionColor?: string;
  sx?: SxProps<Theme>;
}

export const YieldCardComponent = memo(function YieldCardComponent({
  data,
  showTitle = true,
  backgroundImage,
  minHeight,
  sx,
  descriptionColor = 'text.secondary',
}: Readonly<YieldCardProps>) {
  return (
    <CornerContainer
      sx={{
        ...CARD_SX,
        ...(backgroundImage && {
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'top left',
        }),
        ...(minHeight && { minHeight }),
        ...(sx as Record<string, unknown>),
      }}
      showBorder
    >
      {/* Label */}
      <AtomTypography variant="caption" color="text.secondary" sx={LABEL_SX}>
        {data.label}
      </AtomTypography>

      {/* Title (optional) */}
      {showTitle && data.title && (
        <Stack direction="row" alignItems="center" spacing={1}>
          {data.titleIcon && (
            <Image
              src={data.titleIcon}
              alt=""
              width={26}
              height={26}
              style={{ objectFit: 'contain' }}
            />
          )}
          <AtomTypography variant="h4" color="text.primary" mb={2}>
            {data.title}
          </AtomTypography>
        </Stack>
      )}

      {/* Description */}
      <AtomTypography
        variant="body4"
        color={descriptionColor}
        sx={{ whiteSpace: 'pre-line' }}
      >
        {data.description}
      </AtomTypography>
    </CornerContainer>
  );
});

// =============================================================================
// Main Component
// =============================================================================

function YieldTypesSection(): React.JSX.Element {
  return (
    <Box sx={SECTION_SX}>
      <Box sx={ROW_SX}>
        {YIELD_COLUMNS.map((column) => (
          <Stack key={column.id}>
            <YieldCardComponent
              data={column.top}
              showTitle
              backgroundImage={backgroundImageurl}
             sx={{ minHeight: { md: '350px' } }}
            />
            <YieldCardComponent
              data={column.bottom}
              showTitle={false}
              sx={{ minHeight: { md: '240px' } }}
              descriptionColor="text.primary"
            />
          </Stack>
        ))}
      </Box>
    </Box>
  );
}

export default memo(YieldTypesSection);
