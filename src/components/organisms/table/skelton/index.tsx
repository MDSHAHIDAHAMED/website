import { TableBody, TableCell, TableRow } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { memo } from 'react';
import { yieldzNeutral } from 'yldzs-components';

type TAnimation = 'wave' | 'pulse' | false;
type TVariants = 'circular' | 'rectangular' | 'rounded' | 'text';

interface ISkeleton {
  id: string;
  animation: TAnimation;
  variant: TVariants;
  noOfColumns?: number;
  rowCount?: number;
}

/**
 * TableSkeleton Component
 * =====================
 * 
 * Renders skeleton loading state for table rows.
 * Returns only TableBody with skeleton rows to be used inside existing Table component.
 * 
 * @param id - Unique identifier for the skeleton
 * @param animation - Animation type ('wave', 'pulse', or false)
 * @param variant - Skeleton variant type
 * @param noOfColumns - Number of columns to render (default: 7)
 * @param rowCount - Number of skeleton rows to render (default: 4)
 */
const TableSkelton = (props: ISkeleton) => {
  const { id, variant = 'text', animation = 'pulse', noOfColumns = 7, rowCount = 4 } = props;
  
  /**
   * Renders a single skeleton table row
   */
  const renderTableRow = (rowIndex: number) => {
    const cells = [];
    for (let i = 0; i < noOfColumns; i++) {
      cells.push(
        <TableCell key={`${id}-cell-${rowIndex}-${i}`}>
          <Skeleton
            animation={animation}
            variant={variant}
            height={50}
            width={'100%'}
            data-testid={`${id}-skeleton-${rowIndex}-${i}`}
            sx={{
              backgroundColor: yieldzNeutral[900],
              padding: '6px 20px',
            }}
          />
        </TableCell>
      );
    }
    return <TableRow key={`${id}-row-${rowIndex}`}>{cells}</TableRow>;
  };

  return (
    <TableBody>
      {Array.from({ length: rowCount }, (_, index) => renderTableRow(index))}
    </TableBody>
  );
};

export default memo(TableSkelton);
