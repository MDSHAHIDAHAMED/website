import { logger } from '@/lib/default-logger';

/**
 * -----------------------------------------------------------------------------
 * handleServiceError()
 * -----------------------------------------------------------------------------
 * Centralized, fault-tolerant error handler for API and async operations.
 *
 * Design principles:
 *  - Never throws → always returns a clean string message.
 *  - Handles multiple error shapes: Axios, Fetch, Custom, plain string.
 *  - Provides clear logging for developers, and safe output for users.
 * -----------------------------------------------------------------------------
 */

/**
 * Extracts error message from various error structures
 */
function extractErrorMessage(error: any): string | null {
  // Check for nested error structure: { error: { message: "..." } }
  if (error?.error?.message && typeof error.error.message === 'string') {
    return error.error.message;
  }
  
  // Check for direct message: { message: "..." }
  if (error?.message && typeof error.message === 'string') {
    return error.message;
  }
  
  // Check for detail field: { detail: "..." }
  if (error?.detail && typeof error.detail === 'string') {
    return error.detail;
  }
  
  // Check for error field: { error: "..." }
  if (error?.error && typeof error.error === 'string') {
    return error.error;
  }
  
  return null;
}

/**
 * Applies specific error message transformations
 */
function transformErrorMessage(message: string, defaultMessage: string): string {
  if (message.includes('account already exists') || message.includes('account_exists')) {
    return 'An account with this email already exists. Please try signing in instead.';
  }
  
  if (message.includes('execution reverted')) {
    return `${defaultMessage}: Execution reverted. Check your parameters and try again.`;
  }
  
  return message;
}

export function handleServiceError(error: unknown, defaultMessage: string): string {
  try {
    // Handle string errors
    if (typeof error === 'string') {
      return transformErrorMessage(error, defaultMessage);
    }
    
    // Handle Error instances (including AxiosError)
    if (error instanceof Error) {
      let errorMessage = error.message;
      
      // For AxiosError, try to extract API response data
      if ('response' in error) {
        const apiData = (error as any).response?.data || (error as any).data;
        const extractedMessage = extractErrorMessage(apiData);
        if (extractedMessage) {
          errorMessage = extractedMessage;
        }
      }
      
      return transformErrorMessage(errorMessage, defaultMessage);
    }
    
    // Handle object errors
    if (typeof error === 'object' && error !== null) {
      const err = error as Record<string, any>;
      const apiData = err.response?.data || err.data || err;
      
      const extractedMessage = extractErrorMessage(apiData) || 
                              err.statusText || 
                              err.message;
      
      if (extractedMessage) {
        return transformErrorMessage(extractedMessage, defaultMessage);
      }
    }
    
    return defaultMessage;
  } catch (error_) {
    logger.warn('Error parsing failed inside handleServiceError', error_);
    return defaultMessage;
  } finally {
    logger.error(`[ServiceError] Processing error`, { originalError: error });
  }
}