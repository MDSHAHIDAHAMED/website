import { INTEGER } from '@/regex';
import { useCallback, useState } from 'react';

interface IOtpProps {
  length: number;
  isNumberInput: boolean;
  onChangeOTP: (otp: string) => void;
}

export const useOtp = (props: IOtpProps) => {
  const { onChangeOTP, isNumberInput, length } = props;
  const [activeInput, setActiveInput] = useState(0);
  const [otpValues, setOTPValues] = useState(new Array<string>(length).fill(''));

  // Helper to return OTP from inputs
  const handleOtpChange = useCallback(
    (otp: string[]) => {
      const otpValue = otp.join('');
      onChangeOTP(otpValue);
    },
    [onChangeOTP]
  );

  // Helper to return value with the right type: 'text' or 'number'
  const getRightValue = useCallback(
    (inputValue: string) => {
      let changedValue = inputValue;

      if (!isNumberInput || !changedValue) {
        return changedValue;
      }

      return Number(changedValue) >= 0 ? changedValue : '';
    },
    [isNumberInput]
  );

  // Change OTP value at focusing input
  const changeCodeAtFocus = useCallback(
    (str: string) => {
      const updatedOTPValues = [...otpValues];
      updatedOTPValues[activeInput] = str[0] || '';
      setOTPValues(updatedOTPValues);
      handleOtpChange(updatedOTPValues);
    },
    [activeInput, handleOtpChange, otpValues]
  );

  // Focus `inputIndex` input
  const focusInput = useCallback(
    (inputIndex: number) => {
      const selectedIndex = Math.max(Math.min(length - 1, inputIndex), 0);
      setActiveInput(selectedIndex);
    },
    [length]
  );

  const focusPrevInput = useCallback(() => {
    focusInput(activeInput - 1);
  }, [activeInput, focusInput]);

  const focusNextInput = useCallback(() => {
    focusInput(activeInput + 1);
  }, [activeInput, focusInput]);

  // Handle onFocus input
  const handleOnFocus = useCallback(
    (index: number) => () => {
      focusInput(index);
    },
    [focusInput]
  );

  // Handle onChange value for each input
  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = getRightValue(e.currentTarget.value);
  
      if (!val) return;
  
      // Only take the first character to prevent overflow
      changeCodeAtFocus(val[0]);
  
      // Move focus to next input if not last
      if (activeInput < length - 1) focusNextInput();
    },
    [changeCodeAtFocus, focusNextInput, getRightValue, activeInput, length]
  );
  

  // Handle onBlur input
  const onBlur = useCallback(() => {
    setActiveInput(-1);
  }, []);

  // Handle onKeyDown input
  const handleOnKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const pressedKey = e.key;

      switch (pressedKey) {
        case 'Backspace':
        case 'Delete': {
          e.preventDefault();
          if (otpValues[activeInput]) {
            changeCodeAtFocus('');
          } else {
            focusPrevInput();
          }
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          focusPrevInput();
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          focusNextInput();
          break;
        }
        case 'v': {
          break;
        }
        default: {
          if (new RegExp(INTEGER).exec(pressedKey)) {
            e.preventDefault();
          }
          break;
        }
      }
    },
    [activeInput, changeCodeAtFocus, focusNextInput, focusPrevInput, otpValues]
  );

  // Handle onPaste input
  const handleOnPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData
        .getData('text/plain')
        .trim()
        .slice(0, length - activeInput) // prevent overflow
        .split('');
  
      if (!pastedData.length) return;
  
      const updatedOTPValues = [...otpValues];
  
      pastedData.forEach((char, idx) => {
        if (activeInput + idx < length) {
          updatedOTPValues[activeInput + idx] = getRightValue(char);
        }
      });
  
      setOTPValues(updatedOTPValues);
  
      // Set activeInput to the next empty field or last
      const nextIndex = Math.min(activeInput + pastedData.length, length - 1);
      setActiveInput(nextIndex);
  
      handleOtpChange(updatedOTPValues); // update parent
    },
    [activeInput, getRightValue, handleOtpChange, length, otpValues]
  );
  
  // Function to reset OTP values
  const resetOTP = useCallback(() => {
    setOTPValues(new Array(length).fill(''));
    setActiveInput(0);
    onChangeOTP(''); // Trigger onChangeOTP with an empty string to notify the parent component
  }, [length, onChangeOTP]);

  return {
    handleOtpChange,
    getRightValue,
    changeCodeAtFocus,
    focusInput,
    focusPrevInput,
    focusNextInput,
    handleOnFocus,
    handleOnChange,
    onBlur,
    handleOnPaste,
    handleOnKeyDown,
    activeInput,
    otpValues,
    resetOTP,
  };
};
