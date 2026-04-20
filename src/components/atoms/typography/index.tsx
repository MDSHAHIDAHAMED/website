'use client';
 
import { fontFamily } from '@/styles/theme/fonts';
import { Typography, type TypographyProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { kebabCase } from 'change-case';
import React from 'react';
 
/**
 * Font type options for typography
 * - 'ui': PP Mori font for general UI text, headings, and body content (default)
 * - 'numeric': Tickerbit font for numbers, data, addresses, and ticker values
 */
export type FontType = 'ppMori' | 'tickerbit';

export interface CustomTypographyProps extends TypographyProps {
  name?: string;
  id?: string;
  /**
   * Font type to use for this typography
   * @default 'ui' - Uses PP Mori font for general text
   * @example
   * // For general text
   * <AtomTypography fontType="ui">Welcome</AtomTypography>
   * 
   * // For numbers and data
   * <AtomTypography fontType="numeric">$1,234.56</AtomTypography>
   */
  fontType?: FontType;
}
type ReadonlyCustomTypographyProps = Readonly<CustomTypographyProps>;

/**
 * Maps font type to the actual font family
 */
const fontTypeMap: Record<FontType, string> = {
  ppMori: fontFamily.ppMori,
  tickerbit: fontFamily.tickerbit,
};
 
function AtomTypography(props: ReadonlyCustomTypographyProps): React.JSX.Element {
  const theme = useTheme();
 
  const {
    id,
    name = '',
    sx,
    color,
    variant = 'body1',
    align = 'left',
    fontWeight,
    component = 'span',
    children,
    onClick,
    fontType = 'ppMori', // Default to UI font (PP Mori)
    ...rest
  } = props;
 
  return (
    <Typography
      id={id}
      data-testid={`qa-${kebabCase(id ?? '')}`}
      name={name}
      variant={variant}
      align={align}
      component={component}
      onClick={onClick}
      sx={{
        fontFamily: fontTypeMap[fontType],
        fontWeight,
        ...sx,
      }}
      color={color === 'grey' ? theme.palette.text.secondary : color}
      {...rest}
    >
      {children}
    </Typography>
  );
}
 
export default AtomTypography;