import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import {
  Box,
  Divider,
  Drawer,
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material';
import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { items } from './config';
import { SideNavItem } from './side-nav-item';

export const SideNav = (props) => {
  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%'
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral.400'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            component={NextLink}
            href="/"
            sx={{
              display: 'flex',
              // objectFit: 'contain',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto',
              height: 100,
              width: 100
            }}
          >
            <Logo sx={{ 
              height: '100%', 
              width: '100%' ,
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain'
            }}
            />
          </Box>
          <Box
            sx={{ mt: 3 }}
          >
            <div>
              <Typography
                color="inherit"
                variant="subtitle1"
                sx={{ 
                  textAlign: 'center', 
                  width: '100%' 
                }}
              >
                Gazotheque
              </Typography>
              <Typography
                color="rgb(198, 170, 88)"
                variant="body2"
                sx={{ 
                  textAlign: 'center', 
                  width: '100%' 
                }}
              >
                Stockage de bouteilles de gaz
              </Typography>
            </div>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'white' }} />

        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0
            }}
          >
            {items.map((item) => {
              const active = item.path ? (pathname === item.path) : false;

              return (
                <SideNavItem
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                />
              );
            })}
          </Stack>
        </Box>        
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            // backgroundColor: 'neutral.800',
            backgroundColor: 'rgb(1, 50, 32)',
            color: 'white',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          // backgroundColor: 'neutral.800',
          backgroundColor: 'rgb(1, 50, 32)',
          color: 'white',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};