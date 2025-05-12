import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Avatar,
  Button,
  TextField,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Fab,
  Zoom,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Bookmark as BookmarkIcon,
  PersonAdd as PersonAddIcon,
  PersonAddDisabled as PersonAddDisabledIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { getUserProfile, updateUserProfile } from '../services/auth';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface User {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
  isFollowing: boolean;
}

interface Review {
  id: number;
  bookId: number;
  bookTitle: string;
  bookCover: string;
  bookAuthor: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  isLiked: boolean;
  comments: number;
}

interface BookmarkedBook {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  genre: string;
  dateAdded: string;
}

const Profile: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    avatarUrl: 'https://source.unsplash.com/random/200x200?portrait',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile();
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          bio: userData.bio || '',
          avatarUrl: userData.avatarUrl || 'https://source.unsplash.com/random/200x200?portrait',
        });
        setError(null);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError('Please log in to view your profile');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to load profile data');
        }
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Mock data - replace with actual API calls
  const userReviews: Review[] = [
    {
      id: 1,
      bookId: 1,
      bookTitle: 'The Great Gatsby',
      bookCover: 'https://source.unsplash.com/random/300x400?book',
      bookAuthor: 'F. Scott Fitzgerald',
      rating: 5,
      comment: 'A classic masterpiece that everyone should read.',
      date: '2024-03-15',
      likes: 42,
      isLiked: false,
      comments: 3,
    },
    {
      id: 2,
      bookId: 2,
      bookTitle: 'To Kill a Mockingbird',
      bookCover: 'https://source.unsplash.com/random/300x400?book',
      bookAuthor: 'Harper Lee',
      rating: 4,
      comment: 'Beautifully written, though the ending was a bit abrupt.',
      date: '2024-03-10',
      likes: 28,
      isLiked: true,
      comments: 1,
    },
  ];

  const followedUsers: User[] = [
    {
      id: 1,
      name: 'Jane Smith',
      avatar: 'https://source.unsplash.com/random/100x100?portrait',
      bio: 'Literary critic and book blogger',
      isFollowing: true,
    },
    {
      id: 2,
      name: 'Mike Johnson',
      avatar: 'https://source.unsplash.com/random/100x100?portrait',
      bio: 'Science fiction enthusiast',
      isFollowing: true,
    },
  ];

  const bookmarkedBooks: BookmarkedBook[] = [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      cover: 'https://source.unsplash.com/random/300x400?book',
      rating: 4.5,
      genre: 'Fiction',
      dateAdded: '2024-03-15',
    },
    {
      id: 2,
      title: '1984',
      author: 'George Orwell',
      cover: 'https://source.unsplash.com/random/300x400?book',
      rating: 4.8,
      genre: 'Science Fiction',
      dateAdded: '2024-03-10',
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile(profileData);
      setIsEditing(false);
      // Show success message or notification here if you have one
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleFollowToggle = (userId: number) => {
    // TODO: Implement follow/unfollow logic
    console.log('Toggling follow for user:', userId);
  };

  const handleLikeReview = (reviewId: number) => {
    // TODO: Implement like logic
    console.log('Liking review:', reviewId);
  };

  const handleCommentReview = (reviewId: number) => {
    // TODO: Implement comment logic
    console.log('Commenting on review:', reviewId);
  };

  const handleShareReview = (reviewId: number) => {
    // TODO: Implement share logic
    console.log('Sharing review:', reviewId);
  };

  const handleRemoveBookmark = (bookId: number) => {
    // TODO: Implement remove bookmark logic
    console.log('Removing bookmark:', bookId);
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsImageDialogOpen(true);
  };

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
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => window.history.back()}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Profile
            </Typography>
            <IconButton onClick={handleEditProfile}>
              <EditIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', color: 'error.main', py: 4 }}>
            <Typography variant="h6">{error}</Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 4 }}>
            {/* Profile Header */}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                <Box
                  sx={{
                    position: 'relative',
                    width: { xs: 120, sm: 160 },
                    height: { xs: 120, sm: 160 },
                    mx: 'auto',
                    mb: 2,
                    cursor: 'pointer',
                  }}
                  onClick={() => handleImageClick(profileData.avatarUrl)}
                >
                  <Avatar
                    src={profileData.avatarUrl}
                    sx={{
                      width: '100%',
                      height: '100%',
                      fontSize: { xs: '3rem', sm: '4rem' },
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'primary.main',
                      borderRadius: '50%',
                      p: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <EditIcon sx={{ color: 'white', fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                  </Box>
                </Box>

                {isEditing ? (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Bio"
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        onClick={handleSaveProfile}
                        fullWidth={isMobile}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancelEdit}
                        fullWidth={isMobile}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
                      {profileData.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      {profileData.email}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {profileData.bio}
                    </Typography>
                    {!isMobile && (
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={handleEditProfile}
                      >
                        Edit Profile
                      </Button>
                    )}
                  </>
                )}
              </Paper>
            </Grid>

            {/* Tabs Section */}
            <Grid item xs={12} md={8}>
              <Paper elevation={3}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant={isMobile ? "fullWidth" : "standard"}
                  aria-label="profile tabs"
                >
                  <Tab label="My Reviews" />
                  <Tab label="Bookmarked Books" />
                  <Tab label="Following" />
                </Tabs>

                <TabPanel value={activeTab} index={0}>
                  <List>
                    {userReviews.map((review) => (
                      <React.Fragment key={review.id}>
                        <ListItem 
                          alignItems="flex-start"
                          sx={{ 
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              src={review.bookCover}
                              variant="rounded"
                              sx={{ 
                                width: { xs: 60, sm: 80 }, 
                                height: { xs: 90, sm: 120 }, 
                                mr: 2,
                                cursor: 'pointer'
                              }}
                              onClick={() => handleImageClick(review.bookCover)}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: { xs: 1, sm: 0 }
                              }}>
                                <Typography 
                                  component="span" 
                                  variant={isMobile ? "subtitle1" : "h6"}
                                >
                                  {review.bookTitle}
                                </Typography>
                                <Rating
                                  value={review.rating}
                                  size={isMobile ? "small" : "medium"}
                                  readOnly
                                />
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                  sx={{ display: 'block', mt: 1 }}
                                >
                                  {review.comment}
                                </Typography>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center',
                                  gap: { xs: 0.5, sm: 1 },
                                  mt: 1
                                }}>
                                  <IconButton
                                    size={isMobile ? "small" : "medium"}
                                    onClick={() => handleLikeReview(review.id)}
                                    color={review.isLiked ? 'primary' : 'default'}
                                  >
                                    {review.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                  </IconButton>
                                  <Typography variant="body2" color="text.secondary">
                                    {review.likes}
                                  </Typography>
                                  <IconButton
                                    size={isMobile ? "small" : "medium"}
                                    onClick={() => handleCommentReview(review.id)}
                                  >
                                    <CommentIcon />
                                  </IconButton>
                                  <Typography variant="body2" color="text.secondary">
                                    {review.comments}
                                  </Typography>
                                  <IconButton
                                    size={isMobile ? "small" : "medium"}
                                    onClick={() => handleShareReview(review.id)}
                                  >
                                    <ShareIcon />
                                  </IconButton>
                                </Box>
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ display: 'block', mt: 1 }}
                                >
                                  {new Date(review.date).toLocaleDateString()}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                  <Grid container spacing={{ xs: 2, sm: 3 }}>
                    {bookmarkedBooks.map((book) => (
                      <Grid item xs={6} sm={6} md={4} key={book.id}>
                        <Card>
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
                                cursor: 'pointer'
                              }}
                              onClick={() => handleImageClick(book.cover)}
                            />
                          </Box>
                          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                            <Typography 
                              variant={isMobile ? "subtitle1" : "h6"} 
                              noWrap
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
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Rating 
                                value={book.rating} 
                                size={isMobile ? "small" : "medium"} 
                                readOnly 
                              />
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ ml: 1 }}
                              >
                                ({book.rating})
                              </Typography>
                            </Box>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center' 
                            }}>
                              <Chip 
                                label={book.genre} 
                                size={isMobile ? "small" : "medium"} 
                              />
                              <IconButton
                                size={isMobile ? "small" : "medium"}
                                onClick={() => handleRemoveBookmark(book.id)}
                                color="primary"
                              >
                                <BookmarkIcon />
                              </IconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={2}>
                  <List>
                    {followedUsers.map((user) => (
                      <React.Fragment key={user.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              src={user.avatar}
                              sx={{ 
                                width: { xs: 40, sm: 56 },
                                height: { xs: 40, sm: 56 }
                              }}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography 
                                variant={isMobile ? "subtitle1" : "h6"}
                              >
                                {user.name}
                              </Typography>
                            }
                            secondary={user.bio}
                          />
                          <IconButton
                            color="primary"
                            onClick={() => handleFollowToggle(user.id)}
                          >
                            {user.isFollowing ? <PersonAddDisabledIcon /> : <PersonAddIcon />}
                          </IconButton>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                </TabPanel>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Image Preview Dialog */}
      <Dialog
        open={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Typography variant="h6">Image Preview</Typography>
          <IconButton onClick={() => setIsImageDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedImage && (
            <Box
              component="img"
              src={selectedImage}
              alt="Preview"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Mobile FAB for Edit Profile */}
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
            onClick={handleEditProfile}
          >
            <EditIcon />
          </Fab>
        </Zoom>
      )}
    </Box>
  );
};

export default Profile; 