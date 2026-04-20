'use client';

import { Avatar, Box, Button, Divider, List, ListItemIcon, MenuItem, Popover, Stack, Typography } from '@mui/material';
import { Gear as GearIcon } from '@phosphor-icons/react/dist/ssr/Gear';
import { LockKey as LockKeyIcon } from '@phosphor-icons/react/dist/ssr/LockKey';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import RouterLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { memo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Logo } from '@/components/core/logo';
import { NotificationsButton } from '@/components/dashboard/layout/horizontal/main-nav';
import { CustomSignOut } from '@/components/dashboard/layout/user-popover/custom-sign-out';
import { useUser } from '@/hooks/use-user';
import { paths } from '@/paths';

interface DashboardHeaderProps {
  userEmail?: string;
  userAvatar?: string;
}

/**
 * DashboardHeader Component
 * 
 * Main header for the dashboard layout featuring:
 * - Brand logo with navigation to dashboard overview
 * - Central navigation menu for primary sections (Tokens, Portfolio)
 * - Notifications button for user alerts
 * - User profile button with popover menu
 * 
 * User information is automatically fetched from the authenticated user context.
 * Props can be used to override default values if needed.
 */
const DashboardHeader = memo(function DashboardHeader({ 
  userEmail: userEmailProp,
  userAvatar: userAvatarProp 
}: DashboardHeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [openPopover, setOpenPopover] = useState(false);
  const { user } = useUser();
  
  // Use prop values if provided, otherwise fall back to user context
  const userEmail = userEmailProp ?? user?.email ?? '';
  const userAvatar = userAvatarProp ?? user?.avatar;

  const handleOpenPopover = () => setOpenPopover(true);
  const handleClosePopover = () => setOpenPopover(false);

  // Navigation items matching the image
  const navItems = [
    { label: t('common:tokens'), path: paths.dashboard.tokens },
    { label: t('common:portfolio'), path: paths.dashboard.portfolio },
  ];

  const handleNavClick = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper', // White background
        borderRadius: 2,
        px: 3,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'none',
        border: 'none',
      }}
    >
      {/* Left Section - Brand */}
      <Box
        sx={{
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8,
          },
        }}
        onClick={() => router.push(paths.dashboard.overview)}
      >
        <Logo height={24} width={24} emblem/>
      </Box>

      {/* Center Section - Navigation */}
      <Stack direction="row" spacing={4} sx={{ alignItems: 'center' }}>
        {navItems.map((item) => (
          <Typography
            key={item.label}
            variant="body1"
            component="div"
            sx={{
              cursor: 'pointer',
              fontWeight: 400,
              fontSize: '1rem',
              color: isActive(item.path) ? 'text.primary' : 'text.secondary',
              transition: 'color 0.2s ease-in-out',
              '&:hover': {
                color: 'text.primary',
              },
            }}
            onClick={() => handleNavClick(item.path)}
          >
            {item.label}
          </Typography>
        ))}
      </Stack>

      {/* Right Section - Notifications & User Profile */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        {/* Notifications Button */}
        <NotificationsButton />

        {/* User Profile Button */}
        <Button
          ref={anchorRef}
          variant="text"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1,
            backgroundColor: 'background.level2', // Light gray background
            borderRadius: '10px', // Pill shape
            textTransform: 'none',
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: 'background.level3',
            },
          }}
          onClick={handleOpenPopover}
        >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            backgroundColor: 'background.paper', // White avatar background
            color: 'text.primary',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
          src={userAvatar}
        >
          {userEmail.charAt(0).toUpperCase()}
        </Avatar>
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
            fontWeight: 400,
            fontSize: '0.875rem',
          }}
        >
          {userEmail}
        </Typography>
        </Button>
      </Stack>

      {/* User Popover */}
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        onClose={handleClosePopover}
        open={Boolean(openPopover)}
        slotProps={{ paper: { sx: { width: '280px' } } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {userEmail?.split('@')[0] || t('common:user')}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {userEmail}
          </Typography>
        </Box>
        <Divider />
        <List sx={{ p: 1 }}>
          <MenuItem component={RouterLink} href={paths.dashboard.settings.account} onClick={handleClosePopover}>
            <ListItemIcon>
              <UserIcon />
            </ListItemIcon>
            {t('common:profile')}
          </MenuItem>
          <MenuItem component={RouterLink} href={paths.dashboard.settings.security} onClick={handleClosePopover}>
            <ListItemIcon>
              <LockKeyIcon />
            </ListItemIcon>
            {t('common:security')}
          </MenuItem>
          <MenuItem component={RouterLink} href={paths.dashboard.settings.notifications} onClick={handleClosePopover}>
            <ListItemIcon>
              <GearIcon />
            </ListItemIcon>
            {t('common:settings')}
          </MenuItem>
        </List>
        <Divider />
        <Box sx={{ p: 1 }}>
          <CustomSignOut />
        </Box>
      </Popover>
    </Box>
  );
});

export default DashboardHeader;
