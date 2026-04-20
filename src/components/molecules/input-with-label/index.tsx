import { FormLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import React, { forwardRef, type ForwardedRef } from 'react';
 
import AtomInput, { type CustomInputProps } from '@/components/atoms/input';
import { type FormControlTypeProps } from '@/types/common';
 
// import other Atom component interfaces as needed
 
type CombinedInputMolecule = FormControlTypeProps & CustomInputProps;

type TInputWithLabel = Omit<CombinedInputMolecule, ''> & {
  /**
   * If true, shows a persistent label above the input field (similar to SelectWithLabel)
   * This ensures the label remains visible and aligns with select fields
   * Useful for forms like accreditation where label visibility and alignment is critical
   */
  showPersistentLabel?: boolean;
};
 
const InputWithLabel = forwardRef((props: TInputWithLabel, ref: ForwardedRef<HTMLInputElement>): React.JSX.Element => {
  const { id, label = '', required = false, willAuthenticate, disabled, variant = 'outlined', showPersistentLabel = false } = props;

  // Show persistent label if explicitly requested (for accreditation form alignment)
  // or if variant is not 'standard' (existing behavior for backward compatibility)
  const showSeparateLabel = showPersistentLabel || (variant !== 'standard' && label);

  return (
    
    <FormControl sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {showSeparateLabel ? (
        <FormLabel 
          required={required} 
          htmlFor={id} 
          disabled={disabled} 
          sx={{ 
            color: willAuthenticate ? 'black' : '',
            // Match SelectWithLabel styling for consistent alignment
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {label}
        </FormLabel>
      ) : null}
      <AtomInput 
        {...props} 
        // Hide internal label when persistent label is shown to avoid duplication
        label={showPersistentLabel ? '' : label}
        ref={ref} 
      />
    </FormControl>
  );
});
 
// Assign a displayName to the component
InputWithLabel.displayName = 'InputWithLabelComponent';
 
export default InputWithLabel;