import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import theme from './theme';
import { Typography, AppBar, Toolbar } from '@mui/material';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';  // Importing service worker registration

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AppBar position="static" style={{ backgroundColor: '#0075bc' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          AIDA Freediving Score Calculator
        </Typography>
      </Toolbar>
    </AppBar>
    <App />
  </ThemeProvider>
);

// Register the service worker for offline capability
serviceWorkerRegistration.register();