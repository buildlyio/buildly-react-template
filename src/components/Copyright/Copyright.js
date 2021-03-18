import React, { useContext } from 'react';
import {
  AppBar,
  makeStyles,
  Toolbar,
  Typography,
  Link,
} from '@material-ui/core';
import { AppContext } from '@context/App.context';
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
  },
  copyright: {
    flex: 1,
    color: theme.palette.secondary.contrastText,
  },
  navs: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));

const Copyright = () => {
  const classes = useStyles();
  const app = useContext(AppContext);

  return (
    <AppBar position='fixed' className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <Typography
          variant='body2'
          align='center'
          className={classes.copyright}
        >
          {'Copyright © '}
          <Link color='inherit' href='https://example.com/' target='_blank'>
            {app.title}
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
        <div className={classes.navs}>
          <Support />
          <Services />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Copyright;
