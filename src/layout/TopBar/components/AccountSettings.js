import React, { forwardRef, useState } from 'react';
import _ from 'lodash';
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Slide,
  Switch,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import profile from '@assets/profile.png';
import Loader from '@components/Loader/Loader';
import { getUser } from '@context/User.context';
import { useInput } from '@hooks/useInput';
import useAlert from '@hooks/useAlert';
import { useUpdateUserMutation } from 'react-query/mutations/authUser/updateUserMutation';
import { isTablet } from '@utils/mediaQuery';
import '../TopBarStyles.css';

const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

const AccountSettings = ({ open, setOpen }) => {
  const theme = useTheme();
  const user = getUser();
  const { displayAlert } = useAlert();
  const [geoOptions, setGeoOptions] = useState(user.geo_alert_preferences);
  const [envOptions, setEnvOptions] = useState(user.env_alert_preferences);
  const whatsAppNumber = useInput(user.whatsApp_number || '');

  const { mutate: updateUserMutation, isLoading: isUpdatingUser } = useUpdateUserMutation(null, displayAlert);

  const closeAccountSettings = () => {
    setGeoOptions(user.geo_alert_preferences);
    setEnvOptions(user.env_alert_preferences);
    whatsAppNumber.setValue(user.whatsApp_number || '');
    setOpen(false);
  };

  const submitDisabled = () => {
    if (
      (_.isEqual(geoOptions.email, user.geo_alert_preferences.email)
      && _.isEqual(geoOptions.sms, user.geo_alert_preferences.sms)
      && _.isEqual(geoOptions.whatsApp, user.geo_alert_preferences.whatsApp)
      && _.isEqual(envOptions.email, user.env_alert_preferences.email)
      && _.isEqual(envOptions.sms, user.env_alert_preferences.sms)
      && _.isEqual(envOptions.whatsApp, user.env_alert_preferences.whatsApp)
      && !whatsAppNumber.hasChanged())
      || (geoOptions.whatsApp && !whatsAppNumber.value)
      || (envOptions.whatsApp && !whatsAppNumber.value)
    ) {
      return true;
    }

    return false;
  };

  const handleUpdateSettings = () => {
    let userData = {
      id: user.id,
      organization_uuid: user.organization.organization_uuid,
      organization_name: user.organization.name,
      geo_alert_preferences: geoOptions,
      env_alert_preferences: envOptions,
    };

    if (whatsAppNumber.value) {
      userData = { ...userData, whatsApp_number: whatsAppNumber.value };
    }

    updateUserMutation(userData);
  };

  return (
    <Dialog
      open={open}
      onClose={closeAccountSettings}
      fullWidth
      fullScreen={isTablet()}
      aria-labelledby="account-settings"
      TransitionComponent={Transition}
      className="accountSettingsDialog"
    >
      {isUpdatingUser && <Loader open={isUpdatingUser} />}
      <DialogTitle sx={{ borderBottom: `${theme.spacing(0.5)} solid ${theme.palette.background.light}` }}>
        <IconButton sx={{ marginRight: theme.spacing(2) }} onClick={closeAccountSettings}>
          <CloseIcon fontSize="large" />
        </IconButton>
        Account and Settings
        <Button
          type="button"
          color="secondary"
          variant="contained"
          disabled={submitDisabled()}
          onClick={handleUpdateSettings}
          sx={{ float: 'right' }}
        >
          Update Settings
        </Button>
      </DialogTitle>

      <DialogContent className="accountSeetingsDialogContent">
        <Grid container display="flex" alignItems="center" className="accountSettingsUserIconName">
          <Avatar alt={user && `${user.first_name} ${user.last_name}`} src={profile} />
          <Typography ml={2} variant="h5" fontWeight={500}>{user && `${user.first_name} ${user.last_name}`}</Typography>
        </Grid>

        <Grid container spacing={2} className="accountSettingsPersonalNotification">
          <Grid item xs={12} mb={2}>
            <Typography variant="h5" fontWeight={500}>Personal Information</Typography>
            <Typography variant="caption">This information can only be changed by you account administrator</Typography>
          </Grid>

          <Grid item xs={6} sm={4}>
            <Typography variant="body1" fontWeight={500}>First Name:</Typography>
          </Grid>
          <Grid item xs={6} sm={8}>
            <Typography variant="body1" fontWeight={500}>{user && user.first_name}</Typography>
          </Grid>

          <Grid item xs={6} sm={4}>
            <Typography variant="body1" fontWeight={500}>Last Name:</Typography>
          </Grid>
          <Grid item xs={6} sm={8}>
            <Typography variant="body1" fontWeight={500}>{user && user.last_name}</Typography>
          </Grid>

          <Grid item xs={6} sm={4}>
            <Typography variant="body1" fontWeight={500}>Customer ID:</Typography>
          </Grid>
          <Grid item xs={6} sm={8}>
            <Typography variant="body1" fontWeight={500}>{user && user.core_user_uuid}</Typography>
          </Grid>

          <Grid item xs={6} sm={4}>
            <Typography variant="body1" fontWeight={500}>Company:</Typography>
          </Grid>
          <Grid item xs={6} sm={8}>
            <Typography variant="body1" fontWeight={500}>{user && user.organization && user.organization.name}</Typography>
          </Grid>

          <Grid item xs={6} sm={4}>
            <Typography variant="body1" fontWeight={500}>Email:</Typography>
          </Grid>
          <Grid item xs={6} sm={8}>
            <Typography variant="body1" fontWeight={500}>{user && user.email}</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} className="accountSettingsPersonalNotification">
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight={500}>Notification Preferences</Typography>
          </Grid>

          <Grid item xs={12} sx={{ paddingTop: `${theme.spacing(4)} !important` }}>
            <Typography variant="body1" fontWeight={700}>Shipment Status Change Alerts:</Typography>
            <Typography variant="caption">Enabling these alerts will send notifications of departure and arrival activity of your shipments.</Typography>
          </Grid>

          <Grid item xs={6} sm={4} alignSelf="center">
            <Typography variant="body1" fontWeight={500}>Email Alerts:</Typography>
          </Grid>
          <Grid item xs={6} sm={8} alignSelf="center">
            <FormControlLabel
              labelPlacement="end"
              label={geoOptions && geoOptions.email ? 'ON' : 'OFF'}
              control={<Switch checked={geoOptions && geoOptions.email} color="primary" onChange={(e) => setGeoOptions({ ...geoOptions, email: e.target.checked })} />}
            />
          </Grid>

          <Grid item xs={6} sm={4} alignSelf="center">
            <Typography variant="body1" fontWeight={500}>SMS text Alerts:</Typography>
          </Grid>
          <Grid item xs={6} sm={8} alignSelf="center">
            <FormControlLabel
              labelPlacement="end"
              label="Available in a future release"
              control={<Switch checked={false} color="primary" disabled onChange={(e) => setGeoOptions({ ...geoOptions, sms: e.target.checked })} />}
            />
          </Grid>

          <Grid item xs={6} sm={4} alignSelf="center">
            <Typography variant="body1" fontWeight={500}>WhatsApp Alerts:</Typography>
          </Grid>
          <Grid item xs={6} sm={8} alignSelf="center">
            <FormControlLabel
              labelPlacement="end"
              label={geoOptions && geoOptions.whatsApp ? 'ON' : 'OFF'}
              control={<Switch checked={geoOptions && geoOptions.whatsApp} color="primary" onChange={(e) => setGeoOptions({ ...geoOptions, whatsApp: e.target.checked })} />}
            />
          </Grid>

          <Grid item xs={12} sx={{ paddingTop: `${theme.spacing(8)} !important` }}>
            <Typography variant="body1" fontWeight={700}>Environmental Alerts:</Typography>
            <Typography variant="caption">
              Enabling these alerts will send notifications about excursions of your settings for
              temperature, humidity, shock, tilt, and light exposure of your shipments.
            </Typography>
          </Grid>

          <Grid item xs={6} sm={4} alignSelf="center">
            <Typography variant="body1" fontWeight={500}>Email Alerts:</Typography>
          </Grid>
          <Grid item xs={6} sm={8} alignSelf="center">
            <FormControlLabel
              labelPlacement="end"
              label={envOptions && envOptions.email ? 'ON' : 'OFF'}
              control={<Switch checked={envOptions && envOptions.email} color="primary" onChange={(e) => setEnvOptions({ ...envOptions, email: e.target.checked })} />}
            />
          </Grid>

          <Grid item xs={6} sm={4} alignSelf="center">
            <Typography variant="body1" fontWeight={500}>SMS text Alerts:</Typography>
          </Grid>
          <Grid item xs={6} sm={8} alignSelf="center">
            <FormControlLabel
              labelPlacement="end"
              label="Available in a future release"
              control={<Switch checked={false} color="primary" disabled onChange={(e) => setEnvOptions({ ...envOptions, sms: e.target.checked })} />}
            />
          </Grid>

          <Grid item xs={6} sm={4} alignSelf="center">
            <Typography variant="body1" fontWeight={500}>WhatsApp Alerts:</Typography>
          </Grid>
          <Grid item xs={6} sm={8} alignSelf="center">
            <FormControlLabel
              labelPlacement="end"
              label={envOptions && envOptions.whatsApp ? 'ON' : 'OFF'}
              control={<Switch checked={envOptions && envOptions.whatsApp} color="primary" onChange={(e) => setEnvOptions({ ...envOptions, whatsApp: e.target.checked })} />}
            />
          </Grid>

          {(geoOptions.whatsApp || envOptions.whatsApp) && (
            <Grid item xs={12} mt={2}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                type="number"
                className="accountSettingsNumberInput"
                id="whatsapp-number"
                name="whatsapp-number"
                label="Send WhatsApp alerts on"
                {...whatsAppNumber.bind}
                helperText="Additional charges may apply"
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettings;
