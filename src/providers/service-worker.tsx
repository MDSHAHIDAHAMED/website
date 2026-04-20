'use client';

/**
 * Service Worker Provider
 * =======================
 * Handles PWA service worker lifecycle events and displays
 * user-friendly notifications when a new version is deployed.
 *
 * Features:
 * - Detects new service worker installations
 * - Shows update notification with action buttons
 * - Gracefully handles page reload after update
 * - Provides dismiss option for users who want to update later
 * - Protection against infinite reload loops
 */

import { AtomButton } from '@/components/atoms/button';
import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
import { Box, Stack } from '@mui/material';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

// =============================================================================
// Types
// =============================================================================

interface ServiceWorkerProviderProps {
  /** Child components to render */
  children: React.ReactNode;
}

// =============================================================================
// Constants
// =============================================================================

/** Message type sent to service worker to skip waiting */
const SKIP_WAITING_MESSAGE = 'SKIP_WAITING';

/** Message type received when new service worker is activated */
const NEW_SW_ACTIVATED_MESSAGE = 'NEW_SW_ACTIVATED';

/** Minimum time between reloads to prevent infinite loops (in ms) */
const MIN_RELOAD_INTERVAL = 5000;

/** Session storage key for tracking reload timestamp */
const LAST_SW_RELOAD_KEY = 'sw_last_reload_timestamp';

// =============================================================================
// Component
// =============================================================================

/**
 * ServiceWorkerProvider Component
 *
 * Wraps the application and listens for service worker updates.
 * When a new version is detected, displays a user-friendly notification
 * allowing users to update immediately or dismiss for later.
 *
 * @param props - Component props
 * @param props.children - Child components to render
 * @returns Provider component with update notification
 */
