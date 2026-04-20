import type { Components } from '@mui/material/styles';

import type { Theme } from '@/styles/theme/types';

export const MuiAutocomplete = {
  styleOverrides: {
    root: {
      width: '100%',
      // Custom styling for outlined variant select boxes
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'transparent !important', // Ensure background stays transparent
        borderRadius: '0',
        padding: '20px 0 10px 0', // Default padding-top: 20px when no value
        // marginTop: '20px', // Match input field marginTop for alignment when no value
        height: 'auto',
        minHeight: 'auto',
        transition: 'border-bottom-color 0.2s ease, margin-top 0.2s ease, padding-top 0.2s ease',
        borderBottom: '1px solid var(--mui-palette-neutral-700)', // #343434 - only bottom border
        '& fieldset': {
          display: 'none', // Remove the fieldset border completely
        },
        '&:hover': {
          borderBottom: '1px solid var(--mui-palette-neutral-500)', // #595959 - lighter on hover
          backgroundColor: 'transparent !important', // Keep transparent on hover
        },
        '&.Mui-focused': {
          borderBottom: '2px solid var(--mui-palette-primary-500)', // #6DF2FE - cyan on focus, thicker
          padding: '20px 0 10px 0', // Keep padding-top 20px when focused (dropdown open)
          backgroundColor: 'transparent !important', // Keep transparent when focused
          marginTop: '0', // Remove margin when dropdown is open (focused)
        },
        // When focused and value is selected, keep padding-top 20px to maintain position
        '&.Mui-focused:has(.MuiAutocomplete-input:not(:placeholder-shown))': {
          padding: '0px 0 10px 0', // Keep padding-top 20px when focused and value selected
        },
        '&.Mui-focused:has(.MuiOutlinedInput-input:not(:placeholder-shown))': {
          padding: '0px 0 10px 0', // Keep padding-top 20px when focused and value selected
        },
        '&.Mui-error': {
          borderBottom: '1px solid var(--mui-palette-error-main)',
        },
        // When value is selected AND NOT focused, set padding-top to 0
        '&:has(.MuiAutocomplete-input:not(:placeholder-shown)):not(.Mui-focused)': {
          paddingTop: '0', // padding-top 0 when value selected and focus is out
          marginTop: '0', // Remove margin when value is selected
        },
        '&:has(.MuiOutlinedInput-input:not(:placeholder-shown)):not(.Mui-focused)': {
          paddingTop: '0', // padding-top 0 when value selected and focus is out
          marginTop: '0', // Remove margin when value is selected
        },
        '& .MuiOutlinedInput-input': {
          padding: '0px 0 0 0', // Add top padding to match input field label spacing
          fontSize: '14px', // Match input field font size
          fontWeight: 500,
          lineHeight: '1.2',
          color: 'var(--mui-palette-neutral-100)', // #D9D9D9
        },
        // When value is selected, set line height to 18px and add spacing above border
        '&:has(.MuiAutocomplete-input:not(:placeholder-shown)) .MuiOutlinedInput-input': {
          lineHeight: '18px',
          paddingBottom: '8px', // Add spacing between value and blue line
          fontSize: '14px', // Match input field font size
          fontWeight: 500, // Match input field font weight
        },
        '&:has(.MuiOutlinedInput-input:not(:placeholder-shown)) .MuiOutlinedInput-input': {
          lineHeight: '18px',
          paddingBottom: '8px', // Add spacing between value and blue line
          fontSize: '14px', // Match input field font size
          fontWeight: 500, // Match input field font weight
        },
        // Maintain line height and spacing when focused and value is selected
        '&.Mui-focused:has(.MuiAutocomplete-input:not(:placeholder-shown)) .MuiOutlinedInput-input': {
          lineHeight: '18px',
          paddingBottom: '8px', // Add spacing between value and blue line
          fontSize: '14px', // Match input field font size
          fontWeight: 500, // Match input field font weight
        },
        '&.Mui-focused:has(.MuiOutlinedInput-input:not(:placeholder-shown)) .MuiOutlinedInput-input': {
          lineHeight: '18px',
          paddingBottom: '8px', // Add spacing between value and blue line
          fontSize: '14px', // Match input field font size
          fontWeight: 500, // Match input field font weight
        },
        '& .MuiAutocomplete-input': {
          padding: '8px 0 0 0 !important', // Match the top padding
          marginTop: '-4px', // Adjust vertical alignment
          marginBottom: '4px', // Adjust vertical alignment
        },
        '& .MuiAutocomplete-endAdornment': {
          right: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          position: 'absolute',
        },
      },

      // Hide the label completely (using external label from SelectWithLabel)
      '& .MuiInputLabel-root': {
        display: 'none',
      },

      // Remove the default notch behavior
      '& .MuiOutlinedInput-notchedOutline': {
        display: 'none',
      },

      '& .MuiFormHelperText-root': {
        marginLeft: '0',
        marginTop: '4px',
        fontSize: '12px',
      },
    },
    paper: {
      backgroundColor: 'var(--mui-palette-neutral-900)', // #111111 - dark background for visibility
      border: '1px solid var(--mui-palette-neutral-700)', // #343434 - visible border
      boxShadow: 'var(--mui-shadows-16)',
      marginTop: 6,
      borderRadius: '8px',
      overflow: 'hidden',
    },
    listbox: {
      padding: '8px',
      pb: '4px',
      maxHeight: '300px',
      backgroundColor: 'var(--mui-palette-neutral-900)', // #111111
      '& .MuiAutocomplete-option': {
        padding: '12px 16px',
        borderRadius: '4px',
        fontSize: '18px',
        lineHeight: '1.5',
        minHeight: '44px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        color: 'var(--mui-palette-neutral-100)', // #D9D9D9 - light text for visibility
        transition: 'background-color 0.2s ease, color 0.2s ease',
        '&:hover': {
          backgroundColor: 'var(--mui-palette-neutral-800)', // #222222 - visible hover
          color: 'var(--mui-palette-neutral-50)', // #E9E9E9 - brighter on hover
        },
        '&.Mui-focused': {
          backgroundColor: 'var(--mui-palette-neutral-800)', // #222222
          color: 'var(--mui-palette-neutral-50)',
        },
        '&[aria-selected="true"]': {
          backgroundColor: 'var(--mui-palette-neutral-800)', // #222222
          color: 'var(--mui-palette-primary-500)', // #6DF2FE - cyan for selected
          '&:hover': {
            backgroundColor: 'var(--mui-palette-neutral-700)', // #343434 - lighter on hover
            color: 'var(--mui-palette-primary-500)',
          },
        },
      },
      // '& .MuiAutocomplete-noOptions': {
      //   padding: '12px 16px',
      //   fontSize: '14px',
      //   color: 'var(--mui-palette-neutral-400)', // #898989
      // },
    },
    clearIndicator: {
      color: 'var(--mui-palette-neutral-400)', // #898989
      marginRight: '4px',
      marginTop: '15px',
      '&:hover': {
        backgroundColor: 'transparent',
        color: 'var(--mui-palette-neutral-100)',
      },
    },
    popupIndicator: {
      color: 'var(--mui-palette-neutral-100)', // #D9D9D9
      marginRight: '0',
      padding: '4px',
      marginTop: '0', // Remove fixed margin - let endAdornment positioning handle it
      '&:hover': {
        backgroundColor: 'transparent',
        color: 'var(--mui-palette-primary-500)', // #6DF2FE
      },
      '& img': {
        display: 'block',
        width: '16px',
        height: '20px',
      },
    },
  },
} satisfies Components<Theme>['MuiAutocomplete'];
