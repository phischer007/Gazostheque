import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
  const auth = useAuth();
  const user  = auth.user;

  const handleSignOut = useCallback(
    () => {
      onClose?.();
      auth.signOut();
    },
    // [onClose, auth, router]
    [onClose, auth]
  );

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      {user ? 
      <Box
        sx={{
          py: 1.5,
          px: 2
        }}
      >
          <Typography variant="overline">
            Compte
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {user.first_name} {user.last_name}
          </Typography>
          <Typography
            color="text.secondary"
            variant="caption"
          >
            {user.role}
          </Typography>
        
      </Box> : null}

      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1
          }
        }}
      >
        <MenuItem onClick={handleSignOut}>
          Se déconnecter
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};
