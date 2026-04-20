import { Box, Checkbox, TableHead as MUITableHead, TableCell, TableRow, TableSortLabel } from '@mui/material';
import Image from 'next/image';
import React, { memo, useCallback, useRef, useState } from 'react';
import { CornerContainer } from 'yldzs-components';

import AtomTooltip from '@/components/atoms/tooltip';
import AtomTypography from '@/components/atoms/typography';
import { SortOptions } from '@/hooks/use-filter';
import { yieldzNeutral, yieldzPrimary } from '@/styles/theme/colors';

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export interface ITableHeader {
  id: string;
  label: string;
  width?: string;
  isSortable?: boolean;
  tooltip?: string;
}

interface IHeadCellsProps {
  headCells: ITableHeader[];
  setSortData: (sort: SortOptions) => void;
  hasCheckbox?: boolean;
  onSelectAllClick?: (checked: boolean) => void;
  isAllSelected?: boolean;
  isIndeterminate?: boolean;
}

const CustomSortIcon = ({ direction }: { direction: 'asc' | 'desc' }) => (
  <Image
    src="/assets/icons/arrow-custom.svg"
    width={10}
    height={10}
    alt="sort"
    style={{
      transform: direction === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: '0.2s ease',
      marginLeft: '10px',
    }}
  />
);

/** Throttle delay in milliseconds to prevent rapid clicks */
const SORT_THROTTLE_MS = 500;

/** Common typography styles for header labels */
const HEADER_LABEL_SX = {
  color: yieldzNeutral[300],
  textTransform: 'uppercase' as const,
  letterSpacing: '0.6px',
  fontSize: '12px',
  lineHeight: '18px',
};

/** Tooltip icon styles */
const TOOLTIP_ICON_SX = {
  color: yieldzNeutral[400],
  fontSize: '10px',
  lineHeight: '14px',
};

/**
 * Header Label Component
 * Renders the label text with optional tooltip
 */
interface HeaderLabelProps {
  label: string;
  tooltip?: string;
}

const HeaderLabel = memo(function HeaderLabel({ label, tooltip }: HeaderLabelProps): React.JSX.Element {
  const labelContent = (
    <AtomTypography
      sx={HEADER_LABEL_SX}
      fontType="ppMori"
      variant="label3"
      fontWeight={615}
      align="left"
    >
      {label}
    </AtomTypography>
  );

  if (!tooltip) {
    return labelContent;
  }

  return (
    <AtomTooltip title={tooltip} arrow placement="top">
      <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'help' }}>
        {labelContent}
        <AtomTypography component="span" sx={TOOLTIP_ICON_SX}>
          ⓘ
        </AtomTypography>
      </Box>
    </AtomTooltip>
  );
});

/**
 * Sort Icons Component
 * Renders the ascending/descending sort indicators
 */
interface SortIconsProps {
  isActive: boolean;
  direction: SortDirection;
}

const SortIcons = memo(function SortIcons({ isActive, direction }: SortIconsProps): React.JSX.Element {
  const isDescActive = isActive && direction === SortDirection.Desc;
  const isAscActive = isActive && direction === SortDirection.Asc;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1px',
      }}
    >
      {/* DESC ICON */}
      <Image
        src="/assets/icons/upward_icon.svg"
        width={10}
        height={10}
        alt="desc"
        style={{
          opacity: isDescActive ? 1 : 0.35,
          filter: isDescActive ? 'brightness(1.5)' : 'none',
          transition: '200ms',
          transform: 'rotate(-180deg)',
        }}
      />
      {/* ASC ICON */}
      <Image
        src="/assets/icons/upward_icon.svg"
        width={10}
        height={10}
        alt="asc"
        style={{
          opacity: isAscActive ? 1 : 0.35,
          filter: isAscActive ? 'brightness(1.5)' : 'none',
          transition: '200ms',
        }}
      />
    </Box>
  );
});

