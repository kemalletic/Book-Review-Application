import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Divider,
  Button,
  Chip,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface Review {
  id: number;
  userId: number;
  username: string;
  userAvatar: string;
  bookId: number;
  bookTitle: string;
  bookCover: string;
  rating: number;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface UserFeedProps {
  reviews: Review[];
  onLike: (reviewId: number) => void;
  onComment: (reviewId: number) => void;
  onShare: (reviewId: number) => void;
  onBookmark: (reviewId: number) => void;
}

const UserFeed: React.FC<UserFeedProps> = ({
  reviews,
  onLike,
  onComment,
  onShare,
  onBookmark,
}) => {
  if (reviews.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Reviews Yet
        </Typography>
        <Typography color="text.secondary" paragraph>
          Follow some users to see their reviews here.
        </Typography>
        <Button
          component={RouterLink}
          to="/users"
          variant="contained"
          color="primary"
        >
          Find Users to Follow
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {reviews.map((review, index) => (
        <React.Fragment key={review.id}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={review.userAvatar}
                  alt={review.username}
                  component={RouterLink}
                  to={`/profile/${review.userId}`}
                  sx={{ cursor: 'pointer', mr: 2 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    component={RouterLink}
                    to={`/profile/${review.userId}`}
                    variant="subtitle1"
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      fontWeight: 500,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {review.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(review.timestamp).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Box
                component={RouterLink}
                to={`/books/${review.bookId}`}
                sx={{
                  display: 'flex',
                  textDecoration: 'none',
                  color: 'inherit',
                  mb: 2,
                }}
              >
                <Box
                  component="img"
                  src={review.bookCover}
                  alt={review.bookTitle}
                  sx={{
                    width: 60,
                    height: 90,
                    objectFit: 'cover',
                    borderRadius: 1,
                    mr: 2,
                  }}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {review.bookTitle}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`${review.rating}/5`}
                      size="small"
                      color="primary"
                    />
                  </Box>
                </Box>
              </Box>

              <Typography variant="body1" paragraph>
                {review.content}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => onLike(review.id)}
                  color={review.isLiked ? 'primary' : 'default'}
                >
                  <ThumbUpIcon fontSize="small" />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                  {review.likes}
                </Typography>

                <IconButton
                  size="small"
                  onClick={() => onComment(review.id)}
                  sx={{ ml: 1 }}
                >
                  <CommentIcon fontSize="small" />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                  {review.comments}
                </Typography>

                <IconButton
                  size="small"
                  onClick={() => onShare(review.id)}
                  sx={{ ml: 1 }}
                >
                  <ShareIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => onBookmark(review.id)}
                  color={review.isBookmarked ? 'primary' : 'default'}
                  sx={{ ml: 'auto' }}
                >
                  <BookmarkIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
          {index < reviews.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default UserFeed; 