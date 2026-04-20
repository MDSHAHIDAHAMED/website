/**
 * Token Explorer Constants
 * ========================
 * Types, interfaces, and configuration for the Token Explorer page.
 * Follows SOLID principles - centralized configuration for extensibility.
 */

import type { CustomTabOptionProps } from '@/components/atoms/tabs';
import type { ITableHeader } from '@/components/organisms/table/tableHead';
import type { SxProps, Theme } from '@mui/material';

// =============================================================================
// Types & Interfaces
// =============================================================================

/**
 * Featured Token Card Data
 * Defines structure for featured token display cards
 */
export interface FeaturedToken {
  id: string;
  name: string;
  status: 'Active' | 'Inactive' | 'Pending';
  description: string;
  availability: string;
  lockup: string;
  underlyingAsset: string;
  currentAPY: string;
}

/**
 * Token Category Data
 * Defines structure for token category cards
 */
export interface TokenCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

/**
 * Token Table Row Data
 * Defines structure for tokens table rows
 */
export interface TokenTableRow {
  id: string;
  name: string;
  symbol: string;
  price: string;
  priceChange: string;
  priceChangeDirection: 'up' | 'down';
  currentAPY: string;
  apyChange: string;
  apyChangeDirection: 'up' | 'down';
  marketCap: string;
}

/**
 * Token Tab Types
 */
export type TokenTabType = 'TOP_TOKENS' | 'NEWEST' | 'YIELD_TOKENS' | 'STANDARD_TOKENS';

// =============================================================================
// Featured Tokens Data
// =============================================================================

export const FEATURED_TOKENS: readonly FeaturedToken[] = [
  {
    id: 'yldz-1',
    name: 'YLDZ Token',
    status: 'Active',
    description: 'Equity Based Investment token, a revolutionary investment opportunity designed to generate consistent returns based on Bitcoin\'s performance.',
    availability: 'Instant',
    lockup: '365 Days',
    underlyingAsset: 'Bitcoin ASICS',
    currentAPY: '42.85%',
  },
  {
    id: 'yldz-2',
    name: 'YLDZ Token',
    status: 'Active',
    description: 'Equity Based Investment token, a revolutionary investment opportunity designed to generate consistent returns based on Bitcoin\'s performance.',
    availability: 'Instant',
    lockup: '365 Days',
    underlyingAsset: 'Bitcoin ASICS',
    currentAPY: '42.85%',
  },
  {
    id: 'yldz-3',
    name: 'YLDZ Token',
    status: 'Active',
    description: 'Equity Based Investment token, a revolutionary investment opportunity designed to generate consistent returns based on Bitcoin\'s performance.',
    availability: 'Instant',
    lockup: '365 Days',
    underlyingAsset: 'Bitcoin ASICS',
    currentAPY: '42.85%',
  },
] as const;

export const FEATURED_TOKENS_DATA: readonly FeaturedToken[] = [
  {
    id: 'yldz-4',
    name: 'YLDZ Token',
    status: 'Active',
    description: 'Equity Based Investment token, a revolutionary investment opportunity designed to generate consistent returns based on Bitcoin\'s performance.',
    availability: 'Instant',
    lockup: '365 Days',
    underlyingAsset: 'Bitcoin ASICS',
    currentAPY: '42.85%',
  },
] as const;

// =============================================================================
// Token Categories Data
// =============================================================================

export const TOKEN_CATEGORIES: readonly TokenCategory[] = [
  {
    id: 'stable-tokens',
    name: 'STABLE TOKENS',
    description: 'Yield Asset Stable Tokens',
  },
  {
    id: 'commodities',
    name: 'COMMODITIES',
    description: 'Commodity Backed Token Investments',
  },
  {
    id: 'whiskey',
    name: 'WHISKEY',
    description: 'Invest in Whiskey Casks',
  },
  {
    id: 'funds',
    name: 'FUNDS',
    description: 'Funds Based with Bitcoin Yield',
  },
  {
    id: 'commodities-2',
    name: 'COMMODITIES',
    description: 'Commodity Backed Token Investments',
  },
] as const;

