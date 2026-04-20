'use client';

import { yieldzSecondary } from '@/styles/theme/colors';
import { type SxProps, type Theme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import AtomTypography from '../typography';

/* -----------------------------------------------------------------------------
 * Atom: AtomNavItem
 * Description:
 * A reusable, accessible navigation text link with hover animation and
 * MUI theme integration. Designed for App Router + MUI + Framer Motion stack.
 * -------------------------------------------------------------------------- */

export interface AtomNavItemProps {
  /** Text label displayed for the nav item */
  label: string;
  /** Navigation target (Next.js route) */
  href: string;
  /** Optional: Custom styling overrides */
  sx?: SxProps<Theme>;
  /** Optional: Callback before navigation (e.g., analytics) */
  onClick?: () => void;
}

const AtomNavItem: React.FC<AtomNavItemProps> = ({ label, href, sx, onClick }) => {
  const router = useRouter();
  const pathname = usePathname();
  // Check if current path matches exactly OR is a child route of href
  // e.g., href="/dashboard/tokens" should match "/dashboard/tokens/bitcoin"
  // Special case: root dashboard path ("/dashboard") should only match exactly
  const isRootDashboard = href === '/dashboard';
  const isActive = isRootDashboard 
    ? pathname === href 
    : pathname === href || pathname.startsWith(`${href}/`);
  // Navigate to route when clicked
  const handleClick = () => {
    if (onClick) onClick();
    router.push(href);
  };

  return (
      <AtomTypography
        variant="body4"
        role="link"
        tabIndex={0}
        aria-label={`Navigate to ${label}`}
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        sx={{
          cursor: 'pointer',
          userSelect: 'none',
          fontWeight: 400,
          padding: '4px 8px',
          color: 'var(--mui-palette-neutral-300)',
          transition: 'all 0.25s ease',
          // Active state (when on current page)
          ...(isActive && {
            color: 'var(--mui-palette-primary-500)',
          }),
          // Hover state
          '&:hover': { 
            color: 'var(--mui-palette-neutral-25)',
          },
          // Focus state (highest priority)
          '&:focus-visible': {
            color: 'var(--mui-palette-neutral-25)',
            border: `1px solid ${yieldzSecondary.blue.focus}`,
            borderRadius: '4px',
            outline: 'none',
          },
          ...sx,
        }}
      >
        {label}
      </AtomTypography>
  );
};

export default AtomNavItem;
