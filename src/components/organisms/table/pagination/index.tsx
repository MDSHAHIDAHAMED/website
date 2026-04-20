import { Box, ButtonBase, SelectChangeEvent } from '@mui/material';
import { ChangeEvent, memo, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import SelectBox from '@/components/atoms/select-box';
import AtomTypography from '@/components/atoms/typography';
import * as colors from '@/styles/theme/colors';

/**
 * Pagination options enum
 * Follows DRY principle - centralized option values
 */
export const enum paginationOptions {
  Ten = 10,
  Twenty = 20,
  Fifty = 50,
  Hundred = 100,
}

/**
 * Interface for select option
 * Follows Interface Segregation Principle - focused interface
 */
export interface ISelectOption {
  value: string | number;
  label: string;
}

/**
 * Predefined pagination options array
 * Follows DRY principle - reusable across components
 */
export const paginationOption: ISelectOption[] = [
  { label: '10', value: paginationOptions.Ten },
  { label: '20', value: paginationOptions.Twenty },
  { label: '50', value: paginationOptions.Fifty },
  { label: '100', value: paginationOptions.Hundred },
];

/**
 * Props interface for pagination component
 * Follows Single Responsibility Principle - handles only pagination
 */
interface IUserData {
  totalCount?: number;
  onRowsPerPageChange: (event: SelectChangeEvent<ISelectOption>) => void;
  onPageChange: ((event: ChangeEvent<unknown>, page: number) => void) | undefined;
  page?: number;
  size?: 'small' | 'medium';
  pageSize: ISelectOption | number;
}

/**
 * Helper function to add pages to array
 */
const addPages = (pages: (number | string)[], start: number, end: number): void => {
  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }
};

/**
 * Helper function to generate page numbers with ellipsis
 */
const generatePageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
  const pages: (number | string)[] = [];

  if (totalPages <= 7) {
    addPages(pages, 1, totalPages);
    return pages;
  }

  // Always show first page
  pages.push(1);

  const showEllipsisStart = currentPage > 3;
  const showEllipsisEnd = currentPage < totalPages - 2;

  if (showEllipsisStart && currentPage > 4) {
    pages.push('...');
  }

  if (showEllipsisStart) {
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(currentPage + 1, totalPages - 1);
    addPages(pages, rangeStart, rangeEnd);
  } else {
    addPages(pages, 2, 3);
  }

  if (showEllipsisEnd && currentPage < totalPages - 3) {
    pages.push('...');
  }

  if (showEllipsisEnd) {
    const rangeStart = Math.max(currentPage + 2, totalPages - 2);
    addPages(pages, rangeStart, totalPages - 1);
  } else if (!pages.includes(totalPages - 1)) {
    pages.push(totalPages - 1);
  }

  // Always show last page
  if (!pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
};

/**
 * Bracket-style Page Button Component
 */
const PageButton = ({
  pageNum,
  isActive,
  onClick,
}: {
  pageNum: number | string;
  isActive: boolean;
  onClick: () => void;
}) => {
  const isEllipsis = pageNum === '...';

  return (
    <ButtonBase
      onClick={isEllipsis ? undefined : onClick}
      disabled={isEllipsis}
      sx={{
        minWidth: '48px',
        height: '48px',
        position: 'relative',
        padding: '12px 16px',
        cursor: isEllipsis ? 'default' : 'pointer',
        backgroundColor: 'transparent',
        transition: 'all 0.2s ease-in-out',
        ...(!isEllipsis && {
          '&:hover': {
            '& .page-bg': {
              backgroundColor: isActive ? colors.yieldzPrimary[900] : colors.yieldzNeutral[900],
            },
            '& .bracket-left, & .bracket-right': {
              borderColor: colors.yieldzPrimary[400],
            },
            '& .page-number': {
              color: colors.yieldzPrimary[400],
            },
          },
        }),
        '&:disabled': {
          cursor: 'default',
        },
      }}
    >
      {/* Background Box (sits within brackets) */}
      {!isEllipsis && (
        <Box
          className="page-bg"
          sx={{
            position: 'absolute',
            left: '8px',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            height: '24px',
            backgroundColor: isActive ? colors.yieldzPrimary[900] : 'transparent',
            transition: 'background-color 0.2s ease-in-out',
            zIndex: 0,
          }}
        />
      )}

      {/* Left Bracket */}
      {!isEllipsis && (
        <Box
          className="bracket-left"
          sx={{
            position: 'absolute',
            left: '5px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '8px',
            height: '24px',
            borderLeft: `2px solid ${isActive ? colors.yieldzPrimary[500] : colors.yieldzNeutral[100]}`,
            borderTop: `2px solid ${isActive ? colors.yieldzPrimary[500] : colors.yieldzNeutral[100]}`,
            borderBottom: `2px solid ${isActive ? colors.yieldzPrimary[500] : colors.yieldzNeutral[100]}`,
            transition: 'border-color 0.2s ease-in-out',
            zIndex: 1,
          }}
        />
      )}

      {/* Page Number */}
      <Box
        className="page-number"
        sx={{
          color: (() => {
            if (isActive) return colors.yieldzPrimary[500];
            if (isEllipsis) return colors.yieldzNeutral[400];
            return colors.yieldzNeutral[100];
          })(),
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: '24px',
          transition: 'color 0.2s ease-in-out',
          userSelect: 'none',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {pageNum}
      </Box>

      {/* Right Bracket */}
      {!isEllipsis && (
        <Box
          className="bracket-right"
          sx={{
            position: 'absolute',
            right: '5px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '8px',
            height: '24px',
            borderRight: `2px solid ${isActive ? colors.yieldzPrimary[500] : colors.yieldzNeutral[100]}`,
            borderTop: `2px solid ${isActive ? colors.yieldzPrimary[500] : colors.yieldzNeutral[100]}`,
            borderBottom: `2px solid ${isActive ? colors.yieldzPrimary[500] : colors.yieldzNeutral[100]}`,
            transition: 'border-color 0.2s ease-in-out',
            zIndex: 1,
          }}
        />
      )}
    </ButtonBase>
  );
};

/**
 * Navigation Arrow Button Component
 */
export const NavButton = ({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}) => {
  const icon = direction === 'prev' ? '<' : '>';

  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      sx={{
        maxWidth: '36px',
        height: '48px',
        position: 'relative',
        padding: '12px 16px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: 'transparent',
        opacity: disabled ? 0.3 : 1,
        transition: 'all 0.2s ease-in-out',
        '&:hover:not(:disabled)': {
          '& .bracket-left, & .bracket-right': {
            borderColor: colors.yieldzPrimary[400],
          },
          '& .nav-icon': {
            color: colors.yieldzPrimary[400],
          },
        },
      }}
    >
      {/* Left Bracket */}
      <Box
        className="bracket-left"
        sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '8px',
          height: '24px',
          borderLeft: `2px solid ${colors.yieldzNeutral[100]}`,
          borderTop: `2px solid ${colors.yieldzNeutral[100]}`,
          borderBottom: `2px solid ${colors.yieldzNeutral[100]}`,
          transition: 'border-color 0.2s ease-in-out',
        }}
      />

      {/* Arrow Icon */}
      <Box
        className="nav-icon"
        sx={{
          color: colors.yieldzNeutral[100],
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: '24px',
          transition: 'color 0.2s ease-in-out',
          userSelect: 'none',
        }}
      >
        {icon}
      </Box>

      {/* Right Bracket */}
      <Box
        className="bracket-right"
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '8px',
          height: '24px',
          borderRight: `2px solid ${colors.yieldzNeutral[100]}`,
          borderTop: `2px solid ${colors.yieldzNeutral[100]}`,
          borderBottom: `2px solid ${colors.yieldzNeutral[100]}`,
          transition: 'border-color 0.2s ease-in-out',
        }}
      />
    </ButtonBase>
  );
};

