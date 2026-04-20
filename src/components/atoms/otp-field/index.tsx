import { Box, OutlinedInput, Stack, styled } from '@mui/material';
import { CSSProperties, memo, useLayoutEffect } from 'react';

import ErrorMessage from '@/components/atoms/error-message';
import { useOtp } from '@/hooks/use-otp';
import { customGrey, yieldzBase, yieldzNeutral, yieldzSecondary } from '@/styles/theme/colors';

/**
 * StyledNumberInput — Optimized numeric input field.
 * - Keeps consistent with theme tokens.
 * - Clean, scalable, and responsive.
 */
const StyledNumberInput = styled(OutlinedInput)(({ theme }) => ({
  width: 48,
  height: 68, // Fixed height as per design (can be made prop-based if needed)
  borderRadius: 0,
  border: `1px solid ${yieldzNeutral[700]}`, // Default border color (#343434)
  padding: theme.spacing(1, 2), // 8px 16px (reduced horizontal padding)
  textAlign: 'center',

  // Remove MUI's default notched outline
  '& .MuiOutlinedInput-notchedOutline': {
    display: 'none',
  },

  // Focused state - add outer border with blue color
  '&.Mui-focused': {
    borderColor: yieldzNeutral[700], // Same as default
    outline: `2px solid ${yieldzSecondary.blue.focus}`, // #6388F7
    outlineOffset: '2px', // Space between box and outer border
  },

  // Filled state - white border when input has value
  '&:has(input:not(:placeholder-shown))': {
    borderColor: yieldzBase.white, // #FFFFFF
  },

  // Hover states - must come after other states to override
  '&:hover:not(.Mui-focused)': {
    borderColor: `${customGrey[200]} !important`, // #F4F4F4
  },

  // Hover state for filled inputs (when not focused)
  '&:has(input:not(:placeholder-shown)):hover:not(.Mui-focused)': {
    borderColor: `${customGrey[200]} !important`, // #F4F4F4
  },

  '& input': {
    textAlign: 'center',
    paddingTop: '26px', // Push entered value down to near the bottom
    // Remove default number spinners
    '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    '&[type=number]': {
      MozAppearance: 'textfield', // Hide spinner in Firefox
    },
    '&::placeholder': {
      transform: 'translateY(3px) scaleX(2)', // Adjust placeholder to stay at bottom (compensate for paddingTop)
      opacity: 1, 
    },
  },

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5, 1),
    width: 48,
    height: 48,
    
    '& input': {
      paddingTop: '20px', // Push entered value down for mobile
    },
    '& input::placeholder': {
      transform: 'translateY(-8px) scaleX(2)', // Adjust placeholder for mobile (compensate for paddingTop)
      opacity: 1,
    },
  },
}));

export interface OTPInputProps {
  length: number;
  onChangeOTP?: (otp: string) => void;
  autoFocus?: boolean;
  isNumberInput?: boolean;
  disabled?: boolean;
  isReset?: boolean;
  style?: CSSProperties;
  className?: string;
  inputStyle?: CSSProperties;
  inputClassName?: string;
  name?: string;
  error?: boolean;
  helperText?: string;
}

const OtpField = (props: OTPInputProps) => {
  const {
    length,
    isNumberInput = false,
    name,
    disabled,
    onChangeOTP,
    inputClassName,
    inputStyle,
    isReset,
    error,
    helperText = '',
    ...rest
  } = props;
  const { handleOnFocus, handleOnChange, onBlur, handleOnPaste, handleOnKeyDown, activeInput, otpValues, resetOTP } =
    useOtp({
      onChangeOTP: onChangeOTP ?? (() => {}),
      isNumberInput,
      length,
    });
  useLayoutEffect(() => {
    if (isReset) resetOTP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReset]);

  return (
    <Box {...rest}>
      <Stack spacing={{ xs: 1, sm: 3 }} direction="row">
        {new Array(length)
          .fill('')
          .map((_, index) => (
            <StyledNumberInput
              key={`otp-${name ?? 'otp'}-${index}`}
              type="number"
              inputRef={activeInput === index ? (input: any) => input?.focus() : null}
              value={otpValues?.[index] ?? ''}
              onFocus={handleOnFocus(index)}
              onChange={handleOnChange}
              onKeyDown={handleOnKeyDown}
              onBlur={onBlur}
              onPaste={handleOnPaste}
              style={inputStyle}
              className={inputClassName}
              disabled={disabled}
              name={name ?? ''}
              placeholder="_"
            />
          ))}
      </Stack>
      <ErrorMessage errorMsg={helperText} />
    </Box>
  );
};

export default memo(OtpField);
