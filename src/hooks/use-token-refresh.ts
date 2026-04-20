'use client';

import { logger } from '@/lib/default-logger';
import { store } from '@/store';
import { clearPasskeyData } from '@/store/slices/passkey-slice';
import { checkTokenExpiry, getTokenExpiry, renewToken } from '@/utils/token-manager';
import { useEffect, useRef } from 'react';

/**
 * Smart Token Refresh Hook
 * - Auto-schedules next check based on actual expiry time
 * - Fixes interval drift problem
 * - Works even if user refreshes page at awkward times
 * - Super stable for real-world login flows
 * - Handles errors gracefully and prevents infinite retries
 */
export function useTokenRefresh() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const running = useRef(false);

  // Refresh 60 sec before expiry
  const SAFETY_WINDOW_MS = 60_000;

  useEffect(() => {
    if (globalThis.window === undefined) return;

    async function runCycle() {
      if (running.current) return;
      running.current = true;

      try {
        const { isExpired, isNearExpiry } = await checkTokenExpiry();

        logger.debug('[Token Refresh Cycle]', { isExpired, isNearExpiry });

        if (isExpired) {
          logger.warn('[Token Refresh] Token expired. Stopping scheduler.');
          stop();
          return;
        }

        if (isNearExpiry) {
          logger.debug('[Token Refresh] Near expiry → renewing token...');
          const ok = await renewToken();

          if (!ok) {
            logger.error('[Token Refresh] Failed. Stopping scheduler.');
            store.dispatch(clearPasskeyData());
            stop();
            return;
          }
        }
      } catch (err) {
        logger.error('[Token Refresh] Error in cycle:', err);
      }

      running.current = false;

      // Always schedule next cycle based on new expiry time
      scheduleNext();
    }

    function scheduleNext() {
      const expiryMs = getTokenExpiry();
      if (!expiryMs) return;

      const now = Date.now();
      let wait = expiryMs - now - SAFETY_WINDOW_MS;

      if (wait < 5000) wait = 5000; // never schedule too close

      logger.debug('[Token Scheduler] Next check in:', wait, 'ms');

      timerRef.current = setTimeout(runCycle, wait);
    }

    function stop() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Start immediately
    scheduleNext();

    return () => stop();
  }, []);
}
