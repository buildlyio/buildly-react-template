import React, { useContext } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {
  AppBar,
  Toolbar,
  Typography,
  Link,
  Button,
} from '@mui/material';
import { AppContext } from '@context/App.context';
import { routes } from '@routes/routesConstants';
import Support from './Support';
import Services from './Services';

const useStyles = makeStyles((theme) => ({
  root: {
    top: 'auto',
    bottom: 0,
    backgroundColor: theme.palette.secondary.light,
    padding: theme.spacing(1, 0),
  },
  toolbar: {
    width: '100%',
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  copyright: {
    color: theme.palette.secondary.contrastText,
  },
  navs: {
    width: '100%',
    marginRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  login: {
    marginRight: theme.spacing(1),
  },
}));

const Copyright = () => {
  const classes = useStyles();
  const app = useContext(AppContext);

  return (
    <AppBar position="fixed" className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.navs}>
          {window.env.PRODUCTION && (
            <Button
              aria-controls="buildly-login"
              color="primary"
              variant="contained"
              className={classes.login}
              href={routes.LOGIN}
            >
              Insights Login
            </Button>
          )}
          <Support />
          <Services />
        </div>
        <div>
          <Typography
            variant="body2"
            align="center"
            className={classes.copyright}
          >
            {'Copyright © '}
            <Link color="inherit" href="https://example.com/" target="_blank">
              {app.title}
            </Link>
            {` ${new Date().getFullYear()}.`}
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Copyright;
