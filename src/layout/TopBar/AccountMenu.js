import React from 'react';
import {
  withStyles,
  Menu,
  MenuItem,
  ListItemText,
  Typography,
  Divider,
  Box,
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
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
    padding: theme.spacing(2),
    textAlign: 'center',
  },
}))(MenuItem);

const AccountMenu = ({
  anchorEl,
  setAnchorEl,
  user,
  handleLogoutClick,
  handleMyAccountClick,
  organizationData,
}) => {
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
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
              {`Works at: ${organizationData.name}`}
            </Typography>
          )}
        </Box>

        <Divider />
        <StyledMenuItem onClick={handleMyAccountClick}>
          <ListItemText primary="My Account" />
        </StyledMenuItem>
        <Divider />
        <StyledMenuItem onClick={handleLogoutClick}>
          <ListItemText primary="Logout" />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
};

export default AccountMenu;
