'use client';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  TableBody as MUITableBody,
  Stack,
  TableCell,
  TableRow
} from '@mui/material';
import React, { useState } from 'react';

import * as colors from '@/styles/theme/colors';

import AtomTooltip from '@/components/atoms/tooltip';
import AtomTypography from '@/components/atoms/typography';
import { ITableContextMenuLinksProps } from '@/components/organisms/table';
import { ITableHeader } from '@/components/organisms/table/tableHead';

export interface ITableAction {
  icon: React.ReactNode;
  tooltip: string;
  label?: string;
  disabled?: boolean;
  color?: string;
  hoverColor?: string;
  onClick: () => void;
  sx?: Record<string, any>;
}

interface CustomTableBodyProps {
  rowsData: Record<string, any>[]; // Array of row data
  headCells: ITableHeader[]; // Table headers
  noRecords: string; // Message when no rows
  isDropdownAction?: boolean; // Whether to use dropdown for >3 actions
  hasCheckbox?: boolean; // Whether to show checkboxes
  selectedRows?: string[]; // Array of selected row IDs
}

const TableBody: React.FC<CustomTableBodyProps> = ({
  rowsData,
  headCells,
  noRecords,
  isDropdownAction,
  hasCheckbox = false,
  selectedRows = [],
}) => {
  // Map of row index to menu anchor element (for dropdown menus)
  const [anchorElMap, setAnchorElMap] = useState<{ [key: number]: HTMLElement | null }>({});
  const ITEM_HEIGHT = 48; // Menu item height for limiting menu height

  // ---------------------------
  // Open menu for a given row
  // ---------------------------
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, rowIndex: number) => {
    setAnchorElMap((prev) => ({ ...prev, [rowIndex]: event.currentTarget }));
  };

  // ---------------------------
  // Close menu for a given row
  // ---------------------------
  const handleMenuClose = (rowIndex: number) => {
    setAnchorElMap((prev) => ({ ...prev, [rowIndex]: null }));
  };

  // ---------------------------
  // Render a single table cell
  // ---------------------------
  const renderCell = (row: any, headCell: ITableHeader, rowIndex: number) => {
    const value = row[headCell.id];

    // ---------------------------
    // Name cell with icon and subtitle
    // ---------------------------
    if (headCell.id === 'name' && typeof value === 'object' && value !== null) {
      return (
        <Stack direction="row" alignItems="center" spacing={2}>
          {value.icon ? (
            value.icon
          ) : null}
          <Box sx={{display:'flex', flexDirection:'column'}}>
          <AtomTypography
              variant='subtitle3'
              color='text.primary'
              sx={{
                fontWeight:500
              }}
            >
              {value.primary}
            </AtomTypography>
            {value.secondary && (
                        <AtomTypography
                        variant='caption'
                        color='text.secondary'
                        sx={{
                          fontWeight:400
                        }}
              >
                {value.secondary}
              </AtomTypography>
            )}
          </Box>
        </Stack>
      );
    }

    // ---------------------------
    // Price cell with change indicator
    // ---------------------------
    if (headCell.id === 'price' && typeof value === 'object' && value !== null) {
      return (
        <Box sx={{display:'flex', flexDirection:'column'}}>
          <AtomTypography
              variant='subtitle3'
              color='text.primary'
              sx={{
                fontWeight:500
              }}
          >
            {value.value}
          </AtomTypography>
          {value.change && (
             <Box
             sx={{
               color:
                 value.changeType === 'positive'
                   ? colors.yieldzSecondary.green[500]
                   : value.changeType === 'negative'
                     ? colors.yieldzSecondary.red[500]
                     : colors.yieldzNeutral[400],
               fontSize: '11px',
               lineHeight: '16px',
             }}
           >
             {value.change}
           </Box>
          )}
        </Box>
      );
    }

    // ---------------------------
    // Market cap cell
    // ---------------------------
    if (headCell.id === 'marketCap') {
      return (
        <AtomTypography
              variant='subtitle3'
              color='text.primary'
              sx={{
                fontWeight:500
              }}
        >
          {value}
        </AtomTypography>
      );
    }

    // ---------------------------
    // Actions cell (with tooltips)
    // ---------------------------
    if (headCell.id === 'actions' && Array.isArray(row.actions)) {
      return (
        <Stack direction="row" gap={1}>
          {row.actions.map((action: ITableAction) => (
            <AtomTooltip key={`${row.rowId ?? row.id}-action-${action.label ?? action.tooltip}`} title={action.tooltip ?? ''}>
              <span>
                <IconButton
                  disabled={action.disabled ?? false}
                  onClick={action.onClick}
                  aria-label={action.label ?? action.tooltip}
                  sx={{
                    color: action.color ?? colors.yieldzNeutral[400],
                    '&:hover': action.hoverColor ? {
                      color: action.hoverColor,
                      backgroundColor: colors.yieldzNeutral[800],
                    } : {},
                    '&.Mui-disabled': {
                      color: colors.yieldzNeutral[600],
                      pointerEvents: 'none',
                    },
                    ...action.sx,
                  }}
                >
                  {action.icon}
                </IconButton>
              </span>
            </AtomTooltip>
          ))}
        </Stack>
      );
    }

    // ---------------------------
    // Context menu / actions cell
    // ---------------------------
    if (headCell.id === 'contextMenuLinks' && row.contextMenuLinks?.length) {
      if (isDropdownAction) {
        // Render all actions under a single three-dot menu
        return (
          <>
            <IconButton
              aria-label="more"
              aria-controls={`menu-${rowIndex}`}
              aria-haspopup="true"
              onClick={(e) => handleMenuOpen(e, rowIndex)}
              sx={{
                color: colors.yieldzNeutral[400],
                '&:hover': {
                  color: colors.yieldzNeutral[200],
                  backgroundColor: colors.yieldzNeutral[800],
                },
              }}
            >
              <MoreHorizIcon />
            </IconButton>

            <Menu
              id={`menu-${rowIndex}`}
              anchorEl={anchorElMap[rowIndex]}
              open={Boolean(anchorElMap[rowIndex])}
              onClose={() => handleMenuClose(rowIndex)}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '20ch',
                  backgroundColor: colors.yieldzNeutral[900],
                  color: colors.yieldzNeutral[100],
                },
              }}
            >
              {row.contextMenuLinks.map((option: ITableContextMenuLinksProps) => (
                <MenuItem
                  key={`${row.rowId ?? row.id}-${option.title}`}
                  disabled={option.permission}
                  onClick={() => {
                    option.handleClick();
                    handleMenuClose(rowIndex);
                  }}
                  sx={{
                    color: colors.yieldzNeutral[100],
                    '&:hover': {
                      backgroundColor: colors.yieldzNeutral[800],
                    },
                  }}
                >
                  <Stack direction="row" gap={1} alignItems="center">
                    {option.icon}
                    <AtomTypography id={`action-${option.title}`} variant='body4' color="text.primary">{option.title}</AtomTypography>
                  </Stack>
                </MenuItem>
              ))}
            </Menu>
          </>
        );
      } else {
        // Render each action as an inline button
        return (
          <Stack direction="row" gap={1}>
            {row.contextMenuLinks.map((item: ITableContextMenuLinksProps) => (
              <AtomTooltip key={`${row.rowId ?? row.id}-${item.title}`} title={item.title}>
                <IconButton
                  disabled={item.permission}
                  onClick={item.handleClick}
                  sx={{
                    color: colors.yieldzNeutral[400],
                    '&:hover': {
                      color: colors.yieldzNeutral[200],
                      backgroundColor: colors.yieldzNeutral[800],
                    },
                  }}
                >
                  {item.icon}
                </IconButton>
              </AtomTooltip>
            ))}
          </Stack>
        );
      }
    }

    // ---------------------------
    // Default cell rendering
    // ---------------------------
    return (
      <Box
        sx={{
          color: colors.yieldzNeutral[100],
          fontSize: '14px',
        }}
      >
        {value ?? '--'}
      </Box>
    );
  };

  // ---------------------------
  // Render all table rows
  // ---------------------------
  const showTableBody = () =>
    rowsData.map((row, rowIndex) => {
      // Use rowId for unique key if available, otherwise fall back to id or index
      const uniqueRowKey = row.rowId ?? row.id ?? `table_row_${rowIndex}`;
      const rowIdValue = String(row.rowId ?? row.id);
      const isSelected = selectedRows.includes(rowIdValue);

      return (
        <TableRow
          key={uniqueRowKey}
          sx={{
            backgroundColor: colors.yieldzNeutral[900],
            '&:hover': {
              backgroundColor: colors.yieldzNeutral[700],
            },
            cursor: row.onRowClick ? 'pointer' : 'default',
          }}
          onClick={() => {
            // Support row click handler independently of checkbox
            if (row.onRowClick) {
              row.onRowClick(row.rowId ?? row.id);
            }
          }}
        >
          {hasCheckbox && (
            <TableCell
              padding="checkbox"
              sx={{
                paddingLeft: '20px',
              }}
            >
              <Checkbox
                checked={isSelected}
                disabled={row.checkboxDisabled}
                onChange={(e) => {
                  e.stopPropagation();
                  if (row.onCheckboxChange && !row.checkboxDisabled) {
                    row.onCheckboxChange(rowIdValue);
                  }
                }}
                sx={{
                  color: colors.yieldzNeutral[400],
                  '&.Mui-checked': {
                    color: colors.yieldzPrimary[500],
                  },
                  '&.Mui-disabled': {
                    color: colors.yieldzNeutral[700],
                  },
                }}
              />
            </TableCell>
          )}
          {headCells.map((headCell) => (
            <TableCell
              key={`${uniqueRowKey}-${headCell.id}`}
              style={{ width: headCell.width }}
              sx={{
                borderBottom: `1px solid ${colors.yieldzNeutral[800]}`,
              }}
            >
              {renderCell(row, headCell, rowIndex)}
            </TableCell>
          ))}
        </TableRow>
      );
    });

  // ---------------------------
  // Render "no records" row
  // ---------------------------
  const noDataRow = () => (
    <TableRow>
      <TableCell
        colSpan={headCells.length + (hasCheckbox ? 1 : 0)}
        sx={{
          borderBottom: 'none',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            color: colors.yieldzNeutral[400],
            fontWeight: 500,
            padding: '40px 20px',
          }}
        >
          {noRecords}
        </Box>
      </TableCell>
    </TableRow>
  );

  return <MUITableBody>{rowsData.length ? showTableBody() : noDataRow()}</MUITableBody>;
};

export default React.memo(TableBody);
