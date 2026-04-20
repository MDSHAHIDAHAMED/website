import type { AxiosProgressEvent } from 'axios';

import { logger } from '@/lib/default-logger';
import { AuthAxios, Axios } from '@/services/axios';

/**
 * Progress callback type for file uploads
 */
export type UploadProgressCallback = (progress: number) => void;

/* -----------------------------------------------------------------------------
 * STANDARD API METHODS
 * Uses Axios instance with base URL from config (e.g., https://api.example.com)
 * -------------------------------------------------------------------------- */

/**
 * GET request to standard API endpoint
 * @param path - API endpoint path (e.g., '/kyc/inquiry')
 * @returns Promise with response data
 */
export const getMethod = async <T>(path: string): Promise<T> => {
  const response = await Axios.get<T>(path);
  return response.data;
};

/**
 * POST request to standard API endpoint
 * @param path - API endpoint path
 * @param data - Request payload
 * @returns Promise with response data
 */
export const postMethod = async <T>(path: string, data: unknown = null): Promise<T> => {
  const response = await Axios.post<T>(path, data);
  return response.data;
};

/**
 * POST request with upload progress tracking
 * @param path - API endpoint path
 * @param data - FormData payload
 * @param onProgress - Callback with upload progress percentage (0-100)
 * @returns Promise with response data
 */
export const postMethodWithProgress = async <T>(
  path: string,
  data: FormData,
  onProgress?: UploadProgressCallback
): Promise<T> => {
  const response = await Axios.post<T>(path, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentage);
      }
    },
  });
  return response.data;
};

/**
 * PUT request to standard API endpoint
 * @param path - API endpoint path
 * @param data - Request payload
 * @returns Promise with response data
 */
export const putMethod = async <T>(path: string, data: unknown = null): Promise<T> => {
  const response = await Axios.put<T>(path, data);
  return response.data;
};

/**
 * DELETE request to standard API endpoint
 * @param path - API endpoint path
 * @param email - Optional email parameter
 * @returns Promise with response data
 */
export const deleteMethod = async <T>(path: string, email: string | null = null): Promise<T> => {
  const response = await Axios.delete<T>(path, { data: { email } });
  return response.data;
};

/**
 * PATCH request to standard API endpoint
 * @param path - API endpoint path
 * @param data - Request payload
 * @returns Promise with response data
 */
export const patchMethod = async <T>(path: string, data: unknown = null): Promise<T> => {
  const response = await Axios.patch<T>(path, data);
  return response.data;
};

/* -----------------------------------------------------------------------------
 * AUTH API METHODS
 * Uses AuthAxios instance with /api/auth base URL (proxied through Next.js)
 * Includes CSRF token handling for authentication endpoints
 * -------------------------------------------------------------------------- */

/**
 * GET request to auth API endpoint
 * @param path - Auth API endpoint path (automatically prefixed with /api/auth)
 * @returns Promise with response data
 */
export const authGetMethod = async <T>(path: string): Promise<T> => {
  const response = await AuthAxios.get<T>(path);
  return response.data;
};

/**
 * POST request to auth API endpoint
 * @param path - Auth API endpoint path (automatically prefixed with /api/auth)
 * @param data - Request payload
 * @returns Promise with response data
 */
export const authPostMethod = async <T>(path: string, data: unknown = null): Promise<T> => {
  const response = await AuthAxios.post<T>(path, data);
  return response.data;
};

/**
 * PATCH request to auth API endpoint
 * @param path - Auth API endpoint path (automatically prefixed with /api/auth)
 * @param data - Request payload (optional)
 * @returns Promise with response data
 */
export const authPatchMethod = async <T>(path: string, data: unknown = null): Promise<T> => {
  try {
    const response = await AuthAxios.patch<T>(path, data);
    return response.data;
  } catch (error) {
    logger.error('authPatchMethod error', error);
    // Re-throw the error so it can be handled by the error handler
    throw error;
  }
};