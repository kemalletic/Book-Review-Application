import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Drawer,
  Fab,
  Zoom,
} from '@mui/material';
import {
  People as PeopleIcon,
  Book as BookIcon,
  Star as StarIcon,
  Comment as CommentIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Menu as MenuIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, color = 'primary.main' }) => (
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
              <TrendingUpIcon
                sx={{
                  color: trend >= 0 ? 'success.main' : 'error.main',
                  transform: trend < 0 ? 'rotate(180deg)' : 'none',
                }}
              />
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

const AdminAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Mock data - replace with actual API calls
  const metrics = {
    totalUsers: 1234,
    activeUsers: 789,
    totalBooks: 5678,
    totalReviews: 12345,
    userGrowth: 12,
    reviewGrowth: 8,
    bookGrowth: 5,
    engagementGrowth: 15,
  };

  const systemHealth = [
    { status: 'healthy', component: 'API Server', uptime: '99.9%' },
    { status: 'warning', component: 'Database', uptime: '98.5%' },
    { status: 'healthy', component: 'Cache', uptime: '99.7%' },
    { status: 'error', component: 'Email Service', uptime: '95.2%' },
  ];

  const recentActivity = [
    { type: 'user', action: 'New user registration', time: '2 minutes ago' },
    { type: 'review', action: 'New book review posted', time: '5 minutes ago' },
    { type: 'system', action: 'Database backup completed', time: '10 minutes ago' },
    { type: 'error', action: 'Failed login attempt', time: '15 minutes ago' },
  ];

  const chartData = [
    { name: 'Mon', users: 400, reviews: 240 },
    { name: 'Tue', users: 300, reviews: 139 },
    { name: 'Wed', users: 200, reviews: 980 },
    { name: 'Thu', users: 278, reviews: 390 },
    { name: 'Fri', users: 189, reviews: 480 },
    { name: 'Sat', users: 239, reviews: 380 },
    { name: 'Sun', users: 349, reviews: 430 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return null;
    }
  };

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
              Analytics
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
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
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
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: { xs: 2, sm: 4 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1"
          >
            Analytics Dashboard
          </Typography>
          <FormControl sx={{ 
            minWidth: { xs: '100%', sm: 120 },
            display: { xs: 'none', sm: 'block' }
          }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
              size="small"
            >
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Key Metrics */}
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Users"
              value={metrics.totalUsers}
              icon={<PeopleIcon />}
              trend={metrics.userGrowth}
              color="#2196f3"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Books"
              value={metrics.totalBooks}
              icon={<BookIcon />}
              trend={metrics.bookGrowth}
              color="#4caf50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Reviews"
              value={metrics.totalReviews}
              icon={<CommentIcon />}
              trend={metrics.reviewGrowth}
              color="#ff9800"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="User Engagement"
              value={`${metrics.activeUsers} active`}
              icon={<StarIcon />}
              trend={metrics.engagementGrowth}
              color="#9c27b0"
            />
          </Grid>

          {/* Activity Chart */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader
                title="User Activity"
                action={
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                }
                sx={{ 
                  '& .MuiCardHeader-title': {
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }
                }}
              />
              <CardContent>
                <Box sx={{ 
                  height: { xs: 250, sm: 300 },
                  width: '100%',
                  overflow: 'hidden'
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <YAxis 
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          fontSize: isMobile ? 12 : 14,
                          padding: isMobile ? 8 : 12
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#2196f3"
                        strokeWidth={isMobile ? 1.5 : 2}
                      />
                      <Line
                        type="monotone"
                        dataKey="reviews"
                        stroke="#4caf50"
                        strokeWidth={isMobile ? 1.5 : 2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* System Health */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader 
                title="System Health"
                sx={{ 
                  '& .MuiCardHeader-title': {
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }
                }}
              />
              <CardContent>
                <List>
                  {systemHealth.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ 
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 1, sm: 0 }
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          width: { xs: '100%', sm: 'auto' }
                        }}>
                          <ListItemIcon>{getStatusIcon(item.status)}</ListItemIcon>
                          <ListItemText
                            primary={item.component}
                            secondary={`Uptime: ${item.uptime}`}
                            primaryTypographyProps={{
                              fontSize: { xs: '0.9rem', sm: '1rem' }
                            }}
                            secondaryTypographyProps={{
                              fontSize: { xs: '0.8rem', sm: '0.875rem' }
                            }}
                          />
                        </Box>
                        <Chip
                          label={item.status}
                          color={
                            item.status === 'healthy'
                              ? 'success'
                              : item.status === 'warning'
                              ? 'warning'
                              : 'error'
                          }
                          size={isMobile ? "small" : "medium"}
                          sx={{ 
                            mt: { xs: 1, sm: 0 },
                            ml: { xs: 0, sm: 'auto' }
                          }}
                        />
                      </ListItem>
                      {index < systemHealth.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Card>
              <CardHeader 
                title="Recent Activity"
                sx={{ 
                  '& .MuiCardHeader-title': {
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }
                }}
              />
              <CardContent>
                <List>
                  {recentActivity.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ 
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 1, sm: 0 }
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          width: { xs: '100%', sm: 'auto' }
                        }}>
                          <ListItemIcon>
                            {activity.type === 'user' ? (
                              <PeopleIcon color="primary" />
                            ) : activity.type === 'review' ? (
                              <CommentIcon color="primary" />
                            ) : activity.type === 'system' ? (
                              <CheckCircleIcon color="success" />
                            ) : (
                              <ErrorIcon color="error" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={activity.action}
                            secondary={activity.time}
                            primaryTypographyProps={{
                              fontSize: { xs: '0.9rem', sm: '1rem' }
                            }}
                            secondaryTypographyProps={{
                              fontSize: { xs: '0.8rem', sm: '0.875rem' }
                            }}
                          />
                        </Box>
                      </ListItem>
                      {index < recentActivity.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

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

export default AdminAnalytics; 