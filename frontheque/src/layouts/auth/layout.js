import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { 
  Box, 
  Typography, 
  Unstable_Grid2 as Grid,
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl
} from '@mui/material';

import { Logo } from 'src/components/logo';

import { useState } from 'react';

// TODO: Change subtitle text

export const Layout = (props) => {
  const { children } = props;

  const [lab, setLab] = useState('');

  const handleLabChange = (event) => {
    setLab(event.target.value);
    // Optionally, save to user profile or local storage
    console.log('Laboratoire sélectionné :', event.target.value);
  };

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flex: '1 1 auto'
      }}
    >
      <Grid
        container
        sx={{ flex: '1 1 auto' }}
      >
        <Grid
          xs={12}
          lg={6}
          sx={{
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          <Box
            component="header"
            sx={{
              left: 0,
              p: 3,
              position: 'fixed',
              top: 0,
              width: '100%'
            }}
          >
            <Box
              component={NextLink}
              href="/"
              sx={{
                display: 'inline-flex',
                height: 32,
                width: 32
              }}
            >
              <Logo />
            </Box>
          </Box>
          {children}
        </Grid>
        <Grid
          xs={12}
          lg={6}
          sx={{
            alignItems: 'center',
            background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            '& img': {
              maxWidth: '100%'
            }
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              align="center"
              color="inherit"
              sx={{
                fontSize: '24px',
                lineHeight: '32px',
                mb: 1
              }}
              variant="h1"
            >
              Bienvenue{' '}
              <Box
                component="a"
                sx={{ color: '#15B79E' }}
                target="_blank"
              >
                Gazotheque
              </Box>
            </Typography>
            <Typography
              align="center"
              sx={{ mb: 3 }}
              variant="subtitle1"
            >
              Un local de stockage de bouteilles de gaz.
            </Typography>

            {/* Laboratoire selection par user */}
            
            <Box sx={{ minWidth: 120, mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="lab-select-label" 
                  sx={{ color: 'white' }}
                >
                  Laboratoire
                </InputLabel>
                <Select
                  labelId="lab-select-label"
                  id="lab-select"
                  value={lab}
                  label="Laboratoire"
                  onChange={handleLabChange}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white',
                    },
                  }}
                >
                  <MenuItem value="LIPhy">LIPhy</MenuItem>
                  <MenuItem value="IGE">IGE</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {lab && (
              <Typography
                align="center"
                sx={{ mb: 2 }}
                variant="body2"
              >
                Vous avez sélectionné: {lab}
              </Typography>
            )}


          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

Layout.prototypes = {
  children: PropTypes.node
};