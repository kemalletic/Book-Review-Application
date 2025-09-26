import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useTheme,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Close as CloseIcon,
  AdminPanelSettings as AdminIcon,
  Home as HomeIcon,
  Book as BookIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import logo from '../assets/logo.svg';
import { ColorModeContext, useAuth } from '../App';
import { logout } from '../services/auth';

// Mock data for search results
const mockBooks = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction' },
  { id: 3, title: '1984', author: 'George Orwell', genre: 'Science Fiction' },
  { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance' },
  { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Fiction' },
];

const Navbar: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const colorMode = React.useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockBooks>([]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      // Filter books based on search query
      const results = mockBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          book.genre.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleBookSelect = (bookId: number) => {
    navigate(`/books/${bookId}`);
    handleSearchClose();
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUser(null);
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'primary.main',
              flexGrow: 1,
            }}
          >
            <img src={logo} alt="Logo" style={{ height: 32, marginRight: 8 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Book Review
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Search books">
              <IconButton 
                color="primary" 
                aria-label="search"
                onClick={handleSearchOpen}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={`Switch to ${theme.palette.mode === 'dark' ? 'light' : 'dark'} mode`}>
              <IconButton
                color="primary"
                onClick={colorMode.toggleColorMode}
                sx={{ ml: 1 }}
              >
                {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <Button
              color="primary"
              component={RouterLink}
              to="/books"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Browse Books
            </Button>

            {isLoggedIn ? (
              <>
                <IconButton
                  onClick={handleMenu}
                  color="primary"
                  aria-label="account menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {user?.name?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
                    Profile
                  </MenuItem>
                  {user?.role === 'ADMIN' && (
                    <MenuItem component={RouterLink} to="/admin" onClick={handleClose}>
                      <AdminIcon sx={{ mr: 1 }} />
                      Admin Dashboard
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  component={RouterLink}
                  to="/login"
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/register"
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Search Dialog */}
      <Dialog
        open={searchOpen}
        onClose={handleSearchClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            mt: 8,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Search Books</Typography>
            <IconButton onClick={handleSearchClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            placeholder="Search by title, author, or genre..."
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          {searchResults.length > 0 ? (
            <List>
              {searchResults.map((book, index) => (
                <React.Fragment key={book.id}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleBookSelect(book.id)}>
                      <ListItemText
                        primary={book.title}
                        secondary={`${book.author} • ${book.genre}`}
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < searchResults.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : searchQuery ? (
            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
              No books found
            </Typography>
          ) : null}
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};

export default Navbar; 