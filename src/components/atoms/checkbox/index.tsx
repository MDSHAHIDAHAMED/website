import React from 'react';
import { Checkbox, FormControlLabel, FormGroup, FormHelperText } from '@mui/material';
import { Box } from '@mui/system';
import { kebabCase } from 'change-case';
import { Controller, useFormContext } from 'react-hook-form';

import { type TColor } from '@/types/common';

type TSize = 'medium' | 'small';

type TValue = string | number;

export interface CheckBoxProps {
  label: string;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  defaultChecked?: boolean;
  required?: boolean;
  disabled?: boolean;
  size?: TSize;
  id: string;
  options: { label: string; value: TValue }[];
  error?: boolean;
  color?: TColor;
  indeterminate?: boolean;
}

function AtomCheckbox(props: Readonly<CheckBoxProps>): React.JSX.Element {
  const {
    // label = '',
    id,
    // error,
    options = [],
    indeterminate = false,
    color = 'secondary',
    name,
    onChange,
    // checked,
    size = 'small',
    ...rest
  } = props;
  const { control } = useFormContext();
  const getSelected = (selectedItems: TValue[], item: TValue): TValue[] =>
    selectedItems.includes(item) ? selectedItems.filter((value: TValue) => value !== item) : [...selectedItems, item];
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box display="flex" flexDirection="column">
          <FormGroup aria-label="position" row>
            {options?.length ? (
              options.map((option: CheckBoxProps['options'][number], index: number) => (
                <FormControlLabel
                  key={option.value}
                  label={option.label}
                  control={
                    <Checkbox
                      {...field}
                      checked={(field.value as TValue[]).includes(option.value)}
                      onBlur={field.onBlur}
                      onChange={() => {
                        field.onChange(getSelected(field.value as TValue[], option.value));
                      }}
                      size={size}
                      name={`${name}_${index}`}
                      color={color}
                      id={`${id}_${index}`}
                      data-testid={`qa-${kebabCase(id ?? '')}`}
                      value={option.value}
                      indeterminate={indeterminate}
                      {...rest}
                    />
                  }
                />
              ))
            ) : (
              <FormControlLabel
                label=""
                control={
                  <Checkbox
                    {...field}
                    checked={field.value as boolean}
                    size={size}
                    onBlur={field.onBlur}
                    name={name}
                    color={color}
                    id={id}
                    data-testid={`qa-${kebabCase(id ?? '')}`}
                    onChange={onChange}
                    indeterminate={indeterminate}
                    {...rest}
                  />
                }
              />
            )}
          </FormGroup>
          {Boolean(error) && (
            <FormHelperText error={Boolean(error)} sx={{ mx: 0 }}>
              {error ? error?.message : ''}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
}

export default AtomCheckbox;
