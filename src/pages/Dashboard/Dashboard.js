import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { UserContext } from '@context/User.context';
import Loader from '@components/Loader/Loader';
import FeedbackForm from './FeedbackForm';
import ThankYou from './ThankYou';

const Dashboard = ({ loading, loaded, filled }) => {
  const user = useContext(UserContext);

  return (
    <React.Fragment>
      {loading && <Loader open={loading} />}
      {loaded && !filled && <FeedbackForm />}
      {loaded && filled && <ThankYou />}
    </React.Fragment>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.googleSheetReducer,
});

export default connect(mapStateToProps)(Dashboard);
