import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to request password reset
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Container 
        maxWidth="sm" 
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          py: { xs: 2, sm: 4 },
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 4 },
            width: '100%',
            borderRadius: { xs: 2, sm: 3 },
            textAlign: 'center',
          }}
        >
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              mb: { xs: 2, sm: 3 },
            }}
          >
            Check Your Email
          </Typography>
          <Typography 
            color="text.secondary" 
            paragraph
            variant={isMobile ? "body2" : "body1"}
            sx={{ mb: { xs: 3, sm: 4 } }}
          >
            We've sent password reset instructions to {email}
          </Typography>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            color="primary"
            size={isMobile ? "medium" : "large"}
            sx={{ 
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.5 },
              borderRadius: 2,
              textTransform: 'none',
              fontSize: { xs: '1rem', sm: '1.1rem' },
            }}
          >
            Return to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="sm" 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 2, sm: 4 },
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 4 },
          width: '100%',
          borderRadius: { xs: 2, sm: 3 },
        }}
      >
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            mb: { xs: 2, sm: 3 },
          }}
        >
          Forgot Password
        </Typography>
        <Typography 
          color="text.secondary" 
          align="center" 
          paragraph
          variant={isMobile ? "body2" : "body1"}
          sx={{ mb: { xs: 3, sm: 4 } }}
        >
          Enter your email address and we'll send you instructions to reset your password.
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{
            '& .MuiTextField-root': {
              mb: { xs: 1.5, sm: 2 },
            },
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            size={isMobile ? "small" : "medium"}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size={isMobile ? "medium" : "large"}
            disabled={isSubmitting || !email}
            sx={{ 
              mt: { xs: 2, sm: 3 }, 
              mb: { xs: 1.5, sm: 2 },
              py: { xs: 1, sm: 1.5 },
              borderRadius: 2,
              textTransform: 'none',
              fontSize: { xs: '1rem', sm: '1.1rem' },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Send Reset Instructions'
            )}
          </Button>
          <Box 
            sx={{ 
              textAlign: 'center',
              mt: { xs: 1, sm: 2 },
            }}
          >
            <Button
              component={RouterLink}
              to="/login"
              color="primary"
              disabled={isSubmitting}
              sx={{
                textTransform: 'none',
                fontSize: { xs: '0.9rem', sm: '1rem' },
              }}
            >
              Back to Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword; 