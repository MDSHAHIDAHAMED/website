import { deleteMethod, getMethod, patchMethod } from '@/services/api';
import endPoints from '@/services/urls';
import type { NotificationData, NotificationsResponse } from '@/store/slices/notification-slice';
import { handleServiceError } from '@/utils/error-handler';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { logger } from '@/lib/default-logger';

/**
 * API Response Types
 * ==================
 * Types for the actual API response structure
 */
interface ApiNotificationType {
  id: number;
  key: string;
  description: string;
}

interface ApiNotification {
  id: string;
  typeId: number;
  title: string;
  message: string;
  metadata: Record<string, any> | null;
  createdAt: string;
  type: ApiNotificationType;
}

interface ApiNotificationItem {
  id: string;
  userId: string;
  notificationId: string;
  isRead: boolean;
  readAt: string | null;
  notification: ApiNotification;
}

interface ApiNotificationsResponse {
  data: {
    notifications: ApiNotificationItem[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

/**
 * Transform API response to frontend format
 * ==========================================
 */
const transformNotification = (apiItem: ApiNotificationItem): NotificationData => {
  return {
    id: apiItem.id, // Use the user-notification mapping ID
    type: apiItem.notification.type.key,
    title: apiItem.notification.title,
    message: apiItem.notification.message,
    metadata: apiItem.notification.metadata || undefined,
    createdAt: apiItem.notification.createdAt,
    isRead: apiItem.isRead,
    readAt: apiItem.readAt,
  };
};

/**
 * Dummy Notifications Data
 * =========================
 * Mock data for testing UI when API is unavailable
 * Based on the architecture document's Notification schema
 */
const DUMMY_NOTIFICATIONS: NotificationData[] = [
  {
    id: 'notif_001',
    type: 'KYC_APPROVED',
    title: 'KYC Verification Approved',
    message: 'User john.doe@example.com KYC has been approved successfully',
    metadata: {
      userId: 'auth_user_001',
      userName: 'John Doe',
      email: 'john.doe@example.com',
      verificationStatus: 'approved',
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: false,
    readAt: null,
  },
  {
    id: 'notif_002',
    type: 'KYC_REJECTED',
    title: 'KYC Verification Rejected',
    message: 'User jane.smith@example.com KYC has been rejected',
    metadata: {
      userId: 'auth_user_002',
      userName: 'Jane Smith',
      email: 'jane.smith@example.com',
      verificationStatus: 'declined',
      reason: 'Documents are not clear',
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    isRead: false,
    readAt: null,
  },
  {
    id: 'notif_003',
    type: 'SYSTEM_ALERT',
    title: 'System Maintenance Scheduled',
    message: 'System maintenance is scheduled for tomorrow at 2:00 AM UTC',
    metadata: {
      severity: 'info',
      maintenanceDate: '2024-12-10T02:00:00Z',
      duration: '2 hours',
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isRead: true,
    readAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif_004',
    type: 'NEW_USER_REGISTRATION',
    title: 'New User Registered',
    message: 'A new user bob.johnson@example.com has registered',
    metadata: {
      userId: 'auth_user_003',
      userName: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      registrationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    isRead: true,
    readAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif_005',
    type: 'TRANSACTION_ALERT',
    title: 'High-Value Transaction Detected',
    message: 'A transaction of $50,000 requires your approval',
    metadata: {
      transactionId: 'tx_abc123',
      amount: 50000,
      currency: 'USD',
      userId: 'auth_user_004',
      status: 'pending_approval',
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    isRead: false,
    readAt: null,
  },
  {
    id: 'notif_006',
    type: 'DOCUMENT_UPLOADED',
    title: 'New Document Uploaded',
    message: 'User alice.williams@example.com has uploaded new KYC documents',
    metadata: {
      userId: 'auth_user_005',
      userName: 'Alice Williams',
      documentType: 'passport',
      fileURL: 'https://example.com/documents/passport_123.pdf',
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    isRead: true,
    readAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Fetch Notifications Parameters
 * ===============================
 */
export interface FetchNotificationsParams {
  limit?: number;
  cursor?: string | null;
}

/**
 * Fetch Notifications Thunk
 * ==========================
 *
 * Fetches paginated notifications using cursor-based pagination
 * Following the architecture: GET /notifications?limit=20&cursor=token
 *
 * Flow:
 * 1. Call API with limit and optional cursor
 * 2. Return notifications array, nextCursor, and hasMore flag
 * 3. On error, fallback to dummy data for UI testing
 *
 * @param params - Pagination parameters (limit, cursor)
 * @returns Promise<NotificationsResponse>
 */
export const fetchNotificationsThunk = createAsyncThunk<
  NotificationsResponse,
  FetchNotificationsParams,
  { rejectValue: string }
>('notification/fetchNotifications', async (params, { rejectWithValue }) => {
  try {
    const { limit = 20, cursor = null } = params;

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append('limit', String(limit));
    if (cursor) {
      queryParams.append('cursor', cursor);
    }

    const url = `${endPoints.NOTIFICATIONS}?${queryParams.toString()}`;

    // Make API call
    const apiResponse = await getMethod<ApiNotificationsResponse>(url);

    // Transform the nested API response to frontend format
    const transformedNotifications = (apiResponse.data.notifications || []).map(transformNotification);

    return {
      notifications: transformedNotifications,
      nextCursor: apiResponse.data.nextCursor ?? null,
      hasMore: apiResponse.data.hasMore ?? false,
    };
  } catch (err) {
    logger.error('[NotificationThunk] Error fetching notifications:', err);
    logger.warn('[NotificationThunk] Falling back to dummy data');

    // Fallback to dummy data for UI testing
    const { limit = 20, cursor = null } = params;
    const cursorIndex = cursor ? DUMMY_NOTIFICATIONS.findIndex((n) => n.id === cursor) : -1;
    const startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    const endIndex = startIndex + limit;
    const notifications = DUMMY_NOTIFICATIONS.slice(startIndex, endIndex);
    const hasMore = endIndex < DUMMY_NOTIFICATIONS.length;
    const nextCursor = hasMore ? (notifications.at(-1)?.id ?? null) : null;

    return {
      notifications,
      nextCursor,
      hasMore,
    };
  }
});

/**
 * Fetch Unread Count Thunk
 * =========================
 *
 * Fetches the count of unread notifications
 * Following the architecture: GET /notifications/unread-count
 *
 * Called when:
 * - App starts/reloads
 * - User logs in
 * - WebSocket reconnects
 *
 * @returns Promise<number> - Unread count
 */
/**
 * API Response Type for Unread Count
 * ===================================
 * Matches the API response structure: { data: { count: number } }
 */
interface ApiUnreadCountResponse {
  data: {
    count: number;
  };
}

export const fetchUnreadCountThunk = createAsyncThunk<number, void, { rejectValue: string }>(
  'notification/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const url = `${endPoints.NOTIFICATIONS}/unread-count`;
      const response = await getMethod<ApiUnreadCountResponse | { count: number }>(url);

      // Handle both nested structure { data: { count: number } } and flat structure { count: number }
      const count = 'data' in response && response.data ? response.data.count : (response as { count: number }).count;

      logger.warn('[NotificationThunk] Fetched unread count:', count);
      return count;
    } catch (err) {
      logger.error('[NotificationThunk] Error fetching unread count:', err);
      logger.warn('[NotificationThunk] Falling back to dummy data count');

      // Fallback to dummy data
      const unreadCount = DUMMY_NOTIFICATIONS.filter((n) => !n.isRead).length;
      return unreadCount;
    }
  }
);

/**
 * Mark Notification as Read Thunk
 * ================================
 *
 * Marks a single notification as read
 * Following the architecture: PATCH /notifications/:id/read
 *
 * Called when:
 * - User clicks/opens/expands a notification
 *
 * @param notificationId - ID of notification to mark as read
 * @returns Promise<string> - Notification ID
 */
export const markAsReadThunk = createAsyncThunk<string, string, { rejectValue: string }>(
  'notification/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const url = `${endPoints.NOTIFICATIONS}/${notificationId}/read`;
      await patchMethod(url, {});

      return notificationId;
    } catch (err) {
      const errorMessage = handleServiceError(err, 'Failed to mark notification as read');
      logger.error('[NotificationThunk] Error marking notification as read:', errorMessage);

      // Return rejection to trigger error state
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Mark All Notifications as Read Thunk
 * =====================================
 *
 * Marks all notifications as read
 * Following the architecture: PATCH /notifications/read-all
 *
 * Called when:
 * - User clicks "Mark all as read" button
 *
 * @returns Promise<void>
 */
export const markAllAsReadThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  'notification/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const url = `${endPoints.NOTIFICATIONS}/read-all`;
      await patchMethod(url, {});

      return;
    } catch (err) {
      const errorMessage = handleServiceError(err, 'Failed to mark all notifications as read');
      logger.error('[NotificationThunk] Error marking all as read:', errorMessage);

      // Return rejection to trigger error state
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Remove Notification Thunk
 * ==========================
 *
 * Removes a notification (deletes UserNotification mapping)
 * Following the architecture: DELETE /notifications/:id
 *
 * Note: This only removes the user's mapping, not the main Notification
 *
 * Called when:
 * - User clicks X/remove button on notification
 *
 * @param notificationId - ID of notification to remove
 * @returns Promise<string> - Notification ID
 */
export const removeNotificationThunk = createAsyncThunk<string, string, { rejectValue: string }>(
  'notification/removeNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      const url = `${endPoints.NOTIFICATIONS}/${notificationId}`;
      await deleteMethod(url);

      return notificationId;
    } catch (err) {
      const errorMessage = handleServiceError(err, 'Failed to remove notification');
      logger.error('[NotificationThunk] Error removing notification:', errorMessage);

      // Return rejection to trigger error state
      return rejectWithValue(errorMessage);
    }
  }
);
