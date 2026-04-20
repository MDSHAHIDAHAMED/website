'use client';

import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Collapse, IconButton, Stack, Toolbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import { memo, useContext, useState } from 'react';

import { AtomButton } from '@/components/atoms/button';
import AtomNavItem from '@/components/atoms/nav-item';
import AtomTypography from '@/components/atoms/typography';
import { Dropdown } from '@/components/core/dropdown/dropdown';
import { DropdownContext } from '@/components/core/dropdown/dropdown-context';
import { DropdownPopover } from '@/components/core/dropdown/dropdown-popover';
import { DropdownTrigger } from '@/components/core/dropdown/dropdown-trigger';
import { Logo } from '@/components/core/logo';
import { paths } from '@/paths';

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

interface HeaderProps {
  transparent?: boolean;
  hideLaunchButton?: boolean;
}

// Style constants
const TOOLBAR_STYLES = {
  justifyContent: 'space-between',
  alignItems: 'center',
  px: { xs: 2, md: 6 },
  height: '80px'
};

const LOGO_CONTAINER_STYLES = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  cursor: 'pointer'
};

const DESKTOP_NAV_STYLES = {
  display: { xs: 'none', md: 'flex' },
  alignItems: 'center'
};

const DROPDOWN_TRIGGER_BOX_STYLES = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  cursor: 'pointer'
};

const DROPDOWN_POPOVER_PAPER_STYLES = {
  mt: 1,
  p: 1,
  bgcolor: 'rgba(20, 20, 20, 0.0)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '0',
  minWidth: 200
};

const DROPDOWN_ITEM_STYLES = {
  px: 2,
  cursor: 'pointer',
  color: 'text.primary',
  borderRadius: '0',
  borderBottom: '1px solid #FFFFFF33',
  '&:last-child': {
    borderBottom: 'none',
  }
};

const RIGHT_SECTION_STYLES = {
  display: 'flex',
  alignItems: 'center',
  gap: 2
};

const DESKTOP_BUTTONS_STACK_STYLES = {
  display: { xs: 'none', md: 'flex' },
  alignItems: 'center'
};

const DOWNLOAD_APP_BUTTON_STYLES = {
  bgcolor: '#6DF2FE',
  color: 'common.black',
  borderRadius: 0,
  '&:hover': {
    bgcolor: '#4199A1'
  }
};

const MOBILE_HAMBURGER_STYLES = {
  display: { xs: 'flex', md: 'none' },
  color: 'common.white'
};

const MOBILE_COLLAPSE_STYLES = {
  display: { md: 'none' }
};

const MOBILE_MENU_STACK_STYLES = {
  px: 3,
  py: 2,
  bgcolor: 'rgba(20, 20, 20, 0.9)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
};

const MOBILE_CATEGORY_TITLE_STYLES = {
  color: 'text.primary',
  mb: 1,
  fontWeight: 600
};

const MOBILE_CATEGORY_ITEMS_STYLES = {
  pl: 2
};

const MOBILE_ITEM_STYLES = {
  color: 'text.secondary',
  cursor: 'pointer'
};

const MOBILE_BUTTONS_STACK_STYLES = {
  pt: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  marginBottom: 2
};

// Internal component to handle arrow rotation based on dropdown state
function DropdownArrow() {
  const { open } = useContext(DropdownContext);
  return (
    <KeyboardArrowDownIcon
      fontSize="small"
      sx={{
        color: 'inherit',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease-in-out'
      }}
    />
  );
}

