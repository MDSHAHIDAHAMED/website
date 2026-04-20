/**
 * Portfolio Mock Data
 * ====================
 * Mock data for portfolio-related components.
 *
 * @module store/mock/portfolio-mock
 */

// =============================================================================
// Types
// =============================================================================

export interface CashFlowDataPoint {
  /** Month name (e.g., 'JAN', 'FEB') */
  month: string;
  /** Inflow value */
  inflows: number;
  /** Outflow value */
  outflows: number;
}

export interface InvestmentItem {
  /** Unique identifier */
  id: string;
  /** Token symbol */
  tokenSymbol: string;
  /** Token icon URL */
  tokenIcon: string;
  /** Investment amount in USD */
  investmentAmount: string;
  /** Token amount purchased */
  tokenAmount: string;
  /** Token In symbol (for investment amount) */
  tokenIn?: string;
  /** Token Out symbol (for token amount) */
  tokenOut?: string;
  /** Claimable yield value */
  claimableYield: string;
  /** Remaining lockup time */
  remainingLockup: {
    months: number;
    days: number;
    hours: number;
  };
  /** Lockup progress percentage (0-100) */
  lockupProgress: number;
  /** Created at */
  createdAt: string;
}

export interface TransactionItem {
  /** Unique identifier */
  id: string;
  /** Token symbol */
  tokenSymbol: string;
  /** Token icon URL */
  tokenIcon: string;
  tokenIn: string;
  tokenOut: string;
  /** Status */
  status: string;
  /** Date */
  date: string;
  /** Asset */
  asset: string;
  /** Amount */
  amount: string;
  /** Type */
  type: string;
}

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
// =============================================================================
// Constants - Investment Table Headers (ITableHeader compatible)
// =============================================================================

export const INVESTMENT_TABLE_HEADERS = [
  { id: 'token', label: 'TOKEN', width: '20%', isSortable: false },
  { id: 'date', label: 'DATE', width: '20%', isSortable: false },
  { id: 'investmentAmount', label: 'INVESTMENT AMOUNT', width: '20%', isSortable: false },
  { id: 'tokenAmount', label: 'TOKEN AMOUNT', width: '20%', isSortable: false },
  { id: 'remainingLockup', label: 'REMAINING LOCKUP', width: '20%', isSortable: false },
];


// =============================================================================
// Constants - Investment Table Headers (ITableHeader compatible)
// =============================================================================

export const TRANSACTION_TABLE_HEADERS = [
  { id: 'token', label: 'TOKEN', width: '20%', isSortable: false },
  { id: 'status', label: 'STATUS', width: '20%', isSortable: false },
  { id: 'date', label: 'DATE', width: '20%', isSortable: false },
  { id: 'asset', label: 'ASSET', width: '20%', isSortable: false },
  { id: 'amount', label: 'AMOUNT', width: '20%', isSortable: false },
];
// =============================================================================
// Mock Data
// =============================================================================

/**
 * Cash flow data for bar chart
 * Shows monthly inflows and outflows
 */
export const MOCK_CASH_FLOW_DATA: CashFlowDataPoint[] = [
  { month: 'JAN', inflows: 2800, outflows: 2200 },
  { month: 'FEB', inflows: 3200, outflows: 2600 },
  { month: 'MAR', inflows: 2900, outflows: 3100 },
  { month: 'APR', inflows: 3400, outflows: 2800 },
  { month: 'MAY', inflows: 2600, outflows: 3000 },
  { month: 'JUN', inflows: 3100, outflows: 2400 },
  { month: 'JUL', inflows: 2700, outflows: 2900 },
];

/**
 * Portfolio breakdown data
 * Shows allocation percentages for different categories
 */
export const MOCK_PORTFOLIO_BREAKDOWN_DATA: PortfolioBreakdownItem[] = [
  {
    name: 'Portfolio',
    Yield: 40.25,
    Deposited: 35.5,
    yldzToken: 24.25,
  },
];

/**
 * Mock investment data for My Investments listing
 */
export const MOCK_INVESTMENTS_DATA: InvestmentItem[] = [
  {
    id: 'inv-1',
    tokenSymbol: 'YLZD1',
    tokenIcon: '/assets/icons/yieldz-token.svg',
    tokenIn: 'USDC',
    tokenOut: 'YLZD1',
    investmentAmount: '5000.00',
    tokenAmount: '1250.50',
    claimableYield: '0.005234 BTC',
    remainingLockup: { months: 12, days: 0, hours: 0 },
    createdAt: '2025-01-01',
    lockupProgress: 100,
  },
  {
    id: 'inv-2',
    tokenSymbol: 'YLZD1',
    tokenIcon: '/assets/icons/yieldz-token.svg',
    tokenIn: 'USDC',
    tokenOut: 'YLZD1',
    investmentAmount: '2500.00',
    tokenAmount: '625.25',
    createdAt: '2025-01-01',
    claimableYield: '0.005234 BTC',
    remainingLockup: { months: 9, days: 0, hours: 0 },
    lockupProgress: 75,
  },
  {
    id: 'inv-3',
    tokenSymbol: 'YLZD1',
    tokenIcon: '/assets/icons/yieldz-token.svg',
    tokenIn: 'USDC',
    tokenOut: 'YLZD1',
    investmentAmount: '10000.00',
    tokenAmount: '2500.00',
    createdAt: '2025-01-01',
    claimableYield: '0.005234 BTC',
    remainingLockup: { months: 3, days: 0, hours: 0 },
    lockupProgress: 25,
  },
];

/**
 * Mock investment data for My Investments listing
 */
export const MOCK_TRANSACTIONS_DATA: TransactionItem[] = [
  {
    id: 'tx-1',
    tokenSymbol: 'YLZD1',
    tokenIcon: '/assets/icons/yieldz-token.svg',  
    tokenIn: 'USDC',
    tokenOut: 'YLZD1',
    status: 'PENDING',
    date: '01.10.2025',
    asset: 'YLZD1',
    amount: '0.005234 BTC',
    type: 'BUY',
  },
  {
    id: 'tx-2',
    tokenSymbol: 'YLZD1',
    tokenIcon: '/assets/icons/yieldz-token.svg',
    tokenIn: 'USDC',
    tokenOut: 'YLZD1',
    status: 'SUCCESS',
    date: '01.10.2025',
    asset: 'YLZD1',
    amount: '0.005234 BTC',
    type: 'SELL',
  },
  {
    id: 'tx-3',
    tokenSymbol: 'YLZD1',
    tokenIcon: '/assets/icons/yieldz-token.svg',
    tokenIn: 'USDC',
    tokenOut: 'YLZD1',
    status: 'FAILED',
    date: '01.10.2025',
    asset: 'YLZD1',
    amount: '0.005234 BTC',
    type: 'BUY',
  },
];

/**
 * Get mock cash flow data
 * @returns Array of cash flow data points
 */
export function getMockCashFlowData(): CashFlowDataPoint[] {
  return MOCK_CASH_FLOW_DATA;
}

/**
 * Get mock investments data
 * @returns Array of investment items
 */
export function getMockInvestmentsData(): InvestmentItem[] {
  return MOCK_INVESTMENTS_DATA;
}

/**
 * Get mock transactions data
 * @returns Array of transaction items
 */
export function getMockTransactionsData(): TransactionItem[] {
  return MOCK_TRANSACTIONS_DATA;
}

/**
 * Get mock portfolio breakdown data
 * @returns Array of portfolio breakdown items
 */
export function getMockPortfolioBreakdownData(): PortfolioBreakdownItem[] {
  return MOCK_PORTFOLIO_BREAKDOWN_DATA;
}