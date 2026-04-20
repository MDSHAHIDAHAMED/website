'use client';
import { useState, useEffect } from 'react';
import { useAccount, useBalance, useChainId, useChains, useDisconnect, useEnsName } from 'wagmi';
import { BaseWallet, ChainInfo, WalletConnectionState, WalletError, TxStatus } from './types';

/**
 * Ethereum wallet hook mimicking Wagmi hooks.
 * Returns reactive fields (address, balance, ENS, chain info, connection states),
 * the current connector, status, and BaseWallet methods for consistent API.
 */
export function useEthereumWallet(): BaseWallet & {
  connector: typeof useAccount extends { connector: infer C } ? C : any;
  status: string;
  txStatus: TxStatus | null;
  txError: string | null;
} {
  // ---------------------------
  // Wagmi hooks
  // ---------------------------
  const account = useAccount();           // User account info, includes connector & status
  const { disconnect } = useDisconnect(); // Disconnect function
  const chainId = useChainId();           // Current chain ID
  const chains = useChains();             // List of supported chains

  const rawAddress = account.address;
  const ensNameHook = useEnsName({ address: rawAddress });     // ENS lookup
  const balanceHook = useBalance({ address: rawAddress, chainId }); // ETH balance

  // ---------------------------
  // Local reactive state
  // ---------------------------
  const [balance, setBalance] = useState<{ formatted: string; symbol: string } | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [chain, setChain] = useState<ChainInfo | null>(null);

  // ---------------------------
  // Sync wagmi data into reactive state
  // ---------------------------
  useEffect(() => {
    let mounted = true;

    if (balanceHook.data && mounted)
      setBalance({ formatted: balanceHook.data.formatted, symbol: balanceHook.data.symbol });

    if (ensNameHook.data && mounted) setEnsName(ensNameHook.data);

    const currentChain = chains.find(c => c.id === chainId);
    if (mounted)
      setChain({
        chainId,
        name: currentChain?.name ?? 'Unknown',
        isSupported: !!currentChain,
      });

    return () => { mounted = false; };
  }, [balanceHook.data, ensNameHook.data, chainId, chains]);

  // ---------------------------
  // Connection state
  // ---------------------------
  const connection: WalletConnectionState = {
    isConnected: account.isConnected,
    isConnecting: account.isConnecting,
    isDisconnected: account.isDisconnected,
  };

  // ---------------------------
  // Error handling
  // ---------------------------
  const error: WalletError | null = balanceHook.error
    ? { type: 'balanceError', message: balanceHook.error.message }
    : account.status === 'disconnected'
      ? { type: 'disconnected', message: 'Wallet disconnected' }
      : null;

  // ---------------------------
  // Derived fields
  // ---------------------------
  const address: string | null = rawAddress ?? null;
  const displayName = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;
  const status = account.status; // 'connected' | 'disconnected' | 'connecting'
  const connector = account.connector; // current wallet connector

  // ---------------------------
  // Return full BaseWallet object
  // ---------------------------
  return {
    // Reactive fields
    address,
    displayName,
    ensName,
    balance,
    chain,
    error,
    txStatus: null,  // placeholder for single tx tracking
    txError: null,   // placeholder for single tx tracking

    // Connection states
    ...connection,

    // Connector info
    connector,
    status,

    // BaseWallet methods
    connect: async () => console.warn('Use wagmi connectors to connect'),
    disconnect: async () => disconnect(),
    getConnectionState: () => connection,
    getLastError: () => error,
    getAddress: () => address,
    getDisplayName: () => displayName,
    getEnsName: async () => ensName,
    getBalance: async () => balance,
    getChainInfo: async () => chain ?? { chainId: 0, name: 'Unknown', isSupported: false },
    getTransactionStatus: undefined,
    getTransactionError: undefined,

    // Explicitly satisfy interface
    isConnected: connection.isConnected,
    isConnecting: connection.isConnecting,
    isDisconnected: connection.isDisconnected,
  };
}
