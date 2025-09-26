import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Card,
  CardContent,
  Tooltip,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Menu,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Fab,
  Zoom,
  TablePagination,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  BarChart as BarChartIcon,
  List as ListIcon,
  Flag as FlagIcon,
  People as PeopleIcon,
  Book as BookIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
  PersonAdd as PersonAddIcon,
  PersonAddDisabled as PersonAddDisabledIcon,
  Menu as MenuIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { bookService, Book } from '../services/book';
import { API_URL } from '../config';

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color = 'primary.main' }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="text.secondary" variant="subtitle2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ mb: 1 }}>
            {value}
          </Typography>
          {trend !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {trend >= 0 ? (
                <TrendingUpIcon sx={{ color: 'success.main' }} />
              ) : (
                <TrendingDownIcon sx={{ color: 'error.main' }} />
              )}
              <Typography
                variant="body2"
                color={trend >= 0 ? 'success.main' : 'error.main'}
              >
                {Math.abs(trend)}% from last month
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.cloneElement(icon as React.ReactElement, {
            sx: { color: color, fontSize: 24 },
          })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  lastLogin?: string;
  joinedDate?: string;
}

interface FlaggedReview {
  id: number;
  content: string;
  bookTitle: string;
  username: string;
  flagCount: number;
  reportedAt?: string;
}

