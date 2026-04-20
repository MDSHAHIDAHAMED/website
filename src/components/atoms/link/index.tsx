import React from 'react';
import { type TypographyOwnProps } from '@mui/material';
import Link from '@mui/material/Link';
import { kebabCase } from 'change-case';

import { type TColor } from '@/types/common';

interface LinkItemProps {
  href: string;
  variant?: TypographyOwnProps['variant'];
  children: React.ReactNode;
  color: TColor | 'inherit';
  id: string;
  disabled?: boolean;
}

type ReadonlyLinkItemProps = Readonly<LinkItemProps>;

function AtomLink(props: ReadonlyLinkItemProps): React.JSX.Element {
  const { href, id, variant = 'body1', disabled = false, children, color = 'secondary' } = props;

  return (
    <Link
      href={!disabled ? href : '#'}
      color={color}
      underline="always"
      variant={variant}
      id={id}
      data-testid={`qa-${kebabCase(id ?? '')}`}
    >
      {children}
    </Link>
  );
}
export default AtomLink;
