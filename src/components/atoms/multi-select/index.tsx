import CheckIcon from '@mui/icons-material/Check';
import {
    Box,
    Chip,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    type InputBaseProps,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { kebabCase } from 'change-case';
import React, {
    forwardRef,
    useEffect,
    useState,
    type ForwardedRef,
    type SyntheticEvent,
} from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import useScrollMore from '@/hooks/use-scroll-more';
import { logger } from '@/lib/default-logger';
import { type TColor } from '@/types/common';

// -----------------------------
// Type definitions
// -----------------------------
export interface TSelectOption {
  label: string;
  value: string | number;
}

export interface MultiSelectProps {
  id: string;
  name: string;
  label: string;
  options: TSelectOption[];
  error?: boolean;
  fullWidth?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onOpen?: (event: SyntheticEvent) => void;
  onClose?: (event: SyntheticEvent) => void;
  disabled?: boolean;
  InputProps?: InputBaseProps;
  size?: 'small' | 'medium';
  placeholder?: string;
  readonly?: boolean;
  enableLoadMore?: boolean;
  HandleLoadMore?: () => TSelectOption[]; // Function to fetch more options on scroll
  chipColor?: TColor;
  variant?: 'filled' | 'outlined';
}

type ReadonlyMultiSelectProps = Readonly<MultiSelectProps>;

// -----------------------------
// MultiSelect Component with forwardRef
// -----------------------------
const MultiSelect = forwardRef(
  (props: ReadonlyMultiSelectProps, ref: ForwardedRef<HTMLDivElement>): React.JSX.Element => {
    const {
      name,
      id,
      HandleLoadMore = null,
      enableLoadMore = false,
      options,
      label,
      placeholder,
      fullWidth = true,
      disabled,
      variant = 'outlined',
      readonly = false,
      ...rest
    } = props;

    const [target, setTarget] = useState<HTMLUListElement | null>(null); // Scroll target
    const isNextPage = useScrollMore(target); // Detect scroll bottom
    const [list, setList] = useState<TSelectOption[]>(options); // Current options
    const { control, setValue } = useFormContext(); // RHF

    // -----------------------------
    // Merge newly fetched options, avoiding duplicates
    // -----------------------------
    const handleConcatList = (returnedData: TSelectOption[]): void => {
      const existingValues = new Set(list.map((option) => option.value));
      const uniqueReturnedData = returnedData.filter(
        (option) => !existingValues.has(option.value)
      );
      setList([...list, ...uniqueReturnedData]);
    };

    // -----------------------------
    // Effect: fetch more options when scrolling reaches bottom
    // -----------------------------
    useEffect(() => {
      if (isNextPage && HandleLoadMore) {
        const fetchData = async (): Promise<void> => {
          const returnedData = HandleLoadMore();
          if (Array.isArray(returnedData)) {
            handleConcatList(returnedData);
          }
        };
        fetchData().catch((error: unknown) => {
          logger.error('Error fetching data:', error);
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNextPage]);

    // -----------------------------
    // Ensure selected options are valid and unique
    // -----------------------------
    function getSelectedOptions(
      selectedOptions: TSelectOption[],
      options: TSelectOption[]
    ): TSelectOption[] {
      const selectedLabels = Array.from(new Set(selectedOptions.map((o) => o.label)));
      return selectedLabels
        .map((label) => options.find((option) => option.label === label))
        .filter((option): option is TSelectOption => option !== undefined);
    }

    // -----------------------------
    // Render component
    // -----------------------------
    return (
      <Box ref={ref}>
        <Controller
          name={name}
          control={control}
          defaultValue={[]} // <-- ensures controlled Autocomplete
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              multiple
              options={list}
              value={field.value || []} // controlled from first render
              freeSolo={false}
              onBlur={field.onBlur}
              fullWidth={fullWidth}
              readOnly={readonly}
              data-testid={`qa-${kebabCase(id ?? '')}`}
              disablePortal
              id={id}
              disableListWrap
              disabled={disabled}
              getOptionLabel={(option: TSelectOption) => option.label}
              isOptionEqualToValue={(opt, val) => {
                if (Array.isArray(val)) {
                  return val.some((v) => v.value === opt.value);
                }
                return opt.value === val?.value;
              }} // Compare by value
              disableClearable
              {...rest}

              // -----------------------------
              // Render selected chips
              // -----------------------------
              renderValue={(value: TSelectOption[], getTagProps) =>
                value.map((option: TSelectOption, index: number) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={`${option.value}-${index}`}
                    variant="filled"
                    label={option.label}
                  />
                ))
              }

              // -----------------------------
              // Input field rendering
              // -----------------------------
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant={variant}
                  name={name}
                  placeholder={placeholder}
                  size="small"
                  required={false}
                  error={Boolean(error)}
                  helperText={error?.message ?? ''}
                />
              )}

              // -----------------------------
              // Handle selection changes
              // -----------------------------
              onChange={(
                event: React.ChangeEvent<unknown>,
                selectedOptions: TSelectOption[]
              ) => {
                const selectedValues = getSelectedOptions(selectedOptions, options);
                setValue(name, selectedValues, { shouldValidate: true, shouldDirty: true });
              }}

              // -----------------------------
              // Listbox props (scroll + styling)
              // -----------------------------
              slotProps={{
                listbox: {
                  style: { maxHeight: 300, overflow: 'auto' },
                  onScroll: (event: React.UIEvent<HTMLUListElement>): void => {
                    if (!enableLoadMore || HandleLoadMore === null) return;
                    setTarget(event?.target as HTMLUListElement);
                  },
                },
              }}

              // -----------------------------
              // Custom render for options with selected icon
              // -----------------------------
              renderOption={(props, option, { selected }) => (
                <ListItem {...props} key={`${option.value}-item`}>
                  {selected && (
                    <ListItemIcon>
                      <CheckIcon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <ListItemText primary={option.label} sx={{ pl: selected ? 1 : 0 }} />
                </ListItem>
              )}
            />
          )}
        />
      </Box>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';

export default MultiSelect;
