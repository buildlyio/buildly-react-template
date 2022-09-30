import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import { verifyEmail } from '@redux/authuser/actions/authuser.actions';
import Loader from '@components/Loader/Loader';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const VerifyEmail = ({
  dispatch, history, token, loading, loaded, error,
}) => {
  const classes = useStyles();

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail({ token }, history));
    }
  }, [token]);

  return (
    <div className={classes.root}>
      {loading && <Loader open={loading} />}
      {loading && (
      <Typography variant="h5" component="h5">
        Verifying email using the verification link
      </Typography>
      )}

      {loaded && error && (
        <Typography variant="h5" component="h5">
          Something doesn't seem right. Please check the link and try again.
        </Typography>
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
  token: ownProps.match.params.token,
});

export default connect(mapStateToProps)(VerifyEmail);
