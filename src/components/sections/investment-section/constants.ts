/**
 * Investment Section Constants
 * ============================
 * 
 * Shared constants for investment section components
 */

import type { HoldingsData, InvestmentDetails } from './types';

/** Default investment details */
export const DEFAULT_INVESTMENT_DETAILS: InvestmentDetails = {
  youReceive: '500.00 YIELDZ',
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

