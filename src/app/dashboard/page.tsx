'use client';

/**
 * Dashboard Page
 * ==============
 * Main dashboard page with multi-step verification flow and investment overview.
 *
 * Features:
 * - KYC verification via Persona
 * - Accreditation via NorthCapital
 * - DocuSign document signing
 * - Investment performance cards
 */
import {
  BACKGROUND_VIDEO_SRC,
  GRID_SIZE_CONFIG,
  InvestmentCardConfig,
  MAIN_CONTAINER_DASHBOARD_SX,
  SOCKET_EVENTS,
  VIDEO_CONTAINER_SX,
} from '@/constants';
import { CardVariant, MetricItem, VariantDisplayConfig } from '@/constants/dashboard-card';
import { TOAST_IDS, TOAST_MESSAGES } from '@/constants/user-verification';
import { checkKYCStatus, KYCStatusResponse } from '@/services/kyc';
import { useDispatch } from '@/store';
import { setInquiryId } from '@/store/slices/user-slice';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { Box, Divider, Grid, type SxProps, type Theme } from '@mui/material';
import { TFunction } from 'i18next';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AtomTypography from '@/components/atoms/typography';
import BackgroundVideoContainer from '@/components/atoms/video/background-container';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Logo } from '@/components/core/logo';
import MiningCostCard from '@/components/dashboard/overview/mining-cost-card';
import PersonaKYC from '@/components/kyc/persona-kyc';
import useSocketEvents from '@/hooks/use-socket-events';
import { logger } from '@/lib/default-logger';

/** Grid container styles */
const GRID_CONTAINER_SX: SxProps<Theme> = {
  height: { xs: 'auto', md: '100%' },
  minHeight: { xs: 'auto', md: '100vh' },
};

/** Left grid (KYC section) styles */
const LEFT_GRID_SX: SxProps<Theme> = {
  height: { xs: 'auto', md: '100%' },
  minHeight: { xs: '50vh', md: '100vh' },
  pt: { xs: 2, sm: 3, md: 3, lg: 3 },
  pb: { xs: 2, sm: 3, md: 3, lg: 3 },
};

/** Right grid (cards section) styles */
const RIGHT_GRID_SX: SxProps<Theme> = {
  height: { xs: 'auto', md: '100%' },
  minHeight: { xs: 'auto', md: '100vh' },
  pl: { xs: 0, sm: 0, md: 3, lg: 3 },
  pr: { xs: 0, sm: 0, md: 0, lg: 0 },
  pt: { xs: 3, sm: 4, md: 4, lg: 4 },
  pb: { xs: 3, sm: 4, md: 4, lg: 4 },
};

/** Cards container styles */
const CARDS_CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

/** Individual card wrapper styles */
const CARD_WRAPPER_SX: SxProps<Theme> = {
  flex: 1,
};

/** Investment cards to display in the right section */
const INVESTMENT_CARDS: readonly InvestmentCardConfig[] = [
  { id: 'mining-card', variant: 'mining', logoSubtitle: 'Holdings Inc.', showWatermark: false },
  { id: 'token-card', variant: 'token', logoSubtitle: 'Token', showWatermark: true },
] as const;
/**
 * Dashboard Page Component
 *
 * Renders the main dashboard with:
 * - Left side: KYC/Accreditation/DocuSign verification flow
 * - Right side: Investment performance cards
 *
 * @returns Dashboard page wrapped in AuthGuard
 */
