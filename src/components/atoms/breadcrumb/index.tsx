'use client';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { type TypographyOwnProps } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import { kebabCase } from 'change-case';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { type TColor } from '@/types/common';

export interface ItemProps {
  href: string;
  variant: TypographyOwnProps['variant'];
  label: string;
}

interface BreadcrumbsProps {
  id: string;
  seperator?: React.ReactNode | string;
  breadCrumbs: ItemProps[];
  color?: 'inherit' | TColor;
}

function AtomBreadcrumbs(props: Readonly<BreadcrumbsProps>): React.JSX.Element {
  const theme = useTheme();
  const { breadCrumbs = [], id, color = 'inherit', seperator = '>' } = props;
  const router = useRouter();

  const [currentLink, setCurrentLink] = useState<number | null>(0);
  const lastLink = breadCrumbs[breadCrumbs?.length - 1]?.href;

  const handleRedirection = async (index: number, href: string): Promise<void> => {
    if (href !== lastLink) {
      setCurrentLink(index);
      router.push(href);
    }
  };

  return (
    <Breadcrumbs
      separator={seperator ?? <NavigateNextIcon sx={{ color: 'var(--mui-palette-neutral-800)', fontSize: 18 }} />}
      aria-label="breadcrumb"
      id={id}
      maxItems={3}
      data-testid={`qa-${kebabCase(id ?? '')}`}
    >
      {breadCrumbs?.map((item: ItemProps, index: number) => {
        return (
          <Link
            key={`${item.href}-${item.label}`}
            // href={item.href} // This is commented out because we are using async signout to clear session cookies
            color={currentLink === index ? theme.palette.text.primary : color}
            underline="hover"
            variant={item.variant}
            onClick={() => {
              void handleRedirection(index, item.href);
            }}
            sx={{
              userSelect: 'none',
              cursor: 'pointer',
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
export default AtomBreadcrumbs;
