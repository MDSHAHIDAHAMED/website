/**
 * YLDZ Token Static Data Constants
 * ==================================
 * Static data for the YLDZ token page, structured to match CoinGecko API format
 * with additional YLDZ-specific fields for yield details and token information.
 *
 * @module constants/yldzs-token
 */

// =============================================================================
// Types
// =============================================================================

/**
 * Token detail metric item for display
 */
export interface TokenDetailMetric {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Formatted value */
  value: string;
  /** Percentage change (optional) */
  change?: number;
  /** Tooltip description */
  tooltip: string;
  /** Whether to show yield icon */
  isYield?: boolean;
}

/**
 * Market stats for the header section (Liquidity, Volume, Market Cap, Yield)
 */
export interface MarketStatMetric {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Formatted value */
  value: string;
  /** Percentage change (optional) */
  change?: number;
  /** Tooltip description */
  tooltip: string;
  /** Whether to show yield/lightning icon */
  isYield?: boolean;
}

// =============================================================================
// Static YLDZ Token Data (CoinGecko-like format)
// =============================================================================

/**
 * YLDZ Token static coin detail data
 * Structured to match CoinGecko API response with YLDZ-specific additions
 *
 * YLDZ STO is an Ethereum-based DeFi protocol that enables stablecoin holders
 * to earn WBTC-denominated yield through a transparent and secure platform.
 */
export const YLDZS_COIN_DETAIL = {
  id: 'yieldz',
  symbol: 'YLDZ',
  name: 'YLDZ Token',
  web_slug: 'yieldz',
  asset_platform_id: 'ethereum',
  platforms: {
    ethereum: 'native',
  },

  description: {
    en: 'Introducing YieldBTC, an innovative token that transforms the way you invest in cryptocurrency. This groundbreaking investment opportunity is meticulously crafted to provide you with steady returns, leveraging the dynamic performance of Bitcoin. With YieldBTC, you can enjoy the benefits of a diversified portfolio.',
  },

  categories: [
    'DeFi Protocol',
    'Yield-bearing Assets',
    'WBTC Yield',
    'Stablecoin Deposits',
    'Ethereum Ecosystem',
    'Security Token Offering (STO)',
  ],

  links: {
    homepage: ['https://uat-app.yieldz.net'],
    whitepaper: 'https://yieldz.net/whitepaper.pdf',
    blockchain_site: ['https://etherscan.io'],
    twitter_screen_name: 'yieldzofficial',
    telegram_channel_identifier: 'yieldz',
    github: [],
  },

  image: {
    small: '/assets/logo-emblem.png',
    large: '/assets/logo-emblem.png',
    thumb: '/assets/logo-emblem.png',
  },

  market_data: {
    current_price: {
      usd: 1,
    },

    apy: {
      fixed: 15,
      variable: null,
    },

    market_cap: {
      usd: 32160000,
    },

    fully_diluted_valuation: {
      usd: 32160000,
    },

    total_volume: {
      usd: 32160000,
    },

    price_change_percentage_24h: 3,
    price_change_percentage_7d: 0,
    price_change_percentage_30d: 0,
    market_cap_change_percentage_24h: 0.85,

    circulating_supply: 12500000,
    total_supply: 12500000,
    max_supply: 12500000,
  },

  yield_details: {
    underlying_asset: 'WBTC',
    yield_source: 'WBTC-denominated yield distribution',
    yield_distribution: 'Periodic, pro-rata basis',
    oracle_verified: true,
    lockup_period_months: 12,
    minting_ratio: '1:1 stablecoin-to-YLDZ',
    accepted_currencies: ['USDC', 'USDT'],
    withdrawal_type: 'Trustless via smart contracts',
    fees: {
      deposit: 0,
      withdrawal: 0,
    },
  },

  compliance: {
    kyc_required: true,
    aml_compliant: true,
    wallet_connection: true,
  },

  governance: {
    dao_planned: true,
    governance_token: 'YLDZ',
  },

  liquidity_stats: {
    total_liquidity_usd: 32160000,
    liquidity_change_24h: 0.85,
    volume_24h_usd: 32160000,
    volume_change_24h: 90.22,
  },

  mining_stats: {
    cost_to_produce_btc: 32160,
    cost_change_24h: 90.22,
    fleet_avg_th_s: 860,
    fleet_change_24h: 90.22,
    btc_yield_apy: 42.85,
  },

  investor_assets: {
    pitch_deck_url: 'https://yieldz.net/investor-deck.pdf',
    team_video_url: 'https://yieldz.net/team-video.mp4',
  },

  status: {
    tradeable: true,
    buy_enabled: true,
    sell_enabled: true,
  },

  last_updated: '2026-01-05T06:00:00Z',
} as const;

