'use client';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, Divider, IconButton, Stack, type SxProps, type Theme } from '@mui/material';
import React from 'react';

import AtomButton from '@/components/atoms/button';
import CornerContainer from '@/components/atoms/corner-container';
import AtomTypography from '@/components/atoms/typography';
import YieldsBadge from '@/components/atoms/yields-badge';
import { yieldzNeutral } from '@/styles/theme/colors';

/**
 * Profile Item Component Props
 *
 * A reusable component for displaying profile information cards with:
 * - Icon
 * - Title/Heading
 * - Description
 * - Status indicator (with color)
 * - Action button
 */
export interface ProfileItemProps {
  /**
   * Icon to display at the top of the card
   */
  icon?: React.ReactNode;
  /**
   * Title/Heading text
   */
  title: string;
  /**
   * Description text below the title
   */
  description: string;
  /**
   * Status text (e.g., "Verified", "Active", "Not Verified", "Inactive")
   */
  status?: string;

  /**
   * Action button
   */
  button?: React.ReactNode | React.ReactNode[];
  customRightContent?: React.ReactNode;
  /**
   * Status color variant - 'success' maps to 'green', 'default' maps to 'neutral'
   * @default 'default'
   */
  statusColor?: 'success' | 'default';

  /**
   * Custom sx styles
   */
  sx?: SxProps<Theme>;
  /**
   * Data test id for testing
   */
  'data-testid'?: string;

  type?: 'listing' | '';

  /**
   * List items for listing type
   * Each item should have an identifier and optional unlink handler
   */
  listItems?: Array<{ address: string; onUnlink: () => void; onCopyAddress: () => void }>;
}

/**
 * Profile Item Component
 *
 * Displays a profile information card with icon, title, description,
 * status indicator, and action button.
 *
 * Follows SOLID principles:
 * - Single Responsibility: Displays profile item information
 * - Open/Closed: Extensible through props without modification
 * - Liskov Substitution: Can be used anywhere a profile item is needed
 * - Interface Segregation: Clean, focused prop interface
 * - Dependency Inversion: Depends on abstractions (MUI components)
 *
 * Follows KISS principle: Simple, focused functionality
 * Follows DRY principle: Reusable across the application
 */
const ProfileItem = React.forwardRef<HTMLDivElement, ProfileItemProps>(
  (
    {
      icon,
      title,
      description,
      status,
      statusColor = 'default',
      button,
      sx,
      customRightContent,
      'data-testid': dataTestId,
      type = '',
      listItems = [],
    },
    ref
  ) => {
    /**
     * Get YieldsBadge variant based on statusColor prop
     * - 'success': Maps to 'green' variant for verified/active states
     * - 'default': Maps to 'neutral' variant for not verified/inactive states
     */
    const getStatusVariant = (): 'green' | 'neutral' => {
      if (statusColor === 'success') {
        return 'green'; // Green variant for verified/active
      }
      return 'neutral'; // Neutral variant for not verified/inactive
    };

    /**
     * Renders one or multiple action buttons safely.
     * - If `button` is an array → render each inside a Box
     * - If `button` is a single node → wrap in inline-flex Box
     * - If nothing → render null
     */
    const renderButtons = (button: React.ReactNode | React.ReactNode[]) => {
      if (!button) return null;

      // Case: multiple buttons
      if (Array.isArray(button)) {
        return button.map((item) => {
          return item;
        });
      }

      // Case: single button
      return (
        <Box component="span" sx={{ display: 'inline-flex', visibility: listItems?.length ? 'hidden' : 'unset' }}>
          {button}
        </Box>
      );
    };

    return (
      <CornerContainer showBorder={false}>
        <Box
          ref={ref}
          data-testid={dataTestId}
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1,
            justifyContent: { xs: 'flex-start', sm: 'space-between' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            padding: { xs: 3, sm: 4 },
            backgroundColor: yieldzNeutral[950], // #080808 - light black background
            borderRadius: '4px',
            transition: 'all 0.2s ease',
            rowGap: 2,
            '&:hover': {
              borderColor: yieldzNeutral[700],
            },
            ...sx,
          }}
        >
          {/* Left Side: Icon and Text */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              alignItems: 'flex-start',
              flex: { xs: 'none', sm: 1 },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {/* Icon */}
            {icon && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexShrink: 0,
                  '& svg, & img': {
                    width: '24px',
                    height: '24px',
                  },
                }}
              >
                {icon}
              </Box>
            )}

            {/* Title and Description Container */}
            <Stack spacing={0.5} sx={{ flex: 1 }}>
              {/* Title */}
              <AtomTypography
                variant="h5"
                color="text.primary"
                sx={{
                  fontWeight: 615,
                }}
              >
                {title}
              </AtomTypography>

              {/* Description */}
              <AtomTypography variant="subtitle2" color="text.secondary">
                {description}
              </AtomTypography>
            </Stack>
          </Box>

          {/* Right Side: Status and Button */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: { xs: 2, sm: 4 },
              alignItems: 'center',
              flexShrink: 0,
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'flex-start', sm: 'flex-end' },
            }}
          >
            {/* Status Badge */}
            {status && (
              <YieldsBadge
                id={`profile-item-${title.toLowerCase().replaceAll(/\s+/g, '-')}-status`}
                variant={getStatusVariant()}
                label={status}
              />
            )}

            {/* Action Button */}
            {renderButtons(button)}
          </Box>
        </Box>
        {type === 'listing' && listItems && (
          <Box
            sx={{
              paddingX: { xs: 3, sm: 4 },
            }}
          >
            <Divider sx={{ borderColor: yieldzNeutral[800] }} />
          </Box>
        )}

        {/* Listing Type: Show list of items */}
        {type === 'listing' && listItems.length > 0 && (
          <Box
            sx={{
              padding: { xs: 3, sm: 4 },
            }}
          >
            {listItems.map(
              (item: { address: string; onUnlink: () => void; onCopyAddress: () => void }, index: number) => (
                <Stack spacing={1} key={item.address}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: {xs:'column', sm:'row'},
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    {/* Left side: Number and identifier */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <AtomTypography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{
                          minWidth: '24px',
                        }}
                      >
                        {index + 1}
                      </AtomTypography>
                      <AtomTypography variant="subtitle1" color="text.primary">
                        {item.address}
                        <IconButton
                          onClick={item.onCopyAddress}
                          sx={{
                            color: 'text.primary',
                            flexShrink: 0,
                            p: 0.5,
                          }}
                          aria-label="Copy address"
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </AtomTypography>
                    </Box>
                    {/* Right side: Unlink button */}

                    <AtomButton
                      id={`profile-item-unlink-button`}
                      variant="contained"
                      label="UNLINK"
                      size="small"
                      onClick={item.onUnlink}
                      disabled
                      color= 'secondary'
                      sx={{
                        textTransform: 'none',
                        fontFamily: 'inherit',
                        '&:hover': {
                          color: 'text.primary',
                        },
                      }}
                    />
                  </Box>
                </Stack>
              )
            )}
          </Box>
        )}
      </CornerContainer>
    );
  }
);

ProfileItem.displayName = 'ProfileItem';

export default ProfileItem;
