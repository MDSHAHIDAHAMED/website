'use client';

import { DateFormat, DEFAULT_DATE_FORMAT } from '@/constants/date-formats';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { kebabCase } from 'change-case';
import dayjs, { Dayjs } from 'dayjs';
import { forwardRef, useCallback, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { yieldzNeutral, yieldzPrimary } from '@/styles/theme/colors';
import { inputBaseClasses } from '@mui/material';

export interface AtomDatePickerProps {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  format?: DateFormat;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disableFuture?: boolean;
  disablePast?: boolean;
  helperText?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'medium' | 'small';
  fullWidth?: boolean;
}

/**
 * AtomDatePicker - A reusable date picker component integrated with react-hook-form
 *
 * Features:
 * - Configurable date format via props (default: MM-DD-YYYY)
 * - Integrated with react-hook-form
 * - Supports min/max date constraints
 * - Follows the same styling pattern as AtomInput
 */
const AtomDatePicker = forwardRef<HTMLInputElement, AtomDatePickerProps>((props, _ref) => {
  const {
    id,
    name,
    label = '',
    placeholder,
    disabled = false,
    required = false,
    format = DEFAULT_DATE_FORMAT,
    minDate,
    maxDate,
    disableFuture = false,
    disablePast = false,
    helperText = '',
    variant = 'standard',
    size = 'medium',
    fullWidth = true,
  } = props;

  const { control } = useFormContext();

  // State to control picker open/close
  const [open, setOpen] = useState(false);

  // Handlers for opening/closing the picker
  const handleOpen = useCallback(() => {
    if (!disabled) {
      setOpen(true);
    }
  }, [disabled]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // Parse the string value to Dayjs object
        const dateValue = field.value ? dayjs(field.value, format) : null;

        return (
          <DatePicker
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            value={dateValue?.isValid() ? dateValue : null}
            onChange={(newValue: Dayjs | null) => {
              // Convert Dayjs to formatted string for form storage
              const formattedValue = newValue?.isValid() ? newValue.format(format) : '';
              field.onChange(formattedValue);
            }}
            format={format}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            disableFuture={disableFuture}
            disablePast={disablePast}
            slotProps={{
              textField: {
                onClick: handleOpen,
                id,
                name,
                label,
                placeholder: placeholder || format,
                fullWidth,
                variant,
                size,
                error: !!error,
                helperText: error?.message || helperText,
                inputRef: field.ref,
                onBlur: field.onBlur,
                required,
                autoComplete: 'off',
                sx: {
                  // MuiPickersInputBase border styles for DatePicker
                  '& .MuiPickersInputBase-root': {
                    position: 'relative',
                    paddingBottom: '4px',
                    marginTop: '8px',
                  },
                  '& .MuiPickersInput-root': {
                    marginTop: '8px',
                  },
                  // Sections container font size
                  '& .MuiPickersInputBase-sectionsContainer': {
                    fontSize: '14px',
                  },
                  // MuiPickersInputBase border styles for DatePicker
                  '& .MuiPickersInputBase-root, & .MuiPickersInput-root': {
                    position: 'relative',
                    paddingBottom: '4px',
                    marginTop: '8px',
                    // Default border (always visible)
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderBottom: `1px solid ${yieldzNeutral[700]}`,
                      transition: 'border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                      pointerEvents: 'none',
                    },
                    // Focused border (thicker)
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderBottom: `2px solid ${yieldzNeutral[700]}`,
                      transform: 'scaleX(0)',
                      transition: 'transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
                      pointerEvents: 'none',
                    },
                    // Hover state
                    '&:hover:not(.Mui-disabled):not(.Mui-error)::before': {
                      borderBottom: `1px solid ${yieldzNeutral[500]}`,
                    },
                    // Focused state
                    '&.Mui-focused::after': {
                      transform: 'scaleX(1)',
                      borderBottom: `2px solid ${yieldzNeutral[700]}`,
                    },
                    '&.Mui-focused::before': {
                      borderBottom: `1px solid ${yieldzNeutral[700]}`,
                    },
                    // Error state
                    '&.Mui-error::before': {
                      borderBottom: '1px solid var(--mui-palette-error-main)',
                    },
                    '&.Mui-error::after': {
                      borderBottom: '2px solid var(--mui-palette-error-main)',
                    },
                    '&.Mui-error.Mui-focused::after': {
                      transform: 'scaleX(1)',
                    },
                    // Disabled state
                    '&.Mui-disabled::before': {
                      borderBottom: `1px dotted ${yieldzNeutral[600]}`,
                    },
                  },
                  // Input text styling
                  '& .MuiPickersInputBase-input': {
                    height: 'auto',
                    padding: '4px 0 4px 8px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    '&::placeholder': {
                      fontSize: '14px',
                      color: yieldzNeutral[500],
                      opacity: 1,
                    },
                  },
                  // Section list styling (date/month/year segments)
                  '& .MuiPickersSectionList-root': {
                    padding: '4px 0 4px 8px',
                  },
                  '& .MuiPickersSectionList-section': {
                    fontSize: '14px',
                    lineHeight: '1.5',
                  },
                  '& .MuiPickersInputBase-section': {
                    fontSize: '14px',
                    lineHeight: '1.5',
                  },
                  '& .MuiPickersSectionList-sectionContent': {
                    fontSize: '14px',
                    lineHeight: '1.5',
                  },
                  // Remove default outlined border if any
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                },
                slotProps: {
                  input: {
                    'data-testid': `qa-${kebabCase(id ?? '')}`,
                    sx: {
                        height: 'auto',
                        padding: '4px 0 4px 8px',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        [`label[data-shrink=false]+.${inputBaseClasses.formControl} &`]: {
                          '&::placeholder': { opacity: '0 !important' },
                        },
                        [`label[data-shrink=true]+.${inputBaseClasses.formControl} &`]: {
                          '&::placeholder': { opacity: '1 !important' },
                        },
                        '&:-webkit-autofill': {
                          marginInline: 0,
                          paddingInline: 0,
                        },
                    },
                  } as any,
                },
              },
              // Calendar popup (Popper) dark theme styling
              popper: {
                sx: {
                  '& .MuiPaper-root': {
                    backgroundColor: yieldzNeutral[900],
                    border: `1px solid ${yieldzNeutral[700]}`,
                    borderRadius: '8px',
                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.4)',
                  },
                  '& .MuiPickersLayout-root': {
                    backgroundColor: yieldzNeutral[900],
                  },
                  // Calendar header (month/year)
                  '& .MuiPickersCalendarHeader-root': {
                    backgroundColor: yieldzNeutral[900],
                  },
                  '& .MuiPickersCalendarHeader-label': {
                    color: yieldzNeutral[100],
                    fontSize: '14px',
                    fontWeight: 600,
                  },
                  '& .MuiPickersCalendarHeader-switchViewButton': {
                    color: yieldzNeutral[300],
                    '&:hover': {
                      backgroundColor: yieldzNeutral[800],
                    },
                  },
                  '& .MuiPickersArrowSwitcher-button': {
                    color: yieldzNeutral[300],
                    '&:hover': {
                      backgroundColor: yieldzNeutral[800],
                    },
                  },
                  // Weekday labels
                  '& .MuiDayCalendar-weekDayLabel': {
                    color: yieldzNeutral[400],
                    fontSize: '12px',
                  },
                  // Day buttons
                  '& .MuiPickersDay-root': {
                    color: yieldzNeutral[100],
                    fontSize: '14px',
                    '&:hover': {
                      backgroundColor: yieldzNeutral[800],
                    },
                    '&.Mui-selected': {
                      backgroundColor: yieldzPrimary[500],
                      color: '#000',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: yieldzPrimary[400],
                      },
                    },
                    '&.MuiPickersDay-today': {
                      borderColor: yieldzNeutral[500],
                      backgroundColor: 'transparent',
                    },
                    '&.Mui-disabled': {
                      color: yieldzNeutral[600],
                    },
                  },
                  // Year picker
                  '& .MuiYearCalendar-root': {
                    backgroundColor: yieldzNeutral[900],
                  },
                  '& .MuiPickersYear-yearButton': {
                    color: yieldzNeutral[100],
                    fontSize: '14px',
                    '&:hover': {
                      backgroundColor: yieldzNeutral[800],
                    },
                    '&.Mui-selected': {
                      backgroundColor: yieldzPrimary[500],
                      color: '#000',
                      fontWeight: 600,
                    },
                    '&.Mui-disabled': {
                      color: yieldzNeutral[600],
                    },
                  },
                  // Month picker
                  '& .MuiMonthCalendar-root': {
                    backgroundColor: yieldzNeutral[900],
                  },
                  '& .MuiPickersMonth-monthButton': {
                    color: yieldzNeutral[100],
                    fontSize: '14px',
                    '&:hover': {
                      backgroundColor: yieldzNeutral[800],
                    },
                    '&.Mui-selected': {
                      backgroundColor: yieldzPrimary[500],
                      color: '#000',
                      fontWeight: 600,
                    },
                  },
                },
              },
              // Calendar icon styling
              openPickerButton: {
                sx: {
                  color: yieldzNeutral[400],
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: yieldzNeutral[200],
                  },
                },
              },
            }}
          />
        );
      }}
    />
  );
});

AtomDatePicker.displayName = 'AtomDatePicker';

export default AtomDatePicker;

// Re-export date formats for convenience
export { DATE_FORMATS, DEFAULT_DATE_FORMAT, type DateFormat } from '@/constants/date-formats';
