import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import _ from 'lodash';
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  MenuItem,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import logo from '../../assets/tp-logo.png';
import Copyright from '../../components/Copyright/Copyright';
import Loader from '../../components/Loader/Loader';
import { useInput } from '../../hooks/useInput';
import {
  register,
  loadOrgNames,
} from '../../redux/authuser/actions/authuser.actions';
import { getCountries, getCurrencies } from '../../redux/shipment/actions/shipment.actions';
import { routes } from '../../routes/routesConstants';
import { isMobile } from '../../utils/mediaQuery';
import {
  DATE_DISPLAY_CHOICES,
  TIME_DISPLAY_CHOICES,
  UOM_DISTANCE_CHOICES,
  UOM_TEMPERATURE_CHOICES,
  UOM_WEIGHT_CHOICES,
} from '../../utils/mock';
import { validators } from '../../utils/validators';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(8),
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  logo: {
    maxWidth: '20rem',
    width: '100%',
    marginBottom: theme.spacing(3),
  },
  textField: {
    minHeight: '5rem',
    margin: theme.spacing(1, 0),
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  alertGrid: {
    marginTop: theme.spacing(2),
  },
  alertOptionsLabel: {
    fontSize: '1rem',
  },
  alertOptions: {
    marginLeft: theme.spacing(5),
  },
}));

