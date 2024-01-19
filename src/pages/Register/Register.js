import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';
import {
  Button,
  CssBaseline,
  TextField,
  Link,
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
import logo from '../../assets/tp-logo.png';
import Copyright from '../../components/Copyright/Copyright';
import Loader from '../../components/Loader/Loader';
import { useInput } from '../../hooks/useInput';
import { routes } from '../../routes/routesConstants';
import { isTablet } from '../../utils/mediaQuery';
import {
  DATE_DISPLAY_CHOICES,
  TIME_DISPLAY_CHOICES,
  UOM_DISTANCE_CHOICES,
  UOM_TEMPERATURE_CHOICES,
  UOM_WEIGHT_CHOICES,
} from '../../utils/mock';
import { validators } from '../../utils/validators';
import { useQuery } from 'react-query';
import { getOrganizationNameQuery } from '../../react-query/queries/authUser/getOrganizationNameQuery';
import { getCountriesQuery } from '../../react-query/queries/shipments/getCountriesQuery';
import { getCurrenciesQuery } from '../../react-query/queries/shipments/getCurrenciesQuery';
import { useRegisterMutation } from '../../react-query/mutations/authUser/registerMutation';
import useAlert from '@hooks/useAlert';
import './RegisterStyles.css';

const Register = ({ history }) => {
  const { displayAlert } = useAlert();

  const first_name = useInput('', { required: true });
  const last_name = useInput('');
  const username = useInput('', { required: true });
  const email = useInput('', { required: true });
  const password = useInput('', { required: true });
  const re_password = useInput('', {
    required: true,
    confirm: true,
    matchField: password,
  });
  const organization_name = useInput('', { required: true });
  const organization_abbrevation = useInput('', { required: true });
  const [countryList, setCountryList] = useState([]);
  const country = useInput('United States', { required: true });
  const [currencyList, setCurrencyList] = useState([]);
  const currency = useInput('USD', { required: true });
  const dateFormat = useInput('MMM DD, YYYY', { required: true });
  const timeFormat = useInput('hh:mm:ss A', { required: true });
  const distance = useInput('Miles', { required: true });
  const temp = useInput('Fahrenheit', { required: true });
  const weight = useInput('Pounds', { required: true });
  const [pushOptions, setPushOptions] = useState({
    geofence: false,
    environmental: false,
  });
  const [emailOptions, setEmailOptions] = useState({
    geofence: false,
    environmental: false,
  });
  const [formError, setFormError] = useState({});

  const { data: orgNameData, isLoading: isLoadingOrgNames } = useQuery(
    ['orgNames'],
    () => getOrganizationNameQuery(),
  );

  const { data: countriesData, isLoading: isLoadingCountries } = useQuery(
    ['countries'],
    () => getCountriesQuery(displayAlert),
  );

  const { data: currenciesData, isLoading: isLoadingCurrencies } = useQuery(
    ['currencies'],
    () => getCurrenciesQuery(displayAlert),
  );

  useEffect(() => {
    if (!_.isEmpty(countriesData)) {
      setCountryList(_.sortBy(_.without(_.uniq(_.map(countriesData, 'country')), [''])));
    }
  }, [countriesData]);

  useEffect(() => {
    if (!_.isEmpty(currenciesData)) {
      setCurrencyList(_.sortBy(_.without(_.uniq(_.map(currenciesData, 'currency')), [''])));
    }
  }, [currenciesData]);

  const { mutate: registerMutation, isLoading: isRegister } = useRegisterMutation(history, routes.LOGIN, displayAlert);

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
    if (organization_name.value && !_.includes(orgNameData, organization_name.value)) {
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
    registerMutation(registerFormValue);
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
      || (organization_name.value && !_.includes(orgNameData, organization_name.value)
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
      className="container"
    >
      {(isLoadingOrgNames || isLoadingCountries || isLoadingCurrencies || isRegister) && <Loader open={isLoadingOrgNames || isLoadingCountries || isLoadingCurrencies || isRegister} />}
      <CssBaseline />
      <Card variant="outlined">
        <CardContent>
          <div className="paper">
            <img
              src={logo}
              className="logo"
              alt="Company logo"
            />
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <form
              className="form"
              noValidate
              onSubmit={handleSubmit}
            >
              <Grid container spacing={isTablet() ? 0 : 3}>
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
                    className="textField"
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
                    className="textField"
                    onBlur={(e) => handleBlur(e)}
                    {...last_name.bind}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={isTablet() ? 0 : 3}>
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
                    className="textField"
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
                    className="textField"
                    onBlur={(e) => handleBlur(e, 'email', email)}
                    {...email.bind}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={isTablet() ? 0 : 3}>
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
                    className="textField"
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
                    className="textField"
                    onBlur={(e) => handleBlur(e, 'confirm', re_password)}
                    {...re_password.bind}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={isTablet() ? 0 : 3}>
                <Grid item xs={12}>
                  <Autocomplete
                    freeSolo
                    disableClearable
                    id="organization_name"
                    name="organization_name"
                    options={orgNameData || []}
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
                        className="textField"
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
                spacing={isTablet() ? 0 : 3}
                style={{
                  display: (!organization_name.value || _.includes(orgNameData, organization_name.value)) && 'none',
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
                    className="textField2"
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
                      const curr = _.find(currenciesData, {
                        country: _.find(countriesData, { country: e.target.value })
                          ? _.find(countriesData, { country: e.target.value }).iso3
                          : '',
                      });
                      currency.setValue(curr ? curr.currency : '');
                      country.setValue(e.target.value);
                    }}
                    className="textField2"
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
                    className="textField2"
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
                    className="textField2"
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
                    className="textField2"
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
                    className="textField2"
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
                    className="textField2"
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
                    className="textField2"
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
                spacing={isTablet() ? 0 : 3}
              >
                <Grid item xs={12}>
                  <span className="alertOptionsLabel">
                    Push Notification Preference
                  </span>
                  <div className="alertOptions">
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
                <Grid item xs={12} className="alertGrid">
                  <span className="alertOptionsLabel">
                    Email Notification Preference
                  </span>
                  <div className="alertOptions">
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
                className="submit"
                disabled={isLoadingOrgNames || isLoadingCountries || isLoadingCurrencies || isRegister || submitDisabled()}
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
      <Copyright />
    </Container>
  );
};

export default Register;
