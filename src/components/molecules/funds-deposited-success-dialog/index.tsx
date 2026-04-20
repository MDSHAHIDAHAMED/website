'use client';

/**
 * Funds Deposited Success Dialog Component
 * ========================================
 *
 * Success dialog displayed when onramper transaction completes successfully.
 * Shows a success icon, message, and button to view portfolio.
 *
 * Features:
 * - Dark theme styling matching the design system
 * - Success icon with pixelated checkmark
 * - "Funds deposited" message
 * - "VIEW IN PORTFOLIO" button
 * - Close button in top right corner
 */
import { AtomButton } from '@/components/atoms/button';
import AtomTypography from '@/components/atoms/typography';
import { paths } from '@/paths';
import { Box, Dialog } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { CornerContainer } from 'yldzs-components';

// =============================================================================
// Types
// =============================================================================

export interface FundsDepositedSuccessDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog is closed */
  onClose: () => void;
  /**
   * Whether to show the "View in Portfolio" button (default: true)
   *
   * Usage:
   * - Investment Flow: ALWAYS true (button shows)
   * - Onramper Flow: ALWAYS false (button hidden)
   */
  showViewPortfolio?: boolean;
  /**
   * Whether this is a withdrawal transaction (default: false)
   * When true, shows "Funds withdrawn successfully" instead of "Funds deposited successfully"
   */
  isWithdrawal?: boolean;
}

// =============================================================================
// Styles
// =============================================================================

/** Dialog paper styles */
const DIALOG_PAPER_SX: SxProps<Theme> = {
  backgroundColor: 'transparent',
  minWidth: 400,
  maxWidth: 500,
  position: 'relative',
  boxShadow: 'none',
  borderRadius: 0,
};

/** Header container with close button */
const HEADER_SX: SxProps<Theme> = {
  position: 'absolute',
  top: 16,
  right: 16,
  zIndex: 1,
};

/** Content container styles */
const CONTENT_SX: SxProps<Theme> = {
  px: 4,
  py: 6,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 3,
  textAlign: 'center',
};

/** Success icon container */
const SUCCESS_ICON_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 80,
  height: 80,
};

/** Message container */
const MESSAGE_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

/** Button container */
const BUTTON_CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
  mt: 2,
};

// =============================================================================
// Main Component
// =============================================================================

/**
 * Funds Deposited Success Dialog Component
 *
 * @param props - Component props
 * @returns Success dialog JSX element
 */
export function FundsDepositedSuccessDialog({
  open,
  onClose,
  showViewPortfolio = true,
  isWithdrawal = false,
}: Readonly<FundsDepositedSuccessDialogProps>): React.JSX.Element {
  const router = useRouter();

  /**
   * Handle View Portfolio button click
   * Navigates to portfolio page and closes dialog
   */
  const handleViewPortfolio = () => {
    router.push(paths.dashboard.portfolio);
    onClose();
  };

  /**
   * Get success message based on transaction type
   */
  const getSuccessMessage = () => {
    if (isWithdrawal) {
      return showViewPortfolio ? 'Funds withdrawn successfully' : 'Funds withdrawn successfully in your wallet';
    }
    return showViewPortfolio ? 'Funds deposited successfully' : 'Funds deposited successfully in your wallet';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: DIALOG_PAPER_SX,
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
      }}
    >
      {/* Close Button */}
      <Box sx={HEADER_SX}>
        <AtomButton
          id="close-success-dialog"
          label={<Image src="/assets/icons/cross-button.svg" alt="Close" width={20} height={20} />}
          onClick={onClose}
          variant="text"
          color="secondary"
          size="small"
          sx={{
            minWidth: 'auto',
            width: 32,
            height: 32,
            p: 0,
          }}
        />
      </Box>

      {/* Content */}
      <CornerContainer showBorder sx={{ p: 0 }}>
        <Box sx={CONTENT_SX}>
          {/* Success Icon */}
          <Box sx={SUCCESS_ICON_CONTAINER_SX}>
            <Image src="/assets/icons/success.svg" alt="Success" width={80} height={80} style={{ display: 'block' }} />
          </Box>

          {/* Success Message */}
          <Box sx={MESSAGE_SX}>
            <AtomTypography variant="h4" color="text.primary" textAlign="center">
              {getSuccessMessage()}
            </AtomTypography>
          </Box>

          {/* View Portfolio Button - Only show if showViewPortfolio is true */}
          {showViewPortfolio && (
            <Box sx={{ width: '100%' }}>
              <AtomButton
                id="view-portfolio-btn"
                label="VIEW IN PORTFOLIO"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleViewPortfolio}
              />
            </Box>
          )}
        </Box>
      </CornerContainer>
    </Dialog>
  );
}

export default FundsDepositedSuccessDialog;
