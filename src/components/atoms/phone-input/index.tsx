'use client';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { defaultCountries, FlagImage, parseCountry, usePhoneInput, type CountryIso2 } from 'react-international-phone';

import 'react-international-phone/style.css';

import { isPhoneValid } from '@/utils/phone-validation';

import { yieldzNeutral, yieldzPrimary } from '@/styles/theme/colors';

import AtomTypography from '../typography';

export interface PhoneInputProps {
  id: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  defaultCountry?: CountryIso2;
  preferredCountries?: CountryIso2[];
  variant?: 'outlined' | 'standard';
  required?: boolean;
  validatePhone?: boolean;
  disableCountryGuess?: boolean;
  countryLabel?: string;
  phoneLabel?: string;
  onPhoneChange?: (data: { countryCode: string; phoneNumber: string; fullPhone: string; countryIso2: string }) => void;
}

/**
 * Custom dropdown icon for the country select
 */
const CustomSelectIcon = (props: any) => {
  return (
    <Box
      {...props}
      sx={{
        width: '14px',
        height: '8px',
        backgroundImage: 'url("/assets/icons/upward_icon.svg")',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        transition: 'transform 0.2s ease, top 0.2s ease',
        position: 'absolute',
        top: props.error ? '8px' : '42px',
        right: '0 !important',
        pointerEvents: 'none',
      }}
    />
  );
};

/**
 * Internal phone input integrated with react-hook-form and react-international-phone
 */
