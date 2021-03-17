import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.secondary.contrastText,
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant='body1'>Welcome to the Buildly Dashboard</Typography>
    </div>
  );
};

export default Dashboard;
