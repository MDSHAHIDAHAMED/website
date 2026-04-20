'use client';

/**
 * TokenHeaderInfo Component
 * =========================
 * Displays token logo, name, symbol, and description with expand/collapse functionality.
 *
 * Features:
 * - Token logo display (static Image or dynamic img)
 * - Token name and symbol
 * - Expandable/collapsible description
 * - Blockchain explorer link (Etherscan or generic)
 *
 * @module components/molecules/token-header-info
 */

import {
  TOKEN_HEADER_SX,
  TOKEN_INFO_CONTAINER_SX,
} from '@/components/atoms/skeleton/token-header';
import AtomTypography from '@/components/atoms/typography';
import { yieldzNeutral } from '@/styles/theme/colors';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Tooltip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import React, { memo, useCallback, useState } from 'react';

// =============================================================================
// Types
// =============================================================================

/** Blockchain explorer link info */
export interface BlockchainExplorerLink {
  url: string;
  isEtherscan: boolean;
  label: string;
}

export interface TokenHeaderInfoProps {
  /** Token symbol (e.g., "BTC", "ETH") */
  symbol: string;
  /** Token full name */
  name: string;
  /** URL or path to token logo */
  logoUrl?: string;
  /** HTML description text */
  description?: string;
  /** Blockchain explorer link configuration */
  explorerLink?: BlockchainExplorerLink;
  /** 
   * If true, uses Next.js Image component and hides expand/collapse button.
   * Use for static/local assets.
   */
  isStatic?: boolean;
}

// =============================================================================
// Styles
// =============================================================================

/** Token logo styles */
const TOKEN_LOGO_SX: SxProps<Theme> = {
  width: 64,
  height: 64,
  borderRadius: '50%',
  objectFit: 'cover',
};

/** Token description styles - expanded state */
const DESCRIPTION_EXPANDED_SX: SxProps<Theme> = {
  mt: 3,
  maxWidth: { xs: '100%', md: '600px', lg: '800px' },
  color: yieldzNeutral[300],
  lineHeight: 1.6,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
};

/** Token description styles - collapsed state (5 lines max) */
const DESCRIPTION_COLLAPSED_SX: SxProps<Theme> = {
  ...DESCRIPTION_EXPANDED_SX,
  WebkitLineClamp: 5,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

/** Expand/Collapse button styles */
const EXPAND_BUTTON_SX: SxProps<Theme> = {
  cursor: 'pointer',
  mt: 1,
  display: 'inline-flex',
  alignItems: 'center',
  fontWeight: 700,
  gap: 0.5,
  '&:hover': {
    textDecoration: 'underline',
  },
};

// =============================================================================
// Component
// =============================================================================

/**
 * Token Header Information Component
 *
 * Displays token logo, name, symbol, and description with optional
 * expand/collapse functionality and blockchain explorer link.
 *
 * @param props - Component props
 * @returns Token header info JSX element
 */
function TokenHeaderInfo({
  symbol,
  name,
  logoUrl,
  description,
  explorerLink,
  isStatic = false,
}: Readonly<TokenHeaderInfoProps>): React.JSX.Element {
  // State for expand/collapse description
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Toggle description expand/collapse state
   */
  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  /**
   * Open blockchain explorer URL in a new tab
   */
  const handleOpenExplorer = useCallback(() => {
    if (explorerLink?.url) {
      window.open(explorerLink.url, '_blank', 'noopener,noreferrer');
    }
  }, [explorerLink]);

  return (
    <>
      <Box sx={TOKEN_INFO_CONTAINER_SX}>
        {/* Left: Token Symbol, Logo & Name */}
        <Box>
          <AtomTypography variant="body4" color="text.secondary" sx={{ mb: 1 }}>
            {symbol.toUpperCase()}
          </AtomTypography>
          <Box sx={TOKEN_HEADER_SX}>
            {logoUrl && !isStatic ? (
              <Box
                component="img"
                src={logoUrl}
                alt={name}
                sx={TOKEN_LOGO_SX}
              />
            ) : (
              <Image
                src={logoUrl ?? '/assets/logo-emblem.png'}
                alt={name}
                width={64}
                height={64}
                style={{ objectFit: 'cover' }}
              />
            )}
            <AtomTypography variant="display5" fontType="tickerbit" color="text.primary">
              {name.toUpperCase()}
            </AtomTypography>
          </Box>
        </Box>

        {/* Blockchain Explorer Link - Etherscan icon or generic external link */}
        {explorerLink && (
          <Tooltip title={explorerLink.label}>
            <Box
              component="span"
              onClick={handleOpenExplorer}
              sx={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
            >
              {explorerLink.isEtherscan ? (
                <Image src="/assets/icons/etherscan.svg" alt="Etherscan" width={20} height={20} />
              ) : (
                <OpenInNewIcon width={20} height={20} />
              )}
            </Box>
          </Tooltip>
        )}
      </Box>

      {/* Token Description with Expand/Collapse */}
      {description && (
        <Box>
          <AtomTypography
            variant="body4"
            sx={isStatic || isExpanded ? DESCRIPTION_EXPANDED_SX : DESCRIPTION_COLLAPSED_SX}
            dangerouslySetInnerHTML={{ __html: description }}
          />
          {/* Hide expand/collapse button for static pages */}
          {!isStatic && (
            <AtomTypography
              variant="body4"
              sx={EXPAND_BUTTON_SX}
              onClick={handleToggleExpand}
            >
              {isExpanded ? 'Show less' : '... Expand more'}
            </AtomTypography>
          )}
        </Box>
      )}
    </>
  );
}

export default memo(TokenHeaderInfo);

