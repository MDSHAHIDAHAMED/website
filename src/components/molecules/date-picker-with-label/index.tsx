'use client';

import { FormControl, FormLabel } from '@mui/material';
import React, { forwardRef, type ForwardedRef } from 'react';

import AtomDatePicker, { type AtomDatePickerProps } from '@/components/atoms/date-picker';
import { type FormControlTypeProps } from '@/types/common';

// Combine props while avoiding redundant ones
type CombinedDatePickerProps = Omit<FormControlTypeProps & AtomDatePickerProps, ''>;

const DatePickerWithLabel = forwardRef(
  (props: CombinedDatePickerProps, ref: ForwardedRef<HTMLInputElement>): React.JSX.Element => {
    const { id, label = '', required = false, disabled, variant = 'standard' } = props;

    // For standard variant, label is handled by DatePicker itself (floating label)
    const showSeparateLabel = variant !== 'standard' && label;

    return (
      <FormControl sx={{ width: '100%', display: 'flex', flexDirection: 'column', }} disabled={disabled}>
        {showSeparateLabel ? (
          <FormLabel required={required} htmlFor={id} disabled={disabled}>
            {label}
          </FormLabel>
        ) : null}
        <AtomDatePicker {...props} ref={ref} />
      </FormControl>
    );
  }
);

DatePickerWithLabel.displayName = 'DatePickerWithLabel';

export default DatePickerWithLabel;

