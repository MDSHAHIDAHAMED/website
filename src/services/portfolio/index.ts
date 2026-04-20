/**
 * Portfolio Service
 * ================
 * 
 * Service functions for handling portfolio operations.
 * 
 * Features:
 * - Get portfolio assets summary
 * - Handle portfolio API responses
 * ==================
 *
 * Service for portfolio-related API calls.
 * Handles cash flow overview and portfolio breakdown endpoints.
 *
 * @module services/portfolio
 */

import { getMethod } from '@/services/api';
import endPoints from '@/services/urls';

// =============================================================================
// Types
// =============================================================================

/**
 * Portfolio assets summary data from API response
 */
export interface PortfolioAssetsSummaryData {
  totalDeposits: number;
  totalWithdrawals: number;
  remainingDeposits: number;
  availableToWithdraw: number;
  yldzTokenHoldings: number;
  totalYieldEarned: number;
  availableYield: number;
  totalInterestReceived: number;
  averageYieldEarned:number;
  totalYieldEarnedInUSD:number;
}

/**
 * Portfolio assets summary API response
 */
export interface PortfolioAssetsSummaryResponse {
  status: 'success' | 'error';
  data: PortfolioAssetsSummaryData;
  message: string;
}

// =============================================================================
// Service Functions
// =============================================================================

/**
 * Get portfolio assets summary
 * 
 * Fetches portfolio summary data including total deposits, withdrawals,
 * yield earned, and available amounts.
 * 
 * @returns Promise with portfolio assets summary response
 * @throws Error if API call fails
 */
export async function getPortfolioAssetsSummary(): Promise<PortfolioAssetsSummaryResponse> {
  return getMethod<PortfolioAssetsSummaryResponse>(endPoints.PORTFOLIO_ASSETS_SUMMARY);
}

/**
 * Cash flow data point for a single month
 */
export interface CashFlowDataPoint {
  /** Month name (e.g., 'JAN', 'FEB') */
  month: string;
  /** Total inflows for the month */
  inflows: number;
  /** Total outflows for the month */
  outflows: number;
}

/**
 * Portfolio breakdown data point
 */
export interface PortfolioBreakdownItem {
  /** Category name */
  name: string;
  /** Yield percentage */
  Yield: number;
  /** Deposited percentage */
  Deposited: number;
  /** YLDZ Token percentage */
  yldzToken: number;
}

/**
 * Cash flow overview API response
 */
export interface CashFlowOverviewResponse {
  status: string;
  data: CashFlowDataPoint[];
  message: string;
  code: number;
}

/**
 * Portfolio breakdown API response
 */
export interface PortfolioBreakdownResponse {
  status: string;
  data: PortfolioBreakdownItem[];
  message: string;
  code: number;
}

/**
 * Parameters for cash flow overview request
 */
export interface CashFlowOverviewParams {
  /** Start date in YYYY-MM-DD format */
  startDate?: string;
  /** End date in YYYY-MM-DD format */
  endDate?: string;
}

/**
 * Holdings chart data point from API
 */
export interface HoldingsChartDataPoint {
  /** UNIX timestamp in seconds */
  date: number;
  /** Balance as string (high precision) */
  balance: string;
}

/**
 * Holdings chart API response
 */
export interface HoldingsChartResponse {
  status: 'success' | 'error';
  data: {
    /** Selected chart type (1D, 7D, 30D, 3M, 6M, 1Y) */
    chartType: string;
    /** Array of chart data points */
    chartData: HoldingsChartDataPoint[];
  };
  message: string;
}

/**
 * Parameters for holdings chart request
 */
export interface HoldingsChartParams {
  /** Chart type: 1D, 7D, 30D, 3M, 6M, 1Y, ALL */
  chartType: string;
  /** Token filter: BTC or USDC (optional) */
  token?: string;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Get cash flow overview for a date range
 *
 * @param params - Start and end date for the query
 * @returns Promise with cash flow data array
 */
export async function getCashFlowOverview(
  params?: CashFlowOverviewParams
): Promise<CashFlowOverviewResponse> {
  const queryString = `?startDate=${params?.startDate ?? ''}&endDate=${params?.endDate ?? ''}`;
  return getMethod<CashFlowOverviewResponse>(
    `${endPoints.PORTFOLIO_CASHFLOW_OVERVIEW}${queryString}`
  );
}

/**
 * Get portfolio breakdown
 *
 * @returns Promise with portfolio breakdown data array
 */
export async function getPortfolioBreakdown(): Promise<PortfolioBreakdownResponse> {
  return getMethod<PortfolioBreakdownResponse>(endPoints.PORTFOLIO_BREAKDOWN);
}

/**
 * Get holdings chart data for a specified time period
 *
 * @param params - Chart type parameter (1D, 7D, 30D, 3M, 6M, 1Y)
 * @returns Promise with holdings chart response
 */
export async function getHoldingsChart(
  params: HoldingsChartParams
): Promise<HoldingsChartResponse> {
  const queryParams = new URLSearchParams();
  queryParams.set('chartType', params.chartType);
  if (params.token) {
    queryParams.set('token', params.token);
  }
  const queryString = `?${queryParams.toString()}`;
  return getMethod<HoldingsChartResponse>(`${endPoints.PORTFOLIO_HOLDINGS_CHART}${queryString}`);
}

