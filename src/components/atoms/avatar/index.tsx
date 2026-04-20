import React, { type ReactNode } from 'react';
import { Avatar, Box, type SxProps } from '@mui/material';
import { kebabCase } from 'change-case';

import { type TColor } from '@/types/common';

type TVariants = 'circular' | 'rounded' | 'square';

interface AvatarProps {
  children?: ReactNode | string;
  size?: number;
  alt?: string;
  src?: string;
  variant?: TVariants;
  sizes?: { width: number; height: number };
  srcSet?: string;
  id: string | number;
  color?: string;
  sx?: SxProps;
}

const getColor = (color = 'secondary', type = ''): string | null => {
  if (color === 'inherit') return null;
  if (type) return `var(--mui-palette-${color}-200)`;
  if (color && !type) {
    return color;
  }
  return `var(--mui-palette-${color}-700)`;
};

function AtomAvatar(props: Readonly<AvatarProps>): React.JSX.Element {
  const {
    variant = 'circular',
    id,
    color = 'inherit' as TColor | 'inherit',
    children,
    alt = '',
    src = '',
    sizes,
    sx = {},
    ...rest
  } = props;
  return (
    <Box data-testid={`qa-${kebabCase(String(id))}`}>
      {children ? (
        <Avatar
          src={src}
          alt={alt}
          variant={variant}
          sx={{ ...sizes, ...sx, backgroundColor: getColor(color, 'bg'), color: getColor(color) }}
          {...rest}
        >
          <> {children}</>
        </Avatar>
      ) : (
        <Avatar
          alt={alt}
          src={src}
          variant={variant}
          sx={{ ...sizes, ...sx, backgroundColor: getColor(color, 'bg'), color: getColor(color) }}
          {...rest}
        />
      )}
    </Box>
  );
}

export default AtomAvatar;
