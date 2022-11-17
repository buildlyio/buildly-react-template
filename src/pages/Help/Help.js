import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {
  CssBaseline,
  Link,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
} from '@mui/material';
import logo from '@assets/insights-logo.png';
import Copyright from '@components/Copyright/Copyright';
import { routes } from '@routes/routesConstants';

const useStyles = makeStyles((theme) => ({
  logoDiv: {
    width: '100%',
    textAlign: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2.5),
  },
  logo: {
    width: theme.spacing(40),
    objectFit: 'contain',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  placeholder: {
    margin: theme.spacing(8),
  },
}));

const Help = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.logoDiv}>
        <img src={logo} alt="Logo" className={classes.logo} />
      </div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Card variant="outlined">
          <CardContent>
            <div className={classes.paper}>
              <Typography component="h1" variant="h5" gutterBottom>
                Request Help
              </Typography>
              <div className={classes.placeholder}>
                <Typography variant="body1">Work in Progress...</Typography>
              </div>
              <Grid container>
                <Grid item xs>
                  <Link href={routes.LOGIN} variant="body2" color="secondary">
                    Go back to Sign in
                  </Link>
                </Grid>
                <Grid item>
                  <Link href={routes.REGISTER} variant="body2" color="secondary">
                    Don't have an account? Register
                  </Link>
                </Grid>
              </Grid>
            </div>
          </CardContent>
        </Card>
      </Container>
      <Copyright />
    </>
  );
};

export default Help;
