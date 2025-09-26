import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Skeleton,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Star as StarIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  genre: string;
  isBookmarked: boolean;
  matchPercentage?: number;
}

interface BookRecommendationsProps {
  recommendations: Book[];
  isLoading: boolean;
  onBookmark: (bookId: number) => void;
}

const BookRecommendations: React.FC<BookRecommendationsProps> = ({
  recommendations,
  isLoading,
  onBookmark,
}) => {
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3].map((index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" height={32} />
                <Skeleton variant="text" height={24} />
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Skeleton variant="rectangular" width={60} height={24} />
                  <Skeleton variant="rectangular" width={40} height={24} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Recommendations Yet
        </Typography>
        <Typography color="text.secondary" paragraph>
          Rate more books to get personalized recommendations.
        </Typography>
        <Button
          component={RouterLink}
          to="/books"
          variant="contained"
          color="primary"
        >
          Browse Books
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Recommended for You
      </Typography>
      <Typography color="text.secondary" paragraph>
        Based on your reading history and preferences
      </Typography>

      <Grid container spacing={3}>
        {recommendations.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Box
                component={RouterLink}
                to={`/books/${book.id}`}
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={book.cover}
                  alt={book.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2" noWrap>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    by {book.author}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Chip
                      label={book.genre}
                      size="small"
                      sx={{ backgroundColor: 'primary.main', color: 'white' }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                      <StarIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {book.rating}
                      </Typography>
                    </Box>
                  </Box>
                  {book.matchPercentage && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="primary">
                        {book.matchPercentage}% match
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Box>
              <Tooltip title={book.isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}>
                <IconButton
                  onClick={() => onBookmark(book.id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                >
                  {book.isBookmarked ? (
                    <BookmarkIcon color="primary" />
                  ) : (
                    <BookmarkBorderIcon color="primary" />
                  )}
                </IconButton>
              </Tooltip>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BookRecommendations; 