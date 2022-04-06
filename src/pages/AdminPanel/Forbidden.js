import React from 'react';
import { connect } from 'react-redux';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Button,
  Avatar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { routes } from '../../routes/routesConstants';

const useStyles = makeStyles((theme) => ({
  pageHeading: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(5),
  },
  backButton: {
    margin: theme.spacing(3, 0),
  },
}));

/**
 * Outputs the 403 Page.
 */
const Forbidden = ({
  history,
}) => {
  const classes = useStyles();

  return (
    <Box mt={3} textAlign="center">
      <Card variant="outlined">
        <CardContent>

          <Typography className={classes.pageHeading} variant="h2">
            403

          </Typography>

          <Typography className={classes.pageHeading} variant="h5">
            Access Denied
            <p>You don't have permission to access this page</p>
          </Typography>
        </CardContent>
      </Card>
      <Button
        type="button"
        variant="contained"
        color="primary"
        onClick={() => history.push(routes.SHIPMENT)}
        className={classes.backButton}
      >
        Back To Shipment Page
      </Button>

    </Box>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
});

export default connect(mapStateToProps)(Forbidden);
