import React from 'react';
import { Container, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '18% 15%',
  },
  title: {
    color: theme.palette.secondary.contrastText,
  },
}));

const ThankYou = () => {
  const classes = useStyles();

  return (
    <Container className={classes.container} component='main' maxWidth='md'>
      <Typography className={classes.title} variant='h5'>
        Thank you for providing you feedback via the survey. Please stay tuned
        for our upcoming product.
      </Typography>
    </Container>
  );
};

export default ThankYou;
