import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import _ from 'lodash';
import {
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  AccountCircle,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import logo from '@assets/tp-logo.png';
import {
  logout,
  getUser,
  loadAllOrgs,
  updateUser,
} from '../../redux/authuser/actions/authuser.actions';
import {
  getUserOptions,
  getOrganizationOptions,
  setTimezone,
} from '../../redux/options/actions/options.actions';
import {
  getNewGateways,
} from '../../redux/sensorsGateway/actions/sensorsGateway.actions';
import { routes } from '../../routes/routesConstants';
import {
  checkForAdmin,
  checkForGlobalAdmin,
} from '../../utils/utilMethods';
import Loader from '../../components/Loader/Loader';
import AdminMenu from './AdminMenu';
import AccountMenu from './AccountMenu';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.dark,
    zIndex: theme.zIndex.drawer + 1,
    [theme.breakpoints.down('sm')]: {
      overflowX: 'auto',
    },
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
    width: theme.spacing(24),
    marginTop: theme.spacing(1.5),
    marginLeft: theme.spacing(1.5),
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
  allOrgs,
  loading,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [settingEl, setSettingEl] = useState(null);
  const [organization, setOrganization] = useState(null);

  let user;
  let isAdmin = false;
  let isSuperAdmin = false;

  if (data && data.data) {
    user = data.data;
    if (!organization) {
      setOrganization(user.organization.name);
    }
    isAdmin = checkForAdmin(user) || checkForGlobalAdmin(user);
    isSuperAdmin = checkForGlobalAdmin(user);
  }

  useEffect(() => {
    dispatch(getUser());
    if (!allOrgs) {
      dispatch(loadAllOrgs());
    }
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
    history.push(`${routes.ADMIN_PANEL}/configuration`);
    setSettingEl(null);
  };

  const handleUserManagementClick = () => {
    history.push(`${routes.USER_MANAGEMENT}/current-users`);
    setSettingEl(null);
  };

  const handleOrganizationChange = (e) => {
    const organization_name = e.target.value;
    setOrganization(organization_name);
    const { organization_uuid } = _.filter(allOrgs, (org) => org.name === organization_name)[0];
    dispatch(updateUser({
      id: user.id,
      organization_uuid,
      organization_name,
    }, true));
    history.push(routes.SHIPMENT);
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      {loading && <Loader open={loading} />}
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          onClick={() => setNavHidden(!navHidden)}
          color="default"
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
          {isSuperAdmin && (
            <TextField
              className={classes.timezone}
              variant="outlined"
              fullWidth
              id="org"
              label="Organization"
              select
              value={organization}
              onChange={handleOrganizationChange}
            >
              {_.map(allOrgs, (org) => (
                <MenuItem
                  key={`organization-${org.id}`}
                  value={org.name}
                >
                  {org.name}
                </MenuItem>
              ))}
            </TextField>
          )}
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
