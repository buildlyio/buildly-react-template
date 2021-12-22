import React from 'react';
import { connect } from 'react-redux';
import Loader from '@components/Loader/Loader';
import UserDashboard from './components/UserDashboard';
import FeedbackForm from './components/FeedbackForm';

const Dashboard = ({
  history, loading, loaded, filled,
}) => (
  <>
    {loading && <Loader open={loading} />}
    {/* {loaded && !filled && <FeedbackForm />} */}
    {loaded && <UserDashboard history={history} />}
  </>
);

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.googleSheetReducer,
});

export default connect(mapStateToProps)(Dashboard);
