import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Paper,
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
  CircularProgress,
  Rating,
  Alert,
} from '@mui/material';
import { 
  TrendingUp, 
  Star, 
  Bookmark, 
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Book as BookIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { getToken } from '../services/auth';

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [featuredBooks, setFeaturedBooks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [averageRatings, setAverageRatings] = React.useState<{ [bookId: number]: number }>({});
  const [ratingsLoading, setRatingsLoading] = React.useState<{ [bookId: number]: boolean }>({});

  React.useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        console.log('Fetching books from API...');
        const token = getToken();
        const response = await fetch('http://localhost:8080/api/books?size=3&sortBy=rating&sortDir=DESC', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch featured books: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        console.log('Books content:', data.content);
        setFeaturedBooks(data.content || []);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  React.useEffect(() => {
    if (featuredBooks.length === 0) return;
    const fetchRatings = async () => {
      const newRatings: { [bookId: number]: number } = {};
      const newLoading: { [bookId: number]: boolean } = {};
      await Promise.all(
        featuredBooks.map(async (book: any) => {
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
    fetchRatings();
  }, [featuredBooks]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()} 
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Box>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar position="fixed" color="transparent" elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setIsDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
              Book Review
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            <ListItem button component={RouterLink} to="/">
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={RouterLink} to="/books">
              <ListItemIcon><BookIcon /></ListItemIcon>
              <ListItemText primary="Books" />
            </ListItem>
            <ListItem button component={RouterLink} to="/profile">
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          color: 'white',
          py: { xs: 12, sm: 8, md: 12 },
          mb: { xs: 4, sm: 6 },
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.7)',
            zIndex: -1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, rgba(0, 0, 0, 0.7) 30%, rgba(0, 0, 0, 0.5) 90%)'
              : `linear-gradient(45deg, ${theme.palette.primary.main}99 30%, ${theme.palette.primary.dark}99 90%)`,
            zIndex: -1,
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            component="h1"
            variant={isMobile ? "h3" : "h2"}
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              mb: { xs: 2, sm: 3 },
            }}
          >
            Discover Your Next Favorite Book
          </Typography>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            align="center"
            paragraph
            sx={{
              mb: { xs: 3, sm: 4 },
              opacity: 0.9,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Join our community of readers and share your thoughts about the books you love.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: 1, sm: 2 },
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              component={RouterLink}
              to="/books"
              size={isMobile ? "medium" : "large"}
              sx={{
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
              }}
            >
              Browse Books
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              component={RouterLink}
              to="/register"
              size={isMobile ? "medium" : "large"}
              sx={{
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                borderColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Join Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: { xs: 6, sm: 8 } }}>
        <Grid container spacing={{ xs: 2, sm: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                height: '100%',
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <TrendingUp sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main', mb: { xs: 1, sm: 2 } }} />
              <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
                Trending Books
              </Typography>
              <Typography color="text.secondary" variant={isMobile ? "body2" : "body1"}>
                Discover what's popular in our community right now.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                height: '100%',
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Star sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main', mb: { xs: 1, sm: 2 } }} />
              <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
                Expert Reviews
              </Typography>
              <Typography color="text.secondary" variant={isMobile ? "body2" : "body1"}>
                Get insights from our community of book enthusiasts.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                height: '100%',
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Bookmark sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main', mb: { xs: 1, sm: 2 } }} />
              <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
                Save & Share
              </Typography>
              <Typography color="text.secondary" variant={isMobile ? "body2" : "body1"}>
                Keep track of your favorite books and share with friends.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Books Section */}
      <Container maxWidth="lg" sx={{ mb: { xs: 6, sm: 8 } }}>
        <Typography
          component="h2"
          variant={isMobile ? "h5" : "h4"}
          align="center"
          gutterBottom
          sx={{ mb: { xs: 3, sm: 4 } }}
        >
          Featured Books
        </Typography>
        
        {featuredBooks.length === 0 && !loading && !error && (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            No featured books available at the moment.
          </Typography>
        )}
        
        <Grid container spacing={{ xs: 2, sm: 4 }}>
          {featuredBooks.map((book) => (
            <Grid item key={book.id} xs={12} sm={6} md={4}>
              <Card
                component={RouterLink}
                to={`/books/${book.id}`}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box sx={{ position: 'relative', paddingTop: '150%' }}>
                  <CardMedia
                    component="img"
                    image={book.cover ? (book.cover.startsWith('http') ? book.cover : `http://localhost:8080${book.cover}`) : '/default-cover.png'}
                    alt={book.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      backgroundColor: 'grey.100',
                    }}
                    onError={(e) => {
                      e.currentTarget.src = '/default-cover.png';
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
                  <Typography 
                    gutterBottom 
                    variant={isMobile ? "h6" : "h5"} 
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
                    variant={isMobile ? "body2" : "body1"} 
                    color="text.secondary" 
                    gutterBottom
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography
                      variant={isMobile ? "body2" : "body1"}
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {book.genre}
                    </Typography>
                    <Typography 
                      variant={isMobile ? "body2" : "body1"}
                      color="text.secondary"
                    >
                      {ratingsLoading[book.id] ? (
                        <CircularProgress size={18} />
                      ) : (
                        <>
                          <Rating
                            value={averageRatings[book.id] || 0}
                            precision={0.5}
                            readOnly
                            size={isMobile ? "small" : "medium"}
                          />
                          <span style={{ marginLeft: 6 }}>
                            ({(averageRatings[book.id] || 0).toFixed(2)})
                          </span>
                        </>
                      )}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Section */}
      <Box
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          py: { xs: 6, sm: 8 },
          mt: { xs: 6, sm: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Get in Touch
            </Typography>
            <Typography
              variant={isMobile ? "body1" : "h6"}
              sx={{
                maxWidth: '600px',
                mx: 'auto',
                opacity: 0.9,
              }}
            >
              Have questions, suggestions, or want to report an issue? We'd love to hear from you!
            </Typography>
          </Box>
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: 2, sm: 4 },
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              size={isMobile ? "medium" : "large"}
              sx={{
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'white',
                },
              }}
              onClick={() => window.open('mailto:letickemal@gmail.com?subject=Book Review App Inquiry&body=Hello, I have a question about the Book Review application...', '_blank')}
            >
              📧 Email Us
            </Button>
            
            <Button
              variant="outlined"
              color="inherit"
              size={isMobile ? "medium" : "large"}
              sx={{
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                borderColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              onClick={() => window.open('https://github.com/yourusername/book-review-application', '_blank')}
            >
              🔗 GitHub
            </Button>
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Email: letickemal@gmail.com
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 