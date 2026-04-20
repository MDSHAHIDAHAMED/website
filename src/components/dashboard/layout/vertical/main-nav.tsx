'use client';

import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import AtomButton from '@/components/atoms/button';
import AtomNavItem from '@/components/atoms/nav-item';
import { Logo } from '@/components/core/logo';
import { useDialog } from '@/hooks/use-dialog';
import { usePopover } from '@/hooks/use-popover';
import { paths } from '@/paths';
import type { NavItemConfig } from '@/types/nav';

import CornerContainer from '@/components/atoms/corner-container';
import { useUser } from '@/hooks/use-user';
import { useDispatch, useSelector } from '@/store';
import { fetchUnreadCountThunk } from '@/store/thunks/notification-thunk';
import { useRouter } from 'next/navigation';
import { ContactsPopover } from '../contacts-popover';
import type { Language } from '../language-popover';
import { languageFlags, LanguagePopover } from '../language-popover';
import { MobileNav } from '../mobile-nav';
import { NotificationsPopover } from '../notifications-popover';
import { SearchDialog } from '../search-dialog';
import { UserPopover } from '../user-popover/user-popover';

export interface MainNavProps {
  items: NavItemConfig[];
}

export function MainNav({ items }: Readonly<MainNavProps>): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const navPopover = usePopover<HTMLButtonElement>();
  const { t } = useTranslation();
  const router = useRouter();
  // Navigation items array: Home, Tokens, Portfolio
  const navItems = [
    { label: t('common:home') || 'Home', path: paths.dashboard.overview },
    { label: t('common:tokens'), path: paths.dashboard.tokens },
    { label: t('common:portfolio'), path: paths.dashboard.portfolio },
  ];

  return (
      <CornerContainer>
      <Box
        component="header"
        sx={{
          '--MainNav-background': 'var(--mui-palette-background-default)',
          '--MainNav-divider': 'var(--mui-palette-divider)',
          bgcolor: 'var(--MainNav-background)',
          left: 0,
          position: 'sticky',
          pt: { lg: 'var(--Layout-gap)' },
          top: 0,
          width: '100%',
          zIndex: 'var(--MainNav-zIndex)',
        }}
      >
        <Box
          sx={{
            // borderBottom: '1px solid var(--MainNav-divider)',
            display: 'flex',
            flex: '1 1 auto',
            minHeight: 'var(--MainNav-height)',
            px: { xs: '0px', md: '50px', lg: '30px' },
            py: '12px',
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto' }}>
            {/* Hamburger Menu Button - Mobile Only (Opens Full MobileNav Drawer) */}
             {/* Mobile Navigation Dropdown Button - Shows nav items popover */}
             <IconButton
              onClick={navPopover.handleOpen}
              ref={navPopover.anchorRef}
              sx={{ display: { sm: 'inline-flex', md: 'none' } }}
            >
              <ListIcon />
            </IconButton>

            {/* Logo - Clickable to navigate to dashboard */}
            <Box
              component="button"
              onClick={() => router.push(paths.dashboard.overview)}
              sx={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Logo width={124} height={20} emblem />
            </Box>

          </Stack>

          {/* Center Section - Navigation Items from DashboardHeader */}
          <Stack
            direction="row"
            spacing={4}
            sx={{
              alignItems: 'center',
              flex: '1 1 auto',
              justifyContent: 'center',
              display: { xs: 'none', md: 'flex' },
            }}
          >
            {navItems.map((item) => (
              <AtomNavItem key={item.path} label={item.label} href={item.path} />
            ))}
          </Stack>

          <Stack
            direction="row"
            spacing={{ xs: 1, md: 2}}
            sx={{ alignItems: 'center', flex: '1 1 auto', justifyContent: 'flex-end' }}
          >
            <NotificationsButton />
            {/* <ContactsButton /> */}
            <Divider
              flexItem
              orientation="vertical"
              sx={{ borderColor: 'var(--MainNav-divider)', display: { xs: 'none', lg: 'block' } }}
            />
            {/* <LanguageSwitch /> */}
            <UserButton />
          </Stack>
        </Box>
      </Box>
      <MobileNav
        items={items}
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />

      {/* Mobile Navigation Popover - Shows Home, Tokens, Portfolio */}
      <Popover
        anchorEl={navPopover.anchorRef.current}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={navPopover.handleClose}
        open={navPopover.open}
        slotProps={{
          paper: {
            sx: {
              width: '85%',
              margin: '0 auto',
              mt: 1,
              padding: '6px 10px',
              backgroundColor: 'var(--mui-palette-neutral-900)',
              borderColor: 'var(--mui-palette-neutral-700)',
            },
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        <List sx={{ p: 0 }}>
          {navItems.map((item, index) => (
            <React.Fragment key={item.path}>
              <ListItem disablePadding>
                <Box sx={{ py: 1.5, px: 2, width: '100%' }}>
                  <AtomNavItem
                    label={item.label}
                    href={item.path}
                    onClick={() => {
                      navPopover.handleClose();
                    }}
                  />
                </Box>
              </ListItem>
              {index < navItems.length - 1 && <Divider sx={{ borderColor: 'var(--MainNav-divider)' }} />}
            </React.Fragment>
          ))}
        </List>
      </Popover>
    </CornerContainer>
  );
}

function SearchButton(): React.JSX.Element {
  const dialog = useDialog();

  return (
    <React.Fragment>
      <Tooltip title="Search">
        <IconButton onClick={dialog.handleOpen} sx={{ display: { xs: 'none', lg: 'inline-flex' } }}>
          <MagnifyingGlassIcon />
        </IconButton>
      </Tooltip>
      <SearchDialog onClose={dialog.handleClose} open={dialog.open} />
    </React.Fragment>
  );
}

function ContactsButton(): React.JSX.Element {
  const popover = usePopover<HTMLButtonElement>();

  return (
    <React.Fragment>
      <Tooltip title="Contacts">
        <IconButton onClick={popover.handleOpen} ref={popover.anchorRef}>
          <UsersIcon />
        </IconButton>
      </Tooltip>
      <ContactsPopover anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open} />
    </React.Fragment>
  );
}

/**
 * Notifications Button Component
 * ===============================
 * Displays notification bell icon with badge indicator for unread notifications.
 * Only shows the red dot/badge when there are unread notifications.
 */
function NotificationsButton(): React.JSX.Element {
  const dispatch = useDispatch();
  const popover = usePopover<HTMLButtonElement>();

  // Get unread count from Redux store
  const unreadCount = useSelector((state) => {
    console.log("🚀 ~ NotificationsButton ~ state:", state)
    return state.notification?.unreadCount?.count;
  });
  console.log("🚀 ~ NotificationsButton ~ unreadCount:", unreadCount)


  // Fetch unread count on component mount (app startup)
  React.useEffect(() => {
    dispatch(fetchUnreadCountThunk());
  }, [dispatch]);

  // Refresh unread count when popover opens to ensure we have the latest count
  React.useEffect(() => {
    if (popover.open) {
      dispatch(fetchUnreadCountThunk());
    }
  }, [popover.open, dispatch]);

  return (
    <React.Fragment>
      <Tooltip title="Notifications">
        <Badge
          badgeContent={(unreadCount ?? 0) > 0 ? unreadCount : undefined}
          color="error"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.75rem',
              height: '18px',
              minWidth: '18px',
              padding: '0 4px',
            },
            // Show dot style when count is 1 (single unread notification)
            ...(unreadCount === 1 && {
              '& .MuiBadge-badge': {
                borderRadius: '50%',
                height: '10px',
                right: '6px',
                top: '6px',
                width: '10px',
                minWidth: '10px',
                padding: 0,
              },
            }),
          }}
        >
          <IconButton onClick={popover.handleOpen} ref={popover.anchorRef}>
            <BellIcon />
          </IconButton>
        </Badge>
      </Tooltip>
      <NotificationsPopover anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open} />
    </React.Fragment>
  );
}

