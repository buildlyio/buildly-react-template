import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { routes } from '@routes/routesConstants';
import { validators } from '@utils/validators';
import { useResetPasswordMutation } from '@react-query/mutations/authUser/resetPasswordMutation';
import './ResetPasswordStyles.css';

const EmailForm = ({ history }) => {
  const email = useInput('', { required: true });
  const [error, setError] = useState({});

  const { displayAlert } = useAlert();

  const { mutate: resetPasswordMutation, isLoading: isResetPassword } = useResetPasswordMutation(displayAlert, setError, history);

  const handleSubmit = (event) => {
    event.preventDefault();
    const loginFormValue = {
      email: email.value.toLowerCase(),
    };
    resetPasswordMutation(loginFormValue);
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
    if (!email.value) {
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
      className="resetPasswordContainer"
    >
      {isResetPassword && <Loader open={isResetPassword} />}
      <CssBaseline />
      <Card variant="outlined">
        <CardContent>
          <div className="resetPasswordPaper">
            <img
              src={logo}
              className="resetPasswordLogo"
              alt="Company logo"
            />
            <Typography component="h1" variant="h5" gutterBottom>
              Enter your registered Email
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
                id="email"
                label="Registered email"
                name="email"
                autoComplete="email"
                className="resetPasswordTextField"
                error={error.email && error.email.error}
                helperText={
                  error && error.email
                    ? error.email.message
                    : ''
                }
                onBlur={(e) => handleBlur(e, 'email', email)}
                {...email.bind}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginTop: 8, marginBottom: 16 }}
                disabled={isResetPassword || submitDisabled()}
              >
                Submit
              </Button>
              <Grid container>
                <Grid item xs>
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

export default EmailForm;