const Register = ({
  dispatch, loading, history, orgNames, countries, currencies,
}) => {
  const classes = useStyles();
  const email = useInput('', { required: true });
  const username = useInput('', { required: true });
  const password = useInput('', { required: true });
  const re_password = useInput('', {
    required: true,
    confirm: true,
    matchField: password,
  });
  const organization_name = useInput('', { required: true });
  const organization_abbrevation = useInput('', { required: true });
  const first_name = useInput('', { required: true });
  const last_name = useInput('');
  const [pushOptions, setPushOptions] = useState({
    geofence: false,
    environmental: false,
  });
  const [emailOptions, setEmailOptions] = useState({
    geofence: false,
    environmental: false,
  });
  const country = useInput('United States', { required: true });
  const currency = useInput('USD', { required: true });
  const dateFormat = useInput('MMM DD, YYYY', { required: true });
  const timeFormat = useInput('hh:mm:ss A', { required: true });
  const distance = useInput('Miles', { required: true });
  const temp = useInput('Fahrenheit', { required: true });
  const weight = useInput('Pounds', { required: true });
  const [countryList, setCountryList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [formError, setFormError] = useState({});

  useEffect(() => {
    if (_.isEmpty(orgNames)) {
      dispatch(loadOrgNames());
    }
    if (_.isEmpty(countries)) {
      dispatch(getCountries());
    }
    if (_.isEmpty(currencies)) {
      dispatch(getCurrencies());
    }
  }, []);

  useEffect(() => {
    if (!_.isEmpty(countries)) {
      setCountryList(_.sortBy(_.without(_.uniq(_.map(countries, 'country')), [''])));
    }
  }, [countries]);

  useEffect(() => {
    if (!_.isEmpty(currencies)) {
      setCurrencyList(_.sortBy(_.without(_.uniq(_.map(currencies, 'currency')), [''])));
    }
  }, [currencies]);

  /**
   * Submit the form to the backend and attempts to authenticate
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    location.register = true;
    let registerFormValue = {
      username: username.value,
      email: email.value,
      password: password.value,
      organization_name: organization_name.value,
      first_name: first_name.value,
      last_name: last_name.value,
      push_preferences: pushOptions,
      email_preferences: emailOptions,
      user_timezone: moment.tz.guess(),
    };
    if (organization_name.value && !_.includes(orgNames, organization_name.value)) {
      registerFormValue = {
        ...registerFormValue,
        organization_abbrevation: _.toUpper(organization_abbrevation.value),
        country: country.value,
        currency: currency.value,
        date_format: dateFormat.value,
        time_format: timeFormat.value,
        distance: distance.value,
        temperature: temp.value,
        weight: weight.value,
      };
    }
    dispatch(register(registerFormValue, history));
  };

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */

  const handleBlur = (e, validation, input) => {
    const validateObj = validators(validation, input);
    const prevState = { ...formError };
    if (validateObj && validateObj.error) {
      setFormError({
        ...prevState,
        [e.target.id]: validateObj,
      });
    } else {
      setFormError({
        ...prevState,
        [e.target.id]: {
          error: false,
          message: '',
        },
      });
    }
  };

  const submitDisabled = () => {
    const errorKeys = Object.keys(formError);

    if (
      !username.value
      || !password.value
      || !email.value
      || !re_password.value
      || !organization_name.value
      || !first_name.value
      || (organization_name.value && !_.includes(orgNames, organization_name.value)
        && (!country.value || !currency.value || !dateFormat.value || !timeFormat.value
          || !distance.value || !temp.value || !weight.value || !organization_abbrevation.value))
    ) {
      return true;
    }
    let errorExists = false;
    errorKeys.forEach((key) => {
      if (formError[key].error) {
        errorExists = true;
      }
    });
    return errorExists;
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      className={classes.container}
    >
      {loading && <Loader open={loading} />}
      <CssBaseline />
      <Card variant="outlined">
        <CardContent>
          <div className={classes.paper}>
            <img
              src={logo}
              className={classes.logo}
              alt="Company logo"
            />
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <form
              className={classes.form}
              noValidate
              onSubmit={handleSubmit}
            >
              <Grid container spacing={isMobile() ? 0 : 3}>
                <Grid item xs={12} md={6}>
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
                    className={classes.textField}
                    onBlur={(e) => handleBlur(e, 'required', first_name)}
                    {...first_name.bind}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="last_name"
                    label="Last Name"
                    name="last_name"
                    autoComplete="last_name"
                    error={
                      formError.last_name
                      && formError.last_name.error
                    }
                    helperText={
                      formError.last_name
                        ? formError.last_name.message
                        : ''
                    }
                    className={classes.textField}
                    onBlur={(e) => handleBlur(e)}
                    {...last_name.bind}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={isMobile() ? 0 : 3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    error={
                      formError.username
                      && formError.username.error
                    }
                    helperText={
                      formError.username
                        ? formError.username.message
                        : ''
                    }
                    className={classes.textField}
                    onBlur={(e) => handleBlur(e, 'required', username)}
                    {...username.bind}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    type="email"
                    error={
                      formError.email
                      && formError.email.error
                    }
                    helperText={
                      formError.email
                        ? formError.email.message
                        : ''
                    }
                    className={classes.textField}
                    onBlur={(e) => handleBlur(e, 'email', email)}
                    {...email.bind}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={isMobile() ? 0 : 3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    error={
                      formError.password
                      && formError.password.error
                    }
                    helperText={
                      formError.password
                        ? formError.password.message
                        : ''
                    }
                    className={classes.textField}
                    onBlur={(e) => handleBlur(e, 'required', password)}
                    {...password.bind}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="re_password"
                    label="Confirm Password"
                    name="re_password"
                    type="password"
                    autoComplete="re_password"
                    error={
                      formError.re_password
                      && formError.re_password.error
                    }
                    helperText={
                      formError.re_password
                        ? formError.re_password.message
                        : ''
                    }
                    className={classes.textField}
                    onBlur={(e) => handleBlur(e, 'confirm', re_password)}
                    {...re_password.bind}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={isMobile() ? 0 : 3}>
                <Grid item xs={12}>
                  <Autocomplete
                    freeSolo
                    disableClearable
                    id="organization_name"
                    name="organization_name"
                    options={orgNames || []}
                    onChange={(e, newValue) => {
                      organization_name.setValue(newValue || '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Organization Name"
                        autoComplete="organization_name"
                        error={
                          formError.organization_name
                          && formError.organization_name.error
                        }
                        helperText={
                          formError.organization_name
                            ? formError.organization_name.message
                            : ''
                        }
                        className={classes.textField}
                        onBlur={(e) => handleBlur(e, 'required', organization_name)}
                        value={organization_name}
                        onChange={(e) => {
                          organization_name.setValue(e.target.value);
                          organization_abbrevation.setValue(e.target.value.replace(/[^A-Z0-9]/g, ''));
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                spacing={isMobile() ? 0 : 3}
                style={{
                  display: (!organization_name.value || _.includes(orgNames, organization_name.value)) && 'none',
                }}
              >
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="organization_abbrevation"
                    label="Organization Abbreviation"
                    name="organization_abbrevation"
                    autoComplete="organization_abbrevation"
                    error={
                      formError.organization_abbrevation
                      && formError.organization_abbrevation.error
                    }
                    helperText={
                      formError.organization_abbrevation
                        ? formError.organization_abbrevation.message
                        : ''
                    }
                    inputProps={{
                      maxLength: 7,
                      style: { textTransform: 'uppercase' },
                    }}
                    onBlur={(e) => handleBlur(e, 'required', organization_abbrevation)}
                    {...organization_abbrevation.bind}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    select
                    id="country"
                    name="country"
                    label="Default Country"
                    autoComplete="country"
                    value={country.value}
                    onChange={(e) => {
                      const curr = _.find(currencies, {
                        country: _.find(countries, { country: e.target.value })
                          ? _.find(countries, { country: e.target.value }).iso3
                          : '',
                      });
                      currency.setValue(curr ? curr.currency : '');
                      country.setValue(e.target.value);
                    }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {countryList && _.map(countryList, (cntry, index) => (
                      <MenuItem
                        key={`country-${index}-${cntry}`}
                        value={cntry}
                      >
                        {cntry}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    select
                    id="currency"
                    name="currency"
                    label="Default Currency"
                    autoComplete="currency"
                    {...currency.bind}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {currencyList && _.map(currencyList, (curr, index) => (
                      <MenuItem
                        key={`currency-${index}-${curr}`}
                        value={curr}
                      >
                        {curr}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    select
                    id="date-format"
                    name="date-format"
                    label="Default Date Format"
                    autoComplete="date-format"
                    {...dateFormat.bind}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {_.map(DATE_DISPLAY_CHOICES, (date, index) => (
                      <MenuItem
                        key={`date-${index}-${date.label}`}
                        value={date.value}
                      >
                        {date.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    select
                    id="time-format"
                    name="time-format"
                    label="Default Time Format"
                    autoComplete="time-format"
                    {...timeFormat.bind}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {_.map(TIME_DISPLAY_CHOICES, (time, index) => (
                      <MenuItem
                        key={`time-${index}-${time.label}`}
                        value={time.value}
                      >
                        {time.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    select
                    id="distance"
                    name="distance"
                    label="Default Unit of Measure for Distance"
                    autoComplete="distance"
                    {...distance.bind}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {_.map(UOM_DISTANCE_CHOICES, (dist, index) => (
                      <MenuItem
                        key={`distance-${index}-${dist}`}
                        value={dist}
                      >
                        {dist}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    select
                    id="temp"
                    name="temp"
                    label="Default Unit of Measure for Temperature"
                    autoComplete="temp"
                    {...temp.bind}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {_.map(UOM_TEMPERATURE_CHOICES, (tmp, index) => (
                      <MenuItem
                        key={`temperature-${index}-${tmp}`}
                        value={tmp}
                      >
                        {tmp}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    select
                    id="weight"
                    name="weight"
                    label="Default Unit of Measure for Weight"
                    autoComplete="weight"
                    {...weight.bind}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {_.map(UOM_WEIGHT_CHOICES, (wgt, index) => (
                      <MenuItem
                        key={`weight-${index}-${wgt}`}
                        value={wgt}
                      >
                        {wgt}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Grid
                container
                spacing={isMobile() ? 0 : 3}
                mt={(!organization_name.value || _.includes(orgNames, organization_name.value))
                  && -2}
              >
                <Grid item xs={12}>
                  <span className={classes.alertOptionsLabel}>
                    Push Notification Preference
                  </span>
                  <div className={classes.alertOptions}>
                    <FormControl component="fieldset">
                      <FormGroup aria-label="position" row={false}>
                        <FormControlLabel
                          control={(
                            <Checkbox
                              size="medium"
                              color="primary"
                              checked={pushOptions.geofence}
                              onChange={(e) => setPushOptions({
                                ...pushOptions,
                                geofence: e.target.checked,
                              })}
                            />
                          )}
                          label="GeoFence Notifications"
                          labelPlacement="end"
                        />
                        <FormControlLabel
                          control={(
                            <Checkbox
                              size="medium"
                              color="primary"
                              checked={pushOptions.environmental}
                              onChange={(e) => setPushOptions({
                                ...pushOptions,
                                environmental: e.target.checked,
                              })}
                            />
                          )}
                          label="Environmental Notifications"
                          labelPlacement="end"
                        />
                      </FormGroup>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} className={classes.alertGrid}>
                  <span className={classes.alertOptionsLabel}>
                    Email Notification Preference
                  </span>
                  <div className={classes.alertOptions}>
                    <FormControl component="fieldset">
                      <FormGroup aria-label="position" row={false}>
                        <FormControlLabel
                          control={(
                            <Checkbox
                              size="medium"
                              color="primary"
                              checked={emailOptions.geofence}
                              onChange={(e) => setEmailOptions({
                                ...emailOptions,
                                geofence: e.target.checked,
                              })}
                            />
                          )}
                          label="GeoFence Notifications"
                          labelPlacement="end"
                        />
                        <FormControlLabel
                          control={(
                            <Checkbox
                              size="medium"
                              color="primary"
                              checked={emailOptions.environmental}
                              onChange={(e) => setEmailOptions({
                                ...emailOptions,
                                environmental: e.target.checked,
                              })}
                            />
                          )}
                          label="Environmental Notifications"
                          labelPlacement="end"
                        />
                      </FormGroup>
                    </FormControl>
                  </div>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={loading || submitDisabled()}
              >
                Register
              </Button>
              <Grid container>
                <Grid item>
                  <Link
                    href={routes.LOGIN}
                    variant="body2"
                    color="primary"
                  >
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </CardContent>
      </Card>
      <Box mt={8} mb={1}>
        <Copyright />
      </Box>
    </Container>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
  ...state.shipmentReducer,
  loading: state.authReducer.loading || state.shipmentReducer.loading,
});

export default connect(mapStateToProps)(Register);
