'use client';

import { mockWalletConnectApi, type WalletConnectResponse } from '@/lib/mock/wallet';
import { postMethod } from '@/services/api';
import endPoints from '@/services/urls';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useDisconnect } from 'wagmi';

/**
 * Toggle mock mode for local testing
 */
const IS_MOCK_MODE = process.env.NEXT_PUBLIC_IS_MOCK_MODE === 'true';

/**
 * Error codes that require wallet disconnection
 */
const DISCONNECT_ERROR_CODES = new Set([400, 409, 500, 401]);

/**
 * Translation keys
 */
const TRANSLATION_KEYS = {
  connectedSuccessfully: 'wallet:connectedSuccessfully',
  connectionFailed: 'wallet:connectionFailed',
} as const;


/**
 * Returns true if wallet should be disconnected based on error codes.
 * These codes indicate that the wallet address is invalid or conflicts with the backend.
 */
function shouldDisconnectWallet(code?: number): boolean {
  return code !== undefined && DISCONNECT_ERROR_CODES.has(code);
}

/**
 * Checks if response is empty or invalid
 */
function isEmptyResponse(response: unknown): response is null | undefined | Record<string, never> {
  if (!response) return true;
  if (typeof response !== 'object' || response === null) return false;
  return !('status' in response);
}

/**
 * Handles successful wallet connection
 */
function handleConnectionSuccess(
  address: string,
  stateRef: React.MutableRefObject<{
    processedAddress: string | null;
    isProcessing: boolean;
    prevConnected: boolean;
    isInitialMount: boolean;
  }>,
  successMessage: string
): void {
  stateRef.current.processedAddress = address.toLowerCase();
  showSuccessToast('wallet-connected', successMessage);
}

/**
 * Hook: useWalletConnection
 * -------------------------
 * Handles wallet connection lifecycle and triggers backend validation.
 *
 * Key behavior:
 * - Only triggers API when wallet transitions from disconnected → connected.
 * - Does not fire on initial mount when wallet is already connected from a previous session.
 * - Disconnects wallet automatically for known invalid states.
 * - Prevents duplicate API calls by tracking processed addresses.
 */
export function useWalletConnection() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { t } = useTranslation(['wallet']);

  /**
   * Consolidated refs for better performance
   */
  const stateRef = useRef({
    processedAddress: null as string | null,
    isProcessing: false,
    prevConnected: false,
    isInitialMount: true,
  });

  /**
   * Memoize translation messages to prevent unnecessary re-renders
   */
  const messages = useMemo(
    () => ({
      success: t(TRANSLATION_KEYS.connectedSuccessfully),
      error: t(TRANSLATION_KEYS.connectionFailed),
    }),
    [t]
  );

  /**
   * Memoize normalized address to avoid repeated toLowerCase calls
   */
  const normalizedAddress = useMemo(
    () => address?.toLowerCase() ?? null,
    [address]
  );

  /**
   * Memoized wallet connection handler to prevent recreation on every render
   */
  const handleWalletConnection = useCallback(
    async (walletAddress: string) => {
      const state = stateRef.current;

      // Prevent overlapping API calls
      if (state.isProcessing) return;
      state.isProcessing = true;

      try {
        const response = IS_MOCK_MODE
          ? await mockWalletConnectApi(walletAddress)
          : await postMethod<WalletConnectResponse>(endPoints.WALLET_CONNECT, {
              address: walletAddress,
            });
        // Handle empty response (200 with no body) - treat as success
        if (isEmptyResponse(response)) {
          handleConnectionSuccess(walletAddress, stateRef, messages.success);
          return;
        }

        // Handle successful response
        if (response.status === 'success') {
          handleConnectionSuccess(walletAddress, stateRef, messages.success);
          return;
        }

        // Handle error response
        const errorCode = response.errorCode;
        if (shouldDisconnectWallet(errorCode)) {
          disconnect();
        }

        showErrorToast('wallet-connect-error', response.message ?? messages.error);
      } catch (err: unknown) {
        const axiosError = err as { response?: { data?: WalletConnectResponse }; message?: string };
        const backendError = axiosError?.response?.data;
        const errorMessage = backendError?.message ?? axiosError?.message ?? messages.error;

        disconnect();
        showErrorToast('wallet-connect-error', errorMessage);
      } finally {
        stateRef.current.isProcessing = false;
      }
    },
    [disconnect, messages]
  );

  useEffect(() => {
    const state = stateRef.current;

    // Handle initial mount
    if (state.isInitialMount) {
      state.isInitialMount = false;
      state.prevConnected = isConnected;

      if (isConnected && normalizedAddress) {
        state.processedAddress = normalizedAddress;
      }
      return;
    }

    const wasPreviouslyDisconnected = !state.prevConnected;
    const hasJustConnected = isConnected && normalizedAddress !== null;

    state.prevConnected = isConnected;

    // Reset processed state when wallet disconnects
    if (!isConnected) {
      state.processedAddress = null;
      return;
    }

    // Only run when user actively connects the wallet
    if (!wasPreviouslyDisconnected || !hasJustConnected) {
      return;
    }

    // Prevent duplicate processing of the same address
    if (state.processedAddress === normalizedAddress) {
      return;
    }

    // Trigger wallet connection API call
    if (normalizedAddress) {
      handleWalletConnection(normalizedAddress);
    }
  }, [normalizedAddress, isConnected, handleWalletConnection]);

  return {
    isConnected,
    address,
  };
}
