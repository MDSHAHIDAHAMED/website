/**
 * Listing Headers Constants
 * =========================
 * Table header configurations for various listing components.
 * Centralized for reusability and maintainability.
 */

import type { ITableHeader } from '@/components/organisms/table/tableHead';

// =============================================================================
// Token Table Headers
// =============================================================================

/**
 * Headers for the Token Explorer table
 */
export const TOKEN_LISTING_HEADERS: ITableHeader[] = [
  { id: 'name', label: 'NAME', width: '15%', isSortable: false },
  { id: 'price', label: 'PRICE', width: '15%', isSortable: false },
  { id: 'ath', label: 'ATH', width: '15%', isSortable: false },
  { id: 'atl', label: 'ATL', width: '15%', isSortable: false },
  { id: 'circulating_supply', label: 'CIRCULATING SUPPLY', width: '20%', isSortable: false },
  { id: 'marketCap', label: 'MARKET CAP', width: '20%', isSortable: false },
];

// =============================================================================
// Portfolio Table Headers
// =============================================================================

/**
 * Headers for the Portfolio holdings table
 */
export const PORTFOLIO_LISTING_HEADERS: ITableHeader[] = [
  { id: 'asset', label: 'ASSET', width: '20%', isSortable: true },
  { id: 'quantity', label: 'QUANTITY', width: '15%', isSortable: true },
  { id: 'value', label: 'VALUE', width: '15%', isSortable: true },
  { id: 'change', label: '24H CHANGE', width: '15%', isSortable: true },
  { id: 'allocation', label: 'ALLOCATION', width: '15%', isSortable: false },
];

// =============================================================================
// Transaction Table Headers
// =============================================================================

/**
 * Headers for the Transactions history table
 */
export const TRANSACTION_LISTING_HEADERS: ITableHeader[] = [
  { id: 'date', label: 'DATE', width: '15%', isSortable: true },
  { id: 'type', label: 'TYPE', width: '10%', isSortable: true },
  { id: 'asset', label: 'ASSET', width: '15%', isSortable: true },
  { id: 'amount', label: 'AMOUNT', width: '15%', isSortable: true },
  { id: 'status', label: 'STATUS', width: '10%', isSortable: false },
];

// =============================================================================
// Category Table Headers
// =============================================================================

/**
 * Headers for the Category Listing table
 * Displays coin categories with market data
 */
export const CATEGORY_LISTING_HEADERS: ITableHeader[] = [
  { id: 'category_name', label: 'CATEGORY', width: '20%', isSortable: false },
  { id: 'top_coins', label: 'TOP COINS', width: '15%', isSortable: false },
  { id: 'market_cap', label: 'MARKET CAP', width: '20%', isSortable: false },
  { id: 'market_cap_change', label: '24H CHANGE', width: '15%', isSortable: false },
  { id: 'volume_24h', label: 'VOLUME (24H)', width: '15%', isSortable: false },
];

/**
 * Headers for the Token Explorer table
 */
export const YLDZS_TOKEN_LISTING_HEADERS: ITableHeader[] = [
  { id: 'name', label: 'NAME', width: '15%', isSortable: false },
  { id: 'price', label: 'PRICE', width: '15%', isSortable: false },
  { id: 'current_apy', label: 'CURRENT APY', width: '15%', isSortable: false },
  { id: 'marketCap', label: 'MARKET CAP', width: '20%', isSortable: false },
];
