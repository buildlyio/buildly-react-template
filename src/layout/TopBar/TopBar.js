import React, { useState, useEffect } from 'react';
import { useTimezoneSelect, allTimezones } from 'react-timezone-select';
import _ from 'lodash';
import {
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Badge,
  Typography,
} from '@mui/material';
import {
  AccountCircle,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ArrowRight as ArrowRightIcon,
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
import { LANGUAGES } from '@utils/mock';
import OrganizationSelector from '@components/OrganizationSelector/OrganizationSelector';

const TopBar = ({
  navHidden,
  setNavHidden,
  history,
}) => {
  const user = getUser();
  const isAdmin = checkForAdmin(user);
  const isSuperAdmin = checkForGlobalAdmin(user);
  const org_uuid = user.organization.organization_uuid;

  const [anchorEl, setAnchorEl] = useState(null);
  const [settingEl, setSettingEl] = useState(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuOrg, setSubmenuOrg] = useState(null);
  const [organization, setOrganization] = useState(null);
  const { options: tzOptions } = useTimezoneSelect({ labelStyle: 'original', timezones: allTimezones });
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showWhatsNewModal, setShowWhatsNewModal] = useState(false);
  const [showWhatsNewSlider, setShowWhatsNewSlider] = useState(false);
  const [hideAlertBadge, setHideAlertBadge] = useState(true);
  const [showAlertNotifications, setShowAlertNotifications] = useState(false);
  const [custOrgs, setCustOrgs] = useState(null);
  const [displayOrgs, setDisplayOrgs] = useState(null);
  const [language, setLanguage] = useState(null);
  const [mainMenuOpen, setMainMenuOpen] = useState(false);

  const { displayAlert } = useAlert();
  const { data, setTimezone } = useStore();

  if (user) {
    if (!organization) {
      setOrganization(user.organization.name);
    }
    if (!language) {
      if (!_.isEmpty(user.user_language)) {
        setLanguage(user.user_language);
      } else {
        setLanguage('English');
      }
    }
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

  const { data: unitData, isLoading: isLoadingUnits } = useQuery(
    ['unit', org_uuid],
    () => getUnitQuery(org_uuid, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { data: versionNotesData, isLoading: isLoadingVersionNotes } = useQuery(
    ['versionNotes'],
    // eslint-disable-next-line no-undef
    () => getVersionNotesQuery(VERSION, displayAlert),
    { refetchOnWindowFocus: false },
  );

  const { mutate: updateUserMutation, isLoading: isUpdateUser } = useUpdateUserMutation(history, displayAlert);

  const setGoogleTrans = () => {
    // remove cookies
    document.cookie = 'googtrans=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    if (!_.isEqual(document.cookie.search('googtrans'), -1)) {
      // remove cookies
      document.cookie = 'googtrans=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'googtrans=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=.transparentpath.com';

      // set new googtrans cookies
      const googtransLng = document.cookie.split('googtrans')[1].split(';')[0].split('/')[2];
      const lng = LANGUAGES.find((item) => _.isEqual(item.value, googtransLng));
      if (user && lng && !_.isEqual(user.user_language, lng.label)) {
        const newLng = LANGUAGES.find((item) => _.isEqual(item.label, user.user_language));
        document.cookie = `googtrans=/auto/${newLng.value}; Path=/; Domain=${window.location.hostname}`;
        // eslint-disable-next-line no-alert
        alert('Detected language change. So need to reload the website. It might take a little while for this.');
        window.location.reload();
      }
    } else if (user && user.user_language) {
      const isReloaded = sessionStorage.getItem('isReloaded');
      const newLng = LANGUAGES.find((item) => _.isEqual(item.label, user.user_language));
      document.cookie = `googtrans=/auto/${newLng.value}; Path=/; Domain=${window.location.hostname}`;
      if (!isReloaded && !_.isEqual(user.user_language, 'English')) {
        sessionStorage.setItem('isReloaded', 'true');
        // eslint-disable-next-line no-alert
        alert('Detected language change. So need to reload the website. It might take a little while for this.');
        window.location.reload(true);
      }
    } else {
      document.cookie = `googtrans=/auto/en; Path=/; Domain=${window.location.hostname}`;
    }
  };

  useEffect(() => {
    setGoogleTrans();
  }, [language]);

  const handleOrganizationChange = (e) => {
    const organization_name = e.target ? e.target.value : e;
    if (!_.isEqual(organization, organization_name)) {
      setOrganization(organization_name);
      const adminOrgs = JSON.parse(localStorage.getItem('adminOrgs'));
      const { organization_uuid } = isSuperAdmin
        ? _.filter(orgData, (org) => _.isEqual(org.name, organization_name))[0]
        : _.filter(adminOrgs, (org) => _.isEqual(org.name, organization_name))[0];
      const updateData = {
        id: user.id,
        organization_uuid,
        organization_name,
      };
      updateUserMutation(updateData);
    }
    setMainMenuOpen(false);
    setSubmenuAnchorEl(null);
  };

  const handleLanguageChange = (e) => {
    const selected_language = e.target.value;
    if (!_.isEqual(language, selected_language)) {
      setLanguage(selected_language);
      const updateData = {
        id: user.id,
        organization_uuid: user.organization.organization_uuid,
        organization_name: user.organization.name,
        user_language: selected_language,
      };
      updateUserMutation(updateData);
    }
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
            id="language"
            label="Language"
            select
            value={language}
            onChange={handleLanguageChange}
          >
            {_.map(LANGUAGES, (item, index) => (
              <MenuItem key={`${item.value}-${index}`} value={item.label}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
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
          {(isSuperAdmin || isAdmin || (isAdmin && !_.isEmpty(JSON.parse(localStorage.getItem('adminOrgs'))))) && (
            <OrganizationSelector
              handleOrganizationChange={handleOrganizationChange}
              selectedOrg={organization}
              mainMenuOpen={mainMenuOpen}
              setMainMenuOpen={setMainMenuOpen}
              submenuAnchorEl={submenuAnchorEl}
              setSubmenuAnchorEl={setSubmenuAnchorEl}
            />
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
          {(isAdmin || isSuperAdmin)
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
