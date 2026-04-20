'use client';

/**
 * TransactionsListingSection Component
 * =====================================
 * Displays a table of user transactions with token info, amounts, and status.
 *
 * Features:
 * - Table with 5 columns: TOKEN, STATUS, DATE, ASSET, AMOUNT
 * - Token icon and symbol display
 * - Status badge indicators
 * - Fetches withdrawal transactions from API
 * - Uses Listing molecule component
 *
 * @module components/sections/transactions-listing-section
 */
import { SOCKET_EVENTS } from '@/constants';
import { fetchUserTransactions, type TransactionData } from '@/services/transactions';
import { TRANSACTION_TABLE_HEADERS, TransactionItem } from '@/store/mock/portfolio-mock';
import { formatAmountValue } from '@/utils/amount-formatter';
import { dateFormatter } from '@/utils/date-formatter';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import AtomTypography from '@/components/atoms/typography';
import YieldsBadge from '@/components/atoms/yields-badge';
import Listing from '@/components/organisms/table';
import { useFilter } from '@/hooks/use-filter';
import useSocketEvents from '@/hooks/use-socket-events';
import { logger } from '@/lib/default-logger';

// =============================================================================
// Styles
// =============================================================================

/** Main container */
const CONTAINER_SX: SxProps<Theme> = {
  width: '100%',
};

/** Title style */
const TITLE_SX: SxProps<Theme> = {
  fontWeight: 615,
  fontSize: '24px',
  lineHeight: '28px',
  mb: 3,
};

/** Token cell container */
const TOKEN_CELL_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
};

/**
 * Maps transaction status to YieldsBadge variant
 * @param status - Transaction status string
 * @returns Appropriate badge variant for the status
 */
const getStatusBadgeVariant = (status: string): 'green' | 'yellow' | 'red' | 'neutral' => {
  switch (status.toUpperCase()) {
    case 'SUCCESS':
      return 'green';
    case 'PENDING':
      return 'yellow';
    case 'FAILED':
      return 'red';
    default:
      return 'neutral';
  }
};

// =============================================================================
// Main Component
// =============================================================================

export interface TransactionsListingSectionProps {
  /** Custom data (optional, uses API if not provided) */
  data?: TransactionItem[];
  /** Show loading state */
  isLoading?: boolean;
}

/**
 * Transform API transaction data to TransactionItem format
 * Maps API status to display status (completed -> SUCCESS)
 * @param transaction - Transaction data from API
 * @returns TransactionItem for transactions listing
 */
function transformToTransactionItem(transaction: TransactionData): TransactionItem {
  // Map API status to display status
  const statusMap: Record<string, string> = {
    completed: 'SUCCESS',
    pending: 'PENDING',
    failed: 'FAILED',
  };
  const displayStatus = statusMap[transaction.status?.toLowerCase?.()] ?? transaction.status?.toUpperCase?.();

  return {
    id: String(transaction.id),
    tokenSymbol: transaction.tokenOut ?? transaction.tokenIn ?? 'USDC',
    tokenIcon: '/assets/logo-emblem.png',
    status: displayStatus,
    tokenIn: transaction.tokenIn ?? 'USDC',
    tokenOut: transaction.tokenOut ?? 'USDC',
    date: transaction.completedAt ?? transaction.createdAt,
    asset: transaction.tokenOut ?? transaction.tokenIn ?? 'USDC',
    amount: transaction.amountOut ?? transaction.amountIn ?? '0.00',
    type: transaction.type,
  };
}

