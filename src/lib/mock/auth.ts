import type { OtpMethodResponse } from '@/types/auth';
import type { AuthResponse } from '@/utils/user-auth';

/**
 * Mocks OTP sign-up API.
 * Returns a method_id for OTP verification.
 */
export async function mockOtpSignUpApi(email: string): Promise<OtpMethodResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  
    // Simulated success response
    return {
      data: {
        method_id: `mocked-method-id-${crypto.randomUUID()}`,
      },
    };
  }
  


/**
 * Mocks OTP verification API for sign-up.
 * --------------------------------------------------
 * Simulates verifying the OTP code sent to user's email.
 * Returns a fake session JWT and user object on success.
 *
 * @param methodId - The method_id received from OTP start API
 * @param code - The OTP entered by the user
 * @returns Promise<AuthResponse> - Mock authentication response matching API spec
 */
export async function mockOtpVerifyApi(methodId: string | null, code: string | null): Promise<AuthResponse> {
    // Simulate a small network delay
    await new Promise((resolve) => setTimeout(resolve, 600));
  
    // Simulate error for invalid code
    if (code !== '123456') {
      // Mock failure (similar to a 400 Bad Request)
      throw {
        response: {
          status: 400,
          data: {
            message: 'Invalid or expired OTP code.',
          },
        },
      };
    }
  
    // Simulate success response matching AuthResponse type
    const now = new Date().toISOString();
    return {
      data: {
        session: {
          session_jwt: `mocked-session-jwt-${crypto.randomUUID()}`,
          expires_at: Date.now() + 1000 * 60 * 60, // +1 hour expiry
          claims: { verified: true },
          auth_type: 'FULL',
        },
        user: {
          user_id: `mocked-user-id-${crypto.randomUUID()}`,
          email: 'mocked.user@example.com',
          status: 'active',
          is_locked: false,
          created_at: now,
          roles: ['user'],
          claims: { verified: true },
          external_id: `ext-${crypto.randomUUID()}`,
        },
        device: {
          device_id: crypto.randomUUID(),
          platform: 'WEB',
          display_name: 'Mock Browser on Mock OS',
          created_at: now,
          last_seen_at: now,
          status: 'ACTIVE',
          first_seen_at: now,
          last_auth_at: now,
          has_passkey_for_user: false,
        },
      },
    };
  }
  