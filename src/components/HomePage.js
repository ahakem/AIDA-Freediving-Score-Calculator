import React from 'react';
import { Box, Typography } from '@mui/material';

function HomePage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to AIDA Freediving Score Calculator
      </Typography>
      <Typography variant="body1">
        Use the menu to navigate to different features of the app.
      </Typography>
    </Box>
  );
}

export default HomePage;