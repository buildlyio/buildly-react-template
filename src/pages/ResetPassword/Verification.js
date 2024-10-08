import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  Typography,
} from '@mui/material';
import './ResetPasswordStyles.css';
import logo from '@assets/tp-logo.png';
import Copyright from '@components/Copyright/Copyright';
import Loader from '@components/Loader/Loader';
import useAlert from '@hooks/useAlert';
import { useResetPasswordMutation } from '@react-query/mutations/authUser/resetPasswordMutation';
import { routes } from '@routes/routesConstants';

const Verification = ({ location }) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [countdown, setCountdown] = useState(300);
  const [attempts, setAttempts] = useState(3);

  const { displayAlert } = useAlert();

  const { mutate: resetPasswordMutation, isLoading: isResetPassword } = useResetPasswordMutation(displayAlert);

  useEffect(() => {
    if (isDisabled && attempts > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 0) {
            clearInterval(timer);
            setIsDisabled(false);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    return null;
  }, [isDisabled]);

  const handleResendVerification = () => {
    const loginFormValue = {
      email: location.state.email,
    };
    resetPasswordMutation(loginFormValue);
    if (attempts > 0) {
      setAttempts(attempts - 1);
    }
    setIsDisabled(true);
    setCountdown(300);
    setTimeout(() => {
      setIsDisabled(false);
    }, 300000);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      className="verificationContainer"
    >
      {isResetPassword && <Loader open={isResetPassword} />}
      <CssBaseline />
      <Card variant="outlined">
        <CardContent>
          <div className="verificationPaper">
            <img
              src={logo}
              className="resetPasswordLogo"
              alt="Company logo"
            />
            <Typography component="h1" variant="h5" gutterBottom textAlign="center">
              Email Sent Successfully
            </Typography>
            <Typography variant="body" gutterBottom textAlign="center">
              An email has been sent for verification. Click on the link in the email to change
              your 'Password'. If no email was received, check your junk/spam mail and add
              'alerts@transparentpath.com' to your safe sender list (check with your email provider
              on the proper method to enable this).
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="verificationButton"
              onClick={handleResendVerification}
              disabled={isDisabled || attempts <= 0}
            >
              Resend Verification Email
            </Button>
            <Grid container>
              <Grid item xs={11}>
                <Typography variant="body" fontSize={11} textAlign="left">
                  Total Attempts Remaining:
                  {' '}
                  {attempts}
                </Typography>
              </Grid>
              <Grid item xs={1}>
                {isDisabled && attempts > 0 && (
                  <Typography variant="body" fontSize={11} textAlign="right">
                    {formatTime(countdown)}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid container mt={1}>
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
          </div>
        </CardContent>
      </Card>
      <Copyright />
    </Container>
  );
};

export default Verification;
