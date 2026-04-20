/**
 * useDepositConfig Hook
 * =====================
 * 
 * Custom hook for fetching and managing deposit configuration
 */

'use client';

import { logger } from '@/lib/default-logger';
import { getDepositConfig, type DepositConfigResponse, type SupportedAsset } from '@/services/deposits';
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Hook return type
 */
export interface UseDepositConfigReturn {
  /** Deposit configuration data */
  depositConfig: DepositConfigResponse['data'] | null;
  /** Whether config is currently loading */
  isLoading: boolean;
  /** Whether config fetch failed */
  hasError: boolean;
  /** Minimum deposit amount from config */
  minimumDepositAmount: string | null;
  /** Supported assets from config */
  supportedAssets: SupportedAsset[];
  /** Function to refresh/refetch the deposit config */
  refreshConfig: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage deposit configuration
 * 
 * @returns Deposit configuration state and derived values
 */
export function useDepositConfig(): UseDepositConfigReturn {
  const [depositConfig, setDepositConfig] = useState<DepositConfigResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  /**
   * Fetch deposit configuration
   */
  const fetchConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await getDepositConfig();
      if (response.status === 'success' && response.data) {
        setDepositConfig(response.data);
        logger.debug('Deposit config fetched successfully', { 
          minimumDepositAmount: response.data.minimumDepositAmount,
          supportedAssets: response.data.supportedAssets.length 
        });
      } else {
        setHasError(true);
        logger.warn('Deposit config API returned unsuccessful status', { response });
      }
    } catch (error) {
      setHasError(true);
      logger.error('Failed to fetch deposit config', { error });
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch deposit configuration on mount
   */
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  /**
   * Get minimum deposit amount from config
   */
  const minimumDepositAmount = useMemo(() => {
    // If we have the data, return it regardless of error state
    if (depositConfig?.minimumDepositAmount) {
      return depositConfig.minimumDepositAmount;
    }
    // Otherwise return null
    return null;
  }, [depositConfig]);

  /**
   * Get supported assets from config
   */
  const supportedAssets = useMemo(() => {
    return depositConfig?.supportedAssets ?? [];
  }, [depositConfig]);

  /**
   * Refresh/refetch deposit configuration
   */
  const refreshConfig = useCallback(async () => {
    await fetchConfig();
  }, [fetchConfig]);

  return {
    depositConfig,
    isLoading,
    hasError,
    minimumDepositAmount,
    supportedAssets,
    refreshConfig,
  };
}

