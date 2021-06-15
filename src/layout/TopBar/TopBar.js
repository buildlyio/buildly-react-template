import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import _ from 'lodash';
import {
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Hidden,
  TextField,
  MenuItem,
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
  setTimezone,
} from '@redux/options/actions/options.actions';
import {
  getNewGateways,
} from '@redux/sensorsGateway/actions/sensorsGateway.actions';
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
    width: theme.spacing(20),
    marginTop: theme.spacing(1.5),
    '& .MuiOutlinedInput-input': {
      padding: theme.spacing(1, 3.5, 1, 2),
    },
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
  timezone,
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
    dispatch(getNewGateways());
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
          <TextField
            className={classes.timezone}
            variant="outlined"
            fullWidth
            id="timezone"
            label="Timezone"
            select
            value={timezone}
            onChange={(e) => dispatch(setTimezone(e.target.value))}
          >
            {_.map(moment.tz.names(), (name, index) => (
              <MenuItem key={`${name}-${index}`} value={name}>
                {name}
              </MenuItem>
            ))}
          </TextField>
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
