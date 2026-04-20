'use client';

/**
 * YieldAssetsSection Component
 * =============================
 * Displays yield assets comparison table with video background panel.
 *
 * Layout:
 * - Left (3/12): Video background with logo and text
 * - Right (9/12): Heading with tooltips, table, and stat cards
 */
import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import { memo, useMemo } from 'react';

import CornerContainer from '@/components/atoms/corner-container';
import AtomTooltip from '@/components/atoms/tooltip';
import AtomTypography from '@/components/atoms/typography';
import BackgroundVideoContainer from '@/components/atoms/video/background-container';
import Listing from '@/components/organisms/table';
import type { ITableHeader } from '@/components/organisms/table/tableHead';
import { yieldzBase } from '@/styles/theme';
import EthicallyNeutralYieldTooltipContent from './tooltip-content';

// =============================================================================
// Constants
// =============================================================================

const VIDEO_SRC = '/assets/videos/yldzs-offer.mp4';

/** Section container styles */
const SECTION_SX: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  backgroundColor: 'background.default',
  display: 'flex',
  p: { xs: 2, md: 4 },
};

/** Main grid container - uses CSS grid with stretch to ensure equal heights */
const GRID_CONTAINER_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '4fr 8fr' },
  gridTemplateRows: '1fr', // Single row that stretches
  alignItems: 'stretch', // Both children stretch to equal height
  gap: 1,
  width: '100%',
};

/** Left panel styles */
const LEFT_PANEL_SX: SxProps<Theme> = {
  height: '100%', // Fill grid cell height
  minHeight: { xs: 300, md: 'auto' },
  position: 'relative',
};

/** Left panel content */
const LEFT_CONTENT_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '100%',
  py: { xs: 2, md: 2 },
  px: { xs: 2, md: 4 },
};

/** Right panel styles */
const RIGHT_PANEL_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  py: { xs: 2, md: 2 },
  px: { xs: 2, md: 4 },
  height: '100%', // Fill grid cell height
};

/** Stat cards container */
const STAT_CARDS_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
  gap: 1,
  mt: 1,
};

/** Individual stat card */
const STAT_CARD_SX: SxProps<Theme> = {
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

/** Stat card value text */
const STAT_CARD_VALUE_SX: SxProps<Theme> = {
  mt: 2,
  textAlign: 'right',
};

/** Logo container */
const LOGO_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  mt: { xs: 2, md: 5 },
};

/** Logo image style */
const LOGO_IMAGE_STYLE = {
  objectFit: 'contain' as const,
};

/** Text container */
const TEXT_CONTAINER_SX: SxProps<Theme> = {
  textAlign: 'center',
};

/** First text block container */
const FIRST_TEXT_BLOCK_SX: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  gap: 1,
  mb: 3,
};

/** Left panel text item */
const LEFT_PANEL_TEXT_ITEM_SX: SxProps<Theme> = {
  color: yieldzBase.black,
  fontSize: '15px',
};

/** Second text block container */
const SECOND_TEXT_BLOCK_SX: SxProps<Theme> = {
  mt: 2,
  textAlign: 'left',
};

/** Left panel text line */
const LEFT_PANEL_TEXT_LINE_SX: SxProps<Theme> = {
  fontSize: '15px',
  color: yieldzBase.black,
};

/** Tooltip wrapper */
const TOOLTIP_WRAPPER_SX: SxProps<Theme> = {
  textDecoration: 'underline',
  cursor: 'help',
};

/** Tooltip slot props */
const TOOLTIP_SLOT_PROPS = {
  popper: {
    disablePortal: false,
    strategy: 'fixed' as const,
    sx: {
      width: 'calc(100vw - 32px) !important',
      maxWidth: 'calc(100vw - 32px) !important',
    },
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
      {
        name: 'preventOverflow',
        enabled: true,
        options: {
          padding: 16,
          boundary: 'viewport',
        },
      },
      {
        name: 'flip',
        enabled: true,
        options: {
          fallbackPlacements: ['top', 'bottom'],
        },
      },
    ],
  },
  tooltip: {
    sx: {
      width: '100% !important',
      maxWidth: 'none !important',
      backgroundColor: 'transparent',
      boxShadow: 'none',
      pointerEvents: 'auto',
      cursor: 'pointer !important',
      p: 0,
      backdropFilter: 'blur(0px)',
    },
  },
};