interface DashboardStats {
  totalUsers: number;
  totalBooks: number;
  totalReviews: number;
  flaggedReviews: number;
  activeUsers: number;
  newUsers: number;
  userGrowth: number;
  bookGrowth: number;
  reviewGrowth: number;
}

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false);
  const [newBook, setNewBook] = useState<Book>({
    title: '',
    author: '',
    genre: '',
    description: '',
    publishedYear: undefined,
    pageCount: undefined,
  });

  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userAction, setUserAction] = useState<'edit' | 'activate' | 'deactivate' | 'suspend'>('edit');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);

  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalBooks, setTotalBooks] = useState(0);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBooks: 0,
    totalReviews: 0,
    flaggedReviews: 0,
    activeUsers: 0,
    newUsers: 0,
    userGrowth: 0,
    bookGrowth: 0,
    reviewGrowth: 0
  });

  const [users, setUsers] = useState<User[]>([]);
  const [flaggedReviews, setFlaggedReviews] = useState<FlaggedReview[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEditBookDialogOpen, setIsEditBookDialogOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const fetchBooks = useCallback(async () => {
    setIsLoadingBooks(true);
    try {
      const response = await bookService.getBooks(page, rowsPerPage);
      setBooks(response.content);
      setTotalBooks(response.totalElements);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoadingBooks(false);
    }
  }, [page, rowsPerPage]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchFlaggedReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/flagged-reviews`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFlaggedReviews(data);
      }
    } catch (error) {
      console.error('Error fetching flagged reviews:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchStats();
    fetchUsers();
    fetchFlaggedReviews();
  }, [fetchBooks]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddBook = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Add the book
      const addedBook = await bookService.addBook(newBook);

      // If a cover was selected, upload it
      if (selectedCover && addedBook.id) {
        await bookService.uploadBookCover(addedBook.id, selectedCover);
      }

      // Reset form
      setNewBook({
        title: '',
        author: '',
        genre: '',
        description: '',
        publishedYear: undefined,
        pageCount: undefined,
      });
      setSelectedCover(null);
      setIsAddBookDialogOpen(false);

      // Refresh the books list
      fetchBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add book');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedCover(event.target.files[0]);
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(id);
        fetchBooks(); // Refresh the list
      } catch (err) {
        console.error('Failed to delete book:', err);
        // You might want to show an error message to the user here
      }
    }
  };

  const handleDeleteUser = (id: number) => {
    // TODO: Implement user deletion logic
    console.log('Deleting user:', id);
  };

  const handleReviewAction = (id: number, action: 'approve' | 'reject' | 'delete') => {
    // TODO: Implement review action logic
    console.log(`Review ${id}: ${action}`);
  };

  const handleUserAction = (user: User, action: 'edit' | 'activate' | 'deactivate' | 'suspend') => {
    setSelectedUser(user);
    setUserAction(action);
    setIsUserDialogOpen(true);
  };

  const handleUserActionConfirm = () => {
    if (!selectedUser) return;

    // TODO: Implement user action logic
    console.log(`User ${selectedUser.id}: ${userAction}`);
    setIsUserDialogOpen(false);
    setSelectedUser(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'default';
      case 'Suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'error';
      case 'Moderator':
        return 'warning';
      case 'User':
        return 'primary';
      default:
        return 'default';
    }
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setIsEditBookDialogOpen(true);
  };

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
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Admin Dashboard
            </Typography>
            <IconButton color="inherit" onClick={handleFilterClick}>
              <FilterIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleSortClick}>
              <SortIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography color="text.secondary">
            Manage your application's content, users, and monitor system health
          </Typography>
        </Box>
      )}

      {/* Quick Stats - Responsive Grid */}
      <Grid 
        container 
        spacing={{ xs: 1, sm: 2, md: 3 }} 
        sx={{ mb: { xs: 2, sm: 4 } }}
      >
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PeopleIcon />}
            trend={stats.userGrowth}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Books"
            value={stats.totalBooks}
            icon={<BookIcon />}
            trend={stats.bookGrowth}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Reviews"
            value={stats.totalReviews}
            icon={<ListIcon />}
            trend={stats.reviewGrowth}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Flagged Reviews"
            value={stats.flaggedReviews}
            icon={<FlagIcon />}
            color="#f44336"
          />
        </Grid>
      </Grid>

      {/* Quick Actions - Responsive Layout */}
      <Box 
        sx={{ 
          mb: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 2 }
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          Quick Actions
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          <Button
            component={RouterLink}
            to="/admin/analytics"
            variant="outlined"
            startIcon={<BarChartIcon />}
            fullWidth={isMobile}
          >
            View Analytics
          </Button>
          <Button
            component={RouterLink}
            to="/admin/logs"
            variant="outlined"
            startIcon={<ListIcon />}
            fullWidth={isMobile}
          >
            System Logs
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddBookDialogOpen(true)}
            fullWidth={isMobile}
          >
            Add New Book
          </Button>
        </Box>
      </Box>

      {/* Main Content - Responsive Tabs */}
      <Paper 
        elevation={3}
        sx={{
          overflow: 'hidden',
          '& .MuiTabs-root': {
            minHeight: { xs: 48, sm: 64 },
          },
          '& .MuiTab-root': {
            minHeight: { xs: 48, sm: 64 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 3,
          }}
        >
          <Tab label="Books" />
          <Tab label="Users" />
          <Tab label="Flagged Reviews" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Box 
            sx={{ 
              mb: 2, 
              display: 'flex', 
              justifyContent: 'flex-end',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 2 }
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddBookDialogOpen(true)}
              fullWidth={isMobile}
            >
              Add Book
            </Button>
          </Box>

          <TableContainer 
            sx={{ 
              maxHeight: { xs: 'calc(100vh - 300px)', sm: 'calc(100vh - 400px)' },
              overflowX: 'auto'
            }}
          >
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Genre</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Published Year</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Pages</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingBooks ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : books.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No books found
                    </TableCell>
                  </TableRow>
                ) : (
                  books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{book.genre}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{book.publishedYear}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{book.pageCount}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleEditBook(book)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteBook(book.id!)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={totalBooks}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Joined Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>{user.lastLogin || '-'}</TableCell>
                    <TableCell>{user.joinedDate}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit User">
                        <IconButton
                          color="primary"
                          onClick={() => handleUserAction(user, 'edit')}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {user.status === 'Active' ? (
                        <Tooltip title="Deactivate User">
                          <IconButton
                            color="warning"
                            onClick={() => handleUserAction(user, 'deactivate')}
                          >
                            <PersonAddDisabledIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Activate User">
                          <IconButton
                            color="success"
                            onClick={() => handleUserAction(user, 'activate')}
                          >
                            <PersonAddIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Suspend User">
                        <IconButton
                          color="error"
                          onClick={() => handleUserAction(user, 'suspend')}
                        >
                          <WarningIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Book</TableCell>
                  <TableCell>Reviewer</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reported At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flaggedReviews.map((review: FlaggedReview) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.bookTitle}</TableCell>
                    <TableCell>{review.username}</TableCell>
                    <TableCell>{review.content}</TableCell>
                    <TableCell>{review.flagCount}</TableCell>
                    <TableCell>{review.reportedAt}</TableCell>
                    <TableCell>
                      <Tooltip title="Approve Review">
                        <IconButton
                          color="success"
                          onClick={() => handleReviewAction(review.id, 'approve')}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject Review">
                        <IconButton
                          color="warning"
                          onClick={() => handleReviewAction(review.id, 'reject')}
                        >
                          <WarningIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Review">
                        <IconButton
                          color="error"
                          onClick={() => handleReviewAction(review.id, 'delete')}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Mobile Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: { width: '100%', maxWidth: 300 }
        }}
      >
        <MenuItem onClick={handleFilterClose}>All</MenuItem>
        <MenuItem onClick={handleFilterClose}>Active</MenuItem>
        <MenuItem onClick={handleFilterClose}>Inactive</MenuItem>
        <MenuItem onClick={handleFilterClose}>Suspended</MenuItem>
      </Menu>

      {/* Mobile Sort Menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
        PaperProps={{
          sx: { width: '100%', maxWidth: 300 }
        }}
      >
        <MenuItem onClick={handleSortClose}>Name (A-Z)</MenuItem>
        <MenuItem onClick={handleSortClose}>Name (Z-A)</MenuItem>
        <MenuItem onClick={handleSortClose}>Date (Newest)</MenuItem>
        <MenuItem onClick={handleSortClose}>Date (Oldest)</MenuItem>
      </Menu>

      {/* Mobile Navigation Drawer */}
      <SwipeableDrawer
        anchor="left"
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpen={() => setIsMobileMenuOpen(true)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            <ListItem button component={RouterLink} to="/admin/analytics">
              <ListItemIcon><BarChartIcon /></ListItemIcon>
              <ListItemText primary="Analytics" />
            </ListItem>
            <ListItem button component={RouterLink} to="/admin/logs">
              <ListItemIcon><ListIcon /></ListItemIcon>
              <ListItemText primary="System Logs" />
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>

      {/* Mobile FAB for Add Book */}
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
            onClick={() => setIsAddBookDialogOpen(true)}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      )}

      {/* Add Book Dialog */}
      <Dialog
        open={isAddBookDialogOpen}
        onClose={() => setIsAddBookDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Book</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Author"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Genre"
              value={newBook.genre}
              onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={newBook.description}
              onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Published Year"
              type="number"
              value={newBook.publishedYear || ''}
              onChange={(e) => setNewBook({ ...newBook, publishedYear: parseInt(e.target.value) || undefined })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Page Count"
              type="number"
              value={newBook.pageCount || ''}
              onChange={(e) => setNewBook({ ...newBook, pageCount: parseInt(e.target.value) || undefined })}
              sx={{ mb: 2 }}
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mb: 2 }}
            >
              Upload Cover
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleCoverChange}
              />
            </Button>
            {selectedCover && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Selected file: {selectedCover.name}
              </Typography>
            )}
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddBookDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddBook} 
            variant="contained"
            disabled={isLoading || !newBook.title || !newBook.author}
          >
            {isLoading ? 'Adding...' : 'Add Book'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Action Dialog */}
      <Dialog
        open={isUserDialogOpen}
        onClose={() => setIsUserDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {userAction === 'edit' && 'Edit User'}
          {userAction === 'activate' && 'Activate User'}
          {userAction === 'deactivate' && 'Deactivate User'}
          {userAction === 'suspend' && 'Suspend User'}
        </DialogTitle>
        <DialogContent>
          {userAction === 'edit' && selectedUser && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                value={selectedUser.username}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                value={selectedUser.email}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedUser.role}
                  label="Role"
                >
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Moderator">Moderator</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
          {(userAction === 'activate' || userAction === 'deactivate' || userAction === 'suspend') && (
            <Typography>
              Are you sure you want to {userAction} user {selectedUser?.username}?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUserDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUserActionConfirm}
            variant="contained"
            color={
              userAction === 'edit'
                ? 'primary'
                : userAction === 'activate'
                ? 'success'
                : userAction === 'deactivate'
                ? 'warning'
                : 'error'
            }
          >
            {userAction === 'edit' && 'Save Changes'}
            {userAction === 'activate' && 'Activate'}
            {userAction === 'deactivate' && 'Deactivate'}
            {userAction === 'suspend' && 'Suspend'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 