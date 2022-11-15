import React, { useState } from 'react';
import { connect } from 'react-redux';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import Container from '@mui/material/Container';
import logo from '@assets/buildly-logo.png';
import Copyright from '@components/Copyright/Copyright';
import {useHistory,} from 'react-router-dom';
import { devNull } from 'os';

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
  buttonHome: {
    background: '#3E5266',
    cursor: 'pointer',
    width: '170px',
    marginTop: '20px',
  },
  emailText: {
    color: '#3E5266',
    fontWeight: '500',
  }
}));

const RegisterConfirmation = ({ dispatch, loading }) => {
    const classes = useStyles();


    /* this supposed to be the function to redirect to home  */


    /* const history = useHistory()
     /**
   * Submit the form to the backend and attempts to authenticate
   * @param {Event} event the default submit event
   */

    /* const redirect = (event) => {
      event.preventDefault();
      history.push('/')
    
    } */

  
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
              We will be communicating with you through your email.
            </Typography>
            <Typography component="h1" variant="body1" gutterBottom>
              Please if you have any questions write to the following email <span className={classes.emailText}>idk@idk.com</span>.
            </Typography>
            <Button
                onClick={null}
                size="small"
                variant="contained"
                color="primary"
                type="submit"
                className={classes.buttonHome}
                disabled={false}
              >
                Go back Home
            </Button>
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

export default connect(mapStateToProps)(RegisterConfirmation);
