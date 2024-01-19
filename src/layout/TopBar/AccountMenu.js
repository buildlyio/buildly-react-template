import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemText,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import './TopBarStyles.css';

const AccountMenu = ({
  anchorEl,
  setAnchorEl,
  user,
  handleLogoutClick,
  handleMyAccountClick,
  handleAboutClick,
  organizationData,
}) => {
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Menu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}
        elevation={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box
          mb={2}
          p={2}
          justifyContent="center"
          textAlign="center"
        >
          <Typography variant="h6">
            {user && `${user.first_name} ${user.last_name}`}
          </Typography>
          <Typography variant="body2">
            {user && `${user.email}`}
          </Typography>
          {organizationData && (
            <Typography variant="body1">
              {`Works at: ${organizationData}`}
            </Typography>
          )}
        </Box>
        <Divider />
        <MenuItem onClick={handleMyAccountClick} className="adminMenuRoot">
          <ListItemText primary="My Account" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleAboutClick} className="adminMenuRoot">
          <ListItemText primary="About Platform" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogoutClick} className="adminMenuRoot">
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default AccountMenu;
