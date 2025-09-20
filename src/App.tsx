import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EnergyDashboard } from './presentation/components/Dashboard/EnergyDashboard';
import './App.css';

// Clean Architecture implementation with Material-UI theme
const energyTheme = createTheme({
  palette: {
    mode: import.meta.env.VITE_THEME === 'dark' ? 'dark' : 'light',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
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
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={energyTheme}>
      <CssBaseline />
      <ErrorBoundary>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <EnergyDashboard />
        </Box>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;