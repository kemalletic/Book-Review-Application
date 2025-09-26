import React, { useState, useMemo, createContext, useContext, useEffect, Component, ErrorInfo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import axios from 'axios';
import { setupApiMonitoring } from './utils/apiMonitor';
import { getToken } from './services/auth';
import ProtectedRoute from './components/ProtectedRoute';

// Custom Error Boundary Component
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Create a context for theme mode
export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

// Create a context for authentication
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('App component mounted');
    try {
      // Set up axios globally with API monitoring
      setupApiMonitoring(axios);
      console.log('API monitoring setup complete');
    } catch (err) {
      console.error('Error setting up API monitoring:', err);
      setError(err as Error);
    }
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#2C3E50' : '#3498DB',
            light: mode === 'light' ? '#34495E' : '#5DADE2',
            dark: mode === 'light' ? '#1A252F' : '#2980B9',
          },
          secondary: {
            main: mode === 'light' ? '#E74C3C' : '#E67E22',
            light: mode === 'light' ? '#EC7063' : '#F39C12',
            dark: mode === 'light' ? '#C0392B' : '#D35400',
          },
          background: {
            default: mode === 'light' ? '#F5F6FA' : '#1A1A1A',
            paper: mode === 'light' ? '#FFFFFF' : '#2D2D2D',
          },
          text: {
            primary: mode === 'light' ? '#2C3E50' : '#ECF0F1',
            secondary: mode === 'light' ? '#7F8C8D' : '#BDC3C7',
          },
        },
        typography: {
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
          },
          h2: {
            fontWeight: 600,
          },
          h3: {
            fontWeight: 600,
          },
          h4: {
            fontWeight: 600,
          },
          h5: {
            fontWeight: 500,
          },
          h6: {
            fontWeight: 500,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: mode === 'light' 
                  ? '0 4px 6px rgba(0, 0, 0, 0.1)'
                  : '0 4px 6px rgba(0, 0, 0, 0.3)',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#FFFFFF' : '#2D2D2D',
                boxShadow: mode === 'light'
                  ? '0 2px 4px rgba(0, 0, 0, 0.1)'
                  : '0 2px 4px rgba(0, 0, 0, 0.3)',
              },
            },
          },
        },
      }),
    [mode]
  );

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Something went wrong</h1>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Navbar />
              <Routes>
                <Route path="/" element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <Home />
                  </React.Suspense>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/books" element={<ProtectedRoute><BookList /></ProtectedRoute>} />
                <Route path="/books/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
              </Routes>
            </Router>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </AuthContext.Provider>
    </ErrorBoundary>
  );
};

export default App; 