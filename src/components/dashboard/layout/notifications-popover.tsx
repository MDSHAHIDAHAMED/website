'use client';

import { SOCKET_EVENTS } from '@/constants';
import { useSocket } from '@/providers/socket';
import { useDispatch, useSelector } from '@/store';
import type { NotificationData } from '@/store/slices/notification-slice';
import {
  clearNotificationsList,
  markAsReadLocally,
  removeNotificationLocally,
} from '@/store/slices/notification-slice';
import {
  fetchNotificationsThunk,
  fetchUnreadCountThunk,
  markAllAsReadThunk,
  markAsReadThunk,
  removeNotificationThunk,
} from '@/store/thunks/notification-thunk';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChatText as ChatTextIcon } from '@phosphor-icons/react/dist/ssr/ChatText';
import { EnvelopeOpen as EnvelopeOpenIcon } from '@phosphor-icons/react/dist/ssr/EnvelopeOpen';
import { EnvelopeSimple as EnvelopeSimpleIcon } from '@phosphor-icons/react/dist/ssr/EnvelopeSimple';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import * as React from 'react';

import AtomTooltip from '@/components/atoms/tooltip';
import useScrollMore from '@/hooks/use-scroll-more';
import { useSocketEvents } from '@/hooks/use-socket-events';
import { dayjs } from '@/lib/dayjs';
import { logger } from '@/lib/default-logger';

/**
 * Constants
 * =========
 */
const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  KYC_APPROVED: <UserIcon fontSize="var(--Icon-fontSize)" />,
  KYC_REJECTED: <UserIcon fontSize="var(--Icon-fontSize)" />,
  SYSTEM_ALERT: <ChatTextIcon fontSize="var(--Icon-fontSize)" />,
  NEW_USER_REGISTRATION: <UserIcon fontSize="var(--Icon-fontSize)" />,
  TRANSACTION_ALERT: <ChatTextIcon fontSize="var(--Icon-fontSize)" />,
  DOCUMENT_UPLOADED: <ChatTextIcon fontSize="var(--Icon-fontSize)" />,
  DEFAULT: <ChatTextIcon fontSize="var(--Icon-fontSize)" />,
};

const CENTERED_BOX_SX = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const TOOLTIP_POPPER_SX = {
  popper: { sx: { zIndex: 2200 ,lineHeight: 1.5} },
};

const WORD_BREAK_SX = {
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
};

/**
 * Reusable Components
 * ===================
 */

/** Centered message box with optional loading spinner */
function CenteredMessage({
  children,
  py = 4,
  loading = false,
}: {
  readonly children?: React.ReactNode;
  readonly py?: number;
  readonly loading?: boolean;
}): React.JSX.Element {
  return <Box sx={{ ...CENTERED_BOX_SX, py }}>{loading ? <CircularProgress size={24} /> : children}</Box>;
}

export interface NotificationsPopoverProps {
  readonly anchorEl: null | Element;
  readonly onClose?: () => void;
  readonly open?: boolean;
}

/**
 * Notifications Popover Component
 * ================================
 *
 * Displays user notifications in a popover with:
 * - Infinite scroll (cursor-based pagination)
 * - Read/unread state management
 * - Mark as read functionality
 * - Mark all as read functionality
 * - Remove notification functionality
 * - Real-time updates via WebSocket
 *
 * Following the architecture guidelines:
 * - Fetches notifications when popover opens
 * - Loads more on scroll
 * - Optimistic UI updates
 */
