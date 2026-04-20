'use client';

import { SepoliaChain } from '@/blockchain/chains';
import { getSepoliaRpcUrl } from '@/constants/rpc';
import { config } from '@/config';
import {
  RainbowKitProvider,
  connectorsForWallets,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';

const yldzWalletProjectId = config.wallet.yldzWalletProjectId;

// ✅ Automatically detects installed wallets
const { wallets: defaultWallets } = getDefaultWallets({
  appName: 'Yieldz',
  projectId: yldzWalletProjectId,
});

// ✅ Combine your custom wallet + auto-detected wallets
const connectors = connectorsForWallets(
  [
    // {
    //   groupName: 'Yieldz',
    //   wallets: [yldzWallet],
    // },
    ...defaultWallets, // includes detected wallets dynamically
  ],
  {
    appName: 'Yieldz',
    projectId: yldzWalletProjectId,
  }
);

/**
 * RPC URL for Sepolia transport.
 * - In browser: use /api/rpc so all reads go through our proxy (avoids CORS).
 * - On server (SSR): use direct RPC from getSepoliaRpcUrl() (same as proxy upstream).
 * Read functions use this; see @/constants/rpc.
 */
function getRpcUrl(): string {
  if (globalThis.window !== undefined) {
    return '/api/rpc';
  }
  return getSepoliaRpcUrl();
}

// ✅ Wagmi + RainbowKit config – Sepolia, single RPC source for reads
const wagmiConfig = createConfig({
  connectors,
  chains: [sepolia],
  transports: {
    [SepoliaChain.id]: http(getRpcUrl()),
  },
  multiInjectedProviderDiscovery: true,
  ssr: false,
});

const queryClient = new QueryClient();

export function WalletProvider({ children }: { readonly children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" initialChain={sepolia}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