// =============================================================================
// Market Stats (Header Section - Liquidity, Volume, Market Cap, Yield)
// =============================================================================

/**
 * Market stats displayed in the header/chart section
 * Shows: Liquidity, 24H Volume, Market Cap, Yield
 */
export const YLDZS_MARKET_STATS: MarketStatMetric[] = [
  {
    id: 'liquidity',
    label: 'LIQUIDITY',
    value: '$32.16M',
    change: 0.85,
    tooltip: 'Total stablecoin deposits in the YLDZ protocol',
  },
  {
    id: 'volume_24h',
    label: '24H VOLUME',
    value: '$32.16M',
    change: 90.22,
    tooltip: 'Total trading volume in the last 24 hours',
  },
  {
    id: 'market_cap',
    label: 'MARKET CAP',
    value: '12.5M',
    tooltip: 'Total value of circulating YLDZ tokens (1:1 with deposits)',
  },
  {
    id: 'yield',
    label: 'YIELD',
    value: '15.00%',
    tooltip: 'Oracle-verified WBTC yield distributed pro-rata to YLDZ holders',
    isYield: true,
  },
];

// =============================================================================
// Token Details Section (Bottom Grid)
// =============================================================================

/**
 * Token details displayed in the bottom grid section
 * First row: Cost to Produce 1 BTC, Fleet Avg TH/s, BTC Yield APY
 * Second row: Availability, Lockup, Underlying Asset
 * Third row: Min. Investment, Requirements, Available to Deposit
 */
export const YLDZS_TOKEN_DETAILS: TokenDetailMetric[] = [
  // Row 1: Mining/Production Stats
  {
    id: 'cost_btc',
    label: 'COST TO PRODUCE 1 BTC',
    value: '$32,160',
    change: 90.22,
    tooltip: 'Current cost to produce one Bitcoin through mining operations',
  },
  {
    id: 'fleet_th',
    label: 'FLEET AVG TH/s',
    value: '860 TH/s',
    change: 90.22,
    tooltip: 'Average hashrate of the mining fleet in Terahash per second',
  },
  {
    id: 'btc_apy',
    label: 'BTC YIELD APY',
    value: '42.85%',
    tooltip: 'Annual percentage yield on WBTC yield distribution',
  },

  // Row 2: Investment Parameters
  {
    id: 'availability',
    label: 'AVAILABILITY',
    value: 'Instant',
    tooltip: 'YLDZ tokens are minted instantly upon stablecoin deposit',
  },
  {
    id: 'lockup',
    label: 'LOCKUP',
    value: '12 Months',
    tooltip: 'Required holding period before withdrawal via smart contracts',
  },
  {
    id: 'underlying',
    label: 'UNDERLYING ASSET',
    value: 'Bitcoin',
    tooltip: 'Yield is distributed periodically in WBTC on a pro-rata basis',

  },

  // Row 3: Investment Requirements
  {
    id: 'min_investment',
    label: 'MIN. INVESTMENT',
    value: '500.00 USDC',
    tooltip: 'Minimum investment amount required',
  },
  {
    id: 'requirements',
    label: 'REQUIREMENTS',
    value: 'ID Verification',
    tooltip: 'KYC verification, Networth accreditation, and document signing requirements for investment',
  },
  {
    id: 'deposit_currencies',
    label: 'AVAILABLE TO DEPOSIT',
    value: 'USDC, USDT',
    tooltip: 'Supported stablecoins for deposit and YLDZ minting',
  },
];

