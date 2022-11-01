/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Loader from '@components/Loader/Loader';
import { routes } from '@routes/routesConstants';
import UserDashboard from './components/UserDashboard';

const useStyles = makeStyles((theme) => ({
  firstTimeMessage: {
    textAlign: 'center',
    padding: '25% 10%',
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const Dashboard = ({
  history,
  loading,
  loaded,
  user,
}) => {
  const classes = useStyles();
  const [route, setRoute] = useState(routes.DASHBOARD);

  useEffect(() => {
    if (loaded && !user.survey_status) {
      if (user.user_type === 'Developer') {
        setRoute(routes.DEVELOPER_FORM);
      }
      if (user.user_type === 'Product Team') {
        setRoute(routes.NEW_PRODUCT);
      }
    }
  }, [user]);

  return (
    <>
      {loading && <Loader open={loading} />}

      {loaded && user && !user.survey_status && (
        <div className={classes.firstTimeMessage}>
          <Typography variant="h6" component="h6">
            Thanks for registering. To get you started we want to take your through a new product
            wizard. This will help you get oriented with the system, and create your first product
            with Inisights!
          </Typography>

          <Button
            variant="contained"
            type="button"
            className={classes.button}
            onClick={(e) => history.push(route)}
          >
            Let's get started!
          </Button>
        </div>
      )}

      {loaded && user && user.survey_status && <UserDashboard history={history} />}
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  loading: state.authReducer.loading,
  loaded: state.authReducer.loaded,
  user: state.authReducer.data,
});

export default connect(mapStateToProps)(Dashboard);
