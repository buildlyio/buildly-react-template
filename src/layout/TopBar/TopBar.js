import React, { useState, useEffect } from 'react';
import { useTimezoneSelect, allTimezones } from 'react-timezone-select';
import _ from 'lodash';
import {
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  MenuItem,
  Badge,
} from '@mui/material';
import {
  AccountCircle,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import logo from '@assets/tp-logo.png';
import Loader from '@components/Loader/Loader';
import { getUser } from '@context/User.context';
import useAlert from '@hooks/useAlert';
import { oauthService } from '@modules/oauth/oauth.service';
import { routes } from '@routes/routesConstants';
import {
  checkForAdmin,
  checkForGlobalAdmin,
} from '@utils/utilMethods';
import { useStore } from '@zustand/timezone/timezoneStore';
import { useQuery } from 'react-query';
import { getAllOrganizationQuery } from '@react-query/queries/authUser/getAllOrganizationQuery';
import { useUpdateUserMutation } from '@react-query/mutations/authUser/updateUserMutation';
import { getUnitQuery } from '@react-query/queries/items/getUnitQuery';
import { getVersionNotesQuery } from '@react-query/queries/notifications/getVersionNotesQuery';
import AccountSettings from './components/AccountSettings';
import AlertNotifications from './components/AlertNotifications';
import WhatsNewModal from './components/WhatsNew/WhatsNewModal';
import WhatsNewSlider from './components/WhatsNew/WhatsNewSlider';
import AdminMenu from './AdminMenu';
import AccountMenu from './AccountMenu';
import './TopBarStyles.css';

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
  const [showWhatsNewModal, setShowWhatsNewModal] = useState(false);
  const [showWhatsNewSlider, setShowWhatsNewSlider] = useState(false);
  const [hideAlertBadge, setHideAlertBadge] = useState(true);
  const [showAlertNotifications, setShowAlertNotifications] = useState(false);

  const user = getUser();
  let isAdmin = false;
  let isSuperAdmin = false;
  let org_uuid = user.organization.organization_uuid;

  // eslint-disable-next-line no-undef
  const ver = VERSION;

  const { displayAlert } = useAlert();
  const { data, setTimezone } = useStore();

  if (user) {
    if (!organization) {
      setOrganization(user.organization.name);
    }
    isAdmin = checkForAdmin(user) || checkForGlobalAdmin(user);
    isSuperAdmin = checkForGlobalAdmin(user);
    org_uuid = user.organization.organization_uuid;
  }

  useEffect(() => {
    if (!_.isEmpty(localStorage.getItem('isWhatsNewShown'))) {
      setShowWhatsNewModal(false);
    } else {
      setShowWhatsNewModal(true);
    }
  }, []);

  const { data: orgData, isLoading: isLoadingOrgs } = useQuery(
    ['organizations'],
    () => getAllOrganizationQuery(displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { mutate: updateUserMutation, isLoading: isUpdateUser } = useUpdateUserMutation(history, displayAlert);

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', org_uuid],
    () => getUnitQuery(org_uuid, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: versionNotesData, isLoading: isLoadingVersionNotes } = useQuery(
    ['versionNotes'],
    () => getVersionNotesQuery(ver, displayAlert),
    { refetchOnWindowFocus: false },
  );

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

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountSettingsClick = () => {
    setShowAccountSettings(true);
    setAnchorEl(null);
  };

  const handleWhatsNewClick = () => {
    setShowWhatsNewSlider(true);
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

  const handleNotificationsClick = () => {
    setShowAlertNotifications(true);
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" className="topbarAppBar">
      {(isLoadingOrgs || isUpdateUser || isLoadingUnits || isLoadingVersionNotes) && <Loader open={isLoadingOrgs || isUpdateUser || isLoadingUnits || isLoadingVersionNotes} />}
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
            label="Time Zone"
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
              {_.map(
                _.filter(orgData, (org) => org.organization_type === 2),
                (org) => (
                  <MenuItem
                    key={`organization-${org.id}`}
                    value={org.name || ''}
                  >
                    {org.name}
                  </MenuItem>
                ),
              )}
            </TextField>
          )}
          <IconButton
            aria-label="notifications"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="primary"
            onClick={handleNotificationsClick}
          >
            <Badge color="error" overlap="circular" badgeContent=" " variant="dot" invisible={hideAlertBadge} className="topBarNotifications">
              <NotificationsIcon fontSize="large" />
            </Badge>
          </IconButton>
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
            handleWhatsNewClick={handleWhatsNewClick}
            handleAboutClick={handleAboutClick}
            handlePrivacyClick={handlePrivacyClick}
            handleLogoutClick={handleLogoutClick}
          />
        </div>
      </Toolbar>
      <AccountSettings open={showAccountSettings} setOpen={setShowAccountSettings} />
      <WhatsNewModal open={showWhatsNewModal} setOpen={setShowWhatsNewModal} data={versionNotesData} />
      <WhatsNewSlider open={showWhatsNewSlider} setOpen={setShowWhatsNewSlider} data={versionNotesData} />
      <AlertNotifications
        open={showAlertNotifications}
        setOpen={setShowAlertNotifications}
        setHideAlertBadge={setHideAlertBadge}
        history={history}
        timezone={data}
        unitOfMeasure={unitData}
      />
    </AppBar>
  );
};

export default TopBar;
