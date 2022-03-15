import React from 'react';
import { connect } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import makeStyles from '@mui/styles/makeStyles';
import { hideAlert } from '@redux/alert/alert.actions';

function AlertData(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Alert = ({ data, dispatch }) => {
  const classes = useStyles();
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideAlert());
  };
  return (
    <div className={classes.root}>
      <Snackbar
        open={data ? data.open : false}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {data && (
          <div>
            <AlertData onClose={handleClose} severity={data.type}>
              {data.message}
            </AlertData>
          </div>
        )}
      </Snackbar>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.alertReducer,
});

export default connect(mapStateToProps)(Alert);