export function NotificationsPopover({
  anchorEl,
  onClose,
  open = false,
}: NotificationsPopoverProps): React.JSX.Element {
  const dispatch = useDispatch();
  const { socket } = useSocket();

  // Ref for scroll container
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  // Redux state
  const notifications = useSelector((state) => state.notification?.list?.data);
  const isLoading = useSelector((state) => state.notification?.list?.isLoading);
  const hasMore = useSelector((state) => state.notification?.list?.hasMore);
  const nextCursor = useSelector((state) => state.notification?.list?.nextCursor);

  /**
   * Socket Connection Status Monitoring
   * ====================================
   * Monitors socket connection state changes
   */
  React.useEffect(() => {
    if (!socket) {
      return;
    }

    /**
     * Connection Event Handler
     * ========================
     */
    const handleConnect = () => {
      // Connection established
    };

    /**
     * Disconnection Event Handler
     * ===========================
     */
    const handleDisconnect = (reason: string) => {
      // Disconnected
    };

    /**
     * Connection Error Handler
     * ========================
     */
    const handleConnectError = (error: Error) => {
      logger.error('[NotificationsPopover] Socket connection error:', error);
    };

    /**
     * Reconnection Event Handler
     * ===========================
     */
    const handleReconnect = (attemptNumber: number) => {
      // Reconnected
    };

    /**
     * Reconnection Failed Handler
     * ============================
     */
    const handleReconnectFailed = () => {
      logger.error('[NotificationsPopover] Socket reconnection failed');
    };

    // Subscribe to socket lifecycle events
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('reconnect', handleReconnect);
    socket.on('reconnect_failed', handleReconnectFailed);

    // Cleanup listeners on unmount
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('reconnect', handleReconnect);
      socket.off('reconnect_failed', handleReconnectFailed);
    };
  }, [socket]);

  /**
   * Socket Event Listener
   * ======================
   * Listens for new notifications and refetches the list to ensure data consistency
   * Only processes notifications that have both title and message
   */

  useSocketEvents({
    autoJoin: true,
    events: {
      [SOCKET_EVENTS.NOTIFICATION_NEW]: React.useCallback(
        (notification: NotificationData) => {
          // Validate notification has required fields (title and message)
          if (!notification?.title || !notification?.message) {
            return;
          }

          // Refetch notifications list to get the latest data with proper API structure
          // This ensures all parameters and transformations are consistent
          if (open) {
            dispatch(fetchNotificationsThunk({ limit: 20 }));
          }

          // Refresh unread count
          dispatch(fetchUnreadCountThunk());
        },
        [dispatch, open]
      ),
    },
  });

  // Infinite scroll trigger
  const shouldLoadMore = useScrollMore(scrollContainerRef.current, 80, 500);

  // Track if initial fetch has been done
  const hasFetchedRef = React.useRef(false);

  // Fetch notifications when popover opens and cleanup on close
  React.useEffect(() => {
    if (open && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(fetchNotificationsThunk({ limit: 20 }));
    }

    // Cleanup when popover closes
    if (!open && hasFetchedRef.current) {
      hasFetchedRef.current = false;
      dispatch(clearNotificationsList());
    }
  }, [open, dispatch]);

  // Load more notifications on scroll
  React.useEffect(() => {
    if (shouldLoadMore && hasMore && !isLoading && nextCursor) {
      dispatch(fetchNotificationsThunk({ limit: 20, cursor: nextCursor }));
    }
  }, [shouldLoadMore, hasMore, isLoading, nextCursor, dispatch]);

  /**
   * Handle Mark All as Read
   * ========================
   */
  const handleMarkAllAsRead = React.useCallback(async () => {
    try {
      await dispatch(markAllAsReadThunk()).unwrap();
    } catch (err) {
      logger.error('[NotificationsPopover] Error marking all as read:', err);
    }
  }, [dispatch]);

  /**
   * Handle Remove Notification
   * ===========================
   */
  const handleRemoveNotification = React.useCallback(
    async (notificationId: string) => {
      try {
        // Optimistic update
        dispatch(removeNotificationLocally(notificationId));
        // API call
        await dispatch(removeNotificationThunk(notificationId)).unwrap();
        // Refresh unread count and notifications
        // Refresh unread count
        dispatch(fetchUnreadCountThunk());
        // Refresh notifications list
        dispatch(fetchNotificationsThunk({ limit: 20 }));
      } catch (err) {
        logger.error('[NotificationsPopover] Error removing notification:', err);
      }
    },
    [dispatch]
  );

  /**
   * Handle Mark Single Notification as Read
   * ========================================
   */
  const handleMarkAsRead = React.useCallback(
    async (notificationId: string) => {
      try {
        // Optimistic update
        dispatch(markAsReadLocally(notificationId));
        // API call
        await dispatch(markAsReadThunk(notificationId)).unwrap();
        // Refresh unread count
        dispatch(fetchUnreadCountThunk());
      } catch (err) {
        logger.error('[NotificationsPopover] Error marking as read:', err);
      }
    },
    [dispatch]
  );

  /**
   * Handle Notification Click (Mark as Read)
   * =========================================
   */
  const handleNotificationClick = React.useCallback(
    async (notification: NotificationData) => {
      if (!notification.isRead) {
        try {
          // Optimistic update
          dispatch(markAsReadLocally(notification.id));
          // API call
          await dispatch(markAsReadThunk(notification.id)).unwrap();
          // Refresh unread count
          dispatch(fetchUnreadCountThunk());
        } catch (err) {
          logger.error('[NotificationsPopover] Error marking as read:', err);
        }
      }
    },
    [dispatch]
  );

  /**
   * Render Notification Content
   * ============================
   * Renders the appropriate content based on loading and notification states
   * Extracted from nested ternary to improve readability
   */
  const renderNotificationContent = () => {
    // Initial loading state - show spinner
    if (isLoading && (!notifications || notifications.length === 0)) {
      return <CenteredMessage loading />;
    }

    // Empty state - no notifications
    if (!notifications || notifications.length === 0) {
      return (
        <CenteredMessage>
          <Typography variant="subtitle2" color="text.secondary">
            No notifications found
          </Typography>
        </CenteredMessage>
      );
    }

    // Notifications list with data
    return (
      <List disablePadding>
        {notifications.map((notification, index) => (
          <NotificationItem
            divider={index < notifications.length - 1}
            key={notification.id}
            notification={notification}
            onClick={() => handleNotificationClick(notification)}
            onRemove={() => handleRemoveNotification(notification.id)}
            onMarkAsRead={() => handleMarkAsRead(notification.id)}
          />
        ))}

        {/* Pagination Loading indicator */}
        {isLoading && notifications.length > 0 && <CenteredMessage py={2} loading />}

        {/* End of list indicator */}
        {!hasMore && notifications.length > 0 && !isLoading && (
          <CenteredMessage py={2}>
            <Typography variant="caption" color="text.secondary">
              No more notifications
            </Typography>
          </CenteredMessage>
        )}
      </List>
    );
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{
        paper: {
          sx: {
            width: '380px',
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      sx={{ zIndex: 2100 }} // Set z-index higher than MainNav (2000)
    >
      {/* Header */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6">Notifications</Typography>
        </Stack>
        <AtomTooltip title="Mark all as read" placement="bottom" slotProps={TOOLTIP_POPPER_SX}>
          <IconButton edge="end" onClick={handleMarkAllAsRead}>
            <EnvelopeSimpleIcon />
          </IconButton>
        </AtomTooltip>
      </Stack>

      {/* Content */}
      <Box ref={scrollContainerRef} sx={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden' }}>
        {renderNotificationContent()}
      </Box>
    </Popover>
  );
}

interface NotificationItemProps {
  readonly divider?: boolean;
  readonly notification: NotificationData;
  readonly onClick?: () => void;
  readonly onRemove?: () => void;
  readonly onMarkAsRead?: () => void;
}

/**
 * Notification Item Component
 * ============================
 *
 * Displays a single notification with:
 * - Visual indicator for read/unread status
 * - Click handler to mark as read
 * - Remove button
 */
function NotificationItem({
  divider,
  notification,
  onClick,
  onRemove,
  onMarkAsRead,
}: NotificationItemProps): React.JSX.Element {
  return (
    <ListItem
      onClick={onClick}
      sx={{
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: notification.isRead ? 'transparent' : 'rgba(109, 242, 254, 0.05)',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: notification.isRead ? 'rgba(0, 0, 0, 0.2)' : 'rgba(109, 242, 254, 0.4)',
          boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.25)',
        },
        transition: 'all 0.2s ease',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        // borderBottom: '1px solid',
        // borderColor: 'rgba(0, 0, 0, 0.08)',
        py: 2,
        px: 2,
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      {/* Main content row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
        <NotificationContent notification={notification} />

        {/* Action buttons with enhanced visibility on hover */}
        <Stack direction="row" spacing={0.5}>
          {/* Mark as read button - only show if unread */}
          {!notification.isRead && (
            <AtomTooltip title="Mark as read" placement="left" slotProps={TOOLTIP_POPPER_SX}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering onClick
                  onMarkAsRead?.();
                }}
                size="small"
                sx={{
                  color: 'text.primary',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  },
                }}
              >
                <EnvelopeOpenIcon />
              </IconButton>
            </AtomTooltip>
          )}

          {/* Remove button with enhanced visibility */}
          <AtomTooltip title="Remove" placement="left" slotProps={TOOLTIP_POPPER_SX}>
            <IconButton
              edge="end"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering onClick
                onRemove?.();
              }}
              size="small"
              sx={{
                color: 'text.primary',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                },
              }}
            >
              <XIcon />
            </IconButton>
          </AtomTooltip>
        </Stack>
      </Box>

      {/* Timestamp container - separate from content */}
      <Box sx={{ position: 'absolute', bottom: 0, right: 8 }}>
        <Typography color="text.secondary" variant="caption">
          {dayjs(notification.createdAt).fromNow()}
        </Typography>
      </Box>
    </ListItem>
  );
}

