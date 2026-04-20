const endPoints = {
  FETCH_LIST: 'list',
  ME: '/web/me',
  // AUTH ENDPOINTS
  SIGN_UP_START: '/web/otp/sign-up/start',
  SIGN_UP_FINISH: '/web/otp/verify',

  TWO_FACTOR_AUTH_SESSION: '/web/otp/add/start',
  TWO_FACTOR_AUTH__VERIFY_CODE: '/web/otp/verify',
  // PASSKEY ENDPOINTS
  PASSKEY_LOGIN_START: '/web/passkeys/login/start',
  PASSKEY_LOGIN_FINISH: '/web/passkeys/login/finish',
  PASSKEY_REGISTER_START: '/web/passkeys/register/start',
  PASSKEY_REGISTER_FINISH: '/web/passkeys/register/finish',
  /** Revoke passkey - PATCH /me/passkeys/{passkey_id}/revoke */
  REVOKE_PASSKEY: (passkeyId: string) => `/web/me/passkeys/${passkeyId}/revoke`,

  // LOGIN WITH 2FA ENDPOINTS
  TWO_FA_LOGIN_START: '/web/otp/send',
  TWO_FA_LOGIN_FINISH: '/web/otp/verify',

  // KYC ENDPOINTS
  KYC_INQUIRY: '/kyc/inquiry',
  KYC_STATUS: '/users/status', // Check KYC completion status

  // SESSION MANAGEMENT ENDPOINTS
  SESSION_RENEW: '/web/sessions/refresh',
  SIGN_OUT: '/web/sessions/logout', // Deprecated: Use SESSION_LOGOUT instead

  // PROFILE ENDPOINTS
  WALLET_CONNECT: '/users/wallet-address',

  // NOTIFICATIONS
  NOTIFICATIONS: '/notifications',

  // NETWORTH ACCREDITATION ENDPOINTS
  ACCREDITATION_CREATE_ACCOUNT: '/accreditation/start', // Step 1: Create party and account
  ACCREDITATION_UPLOAD_DOCUMENT: '/accreditation/request', // Step 2: Upload verification document
  ACCREDITATION_GET_ACCOUNT: '/accreditation/account', // Get account information

  // DOCUSIGN ENDPOINTS
  DOCUSIGN_START: '/document/sign/start', // Create trade and prepare subscription document
  DOCUSIGN_GET_URL: '/document/sign/url', // Get DocuSign signing URL

  // DEPOSIT ENDPOINTS
  DEPOSITS: '/deposits', // Create deposit/investment
  DEPOSIT_CONFIG: '/deposit/config', // Get deposit configuration
  UPDATE_DEPOSIT: (id: number) => `/deposits/${id}`, // Update deposit transaction

  // ONRAMP TRANSACTION ENDPOINTS
  ONRAMP_INITIATE: '/transactions/onramp/initiate', // Initiate onramp transaction

  // TRANSACTION ENDPOINTS
  TRANSACTIONS_USER: '/transactions/user', // Get user transactions with filters
  TRANSACTIONS: '/transactions', // Create transaction (for withdrawal tracking)
  UPDATE_TRANSACTION: (id: number) => `/transactions/${id}`, // Update transaction (PATCH)

  // PORTFOLIO ENDPOINTS
  PORTFOLIO_ASSETS_SUMMARY: '/portfolio/assets-summary', // Get portfolio assets summary
  PORTFOLIO_CASHFLOW_OVERVIEW: '/portfolio/cashflow', // Get cash flow for date range
  PORTFOLIO_BREAKDOWN: '/portfolio/breakdown', // Get portfolio breakdown
  PORTFOLIO_HOLDINGS_CHART: '/yield-distributions/holdings-chart', // Get holdings chart data

  // =============================================================================
  // COINGECKO ENDPOINTS (External API)
  // =============================================================================

  /** CoinGecko: Get coins with market data */
  COINGECKO_COINS_MARKETS: '/coins/markets',
  /** CoinGecko: Get coin detail by ID */
  COINGECKO_COIN_DETAIL: (id: string) => `/coins/${id}`,
  /** CoinGecko: Get historical chart data by ID */
  COINGECKO_COIN_MARKET_CHART: (id: string) => `/coins/${id}/market_chart`,
  /** CoinGecko: Get historical chart data within time range */
  COINGECKO_COIN_MARKET_CHART_RANGE: (id: string) => `/coins/${id}/market_chart/range`,
  /** CoinGecko: Get OHLC data by ID */
  COINGECKO_COIN_OHLC: (id: string) => `/coins/${id}/ohlc`,
  /** CoinGecko: Get categories list (ID map) */
  COINGECKO_CATEGORIES_LIST: '/coins/categories/list',
  /** CoinGecko: Get categories with market data */
  COINGECKO_CATEGORIES: '/coins/categories',
  /** App URLs */
  APP_URLS: '/app-url-integration',
};

export default endPoints;
