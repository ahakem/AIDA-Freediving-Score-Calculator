import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import theme from './theme';
import PointsCalculator from './components/PointsCalculator';
// Import HomePage if needed later
// import HomePage from './components/HomePage';
import StartListTime from './components/StartListTime';
import Footer from './components/Footer';

function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="fixed" style={{ backgroundColor: '#0075bc' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              AIDA Freediving Score Calculator
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer open={drawerOpen} onClose={toggleDrawer}>
          <List>
            <ListItem button component="a" href="/points-calculator">
              <ListItemText primary="Points Calculator" />
            </ListItem>
            <ListItem button component="a" href="/start-list-time">
              <ListItemText primary="Start List Time" />
            </ListItem>
            {/* Hide Home page for now */}
          </List>
        </Drawer>

        <main style={{ flexGrow: 1, padding: '16px', marginTop: '64px' }}>
          <Routes>
            <Route path="/" element={<PointsCalculator />} />
            <Route path="/points-calculator" element={<PointsCalculator />} />
            <Route path="/start-list-time" element={<StartListTime />} />
            {/* <Route path="/home" element={<HomePage />} /> */} {/* Comment out the Home Page */}
          </Routes>
        </main>

        <Footer /> {/* Make footer globally visible */}
      </div>
    </ThemeProvider>
  );
}

export default App;