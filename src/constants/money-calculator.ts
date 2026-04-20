/**
 * Money Calculator Section Constants
 * ===================================
 * Data constants for the money calculator section component
 */

export interface ChartDataItem {
  year: string;
  treasury: number;
  dividend: number;
  growth: number;
  strc: number;
  dollars: number;
  btc: number;
}

export interface LegendItem {
  label: string;
  color: string;
}

export interface AssumptionMetric {
  label: string;
  value: string;
  id: string;
}

export interface CalculationItem {
  title: string;
  value: string;
}

/**
 * Chart data for CAGR calculator
 * Contains 20 years of investment data
 */
export const CHART_DATA: ChartDataItem[] = [
  { year: 'YEAR 1', treasury: 10000, dividend: 5000, growth: 15000, strc: 10000, dollars: 20000, btc: 60000 },
  { year: 'YEAR 2', treasury: 15000, dividend: 8000, growth: 25000, strc: 15000, dollars: 35000, btc: 100000 },
  { year: 'YEAR 3', treasury: 25000, dividend: 12000, growth: 40000, strc: 25000, dollars: 55000, btc: 160000 },
  { year: 'YEAR 4', treasury: 35000, dividend: 18000, growth: 55000, strc: 35000, dollars: 75000, btc: 220000 },
  { year: 'YEAR 5', treasury: 50000, dividend: 25000, growth: 75000, strc: 50000, dollars: 100000, btc: 300000 },
  { year: 'YEAR 6', treasury: 70000, dividend: 35000, growth: 110000, strc: 80000, dollars: 150000, btc: 450000 },
  { year: 'YEAR 7', treasury: 100000, dividend: 50000, growth: 160000, strc: 120000, dollars: 220000, btc: 670000 },
  { year: 'YEAR 8', treasury: 130000, dividend: 65000, growth: 230000, strc: 170000, dollars: 320000, btc: 950000 },
  { year: 'YEAR 9', treasury: 160000, dividend: 80000, growth: 310000, strc: 230000, dollars: 450000, btc: 1300000 },
  { year: 'YEAR 10', treasury: 200000, dividend: 100000, growth: 400000, strc: 300000, dollars: 600000, btc: 1800000 },
  { year: 'YEAR 11', treasury: 250000, dividend: 125000, growth: 500000, strc: 380000, dollars: 750000, btc: 2300000 },
  { year: 'YEAR 12', treasury: 310000, dividend: 155000, growth: 620000, strc: 470000, dollars: 920000, btc: 2900000 },
  { year: 'YEAR 13', treasury: 370000, dividend: 185000, growth: 750000, strc: 570000, dollars: 1100000, btc: 3600000 },
  { year: 'YEAR 14', treasury: 430000, dividend: 215000, growth: 870000, strc: 680000, dollars: 1300000, btc: 4300000 },
  { year: 'YEAR 15', treasury: 500000, dividend: 250000, growth: 1000000, strc: 800000, dollars: 1500000, btc: 5000000 },
  { year: 'YEAR 16', treasury: 580000, dividend: 290000, growth: 1150000, strc: 900000, dollars: 1700000, btc: 5600000 },
  { year: 'YEAR 17', treasury: 670000, dividend: 335000, growth: 1300000, strc: 1000000, dollars: 1900000, btc: 6300000 },
  { year: 'YEAR 18', treasury: 770000, dividend: 385000, growth: 1450000, strc: 1100000, dollars: 2100000, btc: 7000000 },
  { year: 'YEAR 19', treasury: 880000, dividend: 440000, growth: 1600000, strc: 1200000, dollars: 2350000, btc: 7600000 },
  { year: 'YEAR 20', treasury: 1000000, dividend: 500000, growth: 1800000, strc: 1300000, dollars: 2600000, btc: 8300000 },
];

/**
 * Legend items for the chart
 * Defines the labels and colors for each data series
 */
export const LEGEND_ITEMS: LegendItem[] = [
  { label: 'YIELDS IN BTC', color: '#6DF2FE' },
  { label: 'YIELDS IN DOLLARS', color: '#4199A1' },
  { label: 'STRC YIELD', color: '#21565B' },
  { label: 'S&P GROWTH', color: '#0B292C' },
  { label: 'S&P DIVIDEND', color: '#FFFFFF' },
  { label: 'U.S. TREASURY', color: 'rgba(255, 255, 255, 0.2)' },
];

/**
 * Assumptions metrics for the marquee display
 * Historical BTC CAGR data
 */
export const ASSUMPTIONS_METRICS: AssumptionMetric[] = [
  { label: 'LAST 8 YRS.', value: '129%', id: 'last-8-yrs' },
  { label: 'NEXT 4 YEARS', value: '35%', id: 'next-4-years' },
  { label: 'YEARS 5-8', value: '30%', id: 'years-5-8' },
  { label: 'YEARS 9-12', value: '25%', id: 'years-9-12' },
  { label: 'YEARS 13-16', value: '20%', id: 'years-13-16' },
];

/**
 * Calculations card items
 * Investment calculation display data
 */
export const CALCULATIONS_ITEMS: CalculationItem[] = [
  { title: 'INVESTMENT AMOUNT', value: '$100,000' },
  { title: 'YEARS', value: '10' },
  { title: 'YLDZ TOKEN % IN BTC', value: '15.43%' },
  { title: 'YLDZ TOKEN % IN USD', value: '15.43%' },
  { title: 'US TREASURY %', value: '3.48%' },
  { title: 'S&P DIVIDEND %', value: '6.50%' },
  { title: 'S&P GROWTH%', value: '10.00%' },
];
