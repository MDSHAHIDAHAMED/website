import { DEFAULT_SORT_DIRECTION } from '@/constants/pagination';
import { Table as MUITable, Paper, Stack, TableContainer } from '@mui/material';
import React, { memo, useCallback } from 'react';

import Pagination, { ISelectOption } from '@/components/organisms/table/pagination';
import TableSkeleton from '@/components/organisms/table/skelton';
import { SortOptions } from '@/hooks/use-filter';
import { yieldzNeutral } from '@/styles/theme/colors';

import { CornerContainer } from 'yldzs-components';
import TableBody from './tableBody';
import MUITableHead, { ITableHeader } from './tableHead';

export type { ITableAction } from './tableBody';

interface ITableListing {
  pageSize: ISelectOption | number;
  totalCount: number;
  loading: boolean;
  headers: ITableHeader[];
  pageNumber?: number;
  onRowsPerPageChange?: (event: any) => void;
  onSortChangeHandler?: (data: SortOptions) => void;
  onPageChange?: (event: any, page: number) => void;
  rows: Record<string, any>[];
  filters?: React.ReactNode;
  orderBy?: any;
  noRecords: string;
  isPaginationEnabled?: boolean;
  isDropdownAction?: boolean;
  hasCheckbox?: boolean;
  onSelectAllClick?: (checked: boolean) => void;
  selectedRows?: string[];
}

export interface ITableContextMenuLinksProps {
  to: string;
  title: string | JSX.Element | React.ReactNode;
  icon: React.ReactNode;
  permission: boolean;
  handleClick: (data?: unknown) => void;
}

const Listing: React.FC<ITableListing> = ({
  pageSize,
  noRecords,
  orderBy = { sortBy: '', sortOrder: DEFAULT_SORT_DIRECTION },
  filters,
  totalCount,
  onRowsPerPageChange,
  onSortChangeHandler,
  onPageChange,
  loading = true,
  rows,
  headers,
  pageNumber = 0,
  isPaginationEnabled = true,
  isDropdownAction = false,
  hasCheckbox = false,
  onSelectAllClick,
  selectedRows = [],
}) => {
  // ---------------------------
  // Callback for sort changes
  // ---------------------------
  const handleSortChange = useCallback((sort: SortOptions) => onSortChangeHandler?.(sort), [onSortChangeHandler]);

  return (
    <Stack spacing={3}>
      {filters}

      <CornerContainer>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: yieldzNeutral[950],
            backgroundImage: 'none',
            boxShadow: 'none',
            border: 'none',
            overflow: 'hidden',
          }}
        >
          <MUITable
            sx={{
              '& .MuiTableCell-root': {
                borderBottom: `1px solid ${yieldzNeutral[800]}`,
                borderRight: `1px solid ${yieldzNeutral[800]}`,
                color: yieldzNeutral[100],
                padding: '16px 20px',
                '&:last-child': {
                  borderRight: 'none',
                },
              },
              '& .MuiTableRow-root:last-child .MuiTableCell-root': {
                borderBottom: 'none',
              },
            }}
          >
            <MUITableHead
              headCells={headers}
              setSortData={handleSortChange}
              hasCheckbox={hasCheckbox}
              onSelectAllClick={onSelectAllClick}
              isAllSelected={rows.length > 0 && selectedRows.length === rows.length}
              isIndeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
            />
            {loading ? (
              <TableSkeleton
                id="skeleton-table"
                noOfColumns={headers.length + (hasCheckbox ? 1 : 0)}
                animation="wave"
                variant="text"
              />
            ) : (
              <TableBody
                rowsData={rows}
                headCells={headers}
                noRecords={noRecords}
                isDropdownAction={isDropdownAction}
                hasCheckbox={hasCheckbox}
                selectedRows={selectedRows}
              />
            )}
          </MUITable>
        </TableContainer>
      </CornerContainer>

      {rows.length > 0 && !loading && isPaginationEnabled && onPageChange && onRowsPerPageChange && (
        <Pagination
          page={pageNumber}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </Stack>
  );
};

export default memo(Listing);
