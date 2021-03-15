import React from 'react';
import {
  makeStyles,
  CssBaseline,
  Link,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
} from '@material-ui/core';
import logo from '@assets/buildly-logo.png';
import Copyright from '@components/Copyright/Copyright';
import { routes } from '@routes/routesConstants';

const useStyles = makeStyles((theme) => ({
  logo: {
    width: theme.spacing(15),
    objectFit: 'contain',
    margin: theme.spacing(2.5),
  },
  container: {
    marginBottom: theme.spacing(24),
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

const TicketStatus = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <img src={logo} className={classes.logo} />
      <Container component='main' maxWidth='xs' className={classes.container}>
        <CssBaseline />
        <Card variant='outlined'>
          <CardContent>
            <div className={classes.paper}>
              <Typography component='h1' variant='h5' gutterBottom>
                Status of Ticket
              </Typography>
              <div className={classes.placeholder}>
                <Typography variant='body1'>Work in Progress...</Typography>
              </div>
              <Grid container>
                <Grid item xs>
                  <Link href={routes.LOGIN} variant='body2' color='primary'>
                    Go back to Sign in
                  </Link>
                </Grid>
                <Grid item>
                  <Link href={routes.REGISTER} variant='body2' color='primary'>
                    {"Don't have an account? Register"}
                  </Link>
                </Grid>
              </Grid>
            </div>
          </CardContent>
        </Card>
      </Container>
      <Copyright />
    </React.Fragment>
  );
};

export default TicketStatus;
