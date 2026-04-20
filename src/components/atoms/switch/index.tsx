import * as React from 'react';
import { Box, Typography } from '@mui/material';
import Switch from '@mui/material/Switch';
import { kebabCase } from 'change-case';

import { type TColor } from '@/types/common';

type TSize = 'medium' | 'small';

interface SwitchProps {
  id: string;
  name: string;
  onChange?: (event: React.ChangeEvent) => void;
  label: string;
  color?: TColor;
  disabled?: boolean;
  size?: TSize;
  checked: boolean;
  required?: boolean;
}

type ReadonlySwitchProps = Readonly<SwitchProps>;

function AtomSwitch(props: ReadonlySwitchProps): React.JSX.Element {
  const {
    id,
    name,
    color = 'secondary',
    label,
    onChange,
    disabled = false,
    size = 'medium',
    checked = false,
    required,
    ...rest
  } = props;

  return (
    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }} data-testid={`qa-${kebabCase(id ?? '')}`}>
      <Typography>{label}</Typography>
      <Switch
        aria-label="Switch toggle"
        checked={checked}
        id={id}
        name={name}
        color={color}
        size={size}
        required={required}
        disableRipple={false}
        disabled={disabled}
        onChange={onChange}
        data-testid={`qa-${kebabCase(id ?? '')}`}
        {...rest}
      />
    </Box>
  );
}

export default AtomSwitch;