const TableHead: React.FC<IHeadCellsProps> = ({
  headCells,
  setSortData,
  hasCheckbox = false,
  onSelectAllClick,
  isAllSelected = false,
  isIndeterminate = false,
}) => {
  const [sortedColumn, setSortedColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.Asc);

  // Ref to track if sort is currently throttled
  const isSortThrottledRef = useRef(false);

  // ---------------------------
  // Toggle sort direction and notify parent (throttled)
  // ---------------------------

  const handleSortDirection = useCallback(
    (columnId: string) => {
      // Ignore clicks while throttled
      if (isSortThrottledRef.current) {
        return;
      }

      // Enable throttle
      isSortThrottledRef.current = true;

      // Determine new sort direction
      // If clicking a NEW column → always start with ASC
      // If clicking the SAME column → toggle between ASC and DESC
      const getNewDirection = (): SortDirection => {
        if (sortedColumn !== columnId) {
          return SortDirection.Asc;
        }
        return sortDirection === SortDirection.Desc
          ? SortDirection.Asc
          : SortDirection.Desc;
      };
      const newDirection = getNewDirection();

      setSortedColumn(columnId);
      setSortDirection(newDirection);
      setSortData({ sortBy: columnId, sortOrder: newDirection });

      // Reset throttle after delay
      setTimeout(() => {
        isSortThrottledRef.current = false;
      }, SORT_THROTTLE_MS);
    },
    [sortedColumn, sortDirection, setSortData]
  );

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAllClick?.(event.target.checked);
  };

  return (
    <MUITableHead
      sx={{
        backgroundColor: yieldzNeutral[900],
        borderBottom: `1px solid ${yieldzNeutral[600]}`,
        '& .MuiTableCell-root': {
          backgroundColor: 'transparent',
          borderBottom: 'none',
          borderRight: 'none',
          padding: 0,
          position: 'relative',
          overflow: 'visible',
          height: '56px',
        },
        '& .MuiTableRow-root': {
          height: '56px',
        },
      }}
    >
      <TableRow sx={{ height: '56px' }}>
        {hasCheckbox && (
          <TableCell
            padding="none"
            sx={{
              width: '60px',
            }}
          >
            <CornerContainer
              showBorder={false}
              cornerRadius="6px"
              height="56px"
              sx={{
                backgroundColor: yieldzNeutral[900],
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={handleCheckboxChange}
                sx={{
                  color: yieldzNeutral[400],
                  '&.Mui-checked': {
                    color: yieldzPrimary[500],
                  },
                  '&.MuiCheckbox-indeterminate': {
                    color: yieldzPrimary[500],
                  },
                }}
              />
            </CornerContainer>
          </TableCell>
        )}
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} style={{ width: headCell.width }}>
            <CornerContainer
              showBorder={false}
              cornerRadius="6px"
              height="56px"
              sx={{
                backgroundColor: yieldzNeutral[900],
                padding: '15px',
                border: `1px solid ${yieldzNeutral[800]}`,
              }}
            >
              {headCell.isSortable ? (
                <TableSortLabel
                  active={sortedColumn === headCell.id}
                  direction={sortDirection}
                  onClick={() => handleSortDirection(headCell.id)}
                  IconComponent={() => null}
                  sx={{
                    '& .MuiTableSortLabel-icon': { display: 'none' },
                    '&.Mui-active': { color: yieldzNeutral[300] },
                    cursor: 'pointer',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HeaderLabel label={headCell.label} tooltip={headCell.tooltip} />
                    <SortIcons isActive={sortedColumn === headCell.id} direction={sortDirection} />
                  </Box>
                </TableSortLabel>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HeaderLabel label={headCell.label} tooltip={headCell.tooltip} />
                </Box>
              )}
            </CornerContainer>
          </TableCell>
        ))}
      </TableRow>
    </MUITableHead>
  );
};

export default memo(TableHead);