export default function DashboardPage(): React.JSX.Element {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  /**
   * Get fleet efficiency metrics data with translations
   * @param t - Translation function
   * @returns Array of translated fleet metrics
   */
  const getFleetMetrics = (t: TFunction): MetricItem[] => [
    { id: 'metric-label-1', label: t('miningCard:label'), value: '0.00 VAL' },
    { id: 'metric-efficiency-1', label: t('miningCard:fleetEfficiency'), value: '0.00%' },
    { id: 'metric-label-2', label: t('miningCard:label'), value: '0.00 VAL' },
    { id: 'metric-efficiency-2', label: t('miningCard:fleetEfficiency'), value: '0.00%' },
  ];
  /**
   * Fleet efficiency metrics data
   * Static data for display in marquee
   */
  const FLEET_METRICS_BACKGROUND: MetricItem[] = [
    { id: 'metric-efficiency-1', label: 'FLEET EFFICIENCY', value: '0.00%' },
    { id: 'metric-label-1', label: 'LABEL', value: '0.00 VAL' },
    { id: 'metric-efficiency-2', label: 'FLEET EFFICIENCY', value: '0.00%' },
    { id: 'metric-label-2', label: 'LABEL', value: '0.00 VAL' },
  ];

  const VARIANT_CONFIGS: Record<CardVariant, VariantDisplayConfig> = {
    mining: {
      labelKey: 'miningCard:costToMine',
      value: '$33,384',
      showIcon: false,
    },
    token: {
      labelKey: '15.04%',
      value: '15.04%',
      showIcon: true,
      icon: '⚡',
    },
  } as const;

  // ===========================================================================
  // State & Data Fetching
  // ===========================================================================

  const [statusData, setStatusData] = useState<KYCStatusResponse | null>(null);

  /**
   * Fetch current verification status
   * Memoized to prevent recreation on each render
   */
  const fetchUserVerificationStatus = useCallback(async () => {
    try {
      const status = await checkKYCStatus();
      setStatusData(status);

      // Store inquiry ID if available
      if (status.inquiryId) {
        dispatch(setInquiryId(status.inquiryId));
      }
    } catch {
      setStatusData(null);
    }
  }, [dispatch]);

  /** Fetch status on mount */
  useEffect(() => {
    fetchUserVerificationStatus();
  }, [fetchUserVerificationStatus]);

  /**
   * Socket event handler for user verification updates
   * Memoized with fetchUserVerificationStatus as dependency
   */
  const handleSocketVerification = useCallback(
    (socketData: unknown) => {
      logger.debug('[Dashboard] User verification socket event received:', socketData);
      fetchUserVerificationStatus();
    },
    [fetchUserVerificationStatus]
  );

  /**
   * Socket Event Listener
   * Listens for user verification updates and refreshes status
   */
  useSocketEvents({
    autoJoin: true,
    events: {
      [SOCKET_EVENTS.NOTIFICATION_NEW]: handleSocketVerification,
    },
  });

  // ===========================================================================
  // Event Handlers (memoized to prevent unnecessary re-renders)
  // ===========================================================================

  /**
   * Handle KYC verification completion
   * Shows success toast only if status indicates successful completion
   * Skips success message for rejected/failed/declined statuses
   */
  const handleKYCComplete = useCallback(
    ({ inquiryId, status }: { inquiryId: string; status: string }) => {      
      // Only show success toast for successful completion status
      // Skip for rejected/failed/declined statuses from Persona
      if (status === 'completed') {
        showSuccessToast(TOAST_IDS.KYC_COMPLETE, TOAST_MESSAGES.KYC_COMPLETE);
      } else if (status === 'rejected' || status === 'failed' || status === 'declined') {
        showErrorToast(TOAST_IDS.KYC_ERROR, TOAST_MESSAGES.KYC_ERROR);
      }
      fetchUserVerificationStatus();
    },
    [fetchUserVerificationStatus]
  );

  /**
   * Handle KYC verification cancellation
   * Logs cancellation for debugging purposes
   */
  const handleKYCCancel = useCallback(() => {
    fetchUserVerificationStatus();
  }, [fetchUserVerificationStatus]);

  /**
   * Handle KYC verification error
   * Shows error toast and logs error details
   */
  const handleKYCError = useCallback(
    (error: Error) => {
      showErrorToast(TOAST_IDS.KYC_ERROR, TOAST_MESSAGES.KYC_ERROR);
      fetchUserVerificationStatus();
    },
    [fetchUserVerificationStatus]
  );

  /** Glass effect content for the background video container */
  const glassEffectChildren = (
    <>
      {/* Logo */}
      <Box sx={{display:'flex', justifyContent:'flex-start', alignItems:'center', gap:1}}>
       <AtomTypography variant="h5" color="text.primary">My</AtomTypography> <Logo width={120} height={60} emblem />
      </Box>

      {/* Heading with tickerbit font */}
      <AtomTypography fontType="tickerbit" variant="h1">
        22.54% <span style={{ fontSize: '16px',fontFamily: 'PP Mori' }}>APY</span>
      </AtomTypography>

      {/* Divider */}
      <Divider
        sx={{
          width: '100%',
          borderColor: 'primary.950',
        }}
      />

      {/* Fleet Efficiency Metrics with Marquee */}
      <Box sx={{ overflow: 'hidden', mt: 3 }}>
        {/* @ts-expect-error - marquee is deprecated but used per requirement */}
        <marquee direction="left">
          <Box sx={{ display: 'flex', gap: 4 }}>
            {['set1', 'set2', 'set3', 'set4'].map((setId) => (
              <Box key={setId} sx={{ display: 'inline-flex', gap: 4 }}>
                {FLEET_METRICS_BACKGROUND.map((metric) => (
                  <Box
                    key={`${metric.id}-${setId}`}
                    sx={{
                      display: 'inline-flex',
                      flexDirection: 'column',
                      minWidth: 150,
                    }}
                  >
                    <AtomTypography variant="label3" color="text.secondary" sx={{ mb: 0.5 }}>
                      {metric.label}
                    </AtomTypography>
                    <AtomTypography variant="subtitle4" color="text.primary">
                      {metric.value}
                    </AtomTypography>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
          {/* @ts-expect-error - closing marquee tag */}
        </marquee>
      </Box>
    </>
  );

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <AuthGuard>
      <Box sx={MAIN_CONTAINER_DASHBOARD_SX}>
        <Grid container spacing={0} sx={GRID_CONTAINER_SX}>
          {/* Left Section: Verification Flow */}
          <Grid size={GRID_SIZE_CONFIG} sx={LEFT_GRID_SX}>
            <BackgroundVideoContainer
              src={BACKGROUND_VIDEO_SRC}
              sx={VIDEO_CONTAINER_SX}
              glassEffectChildren={glassEffectChildren}
            >
              <PersonaKYC
                onComplete={handleKYCComplete}
                onCancel={handleKYCCancel}
                onError={handleKYCError}
                statusData={statusData}
              />
            </BackgroundVideoContainer>
          </Grid>

          {/* Right Section: Investment Cards */}
          <Grid size={GRID_SIZE_CONFIG} sx={RIGHT_GRID_SX}>
            <Box sx={CARDS_CONTAINER_SX}>
              {INVESTMENT_CARDS.map((card) => (
                <Box key={card.id} sx={CARD_WRAPPER_SX}>
                  <MiningCostCard
                    variant={card.variant}
                    showLogo
                    logoSubtitle={card.logoSubtitle}
                    showWatermark={card.showWatermark}
                    fleetMetrics={getFleetMetrics(t)}
                    variantConfig={VARIANT_CONFIGS[card.variant]}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </AuthGuard>
  );
}
