import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Pagination,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Fab,
  Zoom,
  InputAdornment,
  Menu,
  MenuItem as MuiMenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  genre: string;
}

const BookList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [page, setPage] = useState(1);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const booksPerPage = isMobile ? 6 : 9;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBooks, setTotalBooks] = useState(0);
  const [averageRatings, setAverageRatings] = useState<{ [bookId: number]: number }>({});
  const [ratingsLoading, setRatingsLoading] = useState<{ [bookId: number]: boolean }>({});

  useEffect(() => {
    setLoading(true);
    // Build query params for backend pagination, search, filter, and sort
    const params = new URLSearchParams();
    params.append('page', String(page - 1)); // backend is 0-based
    params.append('size', String(booksPerPage));
    if (searchTerm) params.append('search', searchTerm);
    if (selectedGenre && selectedGenre !== 'All') params.append('genre', selectedGenre);
    params.append('sortBy', sortBy);
    params.append('sortDir', sortOrder.toUpperCase());
    fetch(`/api/books?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setBooks(data.content || []);
        setTotalBooks(data.totalElements || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchTerm, selectedGenre, page, sortBy, sortOrder, booksPerPage]);

  // Fetch average ratings for each book when books change
  useEffect(() => {
    const fetchRatings = async () => {
      const newRatings: { [bookId: number]: number } = {};
      const newLoading: { [bookId: number]: boolean } = {};
      await Promise.all(
        books.map(async (book) => {
          newLoading[book.id] = true;
          try {
            const res = await fetch(`/api/books/${book.id}/reviews`);
            if (!res.ok) throw new Error('Failed to fetch reviews');
            const reviews = await res.json();
            if (reviews.length > 0) {
              newRatings[book.id] = reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length;
            } else {
              newRatings[book.id] = 0;
            }
          } catch {
            newRatings[book.id] = 0;
          } finally {
            newLoading[book.id] = false;
          }
        })
      );
      setAverageRatings(newRatings);
      setRatingsLoading(newLoading);
    };
    if (books.length > 0) fetchRatings();
  }, [books]);

  const genres = ['All', 'Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Romance'];

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (option: string) => {
    const [field, order] = option.split('-');
    setSortBy(field);
    setSortOrder(order as 'asc' | 'desc');
    handleSortClose();
  };

  const totalPages = Math.ceil(totalBooks / booksPerPage);
  const displayedBooks = books;

  return (
    <Box sx={{ pb: { xs: 7, sm: 0 } }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar 
          position="sticky" 
          color="default" 
          elevation={1}
          sx={{ 
            top: 0,
            mb: 2,
            display: { sm: 'none' }
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Browse Books
            </Typography>
            <IconButton onClick={handleSortClick}>
              <SortIcon />
            </IconButton>
            <IconButton onClick={() => setIsFilterDrawerOpen(true)}>
              <FilterIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
        {!isMobile && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Browse Books
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Search books"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Genre</InputLabel>
                  <Select
                    value={selectedGenre}
                    label="Genre"
                    onChange={(e) => setSelectedGenre(e.target.value)}
                  >
                    {genres.map((genre) => (
                      <MenuItem key={genre} value={genre}>
                        {genre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {displayedBooks.map((book) => (
            <Grid item key={book.id} xs={6} sm={6} md={4}>
              <Card
                component={RouterLink}
                to={`/books/${book.id}`}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <Box sx={{ position: 'relative', paddingTop: '150%' }}>
                  <CardMedia
                    component="img"
                    image={book.cover}
                    alt={book.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
                  <Typography 
                    gutterBottom 
                    variant={isMobile ? "subtitle1" : "h6"} 
                    component="h2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {book.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    by {book.author}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                    {ratingsLoading[book.id] ? (
                      <CircularProgress size={20} />
                    ) : (
                      <>
                        <Rating
                          value={averageRatings[book.id] || 0}
                          precision={0.5}
                          readOnly
                          size={isMobile ? "small" : "medium"}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          ({(averageRatings[book.id] || 0).toFixed(2)})
                        </Typography>
                      </>
                    )}
                  </Box>
                  <Chip 
                    label={book.genre} 
                    size={isMobile ? "small" : "medium"}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {totalPages > 1 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 4,
            mb: { xs: 2, sm: 0 }
          }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        )}
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="right"
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setIsFilterDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            label="Search books"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Genre</InputLabel>
            <Select
              value={selectedGenre}
              label="Genre"
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {genres.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Drawer>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
        PaperProps={{
          sx: { width: 200 }
        }}
      >
        <MuiMenuItem onClick={() => handleSortSelect('title-asc')}>
          Title (A-Z)
        </MuiMenuItem>
        <MuiMenuItem onClick={() => handleSortSelect('title-desc')}>
          Title (Z-A)
        </MuiMenuItem>
        <MuiMenuItem onClick={() => handleSortSelect('rating-desc')}>
          Rating (High to Low)
        </MuiMenuItem>
        <MuiMenuItem onClick={() => handleSortSelect('rating-asc')}>
          Rating (Low to High)
        </MuiMenuItem>
      </Menu>

      {/* Mobile FAB for Add Book (Admin only) */}
      {isMobile && (
        <Zoom in={true}>
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              display: { sm: 'none' }
            }}
            onClick={() => console.log('Add book')}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      )}
    </Box>
  );
};

export default BookList; 