// =============================================================================
// Data
// =============================================================================


/**
 * Table headers for yield assets listing
 * Uses tooltip-wrapped labels for percentage columns
 */
const YIELD_ASSETS_HEADERS: ITableHeader[] = [
  { id: 'name', label: 'YIELD ASSETS', width: '30%', isSortable: false },
  { id: 'percentCol1', label: '% COLUMN 1', width: '20%', isSortable: false },
  { id: 'percentCol2', label: '% COLUMN 2', width: '20%', isSortable: false },
  { id: 'yieldReturnedIn', label: 'YIELD RETURNED IN', width: '30%', isSortable: false },
];

/**
 * Table row data for yield assets
 * Maps to ITableHeader ids for proper rendering
 */
const YIELD_ASSETS_ROWS: Record<string, unknown>[] = [
  { id: 'usd-bank', name: 'USD Bank Accounts', percentCol1: '-', percentCol2: '-', yieldReturnedIn: 'USD' },
  { id: 'money-market', name: 'Money Market Funds', percentCol1: '-', percentCol2: '-', yieldReturnedIn: 'USD' },
  { id: 'short-term', name: 'Short Term Treasury Bills', percentCol1: '-', percentCol2: '-', yieldReturnedIn: 'USD' },
  { id: '12-month', name: '12 Month Treasury Bills', percentCol1: '-', percentCol2: '-', yieldReturnedIn: 'USD' },
  { id: 'staking', name: 'Staking Digital Assets', percentCol1: '-', percentCol2: '-', yieldReturnedIn: 'USDT, ETH, SOL, etc.' },
  { id: 'strc', name: 'STRC by Strategy', percentCol1: '~9.0 - 10.4%', percentCol2: '~15.0 - 16.4%', yieldReturnedIn: 'USD' },
  { id: 'yldz', name: 'YLDZ', percentCol1: '~15%', percentCol2: '~21.50%', yieldReturnedIn: 'BTC' },
];

interface StatCard {
  id: string;
  label: string;
  sublabel: string;
  value: string;
  isHighlighted?: boolean;
  subLabelHighlight?: boolean;
}

const STAT_CARDS: StatCard[] = [
  { id: 'effective-yield', label: 'EFFECTIVE', sublabel: 'YIELD TARGET', subLabelHighlight: true, value: '15.00%', isHighlighted: false },
  { id: 'tax-equiv', label: 'TAX- EQUIV.', sublabel: 'YIELD', value: '21.50%', subLabelHighlight: true, isHighlighted: false },
  { id: 'yield-returned', label: 'YIELD', sublabel: 'RETURNED IN', value: 'wBTC', isHighlighted: true, subLabelHighlight: false },
  { id: 'asset-held', label: 'ASSET', sublabel: 'HELD IN', value: 'Self-Custody', isHighlighted: true, subLabelHighlight: false },
];

const LEFT_PANEL_TEXT = [
  { text: 'YLDZ', highlight: false },
  { text: 'IS', highlight: false },
  { text: 'A', highlight: false },
  { text: 'TOKENIZED', highlight: true },
  { text: '$1', highlight: false },
  { text: 'PEGGED', highlight: true },
  { text: 'DIGITAL', highlight: false },
  { text: 'ASSET', highlight: false },
  { text: 'YIELD', highlight: true },
  { text: 'SECURITY', highlight: false },
  { text: 'TOKEN', highlight: true },
  { text: 'REG', highlight: false },
  { text: 'D', highlight: false },
  { text: '506', highlight: false },
  { text: '(C)', highlight: false },
  { text: 'OFFERING', highlight: false },
];

const LEFT_PANEL_TEXT_2 = [
  'VARIABLE MONTHLY BITCOIN (WBTC)',
  'DISTRIBUTION; DESIGNED TO PROMOTE STABLE',
  'PRICE DYNAMICS WITH YIELD GENERATED',
  'BY HIGH PERFORMANCE COMPUTE HASHING',
];

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Left Panel with Video Background
 */
