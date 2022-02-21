import React from 'react';
import {
  useMediaQuery,
  useTheme,
  Button,
  Grid,
  Box,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  submit: {
    borderRadius: '18px',
    fontSize: 11,
  },
}));

const ViewDetailsWrapper = ({
  handleBack,
  children,
  title,
  maxSteps,
  activeStep,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <>
      {!isDesktop
      && activeStep !== 0
      && (
        <Box mb={5}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography variant="h4">
                {`${title} ${activeStep + 1}/${maxSteps}`}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="contained"
                size="small"
                color="primary"
                onClick={handleBack}
                className={classes.submit}
              >
                Back
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
      {children}
    </>
  );
};

export default ViewDetailsWrapper;
