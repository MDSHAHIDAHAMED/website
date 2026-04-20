import { AtomButton } from '@/components/atoms/button';
import AtomTypography from '@/components/atoms/typography';
import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton
} from '@mui/material';
import React from 'react';

/**
 * Confirmation Action Modal Props
 * ================================
 * 
 * @property open - Whether the modal is open
 * @property onClose - Callback when modal is closed
 * @property onConfirm - Callback when confirm button is clicked
 * @property title - Modal title
 * @property description - Modal description (string or React node)
 * @property confirmButtonText - Text for confirm button (optional - if not provided, button won't show)
 * @property cancelButtonText - Text for cancel button (optional - if not provided, button won't show)
 * @property isLoading - Whether the modal is in loading state
 */
interface ConfirmActionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string | React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText,
  cancelButtonText,
  isLoading = false,
  maxWidth = 'sm',
}) => {
  /**
   * Check if any action buttons should be displayed
   * DialogActions will only render if at least one button text is provided
   */
  const hasActionButtons = Boolean(confirmButtonText || cancelButtonText);

  /**
   * Handle modal close
   * Prevents closing while loading
   */
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  /**
   * Handle confirm button click
   * Calls onConfirm callback (async supported)
   */
  const handleConfirm = async () => {
    await onConfirm();
    // Parent component will close the dialog after the async operation completes
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth={maxWidth} 
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: 'background.default',
        },
      }}
    >
      <DialogTitle 
        id="confirm-action-modal-title"
        sx={{ 
          px: 3, 
          pt: 3, 
          pb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <AtomTypography variant="h4" color="text.primary">
          {title}
        </AtomTypography>
        <IconButton
          id="confirm-action-modal-close-button"
          onClick={handleClose}
          disabled={isLoading}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
              backgroundColor: 'action.hover',
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText 
          id="confirm-action-modal-description"
          component="div"
          sx={{
            mb: 0,
          }}
        >
          {typeof description === 'string' ? (
            <AtomTypography variant="subtitle1" color="text.secondary">
              {description}
            </AtomTypography>
          ) : (
            description
          )}
        </DialogContentText>
      </DialogContent>
      
      {/* Only render DialogActions if at least one button text is provided */}
      {hasActionButtons && (
        <DialogActions sx={{ p: 3, gap: 2 }}>
          {cancelButtonText && (
            <AtomButton 
              id="confirm-action-modal-cancel-button" 
              onClick={handleClose} 
              color="secondary" 
              label={cancelButtonText} 
              size="medium"
              disabled={isLoading}
            />
          )}
          {confirmButtonText && (
            <AtomButton 
              id="confirm-action-modal-confirm-button" 
              onClick={handleConfirm} 
              label={confirmButtonText} 
              size="medium"
              disabled={isLoading}
            />
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ConfirmActionModal;