const LeftPanel = memo(function LeftPanel() {
  return (
    <CornerContainer sx={LEFT_PANEL_SX} showBorder>
      <BackgroundVideoContainer src={VIDEO_SRC} sx={{ height: '100%' }} objectFit="cover">
        <Box sx={LEFT_CONTENT_SX}>
          {/* Logo at top */}
          <Box sx={LOGO_CONTAINER_SX}>
            <Image
              src="/assets/icons/black-yldzs.svg"
              alt="Black YLDZs"
              width={160}
              height={160}
              style={LOGO_IMAGE_STYLE}
            />
          </Box>

          {/* Text at bottom */}
          <Box sx={TEXT_CONTAINER_SX}>
            {/* First text block */}
            <Box sx={FIRST_TEXT_BLOCK_SX}>
              {LEFT_PANEL_TEXT.map((item) => (
                <AtomTypography
                  key={item.text}
                  variant="body4"
                  sx={LEFT_PANEL_TEXT_ITEM_SX}
                >
                  {item.text}
                </AtomTypography>
              ))}
            </Box>

            {/* Second text block */}
            <Box sx={SECOND_TEXT_BLOCK_SX}>
              {LEFT_PANEL_TEXT_2.map((line) => (
                <AtomTypography
                  key={line}
                  variant="body4"
                  sx={LEFT_PANEL_TEXT_LINE_SX}
                >
                  {line}
                </AtomTypography>
              ))}
            </Box>
          </Box>
        </Box>
      </BackgroundVideoContainer>
    </CornerContainer>
  );
});

/**
 * Stat Card Component
 */
interface StatCardProps {
  data: StatCard;
}

const StatCardComponent = memo(function StatCardComponent({ data }: Readonly<StatCardProps>) {
  return (
    <CornerContainer sx={STAT_CARD_SX} showBorder>
      <AtomTypography variant="h3" color={data.isHighlighted ? 'primary' : 'text.primary'}>
        {data.label}
      </AtomTypography>
      <AtomTypography variant="h3" fontType="tickerbit" color={data.subLabelHighlight ? 'primary' : 'text.primary'}>
        {data.sublabel}
      </AtomTypography>
      <AtomTypography variant="display3" fontType="tickerbit" sx={STAT_CARD_VALUE_SX}>
        {data.value}
      </AtomTypography>
    </CornerContainer>
  );
});

/**
 * Right Panel with Table and Stats
 */
const RightPanel = memo(function RightPanel() {
  // Memoize rows data to prevent unnecessary re-renders
  const tableRows = useMemo(() => YIELD_ASSETS_ROWS, []);

  return (
    <Stack sx={RIGHT_PANEL_SX} spacing={3}>
      {/* Heading with Tooltip */}
      <AtomTypography variant="h4">
        YLDZ offers pure{' '}
        <AtomTooltip
          title={<EthicallyNeutralYieldTooltipContent />}
          arrow
          placement="bottom"
          followCursor={false}
          slotProps={TOOLTIP_SLOT_PROPS}
        >
          <Box component="span" sx={TOOLTIP_WRAPPER_SX}>
            <AtomTypography variant="h4" component="span" color="primary">
              ethically neutral yield
            </AtomTypography>
          </Box>
        </AtomTooltip>{' '}
        for those seeking stability, simplicity, and minimal volatility.
      </AtomTypography>

      {/* Table using Listing organism */}
      <Listing
        headers={YIELD_ASSETS_HEADERS}
        rows={tableRows}
        pageSize={10}
        totalCount={tableRows.length}
        loading={false}
        noRecords="No yield assets available"
        isPaginationEnabled={false}
      />

      {/* Stat Cards */}
      <Box sx={STAT_CARDS_SX}>
        {STAT_CARDS.map((card) => (
          <StatCardComponent key={card.id} data={card} />
        ))}
      </Box>
    </Stack>
  );
});

// =============================================================================
// Main Component
// =============================================================================

function YieldAssetsSection(): React.JSX.Element {
  return (
    <Box sx={SECTION_SX}>
      <Box sx={GRID_CONTAINER_SX}>
        <LeftPanel />
        <RightPanel />
      </Box>
    </Box>
  );
}

export default memo(YieldAssetsSection);