// =============================================================================
// Token Table Data (Mock)
// =============================================================================

export const TOKEN_TABLE_DATA: readonly TokenTableRow[] = [
  { id: '1', name: 'YLDZ', symbol: 'YLDZ', price: '42.85%', priceChange: '1%', priceChangeDirection: 'up', currentAPY: '42.85%', apyChange: '1%', apyChangeDirection: 'up', marketCap: '198,394.99' },
  { id: '2', name: 'YLDZ', symbol: 'YLDZ', price: '42.85%', priceChange: '1%', priceChangeDirection: 'down', currentAPY: '42.25%', apyChange: '1%', apyChangeDirection: 'down', marketCap: '198,394.99' },
  { id: '3', name: 'YLDZ', symbol: 'YLDZ', price: '42.85%', priceChange: '1%', priceChangeDirection: 'up', currentAPY: '42.85%', apyChange: '1%', apyChangeDirection: 'up', marketCap: '598,394.99' },
  { id: '4', name: 'YLDZ', symbol: 'YLDZ', price: '42.85%', priceChange: '1%', priceChangeDirection: 'up', currentAPY: '42.85%', apyChange: '1%', apyChangeDirection: 'up', marketCap: '998,000,000' },
  { id: '5', name: 'YLDZ', symbol: 'YLDZ', price: '42.84%', priceChange: '1%', priceChangeDirection: 'up', currentAPY: '55.00%', apyChange: '1%', apyChangeDirection: 'up', marketCap: '598,000,000' },
  { id: '6', name: 'YLDZ', symbol: 'YLDZ', price: '42.85%', priceChange: '1%', priceChangeDirection: 'up', currentAPY: '50.00%', apyChange: '1%', apyChangeDirection: 'up', marketCap: '920,000,000' },
  { id: '7', name: 'YLDZ', symbol: 'YLDZ', price: '42.96%', priceChange: '1%', priceChangeDirection: 'up', currentAPY: '45.75%', apyChange: '1%', apyChangeDirection: 'up', marketCap: '500,889,000' },
  { id: '8', name: 'YLDZ', symbol: 'YLDZ', price: '42.85%', priceChange: '1%', priceChangeDirection: 'up', currentAPY: '60.87%', apyChange: '1%', apyChangeDirection: 'up', marketCap: '630,000,820' },
  { id: '9', name: 'YLDZ', symbol: 'YLDZ', price: '42.89%', priceChange: '1%', priceChangeDirection: 'up', currentAPY: '46.32%', apyChange: '1%', apyChangeDirection: 'up', marketCap: '988,292,000' },
  { id: '10', name: 'YLDZ', symbol: 'YLDZ', price: '44.92%', priceChange: '1%', priceChangeDirection: 'up', currentAPY: '45.00%', apyChange: '1%', apyChangeDirection: 'up', marketCap: '990,000,000' },
  { id: '11', name: 'YLDZ', symbol: 'YLDZ', price: '36.74%', priceChange: '1%', priceChangeDirection: 'up', currentAPY: '45.00%', apyChange: '1%', apyChangeDirection: 'up', marketCap: '500,000,000' },
  { id: '12', name: 'YLDZ', symbol: 'YLDZ', price: '37.55%', priceChange: '1%', priceChangeDirection: 'up', currentAPY: '42.77%', apyChange: '1%', apyChangeDirection: 'up', marketCap: '375,404,100' },
  { id: '13', name: 'YLDZ', symbol: 'YLDZ', price: '38.60%', priceChange: '1%', priceChangeDirection: 'up', currentAPY: '42.77%', apyChange: '1%', apyChangeDirection: 'up', marketCap: '235,849,000' },
  { id: '14', name: 'YLDZ', symbol: 'YLDZ', price: '35.43%', priceChange: '1%', priceChangeDirection: 'up', currentAPY: '46.00%', apyChange: '1%', apyChangeDirection: 'up', marketCap: '575,300,000' },
  { id: '15', name: 'YLDZ', symbol: 'YLDZ', price: '34.05%', priceChange: '1%', priceChangeDirection: 'up', currentAPY: '48.05%', apyChange: '1%', apyChangeDirection: 'up', marketCap: '804,085,000' },
] as const;