/**
 * AtomPagination Component
 *
 * A reusable pagination component with bracket-style design
 */
const AtomPagination = (props: IUserData) => {
  // Destructure props with sensible defaults
  const { totalCount, onRowsPerPageChange, onPageChange, page = 1, pageSize } = props;

  // Calculate total pages based on total count and page size
  const total = Math.ceil(totalCount! / ((pageSize as ISelectOption).value as number));

  // Generate page numbers with ellipsis
  const pageNumbers = useMemo(() => generatePageNumbers(page, total), [page, total]);

  // Initialize form with default pageSize value
  const methods = useForm({
    defaultValues: {
      pageSize: pageSize as ISelectOption,
    },
  });

  // Handle page change
  const handlePageClick = (newPage: number) => {
    if (onPageChange && newPage !== page) {
      onPageChange({} as ChangeEvent<unknown>, newPage);
    }
  };

  return (
    <FormProvider {...methods}>
      {/* Main pagination controls container - Single Line */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        {/* Total count display section - Left */}
        <Box>
          <AtomTypography variant="subtitle1" sx={{ color: colors.yieldzNeutral[100] }}>
            Total Count: {totalCount}
          </AtomTypography>
        </Box>

        {/* Custom bracket-style pagination - Center */}
       {
        totalCount && totalCount > 9 && (
          <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {/* Previous Button */}
          <Box sx={{ mr: 4 }}>
            <NavButton direction="prev" disabled={page <= 1} onClick={() => handlePageClick(page - 1)} />
          </Box>
          {/* Page Numbers */}
          {pageNumbers.map((pageNum, index) => (
            <PageButton
              key={`page-${pageNum}-${index}`}
              pageNum={pageNum}
              isActive={pageNum === page}
              onClick={() => typeof pageNum === 'number' && handlePageClick(pageNum)}
            />
          ))}

          {/* Next Button */}
          <Box sx={{ ml: 4 }}>
            <NavButton direction="next" disabled={page >= total} onClick={() => handlePageClick(page + 1)} />
          </Box>
        </Box>
        )
       }

        {/* Rows per page selector section - Right */}
        {totalCount && totalCount > 9 && <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '12px',
            marginTop: '-10px'
          }}
        >
          <AtomTypography
            id="rows-label"
            variant="subtitle1"
            sx={{
              whiteSpace: 'nowrap',
              color: colors.yieldzNeutral[100],
              display: 'flex',
              alignItems: 'center',
              marginBottom:'8px'
            }}
          >
            Rows per Page:
          </AtomTypography>

          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '100px' }}>
            <SelectBox
              name="pageSize"
              id="row-pagination-handler"
              label=""

              options={paginationOption}
              sx={{
                '& .MuiOutlinedInput-root': {
                  padding: '19px 0 4px 0',
                },
              }}
              onSelectBoxChange={() => {
                const currentValue = methods.getValues('pageSize');
                if (currentValue && onRowsPerPageChange) {
                  const mockEvent = {
                    target: {
                      value: { value: currentValue.value, label: currentValue.label },
                    },
                  } as any;
                  onRowsPerPageChange(mockEvent);
                }
              }}
              disabled={false}
              noLabel
            />
          </Box>
        </Box>}
      </Box>
    </FormProvider>
  );
};

export default memo(AtomPagination);
