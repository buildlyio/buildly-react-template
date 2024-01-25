import React, { useState } from 'react';
import { useTimezoneSelect, allTimezones } from 'react-timezone-select';
import _ from 'lodash';
import {
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  AccountCircle,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import logo from '../../assets/tp-logo.png';
import Loader from '../../components/Loader/Loader';
import { routes } from '../../routes/routesConstants';
import {
  checkForAdmin,
  checkForGlobalAdmin,
} from '../../utils/utilMethods';
import AdminMenu from './AdminMenu';
import AccountMenu from './AccountMenu';
import useAlert from '@hooks/useAlert';
import { useStore } from '../../zustand/timezone/timezoneStore';
import { getUser } from '../../context/User.context';
import { useQuery } from 'react-query';
import { getAllOrganizationQuery } from '../../react-query/queries/authUser/getAllOrganizationQuery';
import { useUpdateUserMutation } from '../../react-query/mutations/authUser/updateUserMutation';
import { oauthService } from '@modules/oauth/oauth.service';
import AccountSettings from './components/AccountSettings';
import './TopBarStyles.css';

/**
 * Component for the top bar header.
 */
const TopBar = ({
  navHidden,
  setNavHidden,
  history,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [settingEl, setSettingEl] = useState(null);
  const [organization, setOrganization] = useState(null);
  const { options: tzOptions } = useTimezoneSelect({ labelStyle: 'original', timezones: allTimezones });
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  const user = getUser();
  let isAdmin = false;
  let isSuperAdmin = false;

  const { displayAlert } = useAlert();
  const { data, setTimezone } = useStore();

  if (user) {
    if (!organization) {
      setOrganization(user.organization.name);
    }
    isAdmin = checkForAdmin(user) || checkForGlobalAdmin(user);
    isSuperAdmin = checkForGlobalAdmin(user);
  }

  const { data: orgData, isLoading: isLoadingOrgs } = useQuery(
    ['organizations'],
    () => getAllOrganizationQuery(displayAlert),
  );

  const { mutate: updateUserMutation, isLoading: isUpdateUser } = useUpdateUserMutation(history, displayAlert);

  const handleOrganizationChange = (e) => {
    const organization_name = e.target.value;
    setOrganization(organization_name);
    const { organization_uuid } = _.filter(orgData, (org) => org.name === organization_name)[0];
    const updateData = {
      id: user.id,
      organization_uuid,
      organization_name,
    };
    updateUserMutation(updateData);
  };

  const settingMenu = (event) => {
    setSettingEl(event.currentTarget);
  };

  const handleAdminPanelClick = () => {
    history.push(`${routes.ADMIN_PANEL}/configuration`);
    setSettingEl(null);
  };

  const handleUserManagementClick = () => {
    history.push(`${routes.USER_MANAGEMENT}/current-users`);
    setSettingEl(null);
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountSettingsClick = () => {
    setShowAccountSettings(true);
    setAnchorEl(null);
  };

  const handleAboutClick = () => {
    history.push(routes.ABOUT_PLATFORM);
    setAnchorEl(null);
  };

  const handlePrivacyClick = () => {
    history.push(routes.PRIVACY_POLICY);
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    oauthService.logout();
    history.push('/');
  };

  return (
    <AppBar position="fixed" className="topbarAppBar">
      {(isLoadingOrgs || isUpdateUser) && <Loader open={isLoadingOrgs || isUpdateUser} />}
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
          <TextField
            className="topbarTimezone"
            variant="outlined"
            fullWidth
            id="timezone"
            label="Timezone"
            select
            value={data}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {_.map(tzOptions, (tzOption, index) => (
              <MenuItem key={`${tzOption.value}-${index}`} value={tzOption.value}>
                {tzOption.label}
              </MenuItem>
            ))}
          </TextField>
          {isSuperAdmin && (
            <TextField
              className="topbarTimezone"
              variant="outlined"
              fullWidth
              id="org"
              label="Organization"
              select
              value={organization}
              onChange={handleOrganizationChange}
            >
              {_.map(orgData, (org) => (
                <MenuItem
                  key={`organization-${org.id}`}
                  value={org.name || ''}
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
                color="primary"
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
          {isAdmin && (
            <IconButton
              aria-label="refresh-app"
              aria-controls="menu-appbar"
              aria-haspopup="false"
              onClick={refreshPage}
              color="primary"
            >
              <RefreshIcon fontSize="large" />
            </IconButton>
          )}
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="primary"
          >
            <AccountCircle fontSize="large" />
          </IconButton>
          <AccountMenu
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            user={user}
            organizationName={organization}
            handleAccountSettingsClick={handleAccountSettingsClick}
            handleAboutClick={handleAboutClick}
            handlePrivacyClick={handlePrivacyClick}
            handleLogoutClick={handleLogoutClick}
          />
        </div>
      </Toolbar>
      <AccountSettings open={showAccountSettings} setOpen={setShowAccountSettings} />
    </AppBar>
  );
};

export default TopBar;
