import React from 'react';
import { Link, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    padding: theme.spacing(1),
    opacity: 0,
    '&:hover': {
      opacity: 1,
      transition: 'all .5s linear',
    },
  },
  titles: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  linksWrapper: {
    display: 'flex',
  },
  links: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  link: {
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

const Copyright = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.titles}>
        <Typography className={classes.title} variant='h6'>
          Buildly Support
        </Typography>
        <Typography className={classes.title} variant='h6'>
          Buildly Services
        </Typography>
      </div>
      <div className={classes.linksWrapper}>
        <div className={classes.links}>
          <Link className={classes.link}>Request Help</Link>
          <Link className={classes.link}>Status of Ticket</Link>
          <Link className={classes.link}>Community</Link>
          <Link className={classes.link}>Contact us</Link>
          <Link className={classes.link}>Accessibility</Link>
        </div>
        <div className={classes.links}>
          <Link className={classes.link}>Open Source</Link>
          <Link className={classes.link}>Sales and Consulting</Link>
        </div>
      </div>
    </div>
  );
};

export default Copyright;
