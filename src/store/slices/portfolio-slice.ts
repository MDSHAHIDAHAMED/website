/**
 * Portfolio Slice
 * ===============
 *
 * Redux slice for portfolio state management.
 * Handles cash flow overview and portfolio breakdown data.
 *
 * @module store/slices/portfolio-slice
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { CashFlowDataPoint, PortfolioBreakdownItem } from '@/services/portfolio';
import {
  fetchCashFlowOverviewThunk,
  fetchHoldingsChartThunk,
  fetchPortfolioBreakdownThunk,
} from '@/store/thunks/portfolio-thunk';
import { initialPortfolioState } from '@/store/types/portfolio-types';

// =============================================================================
// Slice
// =============================================================================

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: initialPortfolioState,
  reducers: {
    /**
     * Clear cash flow data
     */
    clearCashFlowData: (state) => {
      state.cashFlowData = [];
      state.cashFlowError = null;
    },
    /**
     * Clear breakdown data
     */
    clearBreakdownData: (state) => {
      state.breakdownData = [];
      state.breakdownError = null;
    },
    /**
     * Clear holdings chart data
     */
    clearHoldingsChartData: (state) => {
      state.holdingsChartData = [];
      state.holdingsChartType = null;
      state.holdingsChartError = null;
    },
    /**
     * Clear all portfolio data
     */
    clearPortfolioData: (state) => {
      state.cashFlowData = [];
      state.cashFlowError = null;
      state.breakdownData = [];
      state.breakdownError = null;
      state.holdingsChartData = [];
      state.holdingsChartType = null;
      state.holdingsChartError = null;
    },
  },
  extraReducers: (builder) => {
    // ==========================================================================
    // Cash Flow Overview
    // ==========================================================================
    builder
      .addCase(fetchCashFlowOverviewThunk.pending, (state) => {
        state.isCashFlowLoading = true;
        state.cashFlowError = null;
      })
      .addCase(
        fetchCashFlowOverviewThunk.fulfilled,
        (state, action: PayloadAction<CashFlowDataPoint[]>) => {
          state.isCashFlowLoading = false;
          state.cashFlowData = action.payload;
          state.cashFlowError = null;
        }
      )
      .addCase(fetchCashFlowOverviewThunk.rejected, (state, action) => {
        state.isCashFlowLoading = false;
        state.cashFlowError = action.payload ?? 'Failed to fetch cash flow data';
      });

    // ==========================================================================
    // Portfolio Breakdown
    // ==========================================================================
    builder
      .addCase(fetchPortfolioBreakdownThunk.pending, (state) => {
        state.isBreakdownLoading = true;
        state.breakdownError = null;
      })
      .addCase(
        fetchPortfolioBreakdownThunk.fulfilled,
        (state, action: PayloadAction<PortfolioBreakdownItem[]>) => {
          state.isBreakdownLoading = false;
          state.breakdownData = action.payload;
          state.breakdownError = null;
        }
      )
      .addCase(fetchPortfolioBreakdownThunk.rejected, (state, action) => {
        state.isBreakdownLoading = false;
        state.breakdownError = action.payload ?? 'Failed to fetch portfolio breakdown';
      });

    // ==========================================================================
    // Holdings Chart
    // ==========================================================================
    builder
      .addCase(fetchHoldingsChartThunk.pending, (state) => {
        state.isHoldingsChartLoading = true;
        state.holdingsChartError = null;
      })
      .addCase(fetchHoldingsChartThunk.fulfilled, (state, action) => {
        state.isHoldingsChartLoading = false;
        state.holdingsChartData = action.payload.chartData;
        state.holdingsChartType = action.payload.chartType;
        state.holdingsChartError = null;
      })
      .addCase(fetchHoldingsChartThunk.rejected, (state, action) => {
        state.isHoldingsChartLoading = false;
        state.holdingsChartError = action.payload ?? 'Failed to fetch holdings chart data';
      });
  },
});

// =============================================================================
// Actions
// =============================================================================

export const {
  clearCashFlowData,
  clearBreakdownData,
  clearHoldingsChartData,
  clearPortfolioData,
} = portfolioSlice.actions;

// =============================================================================
// Reducer Export
// =============================================================================

export default portfolioSlice.reducer;

