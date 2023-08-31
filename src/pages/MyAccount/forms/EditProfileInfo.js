import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  Button,
  TextField,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
  Checkbox,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Loader from '../../../components/Loader/Loader';
import FormModal from '../../../components/Modal/FormModal';
import CustomizedTooltips from '../../../components/ToolTip/ToolTip';
import { useInput } from '../../../hooks/useInput';
import { updateUser } from '../../../redux/authuser/actions/authuser.actions';
import { setOptionsData } from '../../../utils/utilMethods';
import { validators } from '../../../utils/validators';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      width: '70%',
      margin: 'auto',
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    borderRadius: '18px',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  formTitle: {
    fontWeight: 'bold',
    marginTop: '1em',
    textAlign: 'center',
  },
  infoSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputWithTooltip: {
    display: 'flex',
    alignItems: 'center',
  },
  alertOptions: {
    marginBottom: theme.spacing(2),
  },
  alertTitle: {
    marginRight: theme.spacing(2),
  },
}));

const EditProfileInfo = ({
  dispatch,
  loading,
  editData,
  openFormModal,
  setFormModal,
  organizationData,
  userOptions,
  orgOptions,
}) => {
  const classes = useStyles();
  const [openConfirmModal, setConfirmModal] = useState(false);

  const first_name = useInput(
    (editData && editData.first_name) || '',
    { required: true },
  );
  const last_name = useInput((editData && editData.last_name) || '');
  const organisation_name = useInput(
    (organizationData && organizationData.name) || '',
  );
  const email = useInput((editData && editData.email) || '');
  const [pushOptions, setPushOptions] = useState(
    (editData && editData.push_preferences) || {
      geofence: false,
      environmental: false,
    },
  );
  const [emailOptions, setEmailOptions] = useState(
    (editData && editData.email_preferences) || {
      geofence: false,
      environmental: false,
    },
  );
  const [formError, setFormError] = useState({});

  const [fieldsMetadata, setFieldsMetaData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    organisation_name: '',
    push_preferences: '',
    email_preferences: '',
  });

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    const metadata = { ...fieldsMetadata };
    if (userOptions && userOptions.actions) {
      metadata.first_name = setOptionsData(
        userOptions.actions.POST,
        'first_name',
      );
      metadata.last_name = setOptionsData(
        userOptions.actions.POST,
        'last_name',
      );
      metadata.email = setOptionsData(
        userOptions.actions.POST,
        'email',
      );
      metadata.push_preferences = setOptionsData(
        userOptions.actions.POST,
        'push_preferences',
      );
      metadata.email_preferences = setOptionsData(
        userOptions.actions.POST,
        'email_preferences',
      );
    }
    if (orgOptions && orgOptions.actions) {
      metadata.organisation_name = setOptionsData(
        orgOptions.actions.POST,
        'name',
      );
    }
    setFieldsMetaData(metadata);
  }, [userOptions, orgOptions]);

  /**
   * Submit The form and add/edit custodian
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const editUserFormValue = {
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      username: editData.username,
      ...(organizationData && {
        organization_name: organisation_name.value,
      }),
      id: editData.id,
      ...(organizationData && {
        organization_uuid: organizationData.organization_uuid,
      }),
      push_preferences: pushOptions,
      email_preferences: emailOptions,
      user_timezone: moment.tz.guess(),
    };
    dispatch(updateUser(editUserFormValue, false));
    setFormModal(false);
  };

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */

  const handleBlur = (e, validation, input, parentId) => {
    const validateObj = validators(validation, input);
    const prevState = { ...formError };
    if (validateObj && validateObj.error) {
      setFormError({
        ...prevState,
        [e.target.id || parentId]: validateObj,
      });
    } else {
      setFormError({
        ...prevState,
        [e.target.id || parentId]: {
          error: false,
          message: '',
        },
      });
    }
  };

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);
    if (!first_name.value) {
      return true;
    }
    let errorExists = false;
    _.forEach(errorKeys, (key) => {
      if (formError[key].error) {
        errorExists = true;
      }
    });
    return errorExists;
  };

  const closeFormModal = () => {
    const dataHasChanged = (
      first_name.hasChanged()
      || last_name.hasChanged()
      || organisation_name.hasChanged()
      || email.hasChanged()
      || (pushOptions.geofence !== (
        (editData.push_preferences
          && editData.push_preferences.geofence
        ) || false
      )) || (pushOptions.environmental !== (
        (editData.push_preferences
          && editData.push_preferences.environmental
        ) || false
      )) || (emailOptions.geofence !== (
        (editData.email_preferences
          && editData.email_preferences.geofence
        ) || false
      )) || (emailOptions.environmental !== (
        (editData.email_preferences
          && editData.email_preferences.environmental
        ) || false
      ))
    );

    if (dataHasChanged) {
      setConfirmModal(true);
    } else {
      setFormModal(false);
    }
  };

  const discardFormData = () => {
    setConfirmModal(false);
    setFormModal(false);
  };

  return (
    <FormModal
      open={openFormModal}
      handleClose={closeFormModal}
      title="Edit Profile Info"
      titleClass={classes.formTitle}
      maxWidth="sm"
      openConfirmModal={openConfirmModal}
      setConfirmModal={setConfirmModal}
      handleConfirmModal={discardFormData}
    >
      {loading && <Loader open={loading} />}
      <form
        className={classes.form}
        noValidate
        onSubmit={handleSubmit}
      >
        <Grid container spacing={isDesktop ? 2 : 0}>
          <Grid className={classes.inputWithTooltip} item xs={12}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="first_name"
              label="First Name"
              name="first_name"
              autoComplete="first_name"
              error={
                formError.first_name
                && formError.first_name.error
              }
              helperText={
                formError.first_name
                  ? formError.first_name.message
                  : ''
              }
              onBlur={(e) => handleBlur(e, 'required', first_name)}
              {...first_name.bind}
            />
            {fieldsMetadata.first_name
            && fieldsMetadata.first_name.help_text
            && (
              <CustomizedTooltips
                toolTipText={
                  fieldsMetadata.first_name.help_text
                }
              />
            )}
          </Grid>
          <Grid className={classes.inputWithTooltip} item xs={12}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="last_name"
              label="Last Name"
              name="last_name"
              autoComplete="last_name"
              {...last_name.bind}
            />
            {fieldsMetadata.last_name
            && fieldsMetadata.last_name.help_text
            && (
              <CustomizedTooltips
                toolTipText={
                  fieldsMetadata.last_name.help_text
                }
              />
            )}
          </Grid>
        </Grid>
        <Grid container spacing={isDesktop ? 2 : 0}>
          <Grid className={classes.inputWithTooltip} item xs={12}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              type="email"
              error={formError.email && formError.email.error}
              helperText={
                formError.email
                  ? formError.email.message
                  : ''
              }
              onBlur={(e) => handleBlur(e, 'email', email)}
              {...email.bind}
            />
            {fieldsMetadata.email
            && fieldsMetadata.email.help_text
            && (
              <CustomizedTooltips
                toolTipText={
                  fieldsMetadata.email.help_text
                }
              />
            )}
          </Grid>
          {organizationData && (
            <Grid className={classes.inputWithTooltip} item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="organisation_name"
                label="Organization Name"
                name="organization_name"
                autoComplete="organisation_name"
                error={
                  formError.organisation_name
                  && formError.organisation_name.error
                }
                helperText={
                  formError.organisation_name
                    ? formError.organisation_name.message
                    : ''
                }
                {...organisation_name.bind}
              />
              {fieldsMetadata.organisation_name
              && fieldsMetadata.organisation_name.help_text
              && (
                <CustomizedTooltips
                  toolTipText={
                    fieldsMetadata.organisation_name.help_text
                  }
                />
              )}
            </Grid>
          )}
          <Grid item xs={12} className={classes.alertOptions}>
            <Typography
              className={classes.alertTitle}
              variant="subtitle1"
            >
              Push Notification Preferences
            </Typography>
            {fieldsMetadata.push_preferences
            && fieldsMetadata.push_preferences.help_text
            && (
              <CustomizedTooltips
                toolTipText={
                  fieldsMetadata.push_preferences.help_text
                }
              />
            )}
            <div className={classes.infoSection}>
              <Typography variant="body2">
                Geofence Notifications:
              </Typography>
              <Checkbox
                size="medium"
                color="primary"
                checked={pushOptions.geofence}
                onChange={(event) => setPushOptions({
                  ...pushOptions,
                  geofence: event.target.checked,
                })}
              />
            </div>
            <div className={classes.infoSection}>
              <Typography variant="body2">
                Environmental Notifications:
              </Typography>
              <Checkbox
                size="medium"
                color="primary"
                checked={pushOptions.environmental}
                onChange={(event) => setPushOptions({
                  ...pushOptions,
                  environmental: event.target.checked,
                })}
              />
            </div>
          </Grid>
          <Grid item xs={12} className={classes.alertOptions}>
            <Typography
              className={classes.alertTitle}
              variant="subtitle1"
            >
              Email Notification Preferences
            </Typography>
            {fieldsMetadata.email_preferences
            && fieldsMetadata.email_preferences.help_text
            && (
              <CustomizedTooltips
                toolTipText={
                  fieldsMetadata.email_preferences.help_text
                }
              />
            )}
            <div className={classes.infoSection}>
              <Typography variant="body2">
                Geofence Notifications:
              </Typography>
              <Checkbox
                size="medium"
                color="primary"
                checked={emailOptions.geofence}
                onChange={(event) => setEmailOptions({
                  ...emailOptions,
                  geofence: event.target.checked,
                })}
              />
            </div>
            <div className={classes.infoSection}>
              <Typography variant="body2">
                Environmental Notifications:
              </Typography>
              <Checkbox
                size="medium"
                color="primary"
                checked={emailOptions.environmental}
                onChange={(event) => setEmailOptions({
                  ...emailOptions,
                  environmental: event.target.checked,
                })}
              />
            </div>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={isDesktop ? 3 : 0}
          justifyContent="center"
        >
          <Grid item xs={12} sm={4}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading || submitDisabled()}
            >
              Save
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              color="primary"
              onClick={discardFormData}
              className={classes.submit}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormModal>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
  ...state.optionsReducer,
  loading: (
    state.authReducer.loading
    || state.optionsReducer.loading
  ),
});

export default connect(mapStateToProps)(EditProfileInfo);
