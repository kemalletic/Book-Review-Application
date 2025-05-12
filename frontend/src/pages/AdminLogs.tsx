import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  SelectChangeEvent,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Drawer,
  Fab,
  Zoom,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface LogEntry {
  id: number;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  category: 'system' | 'user' | 'security' | 'database';
  message: string;
  details?: string;
  userId?: number;
  username?: string;
  ipAddress?: string;
}

const AdminLogs: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Mock data - replace with actual API calls
  const logs: LogEntry[] = [
    {
      id: 1,
      timestamp: '2024-03-15 14:30:22',
      level: 'error',
      category: 'system',
      message: 'Database connection failed',
      details: 'Failed to connect to the primary database server. Retrying with backup...',
      ipAddress: '192.168.1.1',
    },
    {
      id: 2,
      timestamp: '2024-03-15 14:29:15',
      level: 'warning',
      category: 'security',
      message: 'Multiple failed login attempts',
      details: 'User account locked after 5 failed login attempts',
      userId: 123,
      username: 'john_doe',
      ipAddress: '192.168.1.2',
    },
    {
      id: 3,
      timestamp: '2024-03-15 14:28:45',
      level: 'info',
      category: 'user',
      message: 'User profile updated',
      userId: 456,
      username: 'jane_smith',
    },
    {
      id: 4,
      timestamp: '2024-03-15 14:27:30',
      level: 'error',
      category: 'database',
      message: 'Query timeout',
      details: 'Long-running query exceeded maximum execution time',
    },
  ];

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleLevelFilterChange = (event: SelectChangeEvent) => {
    setLevelFilter(event.target.value);
    setPage(0);
  };

  const handleCategoryFilterChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
    setPage(0);
  };

  const handleViewDetails = (log: LogEntry) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedLog(null);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'info':
        return <InfoIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.username && log.username.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  return (
    <>
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
              onClick={() => setIsFilterDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              System Logs
            </Typography>
            <IconButton color="inherit">
              <FilterListIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Filter Drawer for Mobile */}
      <Drawer
        anchor="left"
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        sx={{ display: { sm: 'none' } }}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setIsFilterDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            size="small"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Level</InputLabel>
            <Select
              value={levelFilter}
              label="Level"
              onChange={handleLevelFilterChange}
            >
              <MenuItem value="all">All Levels</MenuItem>
              <MenuItem value="error">Error</MenuItem>
              <MenuItem value="warning">Warning</MenuItem>
              <MenuItem value="info">Info</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={handleCategoryFilterChange}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="system">System</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="security">Security</MenuItem>
              <MenuItem value="database">Database</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Drawer>

      <Container 
        maxWidth="xl" 
        sx={{ 
          py: { xs: 2, sm: 4 },
          px: { xs: 1, sm: 2 }
        }}
      >
        <Box sx={{ 
          mb: { xs: 2, sm: 4 },
          display: { xs: 'none', sm: 'block' }
        }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            gutterBottom
          >
            System Logs
          </Typography>
          <Typography color="text.secondary">
            Monitor system activity, user actions, and error tracking
          </Typography>
        </Box>

        {/* Desktop Filters */}
        <Paper 
          sx={{ 
            mb: 3, 
            p: { xs: 1, sm: 2 },
            display: { xs: 'none', sm: 'block' }
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Level</InputLabel>
              <Select
                value={levelFilter}
                label="Level"
                onChange={handleLevelFilterChange}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="error">Error</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="info">Info</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={handleCategoryFilterChange}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="system">System</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="security">Security</MenuItem>
                <MenuItem value="database">Database</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title="Refresh logs">
              <IconButton>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* Mobile Log Cards */}
        {isMobile ? (
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            {filteredLogs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((log) => (
                <Card key={log.id} sx={{ mb: 2 }}>
                  <CardHeader
                    action={
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(log)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          icon={getLevelIcon(log.level)}
                          label={log.level}
                          color={getLevelColor(log.level)}
                          size="small"
                        />
                        <Chip
                          label={log.category}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    }
                    subheader={log.timestamp}
                  />
                  <CardContent>
                    <Typography variant="body2" gutterBottom>
                      {log.message}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {log.username && (
                        <Typography variant="caption" color="text.secondary">
                          User: {log.username}
                        </Typography>
                      )}
                      {log.ipAddress && (
                        <Typography variant="caption" color="text.secondary">
                          IP: {log.ipAddress}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            <TablePagination
              component="div"
              count={filteredLogs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Box>
        ) : (
          /* Desktop Table */
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getLevelIcon(log.level)}
                          label={log.level}
                          color={getLevelColor(log.level)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.category}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{log.message}</TableCell>
                      <TableCell>{log.username || '-'}</TableCell>
                      <TableCell>{log.ipAddress || '-'}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(log)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Log">
                          <IconButton size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredLogs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        )}

        {/* Log Details Dialog */}
        <Dialog
          open={isDetailsOpen}
          onClose={handleCloseDetails}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          {selectedLog && (
            <>
              <DialogTitle>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getLevelIcon(selectedLog.level)}
                    <Typography variant={isMobile ? "h6" : "h5"}>
                      Log Details
                    </Typography>
                  </Box>
                  <IconButton 
                    onClick={handleCloseDetails}
                    sx={{ display: { xs: 'block', sm: 'none' } }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Timestamp"
                      secondary={selectedLog.timestamp}
                      primaryTypographyProps={{
                        variant: 'subtitle2',
                        color: 'text.secondary'
                      }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      {getLevelIcon(selectedLog.level)}
                    </ListItemIcon>
                    <ListItemText
                      primary="Level"
                      secondary={
                        <Chip
                          label={selectedLog.level}
                          color={getLevelColor(selectedLog.level)}
                          size="small"
                        />
                      }
                      primaryTypographyProps={{
                        variant: 'subtitle2',
                        color: 'text.secondary'
                      }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Category"
                      secondary={
                        <Chip
                          label={selectedLog.category}
                          size="small"
                          variant="outlined"
                        />
                      }
                      primaryTypographyProps={{
                        variant: 'subtitle2',
                        color: 'text.secondary'
                      }}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Message"
                      secondary={selectedLog.message}
                      primaryTypographyProps={{
                        variant: 'subtitle2',
                        color: 'text.secondary'
                      }}
                    />
                  </ListItem>
                  {selectedLog.details && (
                    <>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Details"
                          secondary={selectedLog.details}
                          primaryTypographyProps={{
                            variant: 'subtitle2',
                            color: 'text.secondary'
                          }}
                        />
                      </ListItem>
                    </>
                  )}
                  {selectedLog.username && (
                    <>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="User"
                          secondary={`${selectedLog.username} (ID: ${selectedLog.userId})`}
                          primaryTypographyProps={{
                            variant: 'subtitle2',
                            color: 'text.secondary'
                          }}
                        />
                      </ListItem>
                    </>
                  )}
                  {selectedLog.ipAddress && (
                    <>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="IP Address"
                          secondary={selectedLog.ipAddress}
                          primaryTypographyProps={{
                            variant: 'subtitle2',
                            color: 'text.secondary'
                          }}
                        />
                      </ListItem>
                    </>
                  )}
                </List>
              </DialogContent>
              <DialogActions sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <Button onClick={handleCloseDetails}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Mobile FAB for Filters */}
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
              onClick={() => setIsFilterDrawerOpen(true)}
            >
              <FilterListIcon />
            </Fab>
          </Zoom>
        )}
      </Container>
    </>
  );
};

export default AdminLogs; 