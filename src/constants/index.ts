import { KYCStatusResponse } from "@/services/kyc";
import { Theme } from "@mui/material";
import { SxProps } from "@mui/system";

export const TOST_DURATION = {
  SLOW: 9000,
  MEDIUM: 5000,
  FAST: 3000,
};
export const PASSWORD_LENGTH = {
  min: 8,
  max: 16,
};
export const NAME_LENGTH = {
  MAX: 50,
  MIN: 2,
};

// =============================================================================
// Types & Interfaces
// =============================================================================

export interface PersonaKYCProps {
  readonly onComplete?: (data: { inquiryId: string; status: string; fields?: any }) => void;
  readonly onCancel?: () => void;
  readonly onError?: (error: any) => void;
  readonly statusData?: KYCStatusResponse | null;
}

export interface DocumentItem {
  id: string;
  name: string;
}

/**
 * Step configuration for the verification flow
 */
export interface StepConfig {
  title: string;
  description: string;
  buttonLabel: string;
}

export const OTP_LENGTH = 6;
export const RESEND_COOLDOWN_SECONDS = 120;

export const OTP_TYPE = {
  TOTP: 'TOTP',
  SMS: 'SMS',
  EMAIL: 'EMAIL',
};

export const SOCKET_EVENTS = {
  NOTIFICATION_NEW: 'notification:new',
  USER_VERIFICATION:'notification:verification'
};
 /** Background video source path */
export const BACKGROUND_VIDEO_SRC = '/assets/videos/split-bg.mp4';

 /** Main container styles */
 export const MAIN_CONTAINER_DASHBOARD_SX: SxProps<Theme> = {
  minHeight: '100vh',
  height: { xs: 'auto', md: '100vh' },
  width: '100%',
  position: 'relative',
  overflow: { xs: 'visible', md: 'hidden' },
};

/** Background video container styles (uses Record for component compatibility) */
export const VIDEO_CONTAINER_SX: Record<string, unknown> = {
  height: '100%',
  width: '100%',
  pt: { xs: 2, sm: 3, md: 5, lg: 6 },
  pl: { xs: 2, sm: 3, md: 5, lg: 6 },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/** Investment card configuration */
export interface InvestmentCardConfig {
  id: string;
  variant: 'mining' | 'token';
  logoSubtitle: string;
  showWatermark: boolean;
}


/** Grid size configuration for responsive layout */
export const GRID_SIZE_CONFIG = {
  xs: 12,
  sm: 12,
  md: 6,
  lg: 6,
} as const;