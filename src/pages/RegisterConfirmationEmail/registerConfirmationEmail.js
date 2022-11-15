import React, { useState } from 'react';
import { connect } from 'react-redux';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import Container from '@mui/material/Container';
import { useInput } from '@hooks/useInput';
import {
  sendPasswordResetLink,
} from '@redux/authuser/authuser.actions';
import { validators } from '@utils/validators';
import logo from '@assets/buildly-logo.png';
import { routes } from '@routes/routesConstants';
import Copyright from '@components/Copyright/Copyright';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',
  },
  logo: {
    width: '12.5rem',
    maxWidth: '100%',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  emailText: {
    color: '#3E5266',
    fontWeight: '500',
  }
}));

const RegisterConfirmationEmail = ({ dispatch, loading, history }) => {
    const classes = useStyles();

  
    return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <div className={classes.paper}>
            <img src={logo} className={classes.logo} alt="Company logo" />
            <Typography component="h1" variant="h5" gutterBottom>
            <span className={classes.emailText}>Thank you for registering with us!!</span>
            </Typography>
            <Typography component="h1" variant="body1" gutterBottom>
            Please check the email with which you just registered to confirm your account.
            </Typography>
            <Typography component="h1" variant="body1" gutterBottom>
              Please if you have any questions write to the following email <span className={classes.emailText}>idk@idk.com</span>.
            </Typography>
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

export default connect(mapStateToProps)(RegisterConfirmationEmail);