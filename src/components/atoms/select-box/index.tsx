'use client';

import { Autocomplete, Box, TextField, type InputBaseProps, type SxProps, type Theme } from '@mui/material';
import { kebabCase } from 'change-case';
import Image from 'next/image';
import React, { forwardRef, useEffect,  useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import useScrollMore from '@/hooks/use-scroll-more';
import { logger } from '@/lib/default-logger';
import AtomTypography from '../typography';

// Custom dropdown icon component
const CustomDropdownIcon = () => (
  <Image
    src="/assets/icons/upward_icon.svg"
    alt="dropdown"
    width={20}
    height={20}
    style={{ transform: 'rotate(180deg)' }}
  />
);

/**
 * Represents a select option with label and value
 */
export interface TSelectOption {
  label: string;
  value: string | number;
}

/**
 * Available sizes for the select component
 */
type TSize = 'medium' | 'small';

/**
 * Props interface for the SelectBox component
 * Follows Single Responsibility Principle - handles only select box functionality
 */
export interface CustomSelectProps {
  // Required props
  id: string;
  name: string;
  label: string;
  options: TSelectOption[];

  // Optional props with sensible defaults
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  variant?: 'filled' | 'outlined';
  helperText?: string;
  fullWidth?: boolean;
  error?: boolean;
  InputProps?: InputBaseProps;
  size?: TSize;
  enableLoadMore?: boolean;
  HandleLoadMore?: () => TSelectOption[];
  isBorderLess?: boolean;
  onSelectBoxChange?: () => void;
  noLabel?: boolean;
  sx?: SxProps<Theme>;
  disablePortal?: boolean;
  /** If true, shows asterisk (*) after label to indicate required field */
  required?: boolean;
}

/**
 * SelectBox Component
 * 
 * A reusable, accessible select component built on Material-UI Autocomplete
 * Follows SOLID principles:
 * - Single Responsibility: Handles only select functionality
 * - Open/Closed: Extensible through props without modification
 * - Liskov Substitution: Can be used anywhere a select is needed
 * - Interface Segregation: Clean, focused prop interface
 * - Dependency Inversion: Depends on abstractions (react-hook-form)
 * 
 * Follows KISS principle: Simple, focused functionality
 * Follows DRY principle: Reusable across the application
 */
const SelectBox = forwardRef<HTMLDivElement, CustomSelectProps>(
  (
    {
      id,
      name,
      label,
      options,
      placeholder,
      multiple = false,
      disabled = false,
      readonly = false,
      variant = 'outlined',
      helperText = '',
      error = false,
      enableLoadMore = false,
      HandleLoadMore,
      onSelectBoxChange,
      noLabel = false,
      sx = {},
      disablePortal = false,
      required = false,
    },
    ref
  ) => {
    // State management for options and scroll handling
    const [list, setList] = useState<TSelectOption[]>(options);
    const [target, setTarget] = useState<HTMLUListElement | null>(null);
    const isNextPage = useScrollMore(target);
    const { control, setValue } = useFormContext();

    /**
     * Effect hook to sync options prop with internal list state
     * Updates the list when options prop changes (e.g., when data is fetched asynchronously)
     */
    useEffect(() => {
      if (options && Array.isArray(options)) {
        setList(options);
      }
    }, [options]);

    /**
     * Effect hook to handle infinite scroll loading
     * Follows Single Responsibility Principle - handles only scroll loading
     */
    useEffect(() => {
      if (isNextPage && HandleLoadMore) {
        try {
          const newItems = HandleLoadMore();
          if (Array.isArray(newItems)) {
            setList((prev) => [...prev, ...newItems]);
          }
        } catch (error) {
          logger.error('Error fetching data in SelectBox:', error);
        }
      }
    }, [isNextPage, HandleLoadMore]);


    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error: fieldError } }) => {
          // Get current value with proper fallback for multiple/single selection
          const currentValue = field.value ?? (multiple ? [] : null);

          // Use prop error or fieldState error, whichever is present
          const hasError = error || Boolean(fieldError);
          const errorMessage = fieldError?.message || helperText;

          return (
            <Autocomplete
              multiple={multiple}
              selectOnFocus
              id={id}
              ref={ref}
              readOnly={readonly}
              disableClearable
              options={list}
              value={currentValue}
              disablePortal={false}
              noOptionsText={<AtomTypography variant="subtitle1">No {label} available</AtomTypography>}
              onBlur={field.onBlur}
              className={noLabel ? 'no-label' : ''}
              popupIcon={<CustomDropdownIcon />}
              onChange={(_, newValue) => {
                // Update form value with proper validation flags
                setValue(name, newValue ?? (multiple ? [] : null), {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
                // Call optional change handler
                onSelectBoxChange?.();
              }}
              data-testid={`qa-${kebabCase(id ?? '')}`}
              getOptionLabel={(option: TSelectOption) => {
                // Handle both string and object options
                if (typeof option === 'string') return option;
                return option?.label ?? '';
              }}
              isOptionEqualToValue={(option, value) => {
                // Custom equality check for proper option comparison
                if (!option || !value) return false;

                if (multiple && Array.isArray(value)) {
                  return value.some((v) => v && v.value === option.value);
                }

                if (typeof value === 'object' && 'value' in value) {
                  return option.value === value.value;
                }

                return false;
              }}
              renderOption={(optionProps, option) => (
                <li {...optionProps} key={`${option.value}-${option.label}`}>
                  {option.label}
                </li>
              )}
              renderInput={(params) => {
                return (
                  <Box sx={{ position: 'relative', width: '100%' }}>                    
                    <TextField
                      {...params}
                      variant={variant}
                      label={noLabel ? '' : label}
                      disabled={disabled}
                      error={hasError}
                      helperText={errorMessage}
                      size="medium"
                      placeholder={required && placeholder ? `${placeholder} *` : placeholder}
                      required={required}
                      sx={sx}
                    />
                  </Box>
                );
              }}
              slotProps={{
                listbox: {
                  style: { maxHeight: 240, overflow: 'auto', fontSize: '16px' },
                  sx: {
                    '& .MuiAutocomplete-noOptions': {
                      fontSize: '12px', // Reduced font size when there are no options
                    },
                  },
                  onScroll: (event: React.UIEvent<HTMLUListElement>) => {
                    if (enableLoadMore && HandleLoadMore) {
                      setTarget(event.target as HTMLUListElement);
                    }
                  },
                },
              }}
            />
          );
        }}
      />
    );
  }
);

SelectBox.displayName = 'SelectBox';
export default SelectBox;
