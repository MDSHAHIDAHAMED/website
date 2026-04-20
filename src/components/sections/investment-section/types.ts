/**
 * Investment Section Types
 * ========================
 * 
 * Shared type definitions for investment section components
 */

export type TabType = 'buy' | 'sell';

export interface InvestmentDetails {
  youReceive: string;
  fixedApy: string;
  lockup: string;
  minInvestment: string;
  fee: string;
}

export interface HoldingsData {
  tokenBalance: string;
  btcEarnings: string;
  usdValue: string;
}