const PhoneInputInner = ({
  field,
  error,
  id,
  name,
  placeholder,
  disabled,
  variant,
  defaultCountry,
  countries,
  disableCountryGuess,
  countryLabel,
  phoneLabel,
  onPhoneChange,
  required,
}: {
  field: any;
  error: any;
  id: string;
  name: string;
  placeholder: string;
  disabled: boolean;
  variant: 'outlined' | 'standard';
  defaultCountry: CountryIso2;
  countries: any[];
  disableCountryGuess?: boolean;
  countryLabel?: string;
  phoneLabel?: string;
  onPhoneChange?: (data: { countryCode: string; phoneNumber: string; fullPhone: string; countryIso2: string }) => void;
  required?: boolean;
}) => {
  /**
   * Initialize phone input hook
   */
  const phoneInput = usePhoneInput({
    defaultCountry,
    value: field.value || '',
    countries,
    disableCountryGuess,
    onChange: (data) => {
      field.onChange(data.phone);

      const countryCode = `+${data.country.dialCode}`;
      const phoneNumberOnly = data.phone.replace(countryCode, '').trim();

      if (onPhoneChange) {
        onPhoneChange({
          countryCode,
          phoneNumber: phoneNumberOnly,
          fullPhone: data.phone,
          countryIso2: data.country.iso2,
        });
      }
    },
  });

  /**
   * Display only the phone number without country code in the input
   */
  const getDisplayValue = () => {
    const countryCode = `+${phoneInput.country.dialCode}`;
    if (!phoneInput.inputValue.startsWith(countryCode)) return phoneInput.inputValue;
    return phoneInput.inputValue.slice(countryCode.length).trim();
  };

  const handlePhoneValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const localValue = e.target.value; // what user types
    const countryCode = `+${phoneInput.country.dialCode}`;
    const fullValue = `${countryCode}${localValue}`;

    // ✅ Let react-international-phone manage its formatting internally
    phoneInput.handlePhoneValueChange(e);

    // ✅ Sync RHF field (React Hook Form) with full phone
    field.onChange(fullValue);

    // ✅ Notify parent callback if provided
    if (onPhoneChange) {
      onPhoneChange({
        countryCode,
        phoneNumber: localValue,
        fullPhone: fullValue,
        countryIso2: phoneInput.country.iso2,
      });
    }
  };

  // const handlePhoneValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const inputValue = e.target.value.trim();
  //   const countryCode = `+${phoneInput.country.dialCode}`;
  //   const fullValue = `${countryCode}${inputValue}`;

  //   // Detect if user is deleting (backspace or clearing)
  //   const isDeleting = phoneInput.phone.length > fullValue.length;

  //   if (!isDeleting) {
  //     // ✅ User is typing — update both field + native input
  //     field.onChange(fullValue);

  //     if (phoneInput.inputRef?.current) {
  //       const inputEl = phoneInput.inputRef.current;
  //       inputEl.value = fullValue;
  //       const nativeEvent = new InputEvent('input', { bubbles: true });
  //       inputEl.dispatchEvent(nativeEvent);
  //     }
  //   } else {
  //     // ✅ User is deleting — let library handle formatting
  //     phoneInput.handlePhoneValueChange(e);
  //   }

  //   // Optional external callback
  //   if (onPhoneChange) {
  //     onPhoneChange({
  //       countryCode,
  //       phoneNumber: inputValue,
  //       fullPhone: fullValue,
  //       countryIso2: phoneInput.country.iso2,
  //     });
  //   }
  // };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3 }}>
        {/* --- Country Select Dropdown --- */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt:1 }}>
          {countryLabel && (
            <AtomTypography
              variant="label3"
              sx={{
                color: yieldzNeutral[300],
                textAlign: 'left',
                textTransform: 'uppercase',
              }}
            >
              {countryLabel}
              {required && <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>}
            </AtomTypography>
          )}
          <Select
            value={phoneInput.country.iso2}
            onChange={(e) => phoneInput.setCountry(e.target.value as CountryIso2)}
            disabled={disabled}
            IconComponent={(props) => <CustomSelectIcon {...props} error={!!error} />}
            renderValue={() => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AtomTypography variant="subtitle3">+{phoneInput.country.dialCode}</AtomTypography>
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: yieldzNeutral[900],
                  border: `1px solid ${yieldzNeutral[700]}`,
                  borderRadius: '4px',
                  // maxHeight: '300px',
                  width: 'auto',
                  minWidth: '120px',
                  overflow: 'auto',
                  '& .MuiList-root': {
                    padding: 0,
                    // maxHeight: '300px',
                    overflow: 'auto',
                  },
                },
              },
              anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
              transformOrigin: { vertical: 'top', horizontal: 'left' },
            }}
            sx={{
              width: 'max-content',
              minWidth: { md: '120px', sm: '100px', xs: '90px' },
              backgroundColor: 'transparent',
              borderRadius: 0,
              paddingY: 0,
              paddingBottom: '12px !important',
              '& .MuiInputBase-root': { paddingY: 0 },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
                borderBottom: `1px solid ${error ? 'var(--mui-palette-error-main)' : yieldzNeutral[700]}`,
                borderRadius: 0,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: 'none',
                borderBottom: `1px solid ${yieldzNeutral[500]}`,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: 'none',
                borderBottom: `2px solid ${yieldzPrimary[500]}`,
              },
              '& .MuiSelect-select': {
                // Base theme styles (can be overridden)
                height: 'auto',
                minHeight: 'auto',
                padding: '0px !important',
                fontSize: '14px',
                lineHeight: '1.1',
                // Component-specific overrides
                paddingRight: '24px !important',
                display: 'flex',
                alignItems: 'center',
                fontWeight: variant === 'outlined' ? 500 : 400,
              },
              '& .MuiSelect-icon': { right: '0', transform: 'rotate(0deg)' },
              '& .MuiSelect-iconOpen': { transform: 'rotate(180deg)' },
            }}
          >
            {countries.map((c) => {
              const country = parseCountry(c);
              return (
                <MenuItem
                  key={country.iso2}
                  value={country.iso2}
                  sx={{
                    color: yieldzNeutral[100],
                    padding: '6px 12px',
                    fontSize: '14px',
                    minHeight: 'auto',
                    '&:hover': { backgroundColor: yieldzNeutral[800] },
                    '&.Mui-selected': { backgroundColor: yieldzNeutral[800] },
                    '&.Mui-selected:hover': { backgroundColor: yieldzNeutral[700] },
                  }}
                >
                  <FlagImage iso2={country.iso2} style={{ marginRight: '8px', display: 'flex' }} />
                  <AtomTypography variant="subtitle3">{country.name}</AtomTypography>
                  <AtomTypography variant="subtitle3">+{country.dialCode}</AtomTypography>
                </MenuItem>
              );
            })}
          </Select>
        </Box>

        {/* --- Phone Number Input --- */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0, mt:1 }}>
          {phoneLabel && (
            <AtomTypography
              variant="label3"
              sx={{
                color: yieldzNeutral[300],
                textAlign: 'left',
                textTransform: 'uppercase',
              }}
            >
              {phoneLabel}
              {required && <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>}
            </AtomTypography>
          )}
          <TextField
            id={id}
            name={name}
            type="tel"
            placeholder={placeholder}
            value={getDisplayValue()}
            onChange={handlePhoneValueChange}
            disabled={disabled}
            error={!!error}
            variant="standard"
            fullWidth
            inputRef={phoneInput.inputRef} // still keep reference for internal use
            slotProps={{ input: { disableUnderline: true } }}
            sx={{
              '& .MuiInputBase-root': {
                paddingBottom: '0 !important',
                '&:before, &:after': { display: 'none' },
              },
              '& .MuiInputBase-input': {
                padding: variant === 'outlined' ? '0 0 12px 0' : '0 0',
                fontSize: '14px',
                fontWeight: variant === 'outlined' ? 500 : 400,
                lineHeight: '1.1',
                color: yieldzNeutral[100],
                backgroundColor: 'transparent',
                borderBottom: `1px solid ${error ? 'var(--mui-palette-error-main)' : yieldzNeutral[700]}`,
                borderRadius: 0,
                transition: 'border-bottom-color 0.2s ease, padding-bottom 0.2s ease',
                '&:hover': { borderBottomColor: yieldzNeutral[500] },
                '&:focus': {
                  borderBottom: `2px solid ${yieldzPrimary[500]}`,
                  paddingBottom: variant === 'outlined' ? '11px' : '0px',
                  outline: 'none',
                },
                '&::placeholder': { color: yieldzNeutral[500], opacity: 1 },
                '&:disabled': {
                  color: yieldzNeutral[400],
                  backgroundColor: 'transparent',
                  WebkitTextFillColor: yieldzNeutral[400],
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* --- Error Message --- */}
      <Box
        sx={{
          minHeight: '20px',
          marginTop: '4px',
          overflow: 'hidden',
          transition: 'opacity 0.2s ease',
        }}
      >
        {error && (
          <AtomTypography variant="caption" sx={{ textAlign: 'left', color: 'error.main' }}>
            {error.message}
          </AtomTypography>
        )}
      </Box>
    </Box>
  );
};

/**
 * Wrapper with react-hook-form integration
 */
const AtomPhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>((props, _ref) => {
  const {
    name,
    id,
    placeholder = '',
    disabled = false,
    defaultCountry = 'us',
    preferredCountries = [],
    variant = 'outlined',
    required = false,
    validatePhone = true,
    disableCountryGuess = false,
    countryLabel,
    phoneLabel,
    onPhoneChange,
  } = props;

  const { control } = useFormContext();

  const countries =
    preferredCountries.length > 0
      ? defaultCountries.filter((c) => {
          const country = parseCountry(c);
          return preferredCountries.includes(country.iso2);
        })
      : defaultCountries;

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        ...(required && { required: 'Phone number is required' }),
        ...(validatePhone && {
          validate: (value: string) => {
            if (!value) return required ? 'Phone number is required' : true;
            return isPhoneValid(value) || 'Please enter a valid phone number';
          },
        }),
      }}
      render={({ field, fieldState: { error } }) => (
        <PhoneInputInner
          field={field}
          error={error}
          id={id}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          variant={variant}
          defaultCountry={defaultCountry}
          countries={countries}
          disableCountryGuess={disableCountryGuess}
          countryLabel={countryLabel}
          phoneLabel={phoneLabel}
          onPhoneChange={onPhoneChange}
          required={required}
        />
      )}
    />
  );
});

AtomPhoneInput.displayName = 'AtomPhoneInput';

export default AtomPhoneInput;
