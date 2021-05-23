import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Hidden,
  Typography,
  Switch,
} from '@material-ui/core';
import {
  AccountCircle,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
} from '@material-ui/icons';
import logo from '@assets/tp-logo.png';
import {
  logout,
  getUser,
} from '@redux/authuser/actions/authuser.actions';
import {
  getUserOptions,
  getOrganizationOptions,
  showUTCTime,
  showLocaleTime,
} from '@redux/options/actions/options.actions';
import { routes } from '@routes/routesConstants';
import {
  checkForAdmin,
  checkForGlobalAdmin,
} from '@utils/utilMethods';
import AdminMenu from './AdminMenu';
import AccountMenu from './AccountMenu';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#383636',
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  logo: {
    maxWidth: 250,
  },
  menuRight: {
    marginLeft: 'auto',
    display: 'flex',
  },
  timezone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

/**
 * Component for the top bar header.
 */
const TopBar = ({
  navHidden,
  setNavHidden,
  history,
  dispatch,
  data,
  organizationData,
  userOptions,
  orgOptions,
  showUTC,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [settingEl, setSettingEl] = useState(null);

  let user;
  let isAdmin = false;

  if (data && data.data) {
    user = data.data;
    isAdmin = checkForAdmin(user) || checkForGlobalAdmin(user);
  }

  useEffect(() => {
    dispatch(getUser());
    if (userOptions === null) {
      dispatch(getUserOptions());
    }
    if (orgOptions === null) {
      dispatch(getOrganizationOptions());
    }
  }, []);

  const settingMenu = (event) => {
    setSettingEl(event.currentTarget);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const handleLogoutClick = () => {
    dispatch(logout());
    history.push('/');
  };

  const handleMyAccountClick = () => {
    history.push(routes.MY_ACCOUNT);
    setAnchorEl(null);
  };

  const handleAdminPanelClick = () => {
    history.push(routes.ADMIN_PANEL);
    setSettingEl(null);
  };

  const handleUserManagementClick = () => {
    history.push(routes.USER_MANAGEMENT);
    setSettingEl(null);
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Hidden mdUp>
          <IconButton
            edge="start"
            className={classes.menuButton}
            onClick={() => setNavHidden(!navHidden)}
            color="default"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <img
          src={logo}
          className={classes.logo}
          alt="Company text logo"
        />

        <div className={classes.menuRight}>
          <div className={classes.timezone}>
            <Typography color="textPrimary" variant="caption">
              Show UTC Time
            </Typography>
            <Switch
              checked={showUTC}
              onChange={(e) => (
                e.target.checked
                  ? dispatch(showUTCTime())
                  : dispatch(showLocaleTime())
              )}
              color="primary"
            />
          </div>
          {isAdmin
          && (
          <IconButton
            aria-label="admin section"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={settingMenu}
            color="default"
          >
            <SettingsIcon fontSize="large" />
          </IconButton>
          )}
          <AdminMenu
            settingEl={settingEl}
            setSettingEl={setSettingEl}
            handleAdminPanelClick={handleAdminPanelClick}
            handleUserManagementClick={handleUserManagementClick}
          />
          <IconButton
            aria-label="refresh-app"
            aria-controls="menu-appbar"
            aria-haspopup="false"
            onClick={refreshPage}
            color="default"
          >
            <RefreshIcon fontSize="large" />
          </IconButton>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="default"
          >
            <AccountCircle fontSize="large" />
          </IconButton>
          <AccountMenu
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            user={user}
            organizationData={organizationData}
            handleLogoutClick={handleLogoutClick}
            handleMyAccountClick={handleMyAccountClick}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
  ...state.optionsReducer,
});

export default connect(mapStateToProps)(TopBar);
