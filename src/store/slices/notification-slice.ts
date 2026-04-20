import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

import {
  fetchNotificationsThunk,
  fetchUnreadCountThunk,
  markAllAsReadThunk,
  markAsReadThunk,
  removeNotificationThunk,
} from '@/store/thunks/notification-thunk';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Notification Interface
 * Based on the backend schema and API contract
 */
export interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  isRead: boolean;
  readAt?: string | null;
}

/**
 * Paginated Notifications Response
 */
export interface NotificationsResponse {
  notifications: NotificationData[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * Async Operation State
 * Reusable interface for tracking async operation status
 */
interface AsyncState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Notification State Interface
 */
interface NotificationState {
  /** Notifications list with pagination */
  list: AsyncState & {
    data: NotificationData[];
    nextCursor: string | null;
    hasMore: boolean;
  };
  /** Unread count tracking */
  unreadCount: AsyncState & {
    count: number;
  };
  /** Mark as read operation state */
  markAsRead: AsyncState;
  /** Mark all as read operation state */
  markAllAsRead: AsyncState;
  /** Remove notification operation state */
  remove: AsyncState;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/** Default async state values */
const DEFAULT_ASYNC_STATE: AsyncState = { isLoading: false, error: null };

/**
 * Set Pending State
 * Updates async state to loading
 */
const setPendingState = (asyncState: Draft<AsyncState>): void => {
  asyncState.isLoading = true;
  asyncState.error = null;
};

/**
 * Set Fulfilled State
 * Updates async state to success
 */
const setFulfilledState = (asyncState: Draft<AsyncState>): void => {
  asyncState.isLoading = false;
};

/**
 * Set Rejected State
 * Updates async state with error
 */
const setRejectedState = (asyncState: Draft<AsyncState>, errorMessage: string): void => {
  asyncState.isLoading = false;
  asyncState.error = errorMessage;
};

/**
 * Mark Notification As Read
 * Shared logic to mark a single notification as read
 */
const markNotificationAsRead = (notification: Draft<NotificationData>): void => {
  notification.isRead = true;
  notification.readAt = new Date().toISOString();
};

/**
 * Mark All Notifications As Read
 * Shared logic to mark all notifications in list as read
 */
const markAllNotificationsAsRead = (notifications: Draft<NotificationData>[]): void => {
  notifications.forEach(markNotificationAsRead);
};

/**
 * Find And Mark Notification As Read
 * Finds notification by ID and marks it as read, returns true if unread count should decrement
 */
const findAndMarkAsRead = (
  notifications: Draft<NotificationData>[],
  notificationId: string
): boolean => {
  const notification = notifications.find((n) => n.id === notificationId);
  if (notification && !notification.isRead) {
    markNotificationAsRead(notification);
    return true; // Should decrement unread count
  }
  return false;
};

/**
 * Remove Notification From List
 * Removes notification and returns whether unread count should decrement
 */
const removeNotificationFromList = (
  state: Draft<NotificationState>,
  notificationId: string
): void => {
  const notification = state.list.data.find((n) => n.id === notificationId);
  // Decrement unread count if notification was unread
  if (notification && !notification.isRead) {
    state.unreadCount.count = Math.max(0, state.unreadCount.count - 1);
  }
  state.list.data = state.list.data.filter((n) => n.id !== notificationId);
};

/**
 * Safely Decrement Count
 * Decrements count ensuring it doesn't go below zero
 */
const safeDecrementCount = (state: Draft<NotificationState>): void => {
  state.unreadCount.count = Math.max(0, state.unreadCount.count - 1);
};

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: NotificationState = {
  list: {
    ...DEFAULT_ASYNC_STATE,
    data: [],
    nextCursor: null,
    hasMore: false,
  },
  unreadCount: {
    ...DEFAULT_ASYNC_STATE,
    count: 0,
  },
  markAsRead: { ...DEFAULT_ASYNC_STATE },
  markAllAsRead: { ...DEFAULT_ASYNC_STATE },
  remove: { ...DEFAULT_ASYNC_STATE },
};

// =============================================================================
// SLICE DEFINITION
// =============================================================================

/**
 * Notification Slice
 *
 * Manages notification state with:
 * - Cursor-based pagination
 * - Unread count tracking
 * - Read/unread state management
 * - Real-time updates via WebSocket
 */
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    /** Add new notification from WebSocket event */
    addNewNotification: (state, action: PayloadAction<NotificationData>) => {
      state.list.data.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount.count += 1;
      }
    },

    /** Set unread count (WebSocket or local update) */
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount.count = action.payload;
    },

