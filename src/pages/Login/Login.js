import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
} from '@mui/material';
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
  const username = useInput('', { required: true });
  const password = useInput('', { required: true });
  const [error, setError] = useState({});
  const location = useLocation();

  const { displayAlert } = useAlert();
  const { timezone } = useTimezone();

  const { mutate: resetPasswordCheckMutation, isLoading: isPasswordCheck } = useResetPasswordCheckMutation(history, routes.RESET_PASSWORD_CONFIRM, routes.LOGIN, displayAlert);

  const { mutate: loginMutation, isLoading: islogin } = useLoginMutation(history, (location.state && location.state.from) || routes.SHIPMENT, displayAlert, timezone);

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

  /**
   * Submit the form to the backend and attempts to authenticate
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const loginFormValue = {
      username: username.value,
      password: password.value,
    };
    loginMutation(loginFormValue);
  };

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */

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
    if (!username.value || !password.value) {
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
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                error={error.username && error.username.error}
                helperText={
                  error && error.username
                    ? error.username.message
                    : ''
                }
                className="loginTextField"
                onBlur={(e) => handleBlur(e, 'required', username)}
                {...username.bind}
              />
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
                error={error.password && error.password.error}
                helperText={
                  error && error.password
                    ? error.password.message
                    : ''
                }
                className="loginTextField"
                onBlur={(e) => handleBlur(e, 'required', password)}
                {...password.bind}
              />
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
              <Grid container>
                <Grid item xs>
                  <Link
                    to={routes.RESET_PASSWORD}
                    variant="body2"
                    color="primary"
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    to={routes.REGISTER}
                    variant="body2"
                    color="primary"
                  >
                    Don't have an account? Register
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
