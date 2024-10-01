import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Card,
  CardContent,
  Checkbox,
  InputAdornment,
  IconButton,
  Typography,
  Container,
  FormControlLabel,
} from '@mui/material';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import logo from '@assets/tp-logo.png';
import Copyright from '@components/Copyright/Copyright';
import Loader from '@components/Loader/Loader';
import useAlert from '@hooks/useAlert';
import { useInput } from '@hooks/useInput';
import useTimezone from '@hooks/useTimezone';
import { routes } from '@routes/routesConstants';
import { validators } from '@utils/validators';
import { useResetPasswordCheckMutation } from '@react-query/mutations/authUser/resetPasswordCheckMutation';
import { useLoginMutation } from '@react-query/mutations/authUser/loginMutation';
import './LoginStyles.css';

const Login = ({ history }) => {
  const email = useInput(localStorage.getItem('email') || '', { required: true });
  const password = useInput('', { required: true });
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setChecked] = useState(!!localStorage.getItem('email') || false);
  const location = useLocation();

  const { displayAlert } = useAlert();
  const { timezone } = useTimezone();

  const { mutate: resetPasswordCheckMutation, isLoading: isPasswordCheck } = useResetPasswordCheckMutation(history, routes.RESET_PASSWORD_CONFIRM, routes.LOGIN, displayAlert);

  const { mutate: loginMutation, isLoading: islogin, isError: isLoginError } = useLoginMutation(history, (location.state && location.state.from) || routes.SHIPMENT, displayAlert, timezone);

  useEffect(() => {
    if (location.pathname.includes(routes.RESET_PASSWORD_CONFIRM)) {
      const restPath = location.pathname.substring(
        location.pathname.indexOf(routes.RESET_PASSWORD_CONFIRM) + 1,
        location.pathname.lastIndexOf('/'),
      );
      const restPathArr = restPath.split('/');
      const resetCheckValues = {
        uid: restPathArr[1],
        token: restPathArr[2],
      };
      resetPasswordCheckMutation(resetCheckValues);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const loginFormValue = {
      username: email.value.toLowerCase(),
      password: password.value,
    };
    if (isChecked) {
      localStorage.setItem('email', email.value);
    } else {
      localStorage.removeItem('email');
    }
    loginMutation(loginFormValue);
  };

  const handleBlur = (e, validation, input) => {
    const validateObj = validators(validation, input);
    const prevState = { ...error };
    if (validateObj && validateObj.error) {
      setError({
        ...prevState,
        [e.target.id]: validateObj,
      });
    } else {
      setError({
        ...prevState,
        [e.target.id]: {
          error: false,
          message: '',
        },
      });
    }
  };

  const submitDisabled = () => {
    const errorKeys = Object.keys(error);
    if (!email.value || !password.value) {
      return true;
    }
    let errorExists = false;
    errorKeys.forEach((key) => {
      if (error[key].error) {
        errorExists = true;
      }
    });
    return errorExists;
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      className="loginContainer"
    >
      {(isPasswordCheck || islogin) && <Loader open={isPasswordCheck || islogin} />}
      <CssBaseline />
      <Card variant="outlined">
        <CardContent>
          <div className="loginPaper">
            <img
              src={logo}
              className="loginLogo"
              alt="Company logo"
            />
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form
              className="loginForm"
              noValidate
              onSubmit={handleSubmit}
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                error={isLoginError || (error.email && error.email.error)}
                helperText={error && error.email ? error.email.message : ''}
                className="loginTextField"
                onBlur={(e) => handleBlur(e, 'required', email)}
                {...email.bind}
              />
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
                error={isLoginError || (error.password && error.password.error)}
                helperText={
                  error && error.password
                    ? error.password.message
                    : ''
                }
                className="loginTextField"
                onBlur={(e) => handleBlur(e, 'required', password)}
                {...password.bind}
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
              {isLoginError && (
                <Typography className="loginErrorText">
                  Incorrect email or password. Try again!
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginTop: 8, marginBottom: 16 }}
                disabled={isPasswordCheck || islogin || submitDisabled()}
              >
                Sign in
              </Button>
              <Grid container alignItems="center">
                <Grid item xs={7}>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={isChecked}
                        onChange={() => setChecked(!isChecked)}
                        color="primary"
                      />
                    )}
                    label="Remember Email"
                  />
                </Grid>
                <Grid item xs={5} style={{ textAlign: 'end' }}>
                  <Link
                    to={routes.RESET_PASSWORD}
                    variant="body2"
                    color="primary"
                  >
                    Forgot Password?
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

export default Login;
