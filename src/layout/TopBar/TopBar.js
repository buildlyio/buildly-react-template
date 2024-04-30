import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
} from '@mui/icons-material';
import logo from '@assets/buildly-logo.png';
import { oauthService } from '@modules/oauth/oauth.service';
import AccountMenu from './AccountMenu';
import './TopBarStyles.css';
import { getUser } from '@context/User.context';

const TopBar = ({
  navHidden,
  setNavHidden,
  history,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const user = getUser();

  const handleLogoutClick = () => {
    oauthService.logout();
    history.push('/');
  };

  return (
    <AppBar position="fixed" className="topbarAppBar">
      <Toolbar>
        <IconButton
          edge="start"
          className="topbarMenuButton"
          onClick={() => setNavHidden(!navHidden)}
          aria-label="menu"
          sx={{
            display: {
              xs: 'block',
              md: 'none',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
        <img
          src={logo}
          className="topbarLogo"
          alt="Company text logo"
        />
        <div className="topbarMenuRight">
          <AccountMenu
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            user={user}
            handleLogoutClick={handleLogoutClick}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
