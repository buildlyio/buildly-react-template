import React, { useState } from 'react';
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
  Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import logo from '../../assets/tp-logo.png';
import Copyright from '../../components/Copyright/Copyright';
import Loader from '../../components/Loader/Loader';
import { useInput } from '../../hooks/useInput';
import { routes } from '../../routes/routesConstants';
import { isMobile } from '../../utils/mediaQuery';
import { validators } from '../../utils/validators';
import { useResetPasswordConfirmMutation } from '../../react-query/mutations/authUser/resetPasswordConfirmMutation';
import useAlert from '@hooks/useAlert';

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
    marginTop: theme.spacing(1),
  },
  textField: {
    minHeight: '5rem',
    margin: theme.spacing(1, 0),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  logo: {
    maxWidth: '20rem',
    width: '100%',
    marginBottom: theme.spacing(3),
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const NewPassword = ({
  history, location,
}) => {
  const classes = useStyles();
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
      className={classes.container}
    >
      {isResetPasswordConfirm && <Loader open={isResetPasswordConfirm} />}
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
              Reset your Password
            </Typography>
            <form
              className={classes.form}
              noValidate
              onSubmit={handleSubmit}
            >
              <Grid container spacing={isMobile() ? 0 : 2}>
                <Grid item xs={12}>
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
                    className={classes.textField}
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
                </Grid>
                <Grid item xs={12}>
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
                    className={classes.textField}
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
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={isResetPasswordConfirm || submitDisabled()}
              >
                Submit
              </Button>
              <Grid container>
                <Grid item>
                  <Link
                    href={routes.LOGIN}
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
      <Box mt={8} mb={1}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default NewPassword;
