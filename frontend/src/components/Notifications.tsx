import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Button,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Comment as CommentIcon,
  ThumbUp as ThumbUpIcon,
  PersonAdd as PersonAddIcon,
  Bookmark as BookmarkIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface Notification {
  id: number;
  type: 'comment' | 'like' | 'follow' | 'bookmark' | 'system';
  message: string;
  userId?: number;
  username?: string;
  userAvatar?: string;
  bookId?: number;
  bookTitle?: string;
  timestamp: string;
  isRead: boolean;
}

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: number) => void;
  onMarkAllAsRead: () => void;
  onDelete: (notificationId: number) => void;
}

const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'comment':
        return <CommentIcon color="primary" />;
      case 'like':
        return <ThumbUpIcon color="primary" />;
      case 'follow':
        return <PersonAddIcon color="primary" />;
      case 'bookmark':
        return <BookmarkIcon color="primary" />;
      default:
        return <NotificationsIcon color="primary" />;
    }
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.bookId) {
      return `/books/${notification.bookId}`;
    }
    if (notification.userId) {
      return `/profile/${notification.userId}`;
    }
    return '#';
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ ml: 1 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 480,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Notifications</Typography>
          <Box>
            <IconButton size="small" onClick={onMarkAllAsRead}>
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  component={RouterLink}
                  to={getNotificationLink(notification)}
                  sx={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                    bgcolor: notification.isRead ? 'inherit' : 'action.hover',
                    '&:hover': {
                      bgcolor: 'action.selected',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <ListItemAvatar>
                      {notification.userAvatar ? (
                        <Avatar src={notification.userAvatar} alt={notification.username} />
                      ) : (
                        <Avatar>{getNotificationIcon(notification.type)}</Avatar>
                      )}
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" component="span">
                            {notification.message}
                          </Typography>
                          {!notification.isRead && (
                            <Chip
                              label="New"
                              size="small"
                              color="primary"
                              sx={{ height: 20 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.timestamp).toLocaleString()}
                        </Typography>
                      }
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.preventDefault();
                        onDelete(notification.id);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <SettingsIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Button
            component={RouterLink}
            to="/notifications"
            color="primary"
            size="small"
            onClick={handleClose}
          >
            View All Notifications
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default Notifications; 