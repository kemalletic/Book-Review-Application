import React, { useState } from 'react';
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
  Chip,
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
  name: string;
  email: string;
  role: 'User' | 'Admin' | 'Moderator';
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin?: string;
  joinedDate: string;
}

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    publishedYear: '',
    pageCount: '',
  });

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userAction, setUserAction] = useState<'edit' | 'activate' | 'deactivate' | 'suspend'>('edit');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);

  // Mock data - replace with actual API calls
  const stats = {
    totalUsers: 1234,
    activeUsers: 789,
    totalBooks: 5678,
    totalReviews: 12345,
    flaggedReviews: 23,
    userGrowth: 12,
    reviewGrowth: 8,
    bookGrowth: 5,
    engagementGrowth: 15,
  };

  const books = [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Fiction',
      publishedYear: 1925,
      pageCount: 180,
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
      publishedYear: 1960,
      pageCount: 281,
    },
  ];

  const users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'User',
      status: 'Active',
      lastLogin: '2024-03-15 14:30:22',
      joinedDate: '2024-01-01',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Moderator',
      status: 'Active',
      lastLogin: '2024-03-15 13:45:10',
      joinedDate: '2024-01-15',
    },
  ];

  const flaggedReviews = [
    {
      id: 1,
      bookTitle: 'The Great Gatsby',
      reviewer: 'John Doe',
      reason: 'Inappropriate Content',
      status: 'Pending',
      reportedAt: '2024-03-15 14:30:22',
    },
    {
      id: 2,
      bookTitle: 'To Kill a Mockingbird',
      reviewer: 'Jane Smith',
      reason: 'Spam',
      status: 'Under Review',
      reportedAt: '2024-03-15 13:45:10',
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddBook = () => {
    // TODO: Implement book addition logic
    console.log('Adding new book:', newBook);
    setIsAddBookDialogOpen(false);
    setNewBook({
      title: '',
      author: '',
      genre: '',
      description: '',
      publishedYear: '',
      pageCount: '',
    });
  };

  const handleDeleteBook = (id: number) => {
    // TODO: Implement book deletion logic
    console.log('Deleting book:', id);
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
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{book.genre}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{book.publishedYear}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{book.pageCount}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          color="primary"
                          size={isMobile ? "small" : "medium"}
                          onClick={() => console.log('Edit book:', book.id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          size={isMobile ? "small" : "medium"}
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status)}
                        size="small"
                      />
                    </TableCell>
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
                {flaggedReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.bookTitle}</TableCell>
                    <TableCell>{review.reviewer}</TableCell>
                    <TableCell>
                      <Chip
                        label={review.reason}
                        color="error"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={review.status}
                        color={
                          review.status === 'Pending'
                            ? 'warning'
                            : review.status === 'Under Review'
                            ? 'info'
                            : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
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

      {/* Responsive Dialogs */}
      <Dialog
        open={isAddBookDialogOpen}
        onClose={() => setIsAddBookDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>Add New Book</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Author"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
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
              multiline
              rows={4}
              label="Description"
              value={newBook.description}
              onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Published Year"
              type="number"
              value={newBook.publishedYear}
              onChange={(e) => setNewBook({ ...newBook, publishedYear: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Page Count"
              type="number"
              value={newBook.pageCount}
              onChange={(e) => setNewBook({ ...newBook, pageCount: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddBookDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddBook} variant="contained">
            Add Book
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
                value={selectedUser.name}
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
              Are you sure you want to {userAction} user {selectedUser?.name}?
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