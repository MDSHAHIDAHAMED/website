'use client';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { config } from '@/config';
import { AuthStrategy } from '@/lib/auth/strategy';

import AtomTypography from '@/components/atoms/typography';
import { paths } from '@/paths';
import { List, ListItemIcon, MenuItem } from '@mui/material';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import RouterLink from 'next/link';
import { CustomSignOut } from './custom-sign-out';


export interface UserPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: Readonly<UserPopoverProps>): React.JSX.Element {
  const { t } = useTranslation();
  
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={Boolean(open)}
      slotProps={{ paper: { sx: { width: '150px',backgroundColor: 'var(--mui-palette-neutral-900)' } } }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      {/* <Box sx={{ p: 2 }}>
        <Typography>{user.name}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user.email}
        </Typography>
      </Box> */}
     
       <List sx={{ p: 1 }}>
        <MenuItem component={RouterLink} href={paths.dashboard.profile} onClick={onClose}>
          <ListItemIcon>
            <UserIcon />
          </ListItemIcon>
          <AtomTypography variant="subtitle2" color="text.primary">{t('common:profile')}</AtomTypography>
        </MenuItem>
        {/*<MenuItem component={RouterLink} href={paths.dashboard.settings.security} onClick={onClose}>
          <ListItemIcon>
            <LockKeyIcon />
          </ListItemIcon>
          {t('common:security')}
        </MenuItem>
        <MenuItem component={RouterLink} href={paths.dashboard.settings.billing} onClick={onClose}>
          <ListItemIcon>
            <CreditCardIcon />
          </ListItemIcon>
          {t('common:billing')}
        </MenuItem>*/}
      </List> 
      <Divider />
      <Box sx={{ p: 0.5 }}>{config.auth.strategy === AuthStrategy.CUSTOM ? <CustomSignOut /> : null}</Box>
    </Popover>
  );
}
