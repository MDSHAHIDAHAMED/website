import { FormLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { forwardRef, type ForwardedRef } from 'react';

import MultiSelect, { MultiSelectProps } from '@/components/atoms/multi-select';
import { type FormControlTypeProps } from '@/types/common';

// Combine FormControl props + MultiSelect props
type CombinedMultiSelectMolecule = FormControlTypeProps & MultiSelectProps;

/**
 * MultiSelectWithLabel
 * Wraps MultiSelect with FormControl and label.
 * Supports forwardRef for form integration or DOM access.
 */
const MultiSelectWithLabel = forwardRef(
  (props: CombinedMultiSelectMolecule, ref: ForwardedRef<HTMLDivElement>) => {
    const { id, label = '', required = false, disabled, ...rest } = props;

    return (
      <FormControl
        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        {label && (
          <FormLabel required={required} htmlFor={id} disabled={disabled}>
            {label}
          </FormLabel>
        )}

        <MultiSelect {...rest} id={id} disabled={disabled} ref={ref} label={label} />
      </FormControl>
    );
  }
);

MultiSelectWithLabel.displayName = 'MultiSelectWithLabelComponent';

export default MultiSelectWithLabel;
