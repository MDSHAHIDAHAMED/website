'use client';
 
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { kebabCase } from 'change-case';
import React, { forwardRef, useState, type ClipboardEvent, type FocusEvent, type KeyboardEvent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
 
type TPosition = 'end' | 'start';
 
type TInputTypes = 'text' | 'password' | 'email' | 'number';
interface TIcon {
  position: TPosition;
  icon: React.ReactNode;
  isDisabled?: boolean;
  paddingEnd?: number | string;
}
export interface CustomInputProps {
  id: string;
  error?: boolean;
  fullWidth?: boolean;
  label?: string;
  name: string;
  type: TInputTypes;
  disabled?: boolean;
  size?: 'medium' | 'small';
  placeholder?: string;
  icon?: TIcon;
  isIcon?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  helperText?: string;
  readOnly?: boolean;
  isEmptySpaceAllows?: boolean;
  isCopyPasteDisabled?: boolean;
  onFocusHandle?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  willAuthenticate?: boolean;
  /** If true, restricts input to numeric values only (including decimal point) */
  numericOnly?: boolean;
  /** If true, shows asterisk (*) after label to indicate required field */
  required?: boolean;
}
 
const AtomInput = forwardRef<HTMLInputElement, CustomInputProps>((props, _ref) => {
  const {
    name,
    id,
    label = '',
    fullWidth,
    helperText = '',
    type = 'text',
    placeholder = '',
    variant = 'outlined',
    size = 'medium',
    isIcon = false,
    icon,
    disabled = false,
    readOnly = false,
    isEmptySpaceAllows = true,
    isCopyPasteDisabled,
    onFocusHandle,
    numericOnly = false,
    required = false,
    ...rest
  } = props;
  const [showPassword, setShowPassword] = useState(false);
  const { control, setValue } = useFormContext();
  const handleClickShowPassword = (): void => {
    setShowPassword((show) => !show);
  };
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
  };
 
  /**
   * Handle paste events - filter non-numeric characters if numericOnly is true
   */
  const onCopyPasteHandler = (e: ClipboardEvent<HTMLInputElement>): void => {
    if (type === 'password') {
      e.preventDefault();
      return;
    }

    if (numericOnly) {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      // Allow only numbers and one decimal point
      const numericValue = pastedText.replaceAll(/[^\d.]/g, '');
      // Ensure only one decimal point
      const parts = numericValue.split('.');
      const filteredValue = parts.length > 2 
        ? parts[0] + '.' + parts.slice(1).join('')
        : numericValue;
      
      if (filteredValue) {
        const input = e.currentTarget;
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const currentValue = input.value || '';
        const newValue = currentValue.slice(0, start) + filteredValue + currentValue.slice(end);
        // Ensure only one decimal point in final value
        const finalValue = newValue.replaceAll(/[^\d.]/g, '').replaceAll(/\.(?=.*\.)/g, '');
        setValue(name, finalValue, { shouldValidate: true, shouldDirty: true });
      }
    }
  };

  /**
   * Check if key is a navigation/control key that should always be allowed
   */
  const isNavigationKey = (key: string): boolean => {
    return ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key);
  };

  /**
   * Check if key is allowed with modifier keys (Ctrl/Cmd + A, C, V, X, Z)
   */
  const isModifierKeyAllowed = (key: string, ctrlKey: boolean, metaKey: boolean): boolean => {
    return (ctrlKey || metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(key.toLowerCase());
  };

  /**
   * Handle keydown events - restrict to numeric input if numericOnly is true
   */
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === ' ' && !isEmptySpaceAllows) {
      event.preventDefault();
      return;
    }

    if (!numericOnly || readOnly) {
      return;
    }

    const key = event.key;
    const currentValue = event.currentTarget.value || '';

    // Allow navigation keys, modifier keys, numbers, or single decimal point
    if (
      isNavigationKey(key) ||
      isModifierKeyAllowed(key, event.ctrlKey, event.metaKey) ||
      /\d/.test(key) ||
      (key === '.' && !currentValue.includes('.'))
    ) {
      return;
    }

    // Block all other keys
    event.preventDefault();
  };
 
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          id={id}
          label={label}
          placeholder={placeholder}
          fullWidth={fullWidth ?? true}
          name={name}
          {...rest}
          type={showPassword ? 'text' : type}
          disabled={disabled}
          helperText={error ? error.message : helperText}
          value={field?.value as string}
          autoComplete="off"
          variant={variant}
          onBlur={field.onBlur}
          size={size}
          error={Boolean(error)}
          required={required}
          data-testid={`qa-${kebabCase(id ?? '')}`}
          slotProps={{
            input: {
              sx: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                pr: icon?.paddingEnd,
              },
              readOnly,
              endAdornment:
                type === 'password' ? (
                  <InputAdornment position="end">
                    <IconButton
                      disableRipple
                      disableFocusRipple
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ) : (
                  isIcon &&
                  icon?.position === 'end' && (
                    <InputAdornment position="end">
                      <IconButton aria-label={label} disableRipple disabled={icon?.isDisabled}>
                        {icon.icon}
                      </IconButton>
                    </InputAdornment>
                  )
                ),
              startAdornment: isIcon && icon?.position === 'start' && (
                <InputAdornment position="start">
                  <IconButton aria-label={label} disableRipple disabled={icon?.isDisabled}>
                    {icon.icon}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          inputRef={field?.ref}
          onCopy={isCopyPasteDisabled ? onCopyPasteHandler : undefined}
          onPaste={numericOnly || isCopyPasteDisabled ? onCopyPasteHandler : undefined}
          onKeyDown={numericOnly || !isEmptySpaceAllows ? onKeyDown : undefined}
          onFocus={onFocusHandle}
          onChange={(e) => {
            if (numericOnly && !readOnly) {
              // Filter out non-numeric characters (except decimal point)
              let value = e.target.value.replaceAll(/[^\d.]/g, '');
              // Ensure only one decimal point
              const parts = value.split('.');
              if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
              }
              field.onChange(value);
            } else {
              field.onChange(e);
            }
          }}
        />
      )}
    />
  );
});
 
AtomInput.displayName = 'AtomInput';
 
export default AtomInput;