import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
  Card,
  Switch,
  CircularProgress,
  CardContent,
  Typography,
  makeStyles,
  Container,
  Grid,
  FormControl,
  FormGroup,
  FormControlLabel,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import logo from '@assets/tp-logo.png';
import Copyright from '@components/Copyright/Copyright';
import { useInput } from '@hooks/useInput';
import {
  register,
  loadOrgNames,
} from '@redux/authuser/actions/authuser.actions';
import { routes } from '@routes/routesConstants';
import { isMobile } from '@utils/mediaQuery';
import { validators } from '@utils/validators';

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
  loadingWrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
}));

const Register = ({
  dispatch, loading, history, orgNames,
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
  const first_name = useInput('', { required: true });
  const last_name = useInput('');
  const [emailAlertFlag, setEmailAlertFlag] = useState(false);
  const [formError, setFormError] = useState({});

  useEffect(() => {
    if (!orgNames) {
      dispatch(loadOrgNames());
    }
  }, []);

  /**
   * Submit the form to the backend and attempts to authenticate
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    location.register = true;
    const registerFormValue = {
      username: username.value,
      email: email.value,
      password: password.value,
      organization_name: organization_name.value,
      first_name: first_name.value,
      last_name: last_name.value,
      email_alert_flag: emailAlertFlag,
    };
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
                        {...organization_name.bind}
                      />
                    )}
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

                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset">
                    <FormGroup aria-label="position" row>
                      <FormControlLabel
                        control={(
                          <Switch
                            size="medium"
                            color="primary"
                            checked={emailAlertFlag}
                            onChange={(e) => setEmailAlertFlag(e.target.checked)}
                          />
                        )}
                        label="Shipment Email Alerts"
                        labelPlacement="end"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <div className={classes.loadingWrapper}>
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
                {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
              <Grid container>
                <Grid item>
                  <Link
                    href={routes.LOGIN}
                    variant="body2"
                    color="secondary"
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
});

export default connect(mapStateToProps)(Register);
