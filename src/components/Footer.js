// Footer.js
import React from 'react';
import { Box, Typography, Link } from '@mui/material';

function Footer() {
  return (
    <Box marginTop={5} padding={2} textAlign="center" borderTop="1px solid #ccc">
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} Ahmed (Hakim) Elkholy |{' '}
        <Link
          href="https://www.instagram.com/hakim_elkholy/"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          style={{ textDecoration: 'none' }}
        >
          Instagram
        </Link>{' '}
        |{' '}
        <Link
          href="https://www.aidainternational.org/Judges/JudgeProfile-dd623e5d-2871-4cdc-9d68-443c1a2092f8"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          style={{ textDecoration: 'none' }}
        >
          AIDA Profile
        </Link>
      </Typography>
    </Box>
  );
}

export default Footer;