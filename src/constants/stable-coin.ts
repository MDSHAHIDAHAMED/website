/**
 * Investment Section Constants
 * ============================
 * 
 * Shared constants for investment section components
 */

import type { HoldingsData, InvestmentDetails } from '../types/stable-coin';

/** Default investment details */
export const DEFAULT_INVESTMENT_DETAILS: InvestmentDetails = {
  youReceive: '500.00 YLDZ',
  fixedApy: '12.50%',
  lockup: '12 months',
  minInvestment: '500.00 USDC',
  fee: '1%',
};

/** Default holdings data */
export const DEFAULT_HOLDINGS_DATA: HoldingsData = {
  tokenBalance: '0.00',
  btcEarnings: '0.00 BTC',
  usdValue: '$0.00',
};

/** Default balance */
export const DEFAULT_BALANCE = '2,500.00';

/** Max character length before truncating balance display */
export const TRUNCATE_BALANCE_MAX_LENGTH = 12;

/** Stable token icon path (e.g. USDC) */
export const STABLE_TOKEN_ICON_PATH = '/assets/icons/USDC.svg';

/** YLDZ emblem icon path */
export const YLDZ_EMBLEM_PATH = '/assets/logo-emblem.png';

/** Icon display size for balance/emblem in px */
export const TOKEN_ICON_SIZE = 16;
export const EMBLEM_ICON_SIZE = 14;

/** EVM contract/address string length: "0x" + 40 hex chars */
export const ETH_ADDRESS_LENGTH = 42;

