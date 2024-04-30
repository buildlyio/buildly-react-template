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
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import logo from '@assets/buildly-logo.png';
import Copyright from '@components/Copyright/Copyright';
import Loader from '@components/Loader/Loader';
import { useInput } from '@hooks/useInput';
import { routes } from '@routes/routesConstants';
import { isTablet } from '@utils/mediaQuery';
import { validators } from '@utils/validators';
import { useQuery } from 'react-query';
import { inviteTokenCheckQuery } from '@react-query/queries/authUser/inviteTokenCheckQuery';
import { useRegisterMutation } from '@react-query/mutations/authUser/registerMutation';
import useAlert from '@hooks/useAlert';
import './RegisterStyles.css';

const Register = ({ history }) => {
  const { displayAlert } = useAlert();
  const [inviteToken, setInviteToken] = useState('');

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
  const [formError, setFormError] = useState({});

  const { data: inviteTokenCheckData, isLoading: isLoadingInviteTokenCheck } = useQuery(
    ['inviteTokenCheck'],
    () => inviteTokenCheckQuery(inviteToken, displayAlert),
    { refetchOnWindowFocus: false, enabled: !_.isEmpty(inviteToken) },
  );

  useEffect(() => {
    const urlObject = new URL(window.location);
    const token = urlObject.searchParams.get('token');
    if (!_.isEmpty(token)) {
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
    let registerFormValue = {
      username: username.value,
      email: email.value,
      password,
      organization_name: organization_name.value,
      first_name: first_name.value,
      last_name: last_name.value,
    };

    if (inviteToken) {
      registerFormValue = {
        ...registerFormValue,
        invitation_token: inviteToken,
      };
    }

    registerMutation(registerFormValue);
  };

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
      !first_name.value
      || !last_name.value
      || !username.value
      || !email.value
      || !password
      || !re_password.value
      || !organization_name.value
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
      {(isLoadingInviteTokenCheck
        || isRegister)
        && (
          <Loader open={isLoadingInviteTokenCheck
            || isRegister}
          />
        )}
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
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Username"
                    type="text"
                    className="registerTextField"
                    {...username.bind}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Email"
                    type="email"
                    className="registerTextField"
                    disabled={!!inviteToken}
                    {...email.bind}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={isTablet() ? 0 : 3}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Organization Name"
                    className="registerTextField"
                    disabled={!!inviteToken}
                    {...organization_name.bind}
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
                    value={password.value}
                    onChange={(e) => {
                      password.setValue(e.target.value);
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
