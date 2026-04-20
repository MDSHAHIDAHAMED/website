/**
 * Device Manager Utility
 * ---------------------
 * Manages device information for ALL API requests.
 * Uses Redux store (with redux-persist) for state persistence.
 * Provides device headers required by the API.
 * 
 * Device headers are automatically appended to every request:
 * - If device_id exists: sends X-Device-Id
 * - If no device_id: sends X-Device-Name + X-Device-Platform
 */

import { store } from '@/store';
import {
  clearAllDeviceInfo,
  clearDeviceId as clearDeviceIdAction,
  initializeDevice,
  setDeviceId,
  setHasPasskeyForUser
} from '@/store/slices/device-slice';

// Platform constant for web application
export const DEVICE_PLATFORM = 'WEB';

/**
 * Device information interface matching API response
 */
export interface DeviceInfo {
  device_id: string;
  platform: 'WEB' | 'IOS' | 'ANDROID';
  display_name: string;
  created_at: string;
  last_seen_at: string;
  status: string;
  first_seen_at: string;
  last_auth_at: string;
  has_passkey_for_user: boolean;
}

/**
 * Device headers interface for API requests
 */
export interface DeviceHeaders {
  'X-Device-Name'?: string;
  'X-Device-Platform'?: 'WEB' | 'IOS' | 'ANDROID';
  'X-Device-Id'?: string;
}

/**
 * Generate a device name based on browser/OS information
 * Creates a human-readable string like "Chrome on Windows"
 * 
 * @returns A human-readable device name
 */
export function generateDeviceName(): string {
  if (globalThis.window === undefined) return 'Unknown Device';

  const userAgent = navigator.userAgent;
  let browserName = 'Unknown Browser';
  let osName = 'Unknown OS';

  // Detect browser (order matters - check more specific patterns first)
  if (userAgent.includes('Edg')) {
    browserName = 'Edge';
  } else if (userAgent.includes('OPR') || userAgent.includes('Opera')) {
    browserName = 'Opera';
  } else if (userAgent.includes('Chrome')) {
    browserName = 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    browserName = 'Firefox';
  } else if (userAgent.includes('Safari')) {
    browserName = 'Safari';
  }

  // Detect OS
  if (userAgent.includes('Windows')) {
    osName = 'Windows';
  } else if (userAgent.includes('Mac OS') || userAgent.includes('Macintosh')) {
    osName = 'macOS';
  } else if (userAgent.includes('Linux') && !userAgent.includes('Android')) {
    osName = 'Linux';
  } else if (userAgent.includes('Android')) {
    osName = 'Android';
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iPod')) {
    osName = 'iOS';
  }

  return `${browserName} on ${osName}`;
}

/**
 * Get stored device ID from Redux store
 * @returns Device ID or null if not set
 */
export function getStoredDeviceId(): string | null {
  try {
    const state = store.getState();
    return state.device?.deviceId ?? null;
  } catch {
    return null;
  }
}

/**
 * Store device ID in Redux store
 * @param deviceId - The device ID to store
 */
export function storeDeviceId(deviceId: string): void {
  try {
    store.dispatch(setDeviceId(deviceId));
    console.log('[DeviceManager] Stored device ID:', deviceId);
  } catch (error) {
    console.error('[DeviceManager] Failed to store device ID:', error);
  }
}

/**
 * Get stored device name from Redux store
 * If not stored, generates and stores a new one
 * 
 * @returns Device name (always returns a value)
 */
export function getStoredDeviceName(): string {
  try {
    const state = store.getState();
    const storedName = state.device?.deviceName;
    
    if (storedName) return storedName;

    // Generate a new device name if not stored
    const newName = generateDeviceName();
    
    // Initialize device with the new name
    store.dispatch(initializeDevice(newName));
    console.log('[DeviceManager] Generated device name:', newName);
    
    return newName;
  } catch {
    return generateDeviceName();
  }
}

/**
 * Initialize device info on app startup
 * Ensures device name is generated and stored before first API call
 * Call this once during app initialization
 */
export function initializeDeviceInfo(): void {
  if (globalThis.window === undefined) return;

  try {
    const state = store.getState();
    
    // If already initialized and has device name, skip
    if (state.device?.isInitialized && state.device?.deviceName) {
      console.log('[DeviceManager] Already initialized:', {
        deviceName: state.device.deviceName,
        deviceId: state.device.deviceId ?? 'not set (will be assigned by server)',
        platform: DEVICE_PLATFORM,
      });
      return;
    }

    // Generate and store device name
    const deviceName = state.device?.deviceName || generateDeviceName();
    store.dispatch(initializeDevice(deviceName));
    
    console.log('[DeviceManager] Initialized:', {
      deviceName,
      deviceId: state.device?.deviceId ?? 'not set (will be assigned by server)',
      platform: DEVICE_PLATFORM,
    });
  } catch (error) {
    console.error('[DeviceManager] Initialization error:', error);
  }
}

/**
 * Clear stored device ID (used on logout)
 * Keeps device name as it's tied to the browser, not the session
 */
export function clearDeviceId(): void {
  try {
    store.dispatch(clearDeviceIdAction());
    console.log('[DeviceManager] Cleared device ID');
  } catch (error) {
    console.error('[DeviceManager] Failed to clear device ID:', error);
  }
}

/**
 * Clear all device info (full reset)
 * Use when user wants to be treated as a completely new device
 */
export function clearAllDevice(): void {
  try {
    store.dispatch(clearAllDeviceInfo());
    console.log('[DeviceManager] Cleared all device info');
  } catch (error) {
    console.error('[DeviceManager] Failed to clear all device info:', error);
  }
}

/**
 * Get fresh device headers (real browser values, not from Redux)
 * Used for sign-up/start and login/start endpoints to ensure accurate device info
 * 
 * @returns Object containing fresh device headers
 */
export function getFreshDeviceHeaders(): DeviceHeaders {
  return {
    'X-Device-Name': generateDeviceName(),
    'X-Device-Platform': DEVICE_PLATFORM,
  };
}

/**
 * Get device headers for API requests
 * These headers are automatically appended to EVERY request
 * 
 * Logic:
 * - If useFreshValues is true: always use freshly generated name + platform
 * - If we have a device_id: send X-Device-Id only
 * - If no device_id: send X-Device-Name + X-Device-Platform from store
 * 
 * @param useFreshValues - If true, use fresh browser values (for signup/login start)
 * @returns Object containing device headers for the request
 */
export function getDeviceHeaders(useFreshValues: boolean = false): DeviceHeaders {
  // For signup/login start, always use fresh values to capture real browser info
  if (useFreshValues) {
    return getFreshDeviceHeaders();
  }

  const deviceId = getStoredDeviceId();
  const headers: DeviceHeaders = {};

  if (deviceId) {
    // If we have a device ID (from previous login/signup), use it
    headers['X-Device-Id'] = deviceId;
  } else {
    // No device ID yet - send name and platform for server to create device
    headers['X-Device-Name'] = getStoredDeviceName();
    headers['X-Device-Platform'] = DEVICE_PLATFORM;
  }

  return headers;
}

/**
 * Store device info from API response
 * Called after successful auth responses that include device info
 * 
 * @param device - Device info object from API response
 */
export function storeDeviceFromResponse(device: DeviceInfo | undefined | null): void {
  if (!device?.device_id) return;

  storeDeviceId(device.device_id);
  store.dispatch(setHasPasskeyForUser(device.has_passkey_for_user));
}