    /** Increment unread count */
    incrementUnreadCount: (state) => {
      state.unreadCount.count += 1;
    },

    /** Decrement unread count safely */
    decrementUnreadCount: (state) => {
      safeDecrementCount(state);
    },

    /** Mark notification as read locally (optimistic update) */
    markAsReadLocally: (state, action: PayloadAction<string>) => {
      if (findAndMarkAsRead(state.list.data, action.payload)) {
        safeDecrementCount(state);
      }
    },

    /** Mark all notifications as read locally */
    markAllAsReadLocally: (state) => {
      markAllNotificationsAsRead(state.list.data);
      state.unreadCount.count = 0;
    },

    /** Remove notification locally */
    removeNotificationLocally: (state, action: PayloadAction<string>) => {
      removeNotificationFromList(state, action.payload);
    },

    /** Clear notifications list (used when closing popover) */
    clearNotificationsList: (state) => {
      state.list.data = [];
      state.list.nextCursor = null;
      state.list.hasMore = false;
      state.list.error = null;
    },

    /** Reset entire notification state */
    resetNotificationState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotificationsThunk.pending, (state, action) => {
        setPendingState(state.list);
        // Clear existing data for first page (no cursor)
        if (!action.meta.arg.cursor) {
          state.list.data = [];
        }
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        setFulfilledState(state.list);
        state.list.data = [...state.list.data, ...action.payload.notifications];
        state.list.nextCursor = action.payload.nextCursor;
        state.list.hasMore = action.payload.hasMore;
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        setRejectedState(state.list, action.payload || 'Failed to fetch notifications');
      })

      // Fetch Unread Count
      .addCase(fetchUnreadCountThunk.pending, (state) => {
        setPendingState(state.unreadCount);
      })
      .addCase(fetchUnreadCountThunk.fulfilled, (state, action) => {
        setFulfilledState(state.unreadCount);
        state.unreadCount.count = action.payload;
      })
      .addCase(fetchUnreadCountThunk.rejected, (state, action) => {
        setRejectedState(state.unreadCount, action.payload || 'Failed to fetch unread count');
      })

      // Mark as Read
      .addCase(markAsReadThunk.pending, (state) => {
        setPendingState(state.markAsRead);
      })
      .addCase(markAsReadThunk.fulfilled, (state, action) => {
        setFulfilledState(state.markAsRead);
        findAndMarkAsRead(state.list.data, action.payload);
      })
      .addCase(markAsReadThunk.rejected, (state, action) => {
        setRejectedState(state.markAsRead, action.payload || 'Failed to mark as read');
      })

      // Mark All as Read
      .addCase(markAllAsReadThunk.pending, (state) => {
        setPendingState(state.markAllAsRead);
      })
      .addCase(markAllAsReadThunk.fulfilled, (state) => {
        setFulfilledState(state.markAllAsRead);
        markAllNotificationsAsRead(state.list.data);
        state.unreadCount.count = 0;
      })
      .addCase(markAllAsReadThunk.rejected, (state, action) => {
        setRejectedState(state.markAllAsRead, action.payload || 'Failed to mark all as read');
      })

      // Remove Notification
      .addCase(removeNotificationThunk.pending, (state) => {
        setPendingState(state.remove);
      })
      .addCase(removeNotificationThunk.fulfilled, (state, action) => {
        setFulfilledState(state.remove);
        removeNotificationFromList(state, action.payload);
      })
      .addCase(removeNotificationThunk.rejected, (state, action) => {
        setRejectedState(state.remove, action.payload || 'Failed to remove notification');
      });
  },
});

export const {
  addNewNotification,
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  markAsReadLocally,
  markAllAsReadLocally,
  removeNotificationLocally,
  clearNotificationsList,
  resetNotificationState,
} = notificationSlice.actions;

export default notificationSlice.reducer;
