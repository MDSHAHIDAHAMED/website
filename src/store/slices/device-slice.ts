import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * Device State Interface
 * ======================
 * 
 * Manages device-related state for API requests including:
 * - Device ID (assigned by server after first auth)
 * - Device name (browser/OS identifier)
 * - Device platform (WEB/IOS/ANDROID)
 * - Whether user has a passkey registered on this device
 * 
 * This slice is whitelisted for persistence to maintain device identity
 * across page refreshes and sessions.
 */
export interface DeviceState {
  /** Device ID assigned by the server after authentication */
  deviceId: string | null;
  /** Human-readable device name (e.g., "Chrome on Windows") */
  deviceName: string | null;
  /** Device platform - always 'WEB' for web application */
  devicePlatform: 'WEB' | 'IOS' | 'ANDROID';
  /** Whether device info has been initialized */
  isInitialized: boolean;
  hasPasskeyForUser: boolean;

}

const initialState: DeviceState = {
  deviceId: null,
  deviceName: null,
  devicePlatform: 'WEB',
  isInitialized: false,
  hasPasskeyForUser: false,
};

/**
 * Device Slice
 * =============
 * 
 * Redux slice for managing device state with the following actions:
 * - setDeviceId: Store device ID from server response
 * - setDeviceName: Store generated device name
 * - initializeDevice: Initialize device info on app startup
 * - clearDeviceId: Clear device ID on logout (keeps name/platform)
 * - clearAllDeviceInfo: Full reset of device state
 */
export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    /**
     * Set device ID received from server
     * @param state - Current device state
     * @param action - Payload containing device ID
     */
    setDeviceId: (state, action: PayloadAction<string | null>) => {
      state.deviceId = action.payload;
    },

    /**
     * Set device name (browser/OS identifier)
     * @param state - Current device state
     * @param action - Payload containing device name
     */
    setDeviceName: (state, action: PayloadAction<string>) => {
      state.deviceName = action.payload;
    },
    setHasPasskeyForUser: (state, action: PayloadAction<boolean>) => {
      state.hasPasskeyForUser = action.payload;
    },
    /**
     * Initialize device info on app startup
     * Sets device name and marks as initialized
     * @param state - Current device state
     * @param action - Payload containing device name
     */
    initializeDevice: (state, action: PayloadAction<string>) => {
      if (!state.deviceName) {
        state.deviceName = action.payload;
      }
      state.isInitialized = true;
      state.hasPasskeyForUser = false;
    },

    /**
     * Clear device ID on logout
     * Keeps device name and platform for next login
     * @param state - Current device state
     */
    clearDeviceId: (state) => {
      state.deviceId = null;
      state.hasPasskeyForUser = false;
    },

    /**
     * Full reset of device state
     * Used when user wants to be treated as a new device
     * @param state - Current device state
     */
    clearAllDeviceInfo: (state) => {
      state.deviceId = null;
      state.deviceName = null;
      state.isInitialized = false;
      state.hasPasskeyForUser = false;
    },
  },
});

// Export actions
export const {
  setDeviceId,
  setDeviceName,
  initializeDevice,
  clearDeviceId,
  clearAllDeviceInfo,
  setHasPasskeyForUser,
} = deviceSlice.actions;

// Export reducer
export default deviceSlice.reducer;