interface NotificationContentProps {
  readonly notification: NotificationData;
}

/**
 * Notification Content Component
 * ===============================
 *
 * Renders notification content based on the backend data structure:
 * - type: Notification type (e.g., KYC_APPROVED, SYSTEM_ALERT)
 * - title: Notification title
 * - message: Notification message
 * - metadata: Additional JSON data specific to notification type
 * - createdAt: Timestamp
 * - isRead: Read/unread status
 */
function NotificationContent({ notification }: NotificationContentProps): React.JSX.Element {
  const icon = NOTIFICATION_ICONS[notification.type] || NOTIFICATION_ICONS.DEFAULT;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, overflow: 'hidden' }}>
      {/* Avatar with unread indicator - centered vertically */}
      <Box sx={{ position: 'relative', mr: 2 }}>
        <Avatar
          sx={{
            bgcolor: 'primary.main',
          }}
        >
          {icon}
        </Avatar>
        {/* Unread indicator dot - only show for unread */}
        {!notification.isRead && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              // border: '1px solid',
              // borderColor: 'background.paper',
            }}
          />
        )}
      </Box>

      {/* Content - title and message */}
      <Box sx={{ flex: 1, minWidth: 0, pr: 2 }}>
        {/* Title */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            ...WORD_BREAK_SX,
          }}
        >
          {notification.title}
        </Typography>

        {/* Message with tooltip */}
        <AtomTooltip title={notification.message} placement="bottom-start" slotProps={TOOLTIP_POPPER_SX}>
          <Typography
            variant="subtitle4"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              ...WORD_BREAK_SX,
            }}
          >
            {notification.message}
          </Typography>
        </AtomTooltip>
      </Box>
    </Box>
  );
}
