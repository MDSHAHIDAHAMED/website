'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

/**
 * Socket Context Type Definition
 * ===============================
 * Provides socket instance and methods for event management
 */
interface SocketContextType {
  socket: Socket | null;
  subscribe: (event: string, handler: (...args: any[]) => void) => void;
  unsubscribe: (event: string, handler: (...args: any[]) => void) => void;
  emit: (event: string, data?: any) => void;
}

/**
 * Socket Context
 * ==============
 * Default context with no-op functions
 */
const SocketContext = createContext<SocketContextType>({
  socket: null,
  subscribe: () => {},
  unsubscribe: () => {},
  emit: () => {},
});

/**
 * Socket Provider Props
 * =====================
 */
interface SocketProviderProps {
  readonly children: React.ReactNode;
  readonly serverUrl: string | undefined;
}

/**
 * Socket Provider Component
 * =========================
 * 
 * Provides Socket.IO connection to the entire app.
 * 
 * Features:
 * - Automatic connection/reconnection management
 * - Token-based authentication
 * - Event subscription/unsubscription methods
 * - Connection lifecycle management
 * 
 * Configuration:
 * - WebSocket-only transport for reliability
 * - Auto-reconnection with exponential backoff
 * - 5 maximum reconnection attempts
 * - CORS credentials support
 */
export function SocketProvider({ children, serverUrl }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const handlersRef = useRef<Map<string, Set<(...args: any[]) => void>>>(new Map());

  /**
   * Initialize Socket Connection
   * =============================
   * Creates and configures socket instance with authentication
   */
  useEffect(() => {
    if (!serverUrl) {
      return;
    }

    // Get authentication token from storage
    const token = localStorage.getItem('accessToken') ?? sessionStorage.getItem('accessToken');

    // Create socket instance with optimized configuration
    const client = io(serverUrl, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      withCredentials: true,
      auth: token ? { token } : undefined,
    });

    // Core connection event handlers
    client.on('connect', () => {
      // Connection established
    });

    client.on('disconnect', (reason) => {
      // Disconnected
    });

    client.on('connect_error', (error) => {
      // Connection error occurred
    });

    client.on('reconnect', (attemptNumber) => {
      // Reconnected
    });

    client.on('reconnect_failed', () => {
      // Reconnection failed
    });

    setSocket(client);

    // Cleanup on unmount
    return () => {
      client.removeAllListeners();
      client.disconnect();
    };
  }, [serverUrl]);

  /**
   * Subscribe to Socket Event
   * ==========================
   * Adds an event listener and tracks it for cleanup
   */
  const subscribe = useCallback(
    (event: string, handler: (...args: any[]) => void) => {
      if (!socket) {
        return;
      }

      if (!handlersRef.current.has(event)) {
        handlersRef.current.set(event, new Set());
      }

      const handlers = handlersRef.current.get(event)!;
      if (!handlers.has(handler)) {
        handlers.add(handler);
        socket.on(event, handler);
      }
    },
    [socket]
  );

  /**
   * Unsubscribe from Socket Event
   * ==============================
   * Removes an event listener and cleanup tracking
   */
  const unsubscribe = useCallback(
    (event: string, handler: (...args: any[]) => void) => {
      if (!socket) return;

      socket.off(event, handler);
      handlersRef.current.get(event)?.delete(handler);
    },
    [socket]
  );

  /**
   * Emit Socket Event
   * =================
   * Sends an event to the server with validation
   */
  const emit = useCallback(
    (event: string, data?: any) => {
      if (!socket) {
        return;
      }

      if (!socket.connected) {
        return;
      }

      socket.emit(event, data);
    },
    [socket]
  );

  /**
   * Memoize Context Value
   * =====================
   * Prevents unnecessary re-renders
   */
  const value = useMemo(
    () => ({ socket, subscribe, unsubscribe, emit }),
    [socket, subscribe, unsubscribe, emit]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

/**
 * useSocket Hook
 * ==============
 * Access socket context from any component
 */
export const useSocket = () => useContext(SocketContext);
