import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  CssBaseline,
  TextField,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
} from '@mui/material';
import logo from '../../assets/tp-logo.png';
import Copyright from '../../components/Copyright/Copyright';
import Loader from '../../components/Loader/Loader';
import { useInput } from '../../hooks/useInput';
import { routes } from '../../routes/routesConstants';
import { validators } from '../../utils/validators';
import { useResetPasswordConfirmMutation } from '../../react-query/mutations/authUser/resetPasswordConfirmMutation';
import useAlert from '@hooks/useAlert';
import './ResetPasswordStyles.css';

const NewPassword = ({ history, location }) => {
  const password = useInput('', { required: true });
  const re_password = useInput('', {
    required: true,
    confirm: true,
    matchField: password,
  });
  const [formError, setFormError] = useState({});

  const { displayAlert } = useAlert();

  const { mutate: resetPasswordConfirmMutation, isLoading: isResetPasswordConfirm } = useResetPasswordConfirmMutation(history, routes.LOGIN, displayAlert);

  /**
   * Submit the form to the backend and attempts to change password
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    if (location.pathname.includes(routes.RESET_PASSWORD_CONFIRM)) {
      const restPath = location.pathname.substring(
        location.pathname.indexOf(routes.RESET_PASSWORD_CONFIRM) + 1,
        location.pathname.lastIndexOf('/'),
      );
      const restPathArr = restPath.split('/');
      const registerFormValue = {
        new_password1: password.value,
        new_password2: re_password.value,
        uid: restPathArr[1],
        token: restPathArr[2],
      };
      resetPasswordConfirmMutation(registerFormValue);
    }
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
    if (!password.value || !re_password.value) {
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
      maxWidth="xs"
      className="resetPasswordContainer"
    >
      {isResetPasswordConfirm && <Loader open={isResetPasswordConfirm} />}
      <CssBaseline />
      <Card variant="outlined">
        <CardContent>
          <div className="resetPasswordPaper">
            <img
              src={logo}
              className="resetPasswordLogo"
              alt="Company logo"
            />
            <Typography component="h1" variant="h5">
              Reset your Password
            </Typography>
            <form
              className="resetPasswordForm"
              noValidate
              onSubmit={handleSubmit}
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="New Password"
                type="password"
                id="password"
                autoComplete="current-password"
                className="resetPasswordTextField"
                error={
                  formError.password
                  && formError.password.error
                }
                helperText={
                  formError.password
                    ? formError.password.message
                    : ''
                }
                onBlur={(e) => handleBlur(e, 'required', password)}
                {...password.bind}
              />
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
                className="resetPasswordTextField"
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
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginTop: 8, marginBottom: 16 }}
                disabled={isResetPasswordConfirm || submitDisabled()}
              >
                Submit
              </Button>
              <Grid container>
                <Grid item>
                  <Link
                    to={routes.LOGIN}
                    variant="body2"
                    color="primary"
                  >
                    Go back to Sign in
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

export default NewPassword;
