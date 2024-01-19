import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemText,
  Divider,
} from '@mui/material';
import './TopBarStyles.css';

const AdminMenu = ({
  settingEl,
  setSettingEl,
  handleUserManagementClick,
  handleAdminPanelClick,
}) => {
  const handleClose = () => {
    setSettingEl(null);
  };

  return (
    <Menu
      id="customized-admin"
      anchorEl={settingEl}
      keepMounted
      open={!!settingEl}
      onClose={handleClose}
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={handleAdminPanelClick} className="adminMenuRoot">
        <ListItemText primary="Admin Panel" />
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleUserManagementClick} className="adminMenuRoot">
        <ListItemText primary="User Management" />
      </MenuItem>
    </Menu>
  );
};

export default AdminMenu;
