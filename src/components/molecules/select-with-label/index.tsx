'use client';

import { FormControl, FormLabel } from '@mui/material';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import SelectBox, { type CustomSelectProps } from '@/components/atoms/select-box';
import { yieldzNeutral } from '@/styles/theme/colors';
import { type FormControlTypeProps } from '@/types/common';

// Combine props while avoiding redundant ones
type CombinedSelectProps = Omit<FormControlTypeProps & CustomSelectProps, 'InputProps'> & {
  /**
   * If true, shows a persistent label above the select field
   * This ensures the label remains visible (used on accreditation page)
   * Defaults to false to maintain backward compatibility
   */
  showPersistentLabel?: boolean;
};

const SelectWithLabel: React.FC<CombinedSelectProps> = (props) => {
  const { id, label = '', required = false, disabled, showPersistentLabel = false, name, multiple = false } = props;
  const { watch } = useFormContext();
  
  // Watch the form value to determine if label should be shown (matching input field behavior)
  const formValue = watch(name);
  
  // Check if a value is selected (handles both single and multiple selections)
  // For multiple: check if array has items
  // For single: check if value exists and is not empty/null/undefined
  const hasValue = multiple 
    ? Array.isArray(formValue) && formValue.length > 0
    : formValue !== null && formValue !== undefined && formValue !== '' && 
      (typeof formValue !== 'object' || (typeof formValue === 'object' && formValue !== null && Object.keys(formValue).length > 0));

  // Show label only when showPersistentLabel is true AND a value is selected (matching input field standard variant behavior)
  const showSeparateLabel = showPersistentLabel && Boolean(label) && hasValue;

  // When using persistent label, hide the internal label in SelectBox to avoid duplication
  const selectBoxProps = showPersistentLabel 
    ? { ...props, noLabel: true }
    : props;

  return (
    <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: '0px' }} disabled={disabled} fullWidth>
      {showSeparateLabel ? (
        <FormLabel
          required={required}
          htmlFor={id}
          disabled={disabled}
          sx={{
            fontSize: '10px !important', // 10px - matches input label size for consistency
            fontWeight: 600,
            // lineHeight: '18px !important', // Reduced line height for label
            color: `${yieldzNeutral[300]} !important`, // #A7A7A7 - from theme
            textTransform: 'uppercase',
            '&.MuiFormLabel-root': {
              fontSize: '10px !important',
              fontWeight: 600,
              // lineHeight: '18px !important',
              textTransform: 'uppercase',
            },
            '&.MuiFormLabel-colorPrimary': {
              color: `${yieldzNeutral[300]} !important`, // #A7A7A7 - from theme
            },
            '& .MuiFormLabel-asterisk': {
              color: `${yieldzNeutral[300]} !important`,
            },
          }}
        >
          {label}
        </FormLabel>
      ) : null}
      <SelectBox {...selectBoxProps} />
    </FormControl>
  );
};

SelectWithLabel.displayName = 'SelectWithLabel';

export default SelectWithLabel;
