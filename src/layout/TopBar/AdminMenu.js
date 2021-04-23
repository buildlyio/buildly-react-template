import React from 'react';
import {
  withStyles,
  Menu,
  MenuItem,
  ListItemText,
  Divider,
} from '@material-ui/core';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
    padding: theme.spacing(2),
    textAlign: 'center',
  },
}))(MenuItem);

const AdminMenu = (props) => {
  const {
    settingEl,
    setSettingEl,
    handleUserManagementClick,
    handleAdminPanelClick,
  } = props;

  const handleClose = () => {
    setSettingEl(null);
  };

  return (
    <StyledMenu
      id="customized-admin"
      anchorEl={settingEl}
      keepMounted
      open={Boolean(settingEl)}
      onClose={handleClose}
    >
      <StyledMenuItem onClick={handleAdminPanelClick}>
        <ListItemText primary="Admin Panel" />
      </StyledMenuItem>
      <Divider />
      <StyledMenuItem onClick={handleUserManagementClick}>
        <ListItemText primary="User Management" />
      </StyledMenuItem>
    </StyledMenu>
  );
};

export default AdminMenu;
