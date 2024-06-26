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
  organizationName,
}) => {
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
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
      className="topbarMenu"
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
        {organizationName && (
          <Typography variant="body1">
            {`Works at: ${organizationName}`}
          </Typography>
        )}
      </Box>
      <Divider />
      <MenuItem onClick={handleLogoutClick} className="topbarAdminMenuRoot">
        <ListItemText primary="Logout" />
      </MenuItem>
    </Menu>
  );
};

export default AccountMenu;
