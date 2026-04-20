// =============================================================================
// Yield Comparison Section Constants
// =============================================================================

export interface ChartDataItem {
  name: string;
  debasement: number;
  cagr: number;
  capital: number;
  hasReturnOfCapital?: boolean;
}

export const CHART_DATA: ChartDataItem[] = [
  { name: '3.5% - US\nTREASURY\nYIELD\n$273,500', debasement: 8, cagr: 0, capital: 0 },
  { name: '4% - MONEY\nMARKET\nYIELD\n$284,000', debasement: 12, cagr: 0, capital: 0 },
  { name: '4.5% - STAKING\nYIELD\nDIGITAL ASSET\n$294,000', debasement: 18, cagr: 0, capital: 0 },
  { name: '6% - STOCK\nDIVIDEND\nYIELD\n$326,000', debasement: 22, cagr: 0, capital: 0 },
  { name: '10% - STRATEGY\nSTRC\nYIELD\n$410,000', debasement: 25, cagr: 15, capital: 0 },
  { name: '15% - YLDZ IF\nRETURNED\nIN DOLLARS\n$515,000', debasement: 50, cagr: 0, capital: 0 },
  {
    name: 'BTC YIELD\nWITH CAGR\nASSUMPTIONS\n$2,261,480',
    debasement: 60,
    cagr: 30,
    capital: 10,
    hasReturnOfCapital: true,
  },
];

export const TEXT_ROW_1 = ['INCOME', '&', 'GROWTH', 'IN', 'ONE'];
export const TEXT_ROW_2 = ['ASSET', 'YIELD', 'WITH', 'A', 'CAGR'];
