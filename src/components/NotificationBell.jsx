"use client";

import { useState } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Button,
  Divider,
  Chip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAllNotifications, addTestNotification } = useNotifications();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notificationId) => {
    markAsRead(notificationId);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            mt: 1
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} new`}
                size="small"
                color="primary"
              />
            )}
            {notifications.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark all read
                </Button>
                <Button
                  size="small"
                  onClick={clearAllNotifications}
                  color="error"
                >
                  Clear all
                </Button>
              </Box>
            )}
          </Box>

          {/* <Button 
            size="small" 
            onClick={addTestNotification}
            variant="outlined"
            sx={{ mb: 1 }}
          >
            Add Test Notification
          </Button> */}
        </Box>

        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: 300, overflow: 'auto', p: 0 }}>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: notification.read ? 'transparent' : 'action.hover',
                  '&:hover': {
                    backgroundColor: 'action.selected'
                  },
                  borderLeft: notification.read ? 'none' : '4px solid',
                  borderLeftColor: 'primary.main'
                }}
              >
                <ListItemIcon sx={{ minWidth: 50 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {!notification.read && (
                      <CircleIcon sx={{ fontSize: 8, color: 'primary.main' }} />
                    )}
                    <span style={{ fontSize: '20px' }}>{notification.icon}</span>
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(notification.timestamp)}
                      </Typography>
                    </Box>
                  }
                  primaryTypographyProps={{ component: 'div' }}
                  secondaryTypographyProps={{ component: 'div' }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
}