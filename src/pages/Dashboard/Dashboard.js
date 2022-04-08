/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Loader from '@components/Loader/Loader';
import { routes } from '@routes/routesConstants';
import UserDashboard from './components/UserDashboard';

const Dashboard = ({
  history,
  loading,
  loaded,
  user,
}) => {
  useEffect(() => {
    if (loaded && !user.survey_status) {
      if (user.user_type === 'Developer') {
        history.push(routes.DEVELOPER_FORM);
      }
      if (user.user_type === 'Product Team') {
        history.push(routes.NEW_PRODUCT);
      }
    }
  }, [user]);

  return (
    <>
      {loading && <Loader open={loading} />}
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
