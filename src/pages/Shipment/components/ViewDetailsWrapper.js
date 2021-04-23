import React from 'react';
import {
  makeStyles,
  useMediaQuery,
  useTheme,
  Button,
  Grid,
  Box,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
  },
  submit: {
    borderRadius: '18px',
    fontSize: 11,
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  loadingWrapper: {
    position: 'relative',
  },
  buttonContainer: {
    margin: theme.spacing(8, 0),
    textAlign: 'center',
  },
  alignRight: {
    marginLeft: 'auto',
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
      {!isDesktop && activeStep !== 0 && (
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
