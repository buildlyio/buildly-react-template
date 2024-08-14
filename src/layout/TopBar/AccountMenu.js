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
  handleAccountSettingsClick,
  handleWhatsNewClick,
  handleAboutClick,
  handlePrivacyClick,
  organizationName,
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
          {organizationName && (
            <Typography variant="body1">
              Works at:
              {' '}
              <span className="notranslate">{organizationName}</span>
            </Typography>
          )}
        </Box>
        <Divider />
        <MenuItem onClick={handleAccountSettingsClick} className="topbarAdminMenuRoot">
          <ListItemText primary="Account & Settings" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleWhatsNewClick} className="topbarAdminMenuRoot">
          <ListItemText primary="What's New?" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleAboutClick} className="topbarAdminMenuRoot">
          <ListItemText primary="About Platform" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handlePrivacyClick} className="topbarAdminMenuRoot">
          <ListItemText primary="Privacy Policy" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogoutClick} className="topbarAdminMenuRoot">
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default AccountMenu;
