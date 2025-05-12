import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  genre: string;
}

interface BookmarkListProps {
  bookmarks: Book[];
  onRemoveBookmark: (bookId: number) => void;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks, onRemoveBookmark }) => {
  if (bookmarks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Bookmarked Books
        </Typography>
        <Typography color="text.secondary">
          Books you bookmark will appear here for easy access.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {bookmarks.map((book) => (
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
              </CardContent>
            </Box>
            <Tooltip title="Remove from bookmarks">
              <IconButton
                onClick={() => onRemoveBookmark(book.id)}
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
                <BookmarkIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default BookmarkList; 