// =============================================================================
// Static Chart Data (Sample price history)
// =============================================================================

/**
 * Generate static chart data for YLDZ
 * Since it's a $1 peg token, prices are relatively stable around $1.00-$1.10
 */
export function generateYLDZSChartData(days: number): Array<[number, number]> {
  const now = Date.now();
  const dataPoints: Array<[number, number]> = [];
  const basePrice = 1;

  // Generate hourly data points for shorter periods, daily for longer
  const interval = days <= 7 ? 3600000 : 86400000; // 1 hour or 1 day in ms
  const pointCount = days <= 7 ? days * 24 : days;

  for (let i = pointCount; i >= 0; i--) {
    const timestamp = now - i * interval;
    // Small random variation around $1.00-$1.10 to simulate stable peg
    // SAFE: Math.random() is used only for cosmetic UI chart visualization (demo data).
    // No security-sensitive operations - purely for simulating realistic price fluctuations.
    const variation = Math.sin(i * 0.1) * 0.03 + Math.random() * 0.02; // NOSONAR
    const price = basePrice + 0.05 + variation; // Ranges roughly $1.02 to $1.10
    dataPoints.push([timestamp, Math.round(price * 10000) / 10000]);
  }

  return dataPoints;
}

/**
 * Static chart data structure matching CoinGecko market chart format
 */
export const YLDZS_CHART_DATA = {
  prices: generateYLDZSChartData(365),
  market_caps: [] as Array<[number, number]>,
  total_volumes: [] as Array<[number, number]>,
};

// =============================================================================
// Yield Chart Data (Historical yield percentage)
// =============================================================================

// Note: YIELD_CHART_TIME_PERIODS is now exported from @/lib/chart-utils.tsx

/**
 * Current yield value displayed in the chart header
 */
export const YLDZS_CURRENT_YIELD = {
  value: 15,
  formatted: '15.00%',
  label: 'YIELD',
};

/**
 * Generate static yield chart data for YLDZ
 * Yield is relatively stable around 12.50% with small variations
 *
 * @param days - Number of days of data to generate
 * @returns Array of [timestamp, yieldPercentage] tuples
 */
export function generateYLDZSYieldChartData(days: number): Array<[number, number]> {
  const now = Date.now();
  const dataPoints: Array<[number, number]> = [];
  const baseYield = 15; // Base yield of 15.00%

  // Generate data points based on period
  // For shorter periods, use more frequent data points
  let interval: number;
  let pointCount: number;

  if (days <= 1) {
    // 1D: hourly data (24 points)
    interval = 3600000; // 1 hour
    pointCount = 24;
  } else if (days <= 7) {
    // 7D: every 4 hours (42 points)
    interval = 4 * 3600000;
    pointCount = Math.ceil((days * 24) / 4);
  } else if (days <= 30) {
    // 30D: daily data (30 points)
    interval = 86400000; // 1 day
    pointCount = days;
  } else if (days <= 90) {
    // 3M: every 2 days (45 points)
    interval = 2 * 86400000;
    pointCount = Math.ceil(days / 2);
  } else if (days <= 180) {
    // 6M: every 3 days (60 points)
    interval = 3 * 86400000;
    pointCount = Math.ceil(days / 3);
  } else {
    // ALL TIME (365+): weekly data (52 points)
    interval = 7 * 86400000;
    pointCount = Math.ceil(days / 7);
  }

  for (let i = pointCount; i >= 0; i--) {
    const timestamp = now - i * interval;
    // Small random variation around 15.00% (±0.3%) to simulate stable yield
    // Using sine wave for smooth variation + small random noise
    // SAFE: Math.random() is used only for cosmetic UI chart visualization (demo data).
    // No security-sensitive operations - purely for simulating realistic yield fluctuations.
    const sineVariation = Math.sin(i * 0.15) * 0.2;
    const randomNoise = (Math.random() - 0.5) * 0.15; // NOSONAR
    const yieldValue = baseYield + sineVariation + randomNoise;
    // Round to 2 decimal places and clamp between 14.5% and 15.5%
    const clampedYield = Math.max(14.5, Math.min(15.5, yieldValue));
    dataPoints.push([timestamp, Math.round(clampedYield * 100) / 100]);
  }

  return dataPoints;
}

