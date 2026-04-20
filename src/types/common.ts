export type TColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'; //colors

export type TSize = 'xs' | 'small' | 'medium' | 'large'; //sizes

export interface FormControlTypeProps {
  label: string;
  helperText?: string | null;
  required?: boolean;
  id: string;
  name: string;
  error?: boolean;
  disabled?: boolean;
}
