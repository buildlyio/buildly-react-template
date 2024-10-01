import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {
  Button,
  CssBaseline,
  TextField,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  FormControlLabel,
  Switch,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import logo from '@assets/tp-logo.png';
import Copyright from '@components/Copyright/Copyright';
import Loader from '@components/Loader/Loader';
import { useInput } from '@hooks/useInput';
import { routes } from '@routes/routesConstants';
import { isMobile, isTablet } from '@utils/mediaQuery';
import { validators } from '@utils/validators';
import { useQuery } from 'react-query';
import { inviteTokenCheckQuery } from '@react-query/queries/authUser/inviteTokenCheckQuery';
import { useRegisterMutation } from '@react-query/mutations/authUser/registerMutation';
import useAlert from '@hooks/useAlert';
import './RegisterStyles.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Register = ({ history }) => {
  const { displayAlert } = useAlert();

  const [inviteToken, setInviteToken] = useState('');

  const first_name = useInput('', { required: true });
  const email = useInput('', { required: true });
  const last_name = useInput('');
  const [password, setPassword] = useState('');
  const re_password = useInput('', {
    required: true,
    confirm: true,
  });
  const [validations, setValidations] = useState({
    length: false,
    upperCase: false,
    lowerCase: false,
    digit: false,
    special: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const organization_name = useInput('', { required: true });
  const [geoOptions, setGeoOptions] = useState({ email: true, sms: false, whatsApp: false });
  const [envOptions, setEnvOptions] = useState({ email: true, sms: false, whatsApp: false });
  const [whatsappNumber, setWhatsappNumber] = useState();
  const [whatsappFocus, setWhatsappFocus] = useState(false);
  const [formError, setFormError] = useState({});

  const { data: inviteTokenCheckData, isLoading: isLoadingInviteTokenCheck } = useQuery(
    ['inviteTokenCheck'],
    () => inviteTokenCheckQuery(inviteToken, displayAlert),
    { refetchOnWindowFocus: false, enabled: !_.isEmpty(inviteToken) },
  );

  useEffect(() => {
    const urlObject = new URL(window.location);
    const token = urlObject.searchParams.get('token');
    if (_.isEmpty(token)) {
      history.push(routes.LOGIN);
    } else {
      setInviteToken(token);
    }
  }, []);

  useEffect(() => {
    if (inviteTokenCheckData) {
      email.setValue(inviteTokenCheckData.email || '');
      organization_name.setValue(inviteTokenCheckData.organization_name || '');
    }
  }, [inviteTokenCheckData]);

  const { mutate: registerMutation, isLoading: isRegister } = useRegisterMutation(history, routes.LOGIN, displayAlert);

  const handleSubmit = (event) => {
    event.preventDefault();
    let registerFormValue;
    registerFormValue = {
      username: email.value,
      email: email.value.toLowerCase(),
      password,
      organization_name: organization_name.value,
      first_name: first_name.value,
      last_name: last_name.value,
      geo_alert_preferences: geoOptions,
      env_alert_preferences: envOptions,
      user_role: inviteTokenCheckData.user_role,
      invitation_token: inviteToken,
    };
    if (whatsappNumber) {
      registerFormValue = { ...registerFormValue, whatsApp_number: whatsappNumber };
    }
    registerMutation(registerFormValue);
  };

  const handleBlur = (e, validation, input) => {
    let validateObj;
    if (validation === 'confirm') {
      validateObj = validators(validation, { ...input, password });
    } else {
      validateObj = validators(validation, input);
    }
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
      !first_name.value
      || !last_name.value
      || !email.value
      || !password
      || !re_password.value
      || !organization_name.value
      || (geoOptions.whatsApp && !whatsappNumber)
      || (envOptions.whatsApp && !whatsappNumber)
      || ((geoOptions.whatsApp || envOptions.whatsApp) && whatsappNumber && whatsappNumber.length < 11)
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

  const validatePassword = (value) => {
    const lengthRegex = /^.{10,}$/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /\d/;
    const specialCharacterRegex = /[!@#$%^&*]/;

    setValidations({
      length: lengthRegex.test(value),
      upperCase: uppercaseRegex.test(value),
      lowerCase: lowercaseRegex.test(value),
      digit: digitRegex.test(value),
      special: specialCharacterRegex.test(value),
    });
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      className="registerContainer"
    >
      {(isLoadingInviteTokenCheck || isRegister) && <Loader open={isLoadingInviteTokenCheck || isRegister} />}
      <CssBaseline />
      <Card variant="outlined">
        <CardContent>
          <div className="registerPaper">
            <img
              src={logo}
              className="registerLogo"
              alt="Company logo"
            />
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <form
              className="registerForm"
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
                    className="registerTextField"
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
                    className="registerTextField"
                    onBlur={(e) => handleBlur(e)}
                    {...last_name.bind}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={isTablet() ? 0 : 3}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Email"
                    type="email"
                    className="registerTextField"
                    disabled
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
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    className="registerTextField"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="re_password"
                    className="registerTextField"
                    error={
                      formError.re_password
                      && formError.re_password.error
                    }
                    helperText={
                      formError.re_password
                        ? formError.re_password.message
                        : ''
                    }
                    onBlur={(e) => handleBlur(e, 'confirm', re_password)}
                    {...re_password.bind}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Typography
                mt={-3}
                className={validations.length === true
                  ? 'registerValidText'
                  : 'registerInvalidText'}
              >
                {validations.length === true ? '✓' : '✗'}
                {' '}
                10-alphanumeric character length
              </Typography>
              <Typography className={validations.upperCase === true && validations.lowerCase === true
                ? 'registerValidText'
                : 'registerInvalidText'}
              >
                {validations.upperCase === true && validations.lowerCase === true ? '✓' : '✗'}
                {' '}
                Uppercase and lowercase letters
              </Typography>
              <Typography className={validations.digit === true
                ? 'registerValidText'
                : 'registerInvalidText'}
              >
                {validations.digit === true ? '✓' : '✗'}
                {' '}
                At least 1 digit number
              </Typography>
              <Typography
                mb={0.75}
                className={validations.special === true
                  ? 'registerValidText'
                  : 'registerInvalidText'}
              >
                {validations.special === true ? '✓' : '✗'}
                {' '}
                At least 1 special character (!@#$%^&*, etc.)
              </Typography>
              <Grid container spacing={isTablet() ? 0 : 3}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={<Typography className="translate">Organization Name</Typography>}
                    className="registerTextField notranslate"
                    disabled
                    {...organization_name.bind}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={isMobile() ? 0 : 3}>
                <Grid item xs={12}>
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
                  <Typography variant="body1" fontWeight={500}>WhatsApp Alerts:</Typography>
                </Grid>
                <Grid item xs={6} sm={8} alignSelf="center">
                  <FormControlLabel
                    labelPlacement="end"
                    label={geoOptions && geoOptions.whatsApp ? 'ON' : 'OFF'}
                    control={<Switch checked={geoOptions && geoOptions.whatsApp} color="primary" onChange={(e) => setGeoOptions({ ...geoOptions, whatsApp: e.target.checked })} />}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={isMobile() ? 0 : 3} mt={3}>
                <Grid item xs={12}>
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
                  <Typography variant="body1" fontWeight={500}>WhatsApp Alerts:</Typography>
                </Grid>
                <Grid item xs={6} sm={8} alignSelf="center">
                  <FormControlLabel
                    labelPlacement="end"
                    label={envOptions && envOptions.whatsApp ? 'ON' : 'OFF'}
                    control={<Switch checked={envOptions && envOptions.whatsApp} color="primary" onChange={(e) => setEnvOptions({ ...envOptions, whatsApp: e.target.checked })} />}
                  />
                </Grid>
              </Grid>
              {(geoOptions.whatsApp || envOptions.whatsApp) && (
                <Grid item xs={12}>
                  <PhoneInput
                    value={whatsappNumber}
                    onChange={(value) => setWhatsappNumber(value)}
                    placeholder="Send WhatsApp alerts on"
                    inputClass={whatsappFocus ? 'registerPhoneInputFocused' : 'registerPhoneInput'}
                    containerClass={whatsappFocus ? 'registerPhoneInputContainerFocused' : 'registerPhoneInputContainer'}
                    buttonClass="registerFlagDropdown"
                    country="us"
                    onFocus={() => setWhatsappFocus(true)}
                    onBlur={() => setWhatsappFocus(false)}
                  />
                  <Typography variant="caption" className="registerAddText">
                    Additional charges may apply
                  </Typography>
                </Grid>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="registerSubmit"
                disabled={isLoadingInviteTokenCheck || isRegister || submitDisabled()}
              >
                Register
              </Button>
              <Grid container>
                <Grid item>
                  <Link
                    to={routes.LOGIN}
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