// Note: YieldChartDataPoint interface is now exported from @/lib/chart-utils.tsx

/**
 * Yield chart configuration
 */
export const YLDZS_YIELD_CHART_CONFIG = {
  /** Y-axis domain [min, max] */
  yAxisDomain: [0, 20] as [number, number],
  /** Y-axis ticks */
  yAxisTicks: [0, 5, 10, 15, 20],
  /** Chart height in pixels */
  chartHeight: 300,
  /** Stroke width */
  strokeWidth: 4,
  /** Chart colors - Yellow theme */
  colors: {
    /** Area fill color (Yellow with 10% opacity) */
    fill: 'rgba(255, 247, 25, 0.1)',
    /** Line/stroke color (Yellow/500) */
    stroke: 'rgba(255, 247, 25, 1)',
    /** Dot color (Yellow/500) */
    dot: '#FFF719',
    /** Axis text color (neutral/300) */
    axis: '#A7A7A7',
  },
};

// =============================================================================
// Investor Pitch Deck Section
// =============================================================================

export const YLDZS_INVESTOR_SECTION = {
  title: 'Investor pitch deck',
  description:
    'Learn how YLDZ STO enables stablecoin holders to earn WBTC-denominated yield through our transparent Ethereum-based DeFi protocol. Explore our oracle-verified yield distribution, KYC/AML compliance, and planned DAO governance.',
  pitchDeckUrl: 'https://yieldz.net/investor-deck.pdf',
  teamVideoUrl: 'https://yieldz.net/team-video.mp4',
};

// =============================================================================
// Video Content Cards
// =============================================================================

/**
 * Video content cards for the YLDZ token page
 * Used in the two-card section below market details
 */
export const YLDZS_VIDEO_CARDS = [
  {
    id: 'ceo_highlight',
    title: 'CEO & Team Highlight Video',
    subtitle: 'A Team Built For Success',
    description:
      'Learn how Yieldz Holdings is transforming the financial world with a Bitcoin Treasury Company delivering Bitcoin Yield.',
    overlayImageSrc: '/assets/persons/yldz-person.png',
    playUrl: 'https://yieldz.net/ceo-video.mp4',
    iconSrc: '',
  },
  {
    id: 'platform_demo',
    title: 'CEO & Team Highlight Video',
    subtitle: 'A Team Built For Success',
    description:
      'Learn how Yieldz Holdings is transforming the financial world with a Bitcoin Treasury Company delivering Bitcoin Yield.',
    overlayImageSrc: '/assets/persons/yldz-person.png',
    playUrl: 'https://yieldz.net/platform-demo.mp4',
    iconSrc: '',
  },
] as const;

// =============================================================================
// Key Features for Display
// =============================================================================

export const YLDZS_KEY_FEATURES = [
  {
    id: 'stable_deposits',
    title: 'Stable Deposits',
    description: 'Deposit USDC or USDT and receive YLDZ tokens at a fixed 1:1 ratio',
    icon: 'deposit',
  },
  {
    id: 'wbtc_yield',
    title: 'WBTC Yield',
    description: 'Earn oracle-verified yield distributed periodically in WBTC',
    icon: 'yield',
  },
  {
    id: 'trustless_withdrawal',
    title: 'Trustless Withdrawal',
    description: 'Withdraw after 12-month lockup via smart contracts without intermediaries',
    icon: 'withdrawal',
  },
  {
    id: 'kyc_compliant',
    title: 'KYC/AML Compliant',
    description: 'Secure onboarding with wallet connection and identity verification',
    icon: 'security',
  },
  {
    id: 'user_dashboard',
    title: 'User Dashboard',
    description: 'Comprehensive interface for portfolio overview, deposits, withdrawals, and yield tracking',
    icon: 'dashboard',
  },
  {
    id: 'dao_governance',
    title: 'DAO Governance',
    description: 'Planned decentralized governance through YLDZ token holders',
    icon: 'governance',
  },
] as const;

