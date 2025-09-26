import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Rating,
  TextField,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Fab,
  Zoom,
  ImageList,
  ImageListItem,
  Card,
  CardMedia,
  CircularProgress,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  PersonAdd,
  PersonAddDisabled,
  Image as ImageIcon,
  VideoLibrary,
  MoreVert,
  Flag,
  Share,
  Comment,
  ArrowBack,
  Close,
} from '@mui/icons-material';
import { getToken } from '../services/auth';
import { useAuth } from '../App';
import { bookmarkService } from '../services/bookmark';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  genre: string;
  description: string;
  publishedYear: number;
  pageCount: number;
}

interface ReviewComment {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  date: string;
}

interface Review {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  comments: ReviewComment[];
  images: string[];
  videos: string[];
}

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [commentText, setCommentText] = useState('');
  const [activeReviewId, setActiveReviewId] = useState<number | null>(null);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [reviewMenuAnchor, setReviewMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitError, setReviewSubmitError] = useState<string | null>(null);
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const { isLoggedIn } = useAuth();

  const fetchBook = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:8080/api/books/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch book details');
      }
      const data = await response.json();
      setBook(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      const response = await fetch(`http://localhost:8080/api/books/${id}/reviews`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (err: any) {
      setReviewsError(err.message || 'Failed to load reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!id) return;
      try {
        setBookmarkLoading(true);
        const bookmarked = await bookmarkService.isBookmarked(parseInt(id));
        setIsBookmarked(bookmarked);
      } catch (err) {
        console.error('Error checking bookmark status:', err);
      } finally {
        setBookmarkLoading(false);
      }
    };

    checkBookmarkStatus();
  }, [id]);

  // Calculate average rating from reviews
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0;

  const handleSubmitReview = async () => {
    if (!userRating || !reviewText.trim()) {
      setReviewSubmitError('Please provide both a rating and review text');
      return;
    }

    setReviewSubmitting(true);
    setReviewSubmitError(null);
    setReviewSubmitSuccess(false);
    try {
      const token = getToken();
      console.log('Token for review submission:', token ? 'present' : 'null');
      const requestBody = { 
        rating: userRating, 
        content: reviewText.trim(),
        images: [],
        videos: []
      };
      console.log('Submitting review with body:', requestBody);
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      console.log('Request headers:', headers);
      const response = await fetch(`http://localhost:8080/api/books/${id}/reviews`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Review submission failed:', errorData);
        throw new Error(errorData.message || errorData.error || 'Failed to submit review');
      }
      setReviewSubmitSuccess(true);
      setUserRating(null);
      setReviewText('');
      setSelectedFiles([]);
      // Refresh reviews list
      await fetchReviews();
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setReviewSubmitError(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleLikeReview = (reviewId: number) => {
    // TODO: Implement like logic
    console.log('Liking review:', reviewId);
  };

  const handleCommentReview = (reviewId: number) => {
    setActiveReviewId(reviewId);
    setIsCommentDialogOpen(true);
  };

  const handleSubmitComment = () => {
    if (commentText && activeReviewId) {
      // TODO: Implement comment submission logic
      console.log('Submitting comment:', { reviewId: activeReviewId, comment: commentText });
      setCommentText('');
      setIsCommentDialogOpen(false);
    }
  };

  const handleShareReview = (reviewId: number) => {
    // TODO: Implement share logic
    console.log('Sharing review:', reviewId);
  };

  const handleFlagReview = (reviewId: number) => {
    // TODO: Implement flag logic
    console.log('Flagging review:', reviewId);
    setReviewMenuAnchor(null);
  };

  const handleBookmarkToggle = async () => {
    if (!id) return;
    try {
      await bookmarkService.toggleBookmark(parseInt(id));
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      // You might want to show an error message to the user here
    }
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement follow logic
    console.log('Toggling follow:', !isFollowing);
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsImageDialogOpen(true);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !book) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Typography color="error" variant="h6">
            {error || 'Book not found'}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: { xs: 2, sm: 4 }, 
        mb: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 2 },
      }}
    >
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
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Book Details
            </Typography>
            <IconButton
              onClick={handleBookmarkToggle}
              disabled={bookmarkLoading}
              color={isBookmarked ? "primary" : "default"}
            >
              {bookmarkLoading ? (
                <CircularProgress size={24} />
              ) : isBookmarked ? (
                <Bookmark />
              ) : (
                <BookmarkBorder />
              )}
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Grid container spacing={{ xs: 2, sm: 4 }}>
        {/* Book Cover and Basic Info */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2,
              '&:hover': {
                '& .MuiBox-root': {
                  opacity: 1,
                },
              },
            }}
          >
            <Box
              component="img"
              src={book?.cover}
              alt={book?.title}
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                aspectRatio: '2/3',
                display: 'block',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.2s',
              }}
            >
              <IconButton
                color="primary"
                onClick={() => handleImageClick(book?.cover || '')}
                sx={{ backgroundColor: 'white' }}
              >
                <ImageIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>

        {/* Book Details */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                component="h1" 
                gutterBottom
                sx={{ wordBreak: 'break-word' }}
              >
                {book?.title}
              </Typography>
              <Typography 
                variant={isMobile ? "subtitle1" : "h6"} 
                color="text.secondary" 
                gutterBottom
              >
                by {book?.author}
              </Typography>
            </Box>
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}>
                  <span>
                    <IconButton
                      onClick={handleBookmarkToggle}
                      disabled={bookmarkLoading}
                      color={isBookmarked ? "primary" : "default"}
                    >
                      {bookmarkLoading ? (
                        <CircularProgress size={24} />
                      ) : isBookmarked ? (
                        <Bookmark />
                      ) : (
                        <BookmarkBorder />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={isFollowing ? "Unfollow author" : "Follow author"}>
                  <IconButton onClick={handleFollowToggle} color="primary">
                    {isFollowing ? <PersonAddDisabled /> : <PersonAdd />}
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={averageRating} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({averageRating.toFixed(2)})
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            {book?.description}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Genre: {book?.genre}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Published: {book?.publishedYear}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Pages: {book?.pageCount}
              </Typography>
            </Grid>
          </Grid>

          {/* Review Section */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2, sm: 3 },
              mt: { xs: 2, sm: 4 }
            }}
          >
            {isLoggedIn ? (
              <>
                <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
                  Write a Review
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography component="legend">Your Rating</Typography>
                  <Rating
                    value={userRating}
                    onChange={(_, value) => setUserRating(value)}
                    size={isMobile ? "medium" : "large"}
                  />
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Your Review"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ mb: 2 }}>
                  <input
                    accept="image/*,video/*"
                    style={{ display: 'none' }}
                    id="media-upload"
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="media-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<ImageIcon />}
                      fullWidth={isMobile}
                      sx={{ mr: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 } }}
                    >
                      Add Media
                    </Button>
                  </label>
                  {selectedFiles.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {selectedFiles.length} file(s) selected
                    </Typography>
                  )}
                </Box>
                <Button
                  variant="contained"
                  onClick={handleSubmitReview}
                  disabled={!userRating || !reviewText || reviewSubmitting}
                  fullWidth={isMobile}
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                {reviewSubmitSuccess && (
                  <Typography color="success.main" sx={{ mt: 1 }}>
                    Review submitted!
                  </Typography>
                )}
                {reviewSubmitError && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    {reviewSubmitError}
                  </Typography>
                )}
              </>
            ) : (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                Please log in to add a review.
              </Typography>
            )}
          </Paper>

          {/* Reviews List */}
          <Box sx={{ mt: { xs: 2, sm: 4 } }}>
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
              Reviews
            </Typography>
            {reviewsLoading ? (
              <Typography>Loading reviews...</Typography>
            ) : reviewsError ? (
              <Typography color="error">{reviewsError}</Typography>
            ) : (
              <List>
                {reviews.map((review) => (
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
                          src={review.userAvatar}
                          sx={{ 
                            width: { xs: 40, sm: 56 },
                            height: { xs: 40, sm: 56 }
                          }}
                        >
                          {review.userName[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primaryTypographyProps={{ component: 'div' }}
                        secondaryTypographyProps={{ component: 'div' }}
                        primary={
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 1, sm: 0 }
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography 
                                component="span" 
                                variant={isMobile ? "subtitle2" : "subtitle1"}
                              >
                                {review.userName}
                              </Typography>
                              <Rating
                                value={review.rating}
                                size={isMobile ? "small" : "medium"}
                                readOnly
                                sx={{ ml: 1 }}
                              />
                            </Box>
                            <IconButton
                              size={isMobile ? "small" : "medium"}
                              onClick={(e) => {
                                setReviewMenuAnchor(e.currentTarget);
                                setSelectedReviewId(review.id);
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              sx={{ display: 'block' }}
                            >
                              {review.content}
                            </Typography>
                            {review.images && review.images.length > 0 && (
                              <ImageList
                                sx={{
                                  width: '100%',
                                  height: 'auto',
                                  mt: 1,
                                  mb: 1,
                                }}
                                cols={isMobile ? 2 : 3}
                                rowHeight={isMobile ? 120 : 160}
                              >
                                {review.images.map((image, index) => (
                                  <ImageListItem 
                                    key={index}
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => handleImageClick(image)}
                                  >
                                    <img
                                      src={image}
                                      alt={`Review image ${index + 1}`}
                                      loading="lazy"
                                      style={{
                                        height: '100%',
                                        objectFit: 'cover',
                                      }}
                                    />
                                  </ImageListItem>
                                ))}
                              </ImageList>
                            )}
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
                                {review.isLiked ? <Favorite /> : <FavoriteBorder />}
                              </IconButton>
                              <Typography variant="body2" color="text.secondary">
                                {review.likes}
                              </Typography>
                              <IconButton
                                size={isMobile ? "small" : "medium"}
                                onClick={() => handleCommentReview(review.id)}
                              >
                                <Comment />
                              </IconButton>
                              <Typography variant="body2" color="text.secondary">
                                {review.comments ? review.comments.length : 0}
                              </Typography>
                              <IconButton
                                size={isMobile ? "small" : "medium"}
                                onClick={() => handleShareReview(review.id)}
                              >
                                <Share />
                              </IconButton>
                            </Box>
                            {review.comments && review.comments.length > 0 && (
                              <Box sx={{ 
                                mt: 1, 
                                pl: { xs: 1, sm: 2 }, 
                                borderLeft: 1, 
                                borderColor: 'divider' 
                              }}>
                                {review.comments.map((comment) => (
                                  <Box key={comment.id} sx={{ mb: 1 }}>
                                    <Box sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      gap: 1,
                                      flexWrap: 'wrap'
                                    }}>
                                      <Avatar
                                        src={comment.userAvatar}
                                        sx={{ 
                                          width: { xs: 20, sm: 24 }, 
                                          height: { xs: 20, sm: 24 } 
                                        }}
                                      >
                                        {comment.userName[0]}
                                      </Avatar>
                                      <Typography variant={isMobile ? "caption" : "subtitle2"}>
                                        {comment.userName}
                                      </Typography>
                                      <Typography 
                                        variant="caption" 
                                        color="text.secondary"
                                        sx={{ ml: 'auto' }}
                                      >
                                        {new Date(comment.date).toLocaleDateString()}
                                      </Typography>
                                    </Box>
                                    <Typography 
                                      variant={isMobile ? "body2" : "body1"} 
                                      sx={{ ml: { xs: 3, sm: 4 } }}
                                    >
                                      {comment.content}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            )}
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
            )}
          </Box>
        </Grid>
      </Grid>

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
            <Close />
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

      {/* Comment Dialog */}
      <Dialog
        open={isCommentDialogOpen}
        onClose={() => setIsCommentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add a Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCommentDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitComment}
            variant="contained"
            disabled={!commentText}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Menu */}
      <Menu
        anchorEl={reviewMenuAnchor}
        open={Boolean(reviewMenuAnchor)}
        onClose={() => setReviewMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleFlagReview(selectedReviewId!)}>
          <Flag sx={{ mr: 1 }} /> Report Review
        </MenuItem>
      </Menu>

      {/* Mobile FAB for Follow */}
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
            onClick={handleFollowToggle}
          >
            {isFollowing ? <PersonAddDisabled /> : <PersonAdd />}
          </Fab>
        </Zoom>
      )}
    </Container>
  );
};

export default BookDetail; 