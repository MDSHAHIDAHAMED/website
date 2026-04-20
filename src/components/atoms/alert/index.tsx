import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { AlertTitle, Box, IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { kebabCase } from 'change-case';
import * as React from 'react';

interface AlertProps {
  type: 'error' | 'info' | 'success' | 'warning';
  content: {
    heading: string;
    message: string | React.ReactNode;
  };
  id: string;
  // icon?: React.ReactNode;
  onClose?: (event: React.SyntheticEvent) => void;
  isMultiline?: boolean;
}

function AtomAlert(props: Readonly<AlertProps>): React.JSX.Element {
  const { content, type, id, onClose, isMultiline = false } = props;

  const getIconBySeverity = (severity: AlertProps['type']): React.ReactNode => {
    switch (severity) {
      case 'error':
        return <CancelIcon />;
      case 'warning':
        return <ErrorIcon />;
      case 'info':
        return <InfoIcon />;
      case 'success':
        return <CheckCircleIcon />;
      default:
        return null;
    }
  };
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert
        severity={type}
        id={id}
        data-testid={`qa-${kebabCase(id ?? '')}`}
        icon={getIconBySeverity(type)}
        action={
          <IconButton aria-label="close" color="inherit" size="small" disableFocusRipple disableRipple disableTouchRipple onClick={onClose}>
            {/* <CloseIcon fontSize="inherit" /> */}
          </IconButton>
        }
      >
        {!isMultiline ? (
          <Box display="flex" flexDirection="row" gap={2}>
            <AlertTitle>{content.heading}</AlertTitle>
            {content.message}
          </Box>
        ) : (
          <>
            <AlertTitle>{content.heading}</AlertTitle>
            {content.message}
          </>
        )}
      </Alert>
    </Stack>
  );
}
export default AtomAlert;
