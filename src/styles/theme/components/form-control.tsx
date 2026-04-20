import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiFormControl = {
  styleOverrides: {
    root: {
      // FormLabel visibility is now controlled by component logic in SelectWithLabel
      // This ensures the label only shows when a value is selected (matching input field behavior)
      // Add spacing between FormLabel and Autocomplete (select fields) - only when label exists
      '&:has(.MuiFormLabel-root + .MuiAutocomplete-root) .MuiFormLabel-root': {
        marginTop: '-18px', // Space between label and select field value
      },
      // For fields without labels (like buy-tab), adjust arrow positioning to align with input text
      // When there's no FormLabel, the padding-top is 20px, so arrow needs to be positioned lower
      '&:has(.MuiAutocomplete-root):not(:has(.MuiFormLabel-root)) .MuiAutocomplete-root .MuiOutlinedInput-root .MuiAutocomplete-endAdornment': {
        top: 'calc(50% + 0px)', // Adjust for 20px padding-top to align with input text (moved upward)
        transform: 'translateY(-50%)', // Keep centered vertically
      },
      // When value is selected and no label, adjust arrow position (padding-top becomes 0)
      '&:has(.MuiAutocomplete-root):not(:has(.MuiFormLabel-root)) .MuiAutocomplete-root .MuiOutlinedInput-root:has(.MuiAutocomplete-input:not(:placeholder-shown)):not(.Mui-focused) .MuiAutocomplete-endAdornment': {
        top: '50%', // Back to center when padding-top is 0
        transform: 'translateY(-50%)',
      },
      // For FormControls with Autocomplete but NO FormLabel (like buy-tab)
      // Add margin-top to the Autocomplete to maintain alignment with input fields
      // This ensures select fields without labels align properly with input fields that have labels
      // '&:has(.MuiAutocomplete-root):not(:has(.MuiFormLabel-root)) .MuiAutocomplete-root .MuiOutlinedInput-root': {
      //   marginTop: '20px !important', // Force margin-top to align with input field (standard variant has 20px)
      // },
      // // When focused and no label, maintain margin-top for alignment
      // '&:has(.MuiAutocomplete-root):not(:has(.MuiFormLabel-root)) .MuiAutocomplete-root .MuiOutlinedInput-root.Mui-focused': {
      //   marginTop: '20px !important', // Keep margin when focused to prevent jumping and maintain alignment
      // },
      // // When value is selected and no label, maintain margin-top for alignment
      // '&:has(.MuiAutocomplete-root):not(:has(.MuiFormLabel-root)) .MuiAutocomplete-root .MuiOutlinedInput-root:has(.MuiAutocomplete-input:not(:placeholder-shown))': {
      //   marginTop: '20px !important', // Keep margin when value selected to maintain alignment
      // },
    },
  },
} satisfies Components<Theme>['MuiFormControl'];
