/**
 * useDepositConfig Hook
 * =====================
 *
 * Fetches and exposes deposit configuration. Keeps state minimal and
 * derives minimumDepositAmount and supportedAssets from config to avoid
 * redundant memos and extra callback layers.
 */

'use client';

import { getDepositConfig, type DepositConfigResponse, type SupportedAsset } from '@/services/deposits';
import { useCallback, useEffect, useMemo, useState } from 'react';

/** Shape of the value returned by useDepositConfig */
export interface UseDepositConfigReturn {
  /** Deposit configuration data */
  depositConfig: DepositConfigResponse['data'] | null;
  /** Whether config is currently loading */
  isLoading: boolean;
  /** Whether config fetch failed */
  hasError: boolean;
  /** Minimum deposit amount from config */
  minimumDepositAmount: string | null;
  /** Supported assets from config; stable empty array when no config */
  supportedAssets: SupportedAsset[];
  /** Refetches the deposit config (same as calling fetch internally) */
  refreshConfig: () => Promise<void>;
}

/**
 * Fetches deposit configuration on mount and exposes it plus derived values.
 * refreshConfig is a stable callback that re-runs the same fetch.
 *
 * @returns Deposit configuration state and derived values
 */
export function useDepositConfig(): UseDepositConfigReturn {
  const [depositConfig, setDepositConfig] = useState<DepositConfigResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  /** Single source of fetch logic; reused for both initial load and refresh */
  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await getDepositConfig();
      if (response.status === 'success' && response.data) {
        setDepositConfig(response.data);
      } else {
        setHasError(true);
      }
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  /** Primitives derived inline; no memo needed */
  const minimumDepositAmount = depositConfig?.minimumDepositAmount ?? null;

  /** Memoized to keep a stable [] when there is no config and avoid extra re-renders downstream */
  const supportedAssets = useMemo(() => depositConfig?.supportedAssets ?? [], [depositConfig?.supportedAssets]);

  return {
    depositConfig,
    isLoading,
    hasError,
    minimumDepositAmount,
    supportedAssets,
    refreshConfig: fetchConfig,
  };
}

