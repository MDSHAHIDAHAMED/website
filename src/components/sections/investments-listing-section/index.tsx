'use client';

/**
 * InvestmentsListingSection Component
 * =====================================
 * Displays a table of user investments with token info, amounts, and lockup status.
 *
 * Features:
 * - Table with 5 columns: TOKEN, INVESTMENT AMOUNT, TOKEN AMOUNT, CLAIMABLE YIELD, REMAINING LOCKUP
 * - Token icon and symbol display
 * - Lockup progress bar
 * - Uses Listing molecule component
 * - Fetches deposit transactions from API
 *
 * @module components/sections/investments-listing-section
 */
import { fetchUserTransactions, type TransactionData } from '@/services/transactions';
import { INVESTMENT_TABLE_HEADERS, type InvestmentItem } from '@/store/mock/portfolio-mock';
import { formatAmountValue } from '@/utils/amount-formatter';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import AtomProgressBar from '@/components/atoms/progress';
import AtomTypography from '@/components/atoms/typography';
import Listing from '@/components/organisms/table';
import { SOCKET_EVENTS } from '@/constants';
import { useFilter } from '@/hooks/use-filter';
import useSocketEvents from '@/hooks/use-socket-events';
import { dayjs } from '@/lib/dayjs';
import { logger } from '@/lib/default-logger';
import { yieldzNeutral } from '@/styles/theme/colors';
import { dateFormatter } from '@/utils/date-formatter';

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

/** Lockup progress bar container */
const LOCKUP_CELL_SX: SxProps<Theme> = {
  minWidth: 120,
};

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Token cell with icon and symbol
 */
interface TokenCellProps {
  icon: string;
  symbol: string;
}

const TokenCell = memo(function TokenCell({ icon, symbol }: Readonly<TokenCellProps>): React.JSX.Element {
  return (
    <Box sx={TOKEN_CELL_SX}>
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: yieldzNeutral[800],
        }}
      >
        <Image src={icon} alt={symbol} width={20} height={20} />
      </Box>
      <AtomTypography variant="body4" fontWeight={500}>
        {symbol}
      </AtomTypography>
    </Box>
  );
});

/**
 * Lockup cell with time and progress bar
 */
interface LockupCellProps {
  id: string;
  lockup: { months: number; days: number; hours: number };
  progress: number;
}