function TransactionsListingSectionComponent({
  data,
  isLoading: externalLoading,
}: Readonly<TransactionsListingSectionProps>): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Pagination and filter management
  const { handleSortChange, handlePageChange, handleChange, filterData } = useFilter();

  /**
   * Fetch withdrawal transactions from API
   * Only fetch if data is not provided externally
   */
  const fetchTransactions = useCallback(async () => {
    if (data) {
      setTransactions(data);
      setTotalCount(data.length);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Extract page and pageSize from filterData
      const pageValue = filterData.page || 1;
      const pageSizeValue =
        typeof filterData.pageSize === 'number' ? filterData.pageSize : Number(filterData.pageSize.value);

      const response = await fetchUserTransactions({
        type: 'withdrawal',
        status: 'completed',
        page: pageValue,
        pageSize: pageSizeValue,
      });

      if (response?.status === 'success' && response?.data?.records) {
        // Transform API transactions to transaction items
        const transformedTransactions = response.data.records.map(transformToTransactionItem);
        setTransactions(transformedTransactions);
        // Set total count from API response
        setTotalCount(response.data.totalCount || 0);
      } else {
        logger.warn('[TransactionsListing] API returned non-success status:', response?.message);
        setTransactions([]);
        setTotalCount(0);
      }
    } catch (err) {
      logger.error('[TransactionsListing] Error fetching transactions:', err);
      setTransactions([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [data, filterData.page, filterData.pageSize]);

  /**
   * Fetch transactions on mount and when filters change
   */
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  /**
   * Handle page size change
   */
  const handleRowsPerPageChange = useCallback(
    (event: any) => {
      const formattedEvent = {
        target: {
          name: 'pageSize',
          value: event.target.value,
        },
      };
      handleChange(formattedEvent as any);
    },
    [handleChange]
  );

  const loading = externalLoading ?? isLoading;

  /**
   * Transform transaction data to table rows
   * Maps to ITableHeader ids for proper rendering
   */
  const rows = useMemo(() => {
    return transactions.map((transaction) => ({
      // Unique row identifier
      rowId: transaction.id,
      // Token column
      token: (
        <AtomTypography variant="body4" fontWeight={500}>
          {transaction.tokenIn}
        </AtomTypography>
      ),
      // Status column with badge indicator
      status: (
        <YieldsBadge
          id={`status-badge-${transaction.id}`}
          variant={getStatusBadgeVariant(transaction.status)}
          label={transaction.status}
        />
      ),
      // Date column - formatted using dateFormatter utility
      date: (
        <AtomTypography variant="subtitle4" color="text.primary">
          {dateFormatter(transaction.date)}
        </AtomTypography>
      ),
      // Asset column
      asset: (
        <AtomTypography variant="body4" fontWeight={500}>
          {transaction.tokenOut}
        </AtomTypography>
      ),
      // Amount column - formatted with proper decimal places
      amount: (
        <AtomTypography variant="subtitle4" color="text.primary">
          {formatAmountValue(transaction.amount)}
        </AtomTypography>
      ),
    }));
  }, [transactions]);

  /**
   * Socket event handler for investments listing updates
   * Memoized with fetchTransactions as dependency
   */
  const handleSocketVerification = useCallback(
    (socketData: { title?: string; type?: string }) => {
      const isDepositCompleted =
        socketData?.title?.includes('Deposit Completed') && socketData?.type === 'TRANSACTION_UPDATE';
      if (isDepositCompleted) {
        fetchTransactions();
      }
    },
    [fetchTransactions]
  );

  /**
   * Socket Event Listener
   * Listens for investments listing updates and refreshes status
   */
  useSocketEvents({
    autoJoin: true,
    events: {
      [SOCKET_EVENTS.NOTIFICATION_NEW]: handleSocketVerification,
    },
  });

  return (
    <Box sx={CONTAINER_SX}>
      {/* Title */}
      <AtomTypography variant="h4" fontType="ppMori" color="text.primary" sx={TITLE_SX}>
        Transaction history
      </AtomTypography>

      {/* Table Listing */}
      <Listing
        headers={TRANSACTION_TABLE_HEADERS}
        rows={rows}
        loading={loading}
        totalCount={totalCount}
        pageSize={filterData.pageSize}
        pageNumber={filterData.page}
        orderBy={{
          sortBy: filterData.sortBy,
          sortOrder: filterData.sortDir,
        }}
        onSortChangeHandler={handleSortChange}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        noRecords="No transactions found"
        isPaginationEnabled={true}
        isDropdownAction={false}
        hasCheckbox={false}
      />
    </Box>
  );
}

export const TransactionsListingSection = memo(TransactionsListingSectionComponent);
export default TransactionsListingSection;