function LanguageSwitch(): React.JSX.Element {
  const { i18n } = useTranslation();
  const popover = usePopover<HTMLButtonElement>();
  const language = (i18n.language || 'en') as Language;
  const flag = languageFlags[language];

  return (
    <React.Fragment>
      <Tooltip title="Language">
        <IconButton
          onClick={popover.handleOpen}
          ref={popover.anchorRef}
          sx={{ display: { xs: 'none', lg: 'inline-flex' } }}
        >
          <Box sx={{ height: '24px', width: '24px' }}>
            <Box alt={language} component="img" src={flag} sx={{ height: 'auto', width: '100%' }} />
          </Box>
        </IconButton>
      </Tooltip>
      <LanguagePopover anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open} />
    </React.Fragment>
  );
}

function UserButton(): React.JSX.Element | null {
  const { user } = useUser();
  const popover = usePopover<HTMLDivElement>();

  return (
    <React.Fragment>
      <Box
        component="div"
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        sx={{ border: 'none', background: 'transparent', cursor: 'pointer', p: 0, display: 'inline-block' }}
      >
        <AtomButton id="user-button" color="secondary" variant="contained" label={user?.email ?? ''} size="small" data-testid="qa-user-button" />
      </Box>
      <UserPopover anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open} />
    </React.Fragment>
  );
}
