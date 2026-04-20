'use client';

import { useSocket } from '@/providers/socket';
import { useEffect, useRef } from 'react';

import { useUser } from '@/hooks/use-user';
import { logger } from '@/lib/default-logger';

/**
 * Socket Event Map Interface
 * ===========================
 * Maps event names to their handler functions
 */
interface SocketEventMap {
  [eventName: string]: (...args: any[]) => void;
}

/**
 * Socket Events Hook Options
 * ===========================
 */
interface UseSocketEventsOptions {
  /** Event handlers map */
  events: SocketEventMap;
  /** Auto-join user room when connected (default: false) */
  autoJoin?: boolean;
}

/**
 * Socket Events Hook
 * ==================
 *
 * Unified hook for all socket-related functionality.
 * Handles event subscriptions and automatic room joining.
 *
 * Features:
 * - Subscribe to multiple socket events
 * - Automatic cleanup on unmount
 * - Optional auto-join to user-specific rooms
 * - Prevents duplicate subscriptions and joins
 * - Handles reconnection scenarios
 * - Production-safe logging
 *
 * Usage:
 * ```tsx
 * // Simple event subscription
 * useSocketEvents({
 *   events: {
 *     'notification:new': (data) => handleNotification(data),
 *     'connect': () => console.log('Connected'),
 *     'disconnect': (reason) => console.log('Disconnected:', reason),
 *   }
 * });
 *
 * // With auto-join (for authenticated users)
 * useSocketEvents({
 *   events: {
 *     'notification:new': (data) => handleNotification(data),
 *   },
 *   autoJoin: true
 * });
 * ```
 *
 * @param options - Configuration options
 */
export function useSocketEvents(options: UseSocketEventsOptions): void {
  const { events, autoJoin = false } = options;
  const { socket, subscribe, unsubscribe, emit } = useSocket();
  const { user } = useUser();

  // Extract user_id from user object
  // The user object may have 'id' (transformed from user_id) or 'user_id' (original API response)
  const authUserId = (user as any)?.user_id || user?.id;

  // Store handlers in ref to keep them stable
  const handlersRef = useRef<SocketEventMap>(events);
  const hasJoinedRef = useRef(false);

  // Update handlers ref when they change (without re-subscribing)
  useEffect(() => {
    handlersRef.current = events;
  }, [events]);

  // Get event names as stable key for dependency array
  const eventNames = Object.keys(events);
  const eventNamesKey = eventNames.join(',');

  /**
   * Setup Socket Event Listeners
   * =============================
   * Creates wrapper functions and subscribes to socket events
   */
  useEffect(() => {
    if (!socket) {
      logger.debug('[SocketEvents] Waiting for socket initialization');
      return;
    }

    logger.debug('[SocketEvents] Setting up listeners for:', eventNames.join(', '));

    // Create stable wrapper functions that reference the latest handlers
    const wrappedHandlers: Map<string, (...args: any[]) => void> = new Map();

    eventNames.forEach((eventName) => {
      // Wrapper that always calls the latest handler from ref
      const wrapper = (...args: any[]) => {
        const handler = handlersRef.current[eventName];
        if (handler) {
          logger.debug(`[SocketEvents] Event fired: ${eventName}`);
          handler(...args);
        } else {
          logger.warn(`[SocketEvents] No handler found for: ${eventName}`);
        }
      };

      wrappedHandlers.set(eventName, wrapper);
      subscribe(eventName, wrapper);
    });

    // Cleanup function
    return () => {
      logger.debug('[SocketEvents] Cleaning up listeners');
      wrappedHandlers.forEach((wrapper, eventName) => {
        unsubscribe(eventName, wrapper);
      });
      wrappedHandlers.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, subscribe, unsubscribe, eventNamesKey]);

  /**
   * Auto-Join User Room
   * ===================
   * Automatically joins user-specific room when enabled
   */
  useEffect(() => {
    if (!autoJoin || !socket) {
      return;
    }

    /**
     * Connection Handler
     * ==================
     * Emits join event when connected with user ID
     */
    const handleConnect = () => {
      if (authUserId && !hasJoinedRef.current) {
        emit('join', { userId: authUserId });
        hasJoinedRef.current = true;
      }
    };

    /**
     * Disconnection Handler
     * ======================
     * Resets join flag for reconnection
     */
    const handleDisconnect = () => {
      hasJoinedRef.current = false;
      logger.debug('[SocketEvents] Disconnected, reset join flag');
    };

    // Set up connection listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // If already connected, trigger connect handler
    if (socket.connected) {
      handleConnect();
    }

    // Cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [autoJoin, socket, authUserId, emit]);
}

/**
 * Export default for backward compatibility
 */
export default useSocketEvents;
