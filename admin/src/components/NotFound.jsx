import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react';
import './NotFound.css';
export default function NotFound({ setCurrentPage }) {  // Receive setCurrentPage as a prop
  return (
    <Box 
      component="main" 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',  // Ensure full height
        padding: 3 
      }}
    >
      <Stack 
        spacing={3} 
        sx={{ 
          alignItems: 'center', 
          maxWidth: 'md', 
          textAlign: 'center'  // Centralize text alignment
        }}
      >
        <Box>
          <Box
            component="img"
            alt="404 Error - Page Not Found"
            src="/assets/error-404.png"  // Ensure this path is correct
            sx={{ 
              display: 'inline-block', 
              maxWidth: '100%', 
              width: '400px' 
            }}
          />
        </Box>
        <Typography variant="h3">
          404: The page you are looking for isn&apos;t here
        </Typography>
        <Typography color="text.secondary" variant="body1">
          You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation.
        </Typography>
        <Button
          onClick={() => setCurrentPage('Overview')}  // Update currentPage state to 'Overview'
          startIcon={<ArrowLeftIcon fontSize="inherit" />}
          variant="contained"
        >
          Go back to home
        </Button>
      </Stack>
    </Box>
  );
}
