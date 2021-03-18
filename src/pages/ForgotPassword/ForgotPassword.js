import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  makeStyles,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Card,
  CircularProgress,
  CardContent,
  Typography,
  Container,
} from '@material-ui/core';
import logo from '@assets/light-logo.png';
import Copyright from '@components/Copyright/Copyright';
import { useInput } from '@hooks/useInput';
import { sendPasswordResetLink } from '@redux/authuser/actions/authuser.actions';
import { routes } from '@routes/routesConstants';
import { validators } from '@utils/validators';

const useStyles = makeStyles((theme) => ({
  logoDiv: {
    width: theme.spacing(15),
    margin: 'auto',
    marginTop: theme.spacing(1.25),
    marginBottom: theme.spacing(2.5),
  },
  logo: {
    width: theme.spacing(15),
    objectFit: 'contain',
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
    marginBottom: theme.spacing(2),
  },
  textField: {
    minHeight: '5rem',
    margin: '0.25rem 0',
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

const ForgotPassword = ({ dispatch, loading, history }) => {
  const classes = useStyles();
  const email = useInput('', { required: true });
  const [error, setError] = useState({});

  /**
   * Submit the form to the backend and attempts to authenticate
   * @param {Event} event the default submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const loginFormValue = {
      email: email.value,
    };
    dispatch(sendPasswordResetLink(loginFormValue));
  };

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */

  const handleBlur = (e, validation, input) => {
    let validateObj = validators(validation, input);
    let prevState = { ...error };
    if (validateObj && validateObj.error)
      setError({
        ...prevState,
        [e.target.id]: validateObj,
      });
    else
      setError({
        ...prevState,
        [e.target.id]: {
          error: false,
          message: '',
        },
      });
  };

  const submitDisabled = () => {
    let errorKeys = Object.keys(error);
    if (!email.value) return true;
    errorKeys.forEach((key) => {
      if (error[key].error) return true;
    });
    return false;
  };

  return (
    <React.Fragment>
      <div className={classes.logoDiv}>
        <img src={logo} className={classes.logo} />
      </div>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Card variant='outlined'>
          <CardContent>
            <div className={classes.paper}>
              <Typography component='h1' variant='h5' gutterBottom>
                Enter your registered Email
              </Typography>
              <form className={classes.form} noValidate onSubmit={handleSubmit}>
                <TextField
                  variant='outlined'
                  margin='normal'
                  required
                  fullWidth
                  id='email'
                  label='Registered email'
                  name='email'
                  autoComplete='email'
                  className={classes.textField}
                  error={error.email && error.email.error}
                  helperText={error && error.email ? error.email.message : ''}
                  onBlur={(e) => handleBlur(e, 'email', email)}
                  {...email.bind}
                />

                <div className={classes.loadingWrapper}>
                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    color='primary'
                    className={classes.submit}
                    disabled={loading || submitDisabled()}
                  >
                    Submit
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
                <Grid container>
                  <Grid item xs>
                    <Link href={routes.LOGIN} variant='body2' color='primary'>
                      Go back to Sign in
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      href={routes.REGISTER}
                      variant='body2'
                      color='primary'
                    >
                      {"Don't have an account? Register"}
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </div>
          </CardContent>
        </Card>
      </Container>
      <Copyright />
    </React.Fragment>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
});

export default connect(mapStateToProps)(ForgotPassword);
