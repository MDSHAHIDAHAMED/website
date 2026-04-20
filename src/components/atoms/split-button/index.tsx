'use client';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  type SxProps,
} from '@mui/material';
import { kebabCase } from 'change-case';
import React, { useCallback, useRef, useState } from 'react';

import AtomButton from '@/components/atoms/button';
import { type TColor, type TSize } from '@/types/common';

// ---------------------------------------
// Types
// ---------------------------------------
type TVariant = 'contained' | 'outlined' | 'text';

interface SplitButtonOption {
  label: string;
  disabled?: boolean;
  action: () => void;
}

interface SplitButtonProps {
  id: string;
  label: string;
  options: SplitButtonOption[];
  name?: string;
  onPrimaryClick?: () => void;
  disabled?: boolean;
  variant?: TVariant;
  size?: TSize;
  color?: TColor;
  sx?: SxProps;
  fullWidth?: boolean;
}

// ---------------------------------------
// Constants
// ---------------------------------------
const MENU_MAX_HEIGHT = 250;
const MENU_Z_INDEX = 1500;

// ---------------------------------------
// Helpers
// ---------------------------------------
/**
 * Maps TSize to MUI Button size format
 * Converts 'xs' to 'small' since MUI Button doesn't support 'xs'
 * @param size - The size value from TSize type
 * @returns MUI compatible size: 'small' | 'medium' | 'large'
 */
const mapSizeToMuiButton = (size: TSize): 'small' | 'medium' | 'large' => {
  return size === 'xs' ? 'small' : size;
};

// ---------------------------------------
// Component
// ---------------------------------------
const AtomSplitButton: React.FC<SplitButtonProps> = ({
  id,
  label,
  name,
  options,
  onPrimaryClick,
  disabled = false,
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  sx,
  fullWidth = false,
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleToggle = useCallback(() => setOpen((prev) => !prev), []);
  const handleClose = useCallback(
    (event: Event) => {
      if (anchorRef.current?.contains(event.target as HTMLElement)) return;
      setOpen(false);
    },
    []
  );

  const handleOptionClick = useCallback(
    (option: SplitButtonOption) => {
      option.action?.();
      setOpen(false);
    },
    []
  );

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <>
      <ButtonGroup
        variant={variant}
        ref={anchorRef}
        aria-label={`${label}-split-button`}
        sx={sx}
        disabled={disabled}
        color={color}
        fullWidth={fullWidth}
        data-testid={`qa-${kebabCase(id)}`}
      >
        {/* Primary Action Button */}
        <AtomButton
          id={`btn-${kebabCase(name ?? id)}`}
          label={label}
          onClick={onPrimaryClick}
          color={color}
          variant={variant}
          size={size}
          fullWidth={fullWidth}
        />

        {/* Dropdown Arrow Button */}
        <Button
          id={`btn-arrow-${kebabCase(id)}`}
          size={mapSizeToMuiButton(size)}
          color={color}
          aria-controls={open ? `${id}-menu` : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="menu"
          aria-label={`${label} options`}
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      {/* Dropdown Menu */}
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        sx={{ zIndex: MENU_Z_INDEX }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper elevation={3}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  id={`${id}-menu`}
                  autoFocusItem
                  sx={{ maxHeight: MENU_MAX_HEIGHT, overflowY: 'auto' }}
                >
                  {options.map((option) => (
                    <MenuItem
                      key={`${kebabCase(option.label)}-option`}
                      onClick={() => handleOptionClick(option)}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

// ---------------------------------------
// Display Name (for DevTools clarity)
// ---------------------------------------
AtomSplitButton.displayName = 'AtomSplitButton';

export default AtomSplitButton;