export default function ServiceWorkerProvider({
  children,
}: Readonly<ServiceWorkerProviderProps>): React.JSX.Element {
  // Track notification visibility
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);

  // Track the waiting service worker instance
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  // Track if we're in the process of updating
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Ref to prevent multiple reload attempts
  const hasReloadedRef = useRef<boolean>(false);

  /**
   * Safe reload function that prevents infinite reload loops
   * Checks if enough time has passed since last reload before proceeding
   */
  const safeReload = useCallback((): void => {
    // Prevent multiple reloads in the same session
    if (hasReloadedRef.current) {
      console.warn('[ServiceWorker] Reload already triggered, skipping duplicate');
      return;
    }

    // Check session storage for recent reload
    const lastReload = sessionStorage.getItem(LAST_SW_RELOAD_KEY);
    const now = Date.now();

    if (lastReload) {
      const timeSinceLastReload = now - Number.parseInt(lastReload, 10);
      if (timeSinceLastReload < MIN_RELOAD_INTERVAL) {
        console.warn(
          `[ServiceWorker] Reload blocked - only ${timeSinceLastReload}ms since last reload. ` +
            'This prevents infinite reload loops. Uncheck "Update on reload" in DevTools if enabled.'
        );
        return;
      }
    }

    // Mark that we're reloading and store timestamp
    hasReloadedRef.current = true;
    sessionStorage.setItem(LAST_SW_RELOAD_KEY, now.toString());
    globalThis.location.reload();
  }, []);

  /**
   * Handle the update action - activates the new service worker and reloads
   */
  const handleUpdate = useCallback((): void => {
    if (!waitingWorker) {
      // No waiting worker, just reload the page
      safeReload();
      return;
    }

    setIsUpdating(true);

    // Tell the waiting worker to take over
    waitingWorker.postMessage({ type: SKIP_WAITING_MESSAGE });

    // Listen for the worker to become active, then reload
    waitingWorker.addEventListener('statechange', () => {
      if (waitingWorker.state === 'activated') {
        safeReload();
      }
    });

    // Fallback: reload after a short delay if statechange doesn't fire
    setTimeout(() => {
      safeReload();
    }, 1000);
  }, [waitingWorker, safeReload]);

  /**
   * Handle dismiss action - closes the notification
   * User can still update by refreshing the page manually
   */
  const handleDismiss = useCallback((): void => {
    setIsUpdateAvailable(false);
  }, []);

  /**
   * Development-only: Trigger test notification with keyboard shortcut
   * Press Ctrl+Shift+U (or Cmd+Shift+U on Mac) to test the update notification
   */
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      // Ctrl+Shift+U or Cmd+Shift+U
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'U') {
        event.preventDefault();
        setIsUpdateAvailable(true);
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * Set up service worker event listeners
   */
  useEffect(() => {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      return;
    }

    /**
     * Handle detecting a waiting/installing service worker
     */
    const handleWaitingWorker = (worker: ServiceWorker): void => {
      setWaitingWorker(worker);
      setIsUpdateAvailable(true);
    };

    /**
     * Register service worker if not already registered
     * This is a fallback in case next-pwa auto-registration fails
     */
    const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | undefined> => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        return registration;
      } catch {
        return undefined;
      }
    };

    /**
     * Create statechange handler for a given service worker
     * Extracted to reduce nesting depth
     */
    const createStateChangeHandler = (worker: ServiceWorker) => (): void => {
      const isInstalled = worker.state === 'installed';
      const hasController = navigator.serviceWorker.controller;
      if (isInstalled && hasController) {
        handleWaitingWorker(worker);
      }
    };

    /**
     * Handle updatefound event on registration
     * Extracted to reduce nesting depth
     */
    const createUpdateFoundHandler = (reg: ServiceWorkerRegistration) => (): void => {
      const installingWorker = reg.installing;
      if (!installingWorker) return;
      installingWorker.addEventListener('statechange', createStateChangeHandler(installingWorker));
    };

    /**
     * Set up service worker registration and event listeners
     */
    const setupServiceWorker = async (registration: ServiceWorkerRegistration | undefined): Promise<void> => {
      let reg = registration;
      if (!reg) {
        reg = await registerServiceWorker();
        if (!reg) return;
      }

      // Check if there's already a waiting worker (update installed while page was open)
      if (reg.waiting) {
        handleWaitingWorker(reg.waiting);
      }

      // Listen for new service worker installations
      reg.addEventListener('updatefound', createUpdateFoundHandler(reg));
    };

    // Initialize service worker setup
    navigator.serviceWorker.getRegistration().then(setupServiceWorker);

    /**
     * Listen for controller changes (when a new SW takes control)
     */
    const handleControllerChange = (): void => {
      // Controller changed - new service worker took control
    };
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    /**
     * Listen for messages from the service worker
     * Handles the NEW_SW_ACTIVATED message sent after skipWaiting
     */
    const handleServiceWorkerMessage = (event: MessageEvent): void => {
      if (event.data?.type === NEW_SW_ACTIVATED_MESSAGE) {
        // New service worker activated - reload to get fresh content using safe reload
        safeReload();
      }
    };

    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

    // Cleanup listener on unmount
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, [safeReload]);

  return (
    <>
      {children}

      {/* Update Available Notification with Animation */}
      <AnimatePresence>
        {isUpdateAvailable && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 24,
              left: 0,
              right: 0,
              zIndex: 9999,
              display: 'flex',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                maxWidth: 480,
                width: '90%',
                pointerEvents: 'auto',
              }}
            >
              <CornerContainer
                showBorder
                sx={{ p: 3, backgroundColor: '#000000' }}
                height="auto"
                width="100%"
              >
                <Stack direction="column" alignItems="center" justifyContent="space-between" spacing={2} sx={{ backgroundColor: '#000000' }}>
                  {/* Text Content */}
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <AtomTypography variant="body2Bold" fontType="tickerbit" fontWeight={500}>
                      A new version of Yieldz is available!
                    </AtomTypography>
                    <br />
                    <AtomTypography variant="caption" sx={{ opacity: 0.9 }}>
                      Refresh to get the latest version of Yieldz Website.
                    </AtomTypography>
                  </Box>

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={1}>
                    <AtomButton
                      id="later-button"
                      size="medium"
                      variant="contained"
                      color="secondary"
                      label="Later"
                      onClick={handleDismiss}
                      disabled={isUpdating}
                    />
                    <AtomButton
                      id="update-button"
                      size="medium"
                      variant="contained"
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      label={isUpdating ? 'Updating...' : 'Update Now'}
                    />
                  </Stack>
                </Stack>
              </CornerContainer>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
    </>
  );
}
