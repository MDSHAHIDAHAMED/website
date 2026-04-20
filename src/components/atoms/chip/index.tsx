'use client';

import React from 'react';
import { Chip as MUIChip, ChipProps as MUIChipProps } from '@mui/material';


export interface ChipProps extends MUIChipProps {}

const Chip: React.FC<ChipProps> = (props) => {
  return <MUIChip size="medium" {...props} />;
};

export default Chip;
