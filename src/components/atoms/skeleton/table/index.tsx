'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableRow
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import React, { memo } from 'react';

type AnimationType = 'wave' | 'pulse' | false;
type VariantType = 'circular' | 'rectangular' | 'rounded' | 'text';

interface TableSkeletonProps {
  id: string;
  animation?: AnimationType;
  variant?: VariantType;
  rowCount?: number;
  columnCount?: number;
  height?: number;
}

/**
 * AtomTableSkeleton
 * 
 * A reusable skeleton table for loading states.
 * Follows SRP, DRY, and Open-Closed principles.
 */
const AtomTableSkeleton: React.FC<Readonly<TableSkeletonProps>> = ({
  id,
  animation = 'pulse',
  variant = 'text',
  rowCount = 4,
  columnCount = 7,
  height = 50,
}) => {
  /**
   * Generates a single skeleton cell
   */
  const renderSkeletonCell = (colIndex: number): React.JSX.Element => (
    <TableCell key={`${id}-col-${colIndex}`}>
      <Skeleton
        animation={animation}
        variant={variant}
        height={height}
        width="100%"
        data-testid={`qa-${id}-cell-${colIndex}`}
      />
    </TableCell>
  );

  /**
   * Generates a single table row with skeleton cells
   */
  const renderSkeletonRow = (rowIndex: number): React.JSX.Element => (
    <TableRow key={`${id}-row-${rowIndex}`}>
      {Array.from({ length: columnCount }, (_, colIndex) =>
        renderSkeletonCell(colIndex)
      )}
    </TableRow>
  );

  return (
    <Table>
      <TableBody>
        {Array.from({ length: rowCount }, (_, rowIndex) =>
          renderSkeletonRow(rowIndex)
        )}
      </TableBody>
    </Table>
  );
};

export default memo(AtomTableSkeleton);
