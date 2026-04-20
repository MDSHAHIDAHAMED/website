/**
 * Portfolio Thunks
 * ================
 *
 * Async thunks for portfolio-related API calls.
 *
 * @module store/thunks/portfolio-thunk
 */

import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getCashFlowOverview,
  getHoldingsChart,
  getPortfolioBreakdown,
  type CashFlowDataPoint,
  type CashFlowOverviewParams,
  type HoldingsChartDataPoint,
  type HoldingsChartParams,
  type PortfolioBreakdownItem,
} from '@/services/portfolio';
import { handleServiceError } from '@/utils/error-handler';

// =============================================================================
// Thunks
// =============================================================================

/**
 * Fetch Cash Flow Overview Thunk
 * ==============================
 *
 * Fetches cash flow data for the specified date range.
 *
 * @param params - Start and end date for the query
 * @returns Promise<CashFlowDataPoint[]>
 */
export const fetchCashFlowOverviewThunk = createAsyncThunk<
  CashFlowDataPoint[],
  CashFlowOverviewParams,
  { rejectValue: string }
>(
  'portfolio/fetchCashFlowOverview',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getCashFlowOverview(params);

      if (response?.status !== 'success' || !response?.data) {
        throw new Error(response?.message ?? 'Failed to fetch cash flow data');
      }

      return response.data;
    } catch (err) {
      const errorMessage = handleServiceError(err, 'Failed to fetch cash flow data');
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Fetch Portfolio Breakdown Thunk
 * ===============================
 *
 * Fetches portfolio breakdown data showing allocation percentages.
 *
 * @returns Promise<PortfolioBreakdownItem[]>
 */
export const fetchPortfolioBreakdownThunk = createAsyncThunk<
  PortfolioBreakdownItem[],
  void,
  { rejectValue: string }
>(
  'portfolio/fetchPortfolioBreakdown',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPortfolioBreakdown();

      if (response?.status !== 'success' || !response?.data) {
        throw new Error(response?.message ?? 'Failed to fetch portfolio breakdown');
      }

      return response.data;
    } catch (err) {
      const errorMessage = handleServiceError(err, 'Failed to fetch portfolio breakdown');
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Fetch Holdings Chart Thunk
 * ==========================
 *
 * Fetches holdings chart data for the specified time period.
 *
 * @param params - Chart type parameter (1D, 7D, 30D, 3M, 6M, 1Y)
 * @returns Promise with chart data and type
 */
export const fetchHoldingsChartThunk = createAsyncThunk<
  { chartData: HoldingsChartDataPoint[]; chartType: string },
  HoldingsChartParams,
  { rejectValue: string }
>(
  'portfolio/fetchHoldingsChart',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getHoldingsChart(params);

      if (response?.status !== 'success' || !response?.data) {
        throw new Error(response?.message ?? 'Failed to fetch holdings chart data');
      }

      return {
        chartData: response.data.chartData,
        chartType: response.data.chartType,
      };
    } catch (err) {
      const errorMessage = handleServiceError(err, 'Failed to fetch holdings chart data');
      return rejectWithValue(errorMessage);
    }
  }
);