// =============================================================================
// Token Tabs
// =============================================================================

export interface TokenTab {
  id: TokenTabType;
  label: string;
}

/** Token tabs data for AtomTabs component */
export const TOKEN_TABS_DATA: CustomTabOptionProps[] = [
  { label: 'TOP TOKENS', value: 'TOP_TOKENS' },
  { label: 'NEWEST', value: 'NEWEST' },
  { label: 'YIELD TOKENS', value: 'YIELD_TOKENS' }
];

// =============================================================================
// Table Headers
// =============================================================================

export const TOKEN_TABLE_HEADERS: ITableHeader[] = [
  { id: 'name', label: 'NAME', width: '15%', isSortable: true },
  { id: 'price', label: 'PRICE', width: '15%', isSortable: true },
  { id: 'currentAPY', label: 'CURRENT APY (RATE)', width: '20%', isSortable: true },
  { id: 'marketCap', label: 'MARKET CAP', width: '20%', isSortable: true },
];

// =============================================================================
// Style Constants
// =============================================================================

/** Page container styles */
export const TOKEN_PAGE_CONTAINER_SX: SxProps<Theme> = {
  minHeight: '100vh',
  width: '100%',
  py: { xs: 2, sm: 3, md: 4 },
  display: 'flex',
  flexDirection: 'column',
  gap: 10
};

/** Section container styles */
export const SECTION_CONTAINER_SX: SxProps<Theme> = {
  mb: 4,
};

/** Section header styles */
export const SECTION_HEADER_SX: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 2,
};

/** Featured tokens grid styles */
export const FEATURED_GRID_SX: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
  gap: 2,
};

/** Categories scroll container styles */
export const CATEGORIES_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
  overflowX: 'auto',
  pb: 1,
  '&::-webkit-scrollbar': {
    height: 4,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'neutral.700',
    borderRadius: 2,
  },
};

/** Featured token card styles */
export const FEATURED_CARD_SX: SxProps<Theme> = {
  p: "40px",
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  height: '100%',
};

/** Fixed height for category cards (ensures consistency) */
export const CATEGORY_CARD_HEIGHT = 316;

/** Category card styles */
export const CATEGORY_CARD_SX: SxProps<Theme> = {
  height: CATEGORY_CARD_HEIGHT,
  minWidth: 180,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  textAlign: 'center',
  gap: 1,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  p: 5,
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(to right, #171717 0%, #000000 100%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `conic-gradient(
      from 270deg at 0% 50%,
      rgba(23, 23, 23, 0.8) 0deg,
      rgba(23, 23, 23, 0.6) 90deg,
      rgba(0, 0, 0, 0.4) 180deg,
      rgba(0, 0, 0, 0.8) 270deg,
      rgba(23, 23, 23, 0.4) 360deg
    )`,
    filter: 'blur(119px)',
    mixBlendMode: 'plus-lighter',
    pointerEvents: 'none',
    zIndex: 0,
  },
};

/** Token info row styles */
export const TOKEN_INFO_ROW_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  justifyContent: 'center',
  alignItems: 'flex-start',
  textAlign: 'center',
};

/** Tabs container styles */
export const TABS_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
  mb: 2,
  borderBottom: '1px solid',
  borderColor: 'divider',
};

/** Tab button styles */
export const TAB_BUTTON_SX: SxProps<Theme> = {
  px: 2,
  py: 1,
  cursor: 'pointer',
  borderBottom: '2px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: 'primary.main',
  },
};

/** Active tab styles */
export const TAB_ACTIVE_SX: SxProps<Theme> = {
  borderColor: 'primary.main',
  color: 'primary.main',
};

/** Navigation arrows container */
export const NAV_ARROWS_SX: SxProps<Theme> = {
  display: 'flex',
  gap: 1,
};

/** Arrow button styles */
export const ARROW_BUTTON_SX: SxProps<Theme> = {
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid',
  borderColor: 'divider',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: 'primary.main',
  },
};

