'use client';

import { type SxProps, type Theme } from '@mui/material';
import { CaretLeft as CaretLeftIcon } from '@phosphor-icons/react/dist/ssr/CaretLeft';
import React from 'react';

import AtomButton from '@/components/atoms/button';

interface BackButtonProps {
  sx?: SxProps<Theme>;
  url?: string;
  label?: string;
}

export function BackButton({ sx, url, label }: Readonly<BackButtonProps>): React.JSX.Element {
  const handleClick = async (): Promise<void> => {
    if (url) {
      globalThis.location.href = url;
    } else {
      globalThis.history.back(); // NOTE: To go back to the previous page of the browser (Can go back to Aithentic Legacy)
    }
  };

  const buttonLabel = label ? `Back to ${label}` : 'Back';  

  return (
    <AtomButton
      onClick={handleClick}
      id="back-button"
      label={buttonLabel}
      variant="text"
      startIcon={<CaretLeftIcon />}
      sx={sx}
    />
  );
}
