import React from 'react';
import { Link, makeStyles, Typography } from '@material-ui/core';
import { routes } from '@routes/routesConstants';

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
          <Link className={classes.link} href={routes.HELP}>
            Request Help
          </Link>
          <Link className={classes.link} href={routes.TICKET_STATUS}>
            Status of Ticket
          </Link>
          <Link
            className={classes.link}
            href='https://buildly.io/developer-community/'
            target='_blank'
            rel='noopener'
          >
            Community
          </Link>
          <Link
            className={classes.link}
            href='https://buildly.io/contact-us/'
            target='_blank'
            rel='noopener'
          >
            Contact us
          </Link>
          <Link className={classes.link}>Accessibility</Link>
        </div>
        <div className={classes.links}>
          <Link
            className={classes.link}
            href='https://buildly.io/'
            target='_blank'
            rel='noopener'
          >
            Open Source
          </Link>
          <Link
            className={classes.link}
            href='https://buildly.io/'
            target='_blank'
            rel='noopener'
          >
            Sales and Consulting
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Copyright;