export default memo(function Header({ transparent = false, hideLaunchButton = false }: HeaderProps) {
  // State to manage mobile menu open/close
  const [open, setOpen] = useState(false);
  // State to manage mobile dropdown open/close for each item
  const [mobileDropdowns, setMobileDropdowns] = useState<Record<string, boolean>>({});
  const router = useRouter();

  // Text color based on transparency
  const textColor = transparent ? 'common.white' : 'text.primary';
  const hoverColor = transparent ? 'primary.main' : 'text.primary';
  const dropdownTriggerColor = transparent ? 'common.white' : 'text.secondary';
  const dropdownTriggerHoverColor = transparent ? 'primary.main' : 'text.primary';

  // Nav items structure
  const NAV_ITEMS: NavItem[] = [
    {
      label: 'Story',
      children: [
        { label: 'Variable Yield In BTC', href: '#' },
        { label: '20 Year Compounded Return Profile', href: '#' },
        { label: 'Dollar Yield vs BTC YLDZ', href: '#' },
        { label: 'Digital Asset', href: '#' },
        { label: 'Return of Capital "ROC" Distribution Guidance', href: '#' },
        { label: 'YSurance Expand Details', href: '#' },
        { label: 'Core Services', href: '#' },
        { label: 'Meet the Experts', href: '#' },
        { label: 'Blog', href: paths.dashboard.blog.list },
      ],
    },
    {
      label: 'Calculate',
      children: [
        { label: 'Money Calculator', href: '#' },
        { label: 'Yield Comparison', href: '#' },
      ],
    },
    { label: 'Roadmap', href: paths.privacyPolicy }, // Placeholder link
    { label: 'Contact', href: paths.contact },
    { label: 'About Us', href: paths.notFound }, // Placeholder link
  ];

  // Handler for Launch App button
  const handleLaunchApp = () => {
    router.push(paths.auth.custom.signIn);
  };

  // Handler for navigation clicks (closes mobile menu)
  const handleNavClick = (href: string) => {
    router.push(href);
    setOpen(false); // Close mobile dropdown after selection
  };

  // Handler to toggle mobile dropdown
  const handleMobileDropdownToggle = (label: string) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <AppBar
      position={transparent ? "absolute" : "static"}
      elevation={0}
      sx={{
        bgcolor: transparent ? 'transparent !important' : 'background.default',
        color: textColor,
        zIndex: 1300 // Higher than default to ensure it stays above content
      }}
    >
      <Toolbar sx={TOOLBAR_STYLES}>
        {/* Left section: Logo */}
        <Box sx={LOGO_CONTAINER_STYLES} onClick={() => handleNavClick(paths.home)}>
          <Logo height={24} width={124} emblem color={transparent ? 'light' : 'dark'} />
        </Box>

        {/* Desktop navigation menu (hidden on xs/sm) */}
        <Stack direction="row" spacing={4} sx={DESKTOP_NAV_STYLES}>
          {NAV_ITEMS.map((item) => {
            if (item.children) {
              return (
                <Dropdown key={item.label}>
                  <DropdownTrigger>
                    <Box
                      sx={{
                        ...DROPDOWN_TRIGGER_BOX_STYLES,
                        color: dropdownTriggerColor,
                        '&:hover': { color: dropdownTriggerHoverColor }
                      }}
                    >
                      <AtomTypography variant="body4" sx={{ color: 'inherit' }}>
                        {item.label}
                      </AtomTypography>
                      <DropdownArrow />
                    </Box>
                  </DropdownTrigger>
                  <DropdownPopover
                    PaperProps={{
                      sx: DROPDOWN_POPOVER_PAPER_STYLES
                    }}
                  >
                    <Stack spacing={0.5}>
                      {item.children.map((child) => (
                        <Box
                          key={child.label}
                          onClick={() => handleNavClick(child.href)}
                          sx={{
                            ...DROPDOWN_ITEM_STYLES,
                            '&:hover': {
                              color: dropdownTriggerHoverColor,
                              '& .MuiTypography-root': {
                                color: dropdownTriggerHoverColor
                              }
                            }
                          }}
                        >
                          <AtomTypography variant="body4" sx={{ color: 'text.primary' }}>
                            {child.label}
                          </AtomTypography>
                        </Box>
                      ))}
                    </Stack>
                  </DropdownPopover>
                </Dropdown>
              );
            }

            return (
              <AtomNavItem
                key={item.label}
                label={item.label}
                href={item.href || '#'}
                onClick={() => handleNavClick(item.href || '#')}
                sx={{
                  color: dropdownTriggerColor,
                  '&:hover': { color: dropdownTriggerHoverColor }
                }}
              />
            );
          })}
        </Stack>

        {/* Right section: Buttons (Desktop) / Hamburger (Mobile) */}
        <Box sx={RIGHT_SECTION_STYLES}>
          {/* Desktop buttons */}
          <Stack direction="row" spacing={2} sx={DESKTOP_BUTTONS_STACK_STYLES}>
            <AtomButton
              id="login-button"
              label="Log In"
              variant="transparent"
              size="medium"
              onClick={() => router.push(paths.auth.custom.signIn)}
            />
            {!hideLaunchButton && (
              <AtomButton
                id="download-app-button"
                variant="text"
                label="Download App"
                onClick={handleLaunchApp}
                size="medium"
                sx={DOWNLOAD_APP_BUTTON_STYLES}
              />
            )}
          </Stack>

          {/* Mobile hamburger menu */}
          <IconButton
            sx={MOBILE_HAMBURGER_STYLES}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <CloseIcon sx={{ color: textColor }} /> : <MenuIcon sx={{ color: textColor }} />}
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile dropdown menu (Collapse) */}
      <Collapse in={open} timeout="auto" unmountOnExit sx={MOBILE_COLLAPSE_STYLES}>
        {/* Mobile nav items stacked vertically */}
        <Stack
          direction="column"
          spacing={2}
          sx={MOBILE_MENU_STACK_STYLES}
        >
          {NAV_ITEMS.map((item) => (
            <Box key={item.label}>
              {item.children ? (
                <Box>
                  <Box
                    onClick={() => handleMobileDropdownToggle(item.label)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      ...MOBILE_CATEGORY_TITLE_STYLES,
                      '&:hover': { color: hoverColor }
                    }}
                  >
                    <AtomTypography variant="body4" sx={{ color: 'inherit' }}>
                      {item.label}
                    </AtomTypography>
                    <KeyboardArrowDownIcon
                      sx={{
                        transform: mobileDropdowns[item.label] ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease-in-out',
                        color: 'inherit'
                      }}
                    />
                  </Box>
                  <Collapse in={mobileDropdowns[item.label]} timeout="auto" unmountOnExit>
                    <Stack spacing={1} sx={MOBILE_CATEGORY_ITEMS_STYLES}>
                      {item.children.map((child) => (
                        <AtomTypography
                          key={child.label}
                          variant="body4"
                          onClick={() => handleNavClick(child.href)}
                          sx={{
                            ...MOBILE_ITEM_STYLES,
                            '&:hover': { color: hoverColor }
                          }}
                        >
                          {child.label}
                        </AtomTypography>
                      ))}
                    </Stack>
                  </Collapse>
                </Box>
              ) : (
                <AtomNavItem
                  label={item.label}
                  href={item.href || '#'}
                  onClick={() => handleNavClick(item.href || '#')}
                  sx={{
                    '&:hover': { color: hoverColor }
                  }}
                />
              )}
            </Box>
          ))}

          <Stack sx={MOBILE_BUTTONS_STACK_STYLES}>
            <AtomButton
              id="mobile-login-button"
              variant="transparent"
              label="Log In"
              onClick={() => router.push(paths.auth.custom.signIn)}
              fullWidth
              size="medium"
            />
            {!hideLaunchButton && (
              <AtomButton
                id="mobile-download-app-button"
                variant="contained"
                label="Download App"
                onClick={handleLaunchApp}
                fullWidth
                size="medium"
                sx={DOWNLOAD_APP_BUTTON_STYLES}
              />
            )}
          </Stack>
        </Stack>
      </Collapse>
    </AppBar>
  );
});