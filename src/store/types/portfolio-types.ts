/**
 * Portfolio Redux Types
 * =====================
 *
 * Type definitions for portfolio state management.
 *
 * @module store/types/portfolio-types
 */

import type {
  CashFlowDataPoint,
  HoldingsChartDataPoint,
  PortfolioBreakdownItem,
} from '@/services/portfolio';

// =============================================================================
// State Types
// =============================================================================

/**
 * Portfolio Redux state interface
 */
export interface PortfolioState {
  /** Cash flow data array */
  cashFlowData: CashFlowDataPoint[];
  /** Whether cash flow data is loading */
  isCashFlowLoading: boolean;
  /** Cash flow error message */
  cashFlowError: string | null;

  /** Portfolio breakdown data array */
  breakdownData: PortfolioBreakdownItem[];
  /** Whether breakdown data is loading */
  isBreakdownLoading: boolean;
  /** Breakdown error message */
  breakdownError: string | null;

  /** Holdings chart data array */
  holdingsChartData: HoldingsChartDataPoint[];
  /** Currently selected chart type for holdings */
  holdingsChartType: string | null;
  /** Whether holdings chart data is loading */
  isHoldingsChartLoading: boolean;
  /** Holdings chart error message */
  holdingsChartError: string | null;
}

/**
 * Initial state for portfolio slice
 */
export const initialPortfolioState: PortfolioState = {
  cashFlowData: [],
  isCashFlowLoading: false,
  cashFlowError: null,

  breakdownData: [],
  isBreakdownLoading: false,
  breakdownError: null,

  holdingsChartData: [],
  holdingsChartType: null,
  isHoldingsChartLoading: false,
  holdingsChartError: null,
};

