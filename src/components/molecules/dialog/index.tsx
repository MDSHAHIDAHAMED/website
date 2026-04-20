import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface CommonDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  content: string | React.ReactNode;
  showActions?: boolean;
  actionText?: string;
  hideCloseButton?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const CommonDialog: React.FC<CommonDialogProps> = ({
  open,
  onClose,
  title,
  content,
  showActions = false,
  actionText = 'OK',
  hideCloseButton = false,
  maxWidth = 'sm',
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      {title && <DialogTitle>{title}</DialogTitle>}

      <DialogContent>
        <Box sx={{ mt: 1 }}>{typeof content === 'string' ? <Typography>{content}</Typography> : content}</Box>
      </DialogContent>

      {showActions && (
        <DialogActions>
          {!hideCloseButton && (
            <Button onClick={onClose} variant="outlined" color="inherit">
              Close
            </Button>
          )}
          <Button onClick={onClose} variant="contained" color="primary">
            {actionText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CommonDialog;