const LockupCell = memo(function LockupCell({ id, lockup, progress }: Readonly<LockupCellProps>): React.JSX.Element {
  // Check if lockup is completed (all values are 0)
  const isMatured = lockup.months === 0 && lockup.days === 0 && lockup.hours === 0;

  // Format time string manually to show even when values are 0
  const timeString = `${lockup.months}M ${lockup.days}D ${lockup.hours}H`;

  return (
    <Box sx={LOCKUP_CELL_SX}>
      {isMatured ? (
        // Show "Matured" text when lockup is completed
        <AtomTypography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Matured
        </AtomTypography>
      ) : (
        <>
          {/* Custom label to show even when values are 0 */}
          <AtomTypography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            {timeString}
          </AtomTypography>
          <AtomProgressBar
            id={`lockup-progress-${id}`}
            value={progress}
            format="percentage"
            showLabel={false}
            visualVariant="segmented"
          />
        </>
      )}
    </Box>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export interface InvestmentsListingSectionProps {
  /** Custom data (optional, uses mock if not provided) */
  data?: InvestmentItem[];
  /** Show loading state */
  isLoading?: boolean;
}

/**
 * Calculate remaining lockup time and progress from withdrawalUnlockDate
 * @param withdrawalUnlockDate - Date when lockup ends (ISO string)
 * @param createdAt - Date when investment was created (ISO string)
 * @returns Object with remaining lockup time and progress percentage
 */
function calculateLockupDetails(
  withdrawalUnlockDate: string | null,
  createdAt: string
): { remainingLockup: { months: number; days: number; hours: number }; lockupProgress: number } {
  // Default values if withdrawalUnlockDate is not provided
  if (!withdrawalUnlockDate) {
    return {
      remainingLockup: { months: 0, days: 0, hours: 0 },
      lockupProgress: 100, // If no unlock date, consider it fully unlocked
    };
  }

  const now = dayjs();
  const unlockDate = dayjs(withdrawalUnlockDate);
  const startDate = dayjs(createdAt);

  // Calculate total lockup period (from start to unlock date)
  const totalLockupDuration = unlockDate.diff(startDate, 'millisecond');
  
  // Calculate elapsed time (from start to now)
  const elapsedTime = now.diff(startDate, 'millisecond');
  
  // Calculate remaining time (from now to unlock date)
  const remainingTime = unlockDate.diff(now, 'millisecond');

  // If lockup period has ended, return 0 remaining time and 100% progress
  if (remainingTime <= 0) {
    return {
      remainingLockup: { months: 0, days: 0, hours: 0 },
      lockupProgress: 100,
    };
  }

  // Calculate progress percentage (0-100)
  const progress = totalLockupDuration > 0 
    ? Math.min(100, Math.max(0, (elapsedTime / totalLockupDuration) * 100))
    : 0;

  // Calculate remaining time components
  // Use dayjs diff with different units to get accurate breakdown
  const remainingMonths = unlockDate.diff(now, 'month');
  const remainingDaysAfterMonths = unlockDate.diff(now.add(remainingMonths, 'month'), 'day');
  const remainingHoursAfterDays = unlockDate.diff(
    now.add(remainingMonths, 'month').add(remainingDaysAfterMonths, 'day'),
    'hour'
  );

  return {
    remainingLockup: {
      months: Math.max(0, remainingMonths),
      days: Math.max(0, remainingDaysAfterMonths),
      hours: Math.max(0, remainingHoursAfterDays),
    },
    lockupProgress: Math.round(progress * 100) / 100, // Round to 2 decimal places
  };
}

/**
 * Transform API transaction data to InvestmentItem format
 * @param transaction - Transaction data from API
 * @returns InvestmentItem for investments listing
 */
function transformToInvestmentItem(transaction: TransactionData): InvestmentItem {
  // Calculate lockup details from withdrawalUnlockDate
  const lockupDetails = calculateLockupDetails(
    transaction.withdrawalUnlockDate,
    transaction.createdAt
  );

  return {
    id: String(transaction.id),
    tokenSymbol: transaction.tokenOut ?? transaction.tokenIn ?? 'YLDZ',
    tokenIcon: '/assets/logo-emblem.png',
    investmentAmount: transaction.amountIn ?? '0.00',
    tokenAmount: transaction.amountOut ?? '0.00',
    tokenIn: transaction.tokenIn,
    tokenOut: transaction.tokenOut ?? undefined,
    claimableYield: '0.00',
    remainingLockup: lockupDetails.remainingLockup,
    lockupProgress: lockupDetails.lockupProgress,
    createdAt: transaction.createdAt,
  };
}

function InvestmentsListingSectionComponent({
  data,
  isLoading: externalLoading,
}: Readonly<InvestmentsListingSectionProps>): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [investments, setInvestments] = useState<InvestmentItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  
  // Pagination and filter management
  const { handleSortChange, handlePageChange, handleChange, filterData } = useFilter();

  /**
   * Fetch deposit transactions from API
   * Only fetch if data is not provided externally
   */
  const fetchTransactions = useCallback(async () => {
    if (data) {
      setInvestments(data);
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
        type: 'deposit',
        status: 'completed',
        page: pageValue,
        pageSize: pageSizeValue,
      });

      if (response?.status === 'success' && response?.data?.records) {
        // Transform API transactions to investment items
        const transformedInvestments = response.data.records.map(transformToInvestmentItem);
        setInvestments(transformedInvestments);
        // Set total count from API response
        setTotalCount(response.data.totalCount || 0);
      } else {
        logger.warn('[InvestmentsListing] API returned non-success status:', response?.message);
        setInvestments([]);
        setTotalCount(0);
      }
    } catch (err) {
      logger.error('[InvestmentsListing] Error fetching transactions:', err);
      setInvestments([]);
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

  /**
   * Transform investment data to table rows
   * Maps to ITableHeader ids for proper rendering
   */
  const rows = useMemo(() => {
    return investments.map((investment) => ({
      // Unique row identifier
      rowId: investment.id,
      // Date column
      date: <AtomTypography variant="subtitle4" color="text.primary">
         {dateFormatter(investment.createdAt)}
      </AtomTypography>,
      // Token column
      token: <TokenCell icon={'/assets/logo-emblem.png'} symbol={investment.tokenSymbol} />,
      // Investment Amount column - formatted with proper decimal places and tokenIn in brackets
      investmentAmount: (
        <AtomTypography variant="subtitle4" color="text.primary">
          {formatAmountValue(investment.investmentAmount)}
          {investment.tokenIn && ` (${investment.tokenIn})`}
        </AtomTypography>
      ),
      // Token Amount column - formatted with proper decimal places and tokenOut in brackets
      tokenAmount: (
        <AtomTypography variant="subtitle4" color="text.primary">
          {formatAmountValue(investment.tokenAmount)}
          {investment.tokenOut && ` (${investment.tokenOut})`}
        </AtomTypography>
      ),
      // Claimable Yield column
      // claimableYield: (
      //   <AtomTypography variant="subtitle4" color="text.primary">
      //     {investment.claimableYield}
      //   </AtomTypography>
      // ),
      // Remaining Lockup column
      remainingLockup: (
        <LockupCell id={investment.id} lockup={investment.remainingLockup} progress={investment.lockupProgress} />
      ),
    }));
  }, [investments]);

  return (
    <Box sx={CONTAINER_SX}>
      {/* Title */}
      <AtomTypography variant="h4" fontType="ppMori" color="text.primary" sx={TITLE_SX}>
        My investments
      </AtomTypography>

      {/* Table Listing */}
      <Listing
        headers={INVESTMENT_TABLE_HEADERS}
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
        noRecords="No investments found"
        isPaginationEnabled={true}
        isDropdownAction={false}
        hasCheckbox={false}
      />
    </Box>
  );
}

export const InvestmentsListingSection = memo(InvestmentsListingSectionComponent);
export default InvestmentsListingSection;
