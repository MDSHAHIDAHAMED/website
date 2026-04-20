import type { User } from '@/types/user';

export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  otpMethodId: string | null;
  otpEmail: string | null;
  checkSession: (showToast?: boolean) => Promise<void>;
  clearUser: () => void;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  setOtpMethodId: (methodId: string | null) => void;
  setOtpEmail: (email: string | null) => void;
}
