# 🪙 YLDZ — Ethereum-Based DeFi Yield Protocol

YLDZ is a decentralized finance (DeFi) protocol built on Ethereum that enables stablecoin holders (USDC/USDT) to earn WBTC-denominated yield through a transparent and secure system.

This repository contains the frontend user application developed using **Next.js**, **Redux Toolkit (Thunk)**, and **Material UI**.

---
git push -u origin main

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [How It Works](#-how-it-works)
- [User Onboarding Flow](#-user-onboarding-flow)
- [Key Features](#️-key-features)
- [System Architecture](#-system-architecture)
- [Tokenomics](#tokenomics)
- [User Roles](#-user-roles)
- [Project Setup](#project-setup)
- [Folder Structure](#-folder-structure)
- [Custom Hooks](#-custom-hooks)
- [State Management](#-state-management)
- [Contributing](#-contributing)
- [License](#️-license)

---

## Tech Stack

| Layer                          | Technology                                                                 |
| ------------------------------ | -------------------------------------------------------------------------- |
| **Frontend Framework**         | [Next.js](https://nextjs.org/) (App Router)                                |
| **State Management**           | [Redux Toolkit](https://redux-toolkit.js.org/) + Thunk                     |
| **UI Library**                 | [Material UI (MUI)](https://mui.com/)                                      |
| **Charts**                     | [Recharts](https://recharts.org/) (Area, Line charts)                      |
| **Authentication**             | Passkey (WebAuthn) + Email OTP + SMS/Authenticator 2FA                     |
| **Blockchain**                 | Ethereum (WalletConnect / MetaMask / Coinbase / Trust Wallet / Rainbow)    |
| **Identity Verification (KYC)**| [Persona SDK](https://withpersona.com/) (Embedded Widget)                  |
| **Accreditation Verification** | [North Capital](https://www.northcapital.com/) (Income/Networth Forms)     |
| **Document Signing**           | [DocuSign](https://www.docusign.com/) (Redirect URL Integration)           |
| **Market Data**                | [CoinGecko API](https://www.coingecko.com/api/) (Token prices, charts)     |
| **Data Fetching**              | Axios with typed error handling                                            |

---

## 🧩 How It Works

1. **User deposits stablecoins** (USDC or USDT)
   - 1 stablecoin = 1 YLDZ token minted

2. **YLDZ tokens** represent deposited capital and yield entitlement

3. **Yield is distributed periodically in WBTC**
   - Oracle-verified
   - Distributed on a pro-rata basis

4. **Lockup Period:** 12 months
   - After lockup, users can withdraw USDC equivalent of their YLDZ holdings

5. **Full Liquidity**
   - Users maintain ownership of tokens and can track yield transparently via the dashboard

---

## 🔄 User Onboarding Flow

The application follows a comprehensive multi-step verification process before users can trade:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              USER ONBOARDING FLOW                               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  1. SIGN UP  │───▶│  2. EMAIL    │───▶│   3. 2FA     │───▶│  4. PASSKEY  │
│   / SIGN IN  │    │   OTP        │    │  SETUP       │    │   SETUP      │
│  (Passkey)   │    │ Verification │    │ SMS + Auth   │    │  (WebAuthn)  │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                                                                    │
                                                                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  8. READY    │◀───│ 7. DOCUMENT  │◀───│ 6. ACCREDIT  │◀───│   5. KYC     │
│  TO TRADE    │    │   SIGNING    │    │  VERIFICATION│    │  (Persona)   │
│              │    │  (DocuSign)  │    │(NorthCapital)│    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

### Step-by-Step Breakdown

#### 1️⃣ Sign Up / Sign In (Passkey Authentication)
- Users register or login using **Passkey (WebAuthn)** for passwordless authentication
- Biometric or hardware key based secure authentication
- Device-bound credentials for enhanced security

#### 2️⃣ Email Verification (OTP)
- 6-digit OTP sent to registered email
- Time-limited verification code
- Resend functionality with cooldown timer

#### 3️⃣ Two-Factor Authentication (2FA) Setup
- **SMS Verification:** OTP sent to phone number
- **Authenticator App:** TOTP-based authentication (Google Authenticator, Authy, etc.)
- Users must complete both for enhanced security

#### 4️⃣ Passkey Registration
- Register device-bound passkey for future logins
- WebAuthn standard implementation
- Supports biometrics, hardware keys, and platform authenticators

#### 5️⃣ KYC Verification (Persona)
- **Persona SDK Widget** embedded in application
- Identity document upload and verification
- Liveness check and facial recognition
- **Status:** Pending → Approved / Rejected
- Admin review capability for edge cases

#### 6️⃣ Accreditation Verification (North Capital)
- **Income verification** form submission
- **Net worth verification** form submission
- Document upload functionality within application
- **Status:** Pending → Approved / Rejected
- Wait for North Capital verification response

#### 7️⃣ Document Signing (DocuSign)
- Redirect to DocuSign URL for legal document signing
- Investment agreements and terms acceptance
- Callback handling for completion status
- Signature verification and storage

#### 8️⃣ Ready to Trade
- User gains full access to trading functionality
- Deposit stablecoins (USDC/USDT)
- Mint YLDZ tokens
- Track yield and manage portfolio

---

## ⚙️ Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **Passkey Authentication** | Passwordless WebAuthn-based secure login |
| 📧 **Email OTP Verification** | Time-limited one-time password verification |
| 📱 **2FA (SMS + Authenticator)** | Multi-factor authentication for enhanced security |
| 🪪 **KYC/AML Onboarding** | Persona SDK widget integration for identity verification |
| 📊 **Accreditation Verification** | North Capital integration for investor accreditation |
| ✍️ **Document Signing** | DocuSign redirect integration for legal agreements |
| 💰 **1:1 Token Minting** | Stablecoin-to-YLDZ minting ratio |
| 📈 **Real-time Dashboard** | Deposits, withdrawals, yield tracking |
| 💸 **WBTC Yield Distribution** | Transparent oracle-based allocations |
| 🪙 **Trustless Withdrawals** | Smart contract-based redemption after 12-month lockup |
| 📨 **Notifications System** | Transaction status, KYC updates, yield alerts |
| 🌐 **Multi-Wallet Support** | WalletConnect, MetaMask, Trust Wallet, Coinbase, Rainbow |
| 📊 **Token Explorer** | Browse tokens with market data from CoinGecko |
| 📈 **Price Charts** | Interactive Area/Line charts with time period selection |

---

## 🧠 System Architecture

### 1️⃣ Authentication Layer
- Passkey (WebAuthn) registration and login
- Email OTP verification
- SMS and Authenticator-based 2FA
- Secure token management with context + Redux slices

### 2️⃣ Verification Layer
- **KYC:** Persona SDK widget for identity verification
- **Accreditation:** North Capital forms for income/networth verification
- **Document Signing:** DocuSign integration for legal agreements

### 3️⃣ Yield Engine
- Oracle-verified WBTC yield distribution
- Transparent, auditable allocation per user

### 4️⃣ Withdrawal Layer
- 12-month lockup enforcement
- Smart contract–based stablecoin redemption
- Auto-updated user dashboard post-withdrawal

### 5️⃣ Market Data Layer (CoinGecko Integration)
- Real-time token prices and market data
- Historical price charts with multiple time periods
- Token categories and detailed metadata
- Cached responses for optimal performance

---

## 📊 CoinGecko API Integration

The application integrates with **CoinGecko API** to provide real-time cryptocurrency market data.

### Available Endpoints

| Endpoint | Description | Redux Thunk |
|----------|-------------|-------------|
| `/coins/markets` | Token listing with market data | `fetchCoinsMarketsThunk` |
| `/coins/{id}` | Token metadata and details | `fetchCoinDetailThunk` |
| `/coins/{id}/market_chart` | Historical price chart | `fetchMarketChartThunk` |
| `/coins/{id}/market_chart/range` | Price chart within date range | `fetchMarketChartRangeThunk` |
| `/coins/{id}/ohlc` | OHLC candlestick data | `fetchOHLCThunk` |
| `/coins/categories` | Token categories with market data | `fetchCategoriesWithMarketThunk` |
| `/coins/categories/list` | Categories list (ID map) | `fetchCategoriesListThunk` |

### API Routes (Internal)

```
src/app/api/
├── market-coins/        # GET /api/market-coins - Paginated token listing
├── coin-detail/         # GET /api/coin-detail?id=bitcoin - Token metadata
├── coin-chart/          # GET /api/coin-chart?id=bitcoin&days=7 - Price chart
├── coin-chart-range/    # GET /api/coin-chart-range?id=bitcoin&from=...&to=... - Date range chart
├── coin-ohlc/           # GET /api/coin-ohlc?id=bitcoin&days=30 - OHLC data
├── categories/          # GET /api/categories?type=list|market - Token categories
└── _utils/
    └── coingecko.ts     # Shared utilities (URL builder, error handler)
```

### Token Chart Section

The `TokenChartSection` component provides interactive price visualization:

```tsx
<TokenChartSection coinId="bitcoin" vsCurrency="usd" />
```

**Features:**
- **Time Period Selector**: 1D, 7D, 30D, 3M, 6M, 1Y
- **Chart Type Toggle**: Switch between Area and Line charts
- **Custom Tooltip**: Shows formatted price and date
- **Responsive Design**: Adapts to container width
- **Loading States**: Spinner while fetching data
- **Error Handling**: Displays error messages gracefully

**Date Formatting by Period:**

| Period | X-Axis | Tooltip |
|--------|--------|---------|
| 1D | `10:30` | `30 Dec, 10:30 AM` |
| 7D | `MON` | `Monday, 30 Dec` |
| 30D | `30 DEC` | `30 Dec, 2025` |
| 3M/6M/1Y | `DEC 2025` | `Dec 2025` |

---

## Tokenomics

| Parameter              | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| **Token Name**         | YLDZ                                                 |
| **Stablecoin Support** | USDC / USDT                                          |
| **Conversion Ratio**   | 1:1                                                  |
| **Yield Denomination** | WBTC                                                 |
| **Lockup Period**      | 12 months                                            |
| **Supply**             | No fixed cap — admin-mintable as per protocol demand |
| **Governance**         | DAO (future via YLDG token)                          |

---

## 🔐 User Roles

### 🧍‍♂️ End Users (Investors)

1. Sign up / Sign in using Passkey
2. Verify email via OTP
3. Complete 2FA setup (SMS + Authenticator)
4. Complete KYC via Persona widget
5. Complete accreditation verification via North Capital
6. Sign legal documents via DocuSign
7. Connect wallet
8. Deposit USDC/USDT → mint YLDZ
9. Track portfolio, deposits, yield, withdrawals
10. Receive WBTC yield directly to connected wallet
11. Withdraw USDC after 12-month lockup

---

## Project Setup

### Clone Repository

```bash
# via HTTPS
git clone https://narayan3998@bitbucket.org/yieldz-frontend/website.git

# via SSH
git clone git@bitbucket.org:yieldz-frontend/website.git
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Environment Setup

Create `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=your_api_url
NEXT_PUBLIC_PERSONA_CLIENT_ID=your_persona_client_id
NEXT_PUBLIC_WALLETCONNECT_ID=your_walletconnect_id
NEXTAUTH_SECRET=your_secret_key

# CoinGecko API (optional - uses demo API without key)
NEXT_PUBLIC_COINGECKO_URL=https://api.coingecko.com/api/v3
NEXT_PUBLIC_COINGECKO_KEY=your_coingecko_api_key
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧱 Folder Structure

The project follows **Atomic Design Pattern** for component organization:

```
src/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Marketing pages (landing, etc.)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── auth/                     # Authentication pages
│   │   └── custom/               # Custom auth flows
│   │       ├── sign-in/
│   │       ├── sign-up/
│   │       ├── verify-email/
│   │       ├── verify-phone/
│   │       └── enable-passkey/
│   ├── api/                      # API Routes (Next.js Route Handlers)
│   │   ├── market-coins/         # CoinGecko market data
│   │   ├── coin-detail/          # Token metadata
│   │   ├── coin-chart/           # Price chart data
│   │   ├── coin-chart-range/     # Date range chart
│   │   ├── coin-ohlc/            # OHLC candlestick data
│   │   ├── categories/           # Token categories
│   │   ├── cookie/               # Session cookie check
│   │   └── _utils/
│   │       └── coingecko.ts      # Shared CoinGecko utilities
│   │
│   ├── dashboard/                # Protected dashboard routes
│   │   ├── accreditation/        # Accreditation verification
│   │   ├── profile/              # User profile management
│   │   ├── tokens/               # Token Explorer page
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── privacy-policy/
│   ├── terms-of-service/
│   ├── wallet/                   # Wallet management
│   ├── layout.tsx                # Root layout
│   └── not-found.tsx
│
├── components/
│   ├── atoms/                    # 🔹 Smallest UI building blocks
│   │   ├── accordion/
│   │   ├── alert/
│   │   ├── avatar/
│   │   ├── badge/
│   │   ├── bg-effect/
│   │   ├── breadcrumb/
│   │   ├── button/
│   │   │   ├── index.tsx         # Primary button component
│   │   │   └── back-button.tsx
│   │   ├── checkbox/
│   │   ├── chip/
│   │   ├── company-logo/
│   │   ├── corner-container/
│   │   ├── custom-icon-wrapper/
│   │   ├── date-picker/
│   │   ├── docusign-frame/
│   │   ├── error-message/
│   │   ├── input/
│   │   ├── link/
│   │   ├── multi-select/
│   │   ├── nav-item/
│   │   ├── or-separator/
│   │   ├── otp-field/            # OTP input component
│   │   ├── phone-input/
│   │   ├── profile-item/
│   │   ├── progress/
│   │   ├── radio-card/
│   │   ├── select-box/
│   │   ├── skeleton/
│   │   │   ├── index.tsx
│   │   │   ├── persona/          # Persona loading skeleton
│   │   │   └── table/
│   │   ├── spinner/
│   │   │   ├── index.tsx
│   │   │   ├── atom-spinner.tsx
│   │   │   └── gradient-circular-spinner.tsx
│   │   ├── split-button/
│   │   ├── switch/
│   │   ├── tab/
│   │   ├── table/
│   │   ├── tabs/
│   │   ├── tooltip/
│   │   ├── typography/
│   │   ├── video/
│   │   └── yields-badge/
│   │
│   ├── molecules/                # 🔸 Combinations of atoms
│   │   ├── confirmation-dialog/
│   │   ├── date-picker-with-label/
│   │   ├── dialog/
│   │   ├── docusign-signing-button/
│   │   ├── docusign-signing-dialog/
│   │   ├── input-with-label/
│   │   ├── multi-select-with-label/
│   │   └── select-with-label/
│   │
│   ├── organisms/                # 🔶 Complex UI sections
│   │   ├── carousel/
│   │   │   ├── index.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   └── types.ts
│   │   └── table/
│   │       ├── index.tsx
│   │       ├── pagination/
│   │       ├── skelton/
│   │       ├── tableBody/
│   │       └── tableHead/
│   │
│   ├── auth/                     # Authentication components
│   │   ├── auth-guard.tsx        # Protected route wrapper
│   │   ├── guest-guard.tsx       # Public route wrapper
│   │   ├── strategy-guard.tsx
│   │   ├── centered-layout.tsx
│   │   ├── split-layout.tsx
│   │   └── custom/
│   │       ├── sign-in-form.tsx
│   │       ├── sign-up-form.tsx
│   │       ├── sign-options-form.tsx
│   │       ├── verify-code/      # Email OTP verification
│   │       ├── verify-phone/     # SMS verification
│   │       ├── 2fa-authentication/
│   │       ├── totp-authenticator/
│   │       └── enable-passkey/   # Passkey registration
│   │
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── layout/               # Dashboard layout components
│   │   └── overview/             # Overview widgets
│   │
│   ├── kyc/                      # KYC (Persona) components
│   │
│   ├── marketing/                # Marketing page components
│   │   ├── home/
│   │   └── layout/
│   │
│   ├── sections/                 # Page sections
│   │   ├── token-chart-section/  # Price chart with Area/Line toggle
│   │   ├── token-listing-section/ # Token listing table
│   │   └── ...                   # Other marketing sections
│   │
│   └── wallet/                   # Wallet components
│
├── constants/                    # Application constants
│   ├── index.ts
│   ├── date-formats.ts
│   ├── networth-accrediation.ts  # Accreditation form options
│   ├── pagination.ts
│   └── static-data.ts
│
├── contexts/                     # React Context providers
│   ├── auth/
│   │   ├── custom/
│   │   │   └── user-context.tsx  # User authentication context
│   │   ├── types.d.ts
│   │   └── user-context.ts
│   ├── form-provider/
│   ├── settings.tsx
│   └── wallet/
│       └── chain/
│
├── hooks/                        # Custom React hooks
│   ├── use-accreditation.ts      # Accreditation logic
│   ├── use-async.ts              # Async operations
│   ├── use-debounce.ts           # Debounce utility
│   ├── use-dialog.ts             # Dialog state management
│   ├── use-filter.ts             # Filter logic
│   ├── use-media-query.ts        # Responsive breakpoints
│   ├── use-otp.ts                # OTP handling
│   ├── use-passkey-login.ts      # Passkey login logic
│   ├── use-passkey-register.ts   # Passkey registration logic
│   ├── use-passkey-state.ts      # Passkey state management
│   ├── use-phone-input.ts        # Phone input formatting
│   ├── use-popover.ts            # Popover state
│   ├── use-resend-timer.ts       # OTP resend timer
│   ├── use-scroll-more.ts        # Infinite scroll
│   ├── use-selection.ts          # Selection state
│   ├── use-settings.ts           # App settings
│   ├── use-socket-events.ts      # WebSocket events
│   ├── use-token-refresh.ts      # Token refresh logic
│   ├── use-user.ts               # User data hook
│   ├── use-wallet-auth.ts        # Wallet authentication
│   ├── use-wallet-connection.ts  # Wallet connection
│   ├── use-wallet.ts             # Wallet operations
│   └── use-write-with-wait.ts    # Blockchain write ops
│
├── interfaces/                   # TypeScript interfaces
│   └── sample.ts
│
├── lib/                          # Library utilities
│   ├── auth/
│   │   ├── custom/
│   │   │   ├── auth-otp-handler.ts
│   │   │   └── client.ts
│   │   └── strategy.ts
│   ├── docusign/
│   │   ├── index.ts
│   │   └── url-provider-factory.ts
│   ├── mock/
│   │   ├── auth.ts
│   │   ├── docusign.ts
│   │   └── wallet.ts
│   ├── settings/
│   │   ├── apply-default-settings.ts
│   │   ├── get-settings.ts
│   │   └── set-settings.ts
│   ├── dayjs.ts
│   ├── default-logger.ts
│   ├── get-site-url.ts
│   ├── i18n/
│   ├── is-nav-item-active.ts
│   └── logger.ts
│
├── locales/                      # Internationalization
│   ├── en/
│   ├── de/
│   └── es/
│
├── providers/                    # Application providers
│   ├── service-worker.tsx
│   ├── socket.tsx
│   ├── store.tsx                 # Redux store provider
│   └── wagmi-provider.tsx        # Wallet connection provider
│
├── regex/                        # Regex patterns
│   └── index.ts
│
├── services/                     # API services
│   ├── api.ts                    # API instance
│   ├── axios.ts                  # Axios configuration
│   ├── urls.ts                   # API endpoints
│   ├── docusign/
│   │   └── index.ts              # DocuSign API service
│   ├── kyc/
│   │   └── index.ts              # Persona KYC service
│   ├── passkeys/
│   │   ├── login.ts              # Passkey login service
│   │   └── register.ts           # Passkey register service
│   ├── user/
│   │   └── me.ts                 # User profile service
│   └── wallet/
│
├── store/                        # Redux Store
│   ├── index.ts                  # Store configuration
│   ├── root-reducer.ts           # Root reducer
│   ├── noop-storage.tsx          # SSR-safe storage
│   ├── slices/                   # Redux slices
│   │   ├── accreditation-slice.ts
│   │   ├── coingecko-slice.ts    # CoinGecko market data
│   │   ├── device-slice.ts
│   │   ├── notification-slice.ts
│   │   ├── passkey-slice.ts
│   │   └── user-slice.ts
│   ├── thunks/                   # Async thunks
│   │   ├── accreditation-thunk.ts
│   │   ├── coingecko-thunk.ts    # CoinGecko API thunks
│   │   ├── notification-thunk.ts
│   │   ├── sample-thunk.ts
│   │   └── user-thunk.ts
│   ├── mock/                     # Mock data for development
│   │   └── accreditation-mock.ts
│   └── types/                    # Store type definitions
│       ├── accreditation-types.ts
│       └── coingecko-types.ts    # CoinGecko state types
│
├── styles/                       # Global styles
│   ├── global.css
│   └── theme/                    # MUI theme customization
│
├── types/                        # Global TypeScript types
│   ├── auth.ts
│   ├── blockchain.ts
│   ├── coingecko.ts              # CoinGecko API response types
│   ├── common.ts
│   ├── docusign.ts
│   ├── nav.d.ts
│   ├── settings.d.ts
│   └── user.d.ts
│
├── utils/                        # Utility functions
│   ├── __tests__/                # Unit tests
│   ├── buffer-to-base64.ts       # Buffer conversion
│   ├── device-manager.ts         # Device fingerprinting
│   ├── error-handler.ts          # Error handling utilities
│   ├── number-format.ts          # Number formatting
│   ├── phone-validation.ts       # Phone validation
│   ├── toast.ts                  # Toast notifications
│   ├── token-manager.ts          # JWT token management
│   ├── truncate-with-tooltip.tsx # Text truncation
│   ├── user-auth.ts              # User auth utilities
│   └── webauthn.ts               # WebAuthn utilities
│
├── config.ts                     # Application configuration
├── env.d.ts                      # Environment type definitions
└── paths.ts                      # Route paths
```

---

## 🪝 Custom Hooks

| Hook | Description |
|------|-------------|
| `use-passkey-login` | Handles passkey-based login flow |
| `use-passkey-register` | Manages passkey registration process |
| `use-passkey-state` | Tracks passkey availability and state |
| `use-otp` | OTP input and verification logic |
| `use-resend-timer` | Countdown timer for OTP resend |
| `use-phone-input` | Phone number formatting and validation |
| `use-accreditation` | Accreditation verification status |
| `use-wallet` | Wallet operations and balance |
| `use-wallet-auth` | Wallet-based authentication |
| `use-wallet-connection` | Wallet connection state |
| `use-user` | Current user data and state |
| `use-token-refresh` | JWT token refresh logic |
| `use-dialog` | Dialog open/close state |
| `use-popover` | Popover positioning |
| `use-debounce` | Debounced value updates |
| `use-async` | Async operation handling |
| `use-media-query` | Responsive breakpoint detection |
| `use-socket-events` | Real-time WebSocket events |
| `use-write-with-wait` | Blockchain transaction handling |

---

## 🗄️ State Management

### Redux Store Structure

```
store/
├── index.ts              # Store configuration with middleware
├── root-reducer.ts       # Combined reducers
│
├── slices/               # Feature slices
│   ├── user-slice.ts     # User authentication state
│   ├── passkey-slice.ts  # Passkey registration state
│   ├── accreditation-slice.ts  # Accreditation status
│   ├── coingecko-slice.ts     # CoinGecko market data
│   ├── notification-slice.ts   # Notifications
│   └── device-slice.ts   # Device information
│
├── thunks/               # Async operations
│   ├── user-thunk.ts     # User-related async actions
│   ├── accreditation-thunk.ts  # Accreditation API calls
│   ├── coingecko-thunk.ts     # CoinGecko API calls
│   └── notification-thunk.ts   # Notification fetching
│
├── mock/                 # Development mock data
│   └── accreditation-mock.ts
│
└── types/                # TypeScript definitions
    ├── accreditation-types.ts
    └── coingecko-types.ts
```

### Key Slices

| Slice | Purpose |
|-------|---------|
| `user-slice` | User profile, authentication status, session |
| `passkey-slice` | Passkey registration state and credentials |
| `accreditation-slice` | North Capital verification status |
| `notification-slice` | In-app notifications and alerts |
| `device-slice` | Device fingerprint and identification |
| `coingecko-slice` | Token market data, charts, categories from CoinGecko |

---

## 🤝 Contributing

1. Fork this repo

2. Create your feature branch:
   ```bash
git checkout -b feature/awesome-feature
   ```

3. Commit changes and push

4. Open a Pull Request 🚀

---

## 🛡️ License

This project is licensed under the MIT License.

© 2025 YLDZ Protocol. All rights reserved.
