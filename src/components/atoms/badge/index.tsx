import React, { forwardRef } from 'react';
import { Badge, Box, type SxProps } from '@mui/material';
import { kebabCase } from 'change-case';

import { type TColor } from '@/types/common';

type TOverlapBadge = 'circular' | 'rectangular';
type TVariant = 'dot' | 'standard';
interface BadgeProps {
  color?: TColor;
  variant?: TVariant;
  showZero?: boolean;
  invisible?: boolean;
  overlap?: TOverlapBadge;
  children: React.ReactNode;
  badgeContent?: React.ReactNode;
  id: string;
  sx?: SxProps;
}
function AtomBadge(props: BadgeProps, _ref: React.Ref<HTMLDivElement>): React.JSX.Element {
  const {
    color = 'error',
    id = 'badge',
    variant,
    showZero = false,
    overlap = 'circular',
    children,
    invisible = false,
    badgeContent,
    sx = {},
  } = props;
  return (
    <Box sx={{ color: 'action.active' }}>
      <Badge
        color={color}
        showZero={showZero}
        overlap={overlap}
        variant={variant}
        id={id}
        data-testid={`qa-${kebabCase(id ?? '')}`}
        invisible={invisible}
        badgeContent={badgeContent}
        sx={sx}
      >
        {children}
      </Badge>
    </Box>
  );
}

export default forwardRef(AtomBadge);
