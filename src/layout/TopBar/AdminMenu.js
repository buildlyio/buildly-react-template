import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemText,
} from '@mui/material';
import './TopBarStyles.css';

const AdminMenu = ({
  settingEl,
  setSettingEl,
  handleUserManagementClick,
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
      className="topbarMenu"
    >
      <MenuItem onClick={handleUserManagementClick} className="topbarAdminMenuRoot">
        <ListItemText primary="User Management" />
      </MenuItem>
    </Menu>
  );
};

export default AdminMenu;
