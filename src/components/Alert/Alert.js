import React from 'react';
import { connect } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { IconButton, Slide, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { hideAlert } from '@redux/alert/alert.actions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  success: {
    backgroundColor: '#009900',
    color: '#000',
  },
  info: {
    backgroundColor: '#0099CC',
    color: '#000',
  },
  warning: {
    backgroundColor: '#FFCC33',
    color: '#000',
  },
  error: {
    backgroundColor: '#FF0033',
    color: '#000',
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
      {data && (
        <Snackbar
          key={`${data.type}-${data.message}`}
          open={data.open || false}
          autoHideDuration={4000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          message={data.message}
          TransitionComponent={(props) => (
            <Slide {...props} direction="left" />
          )}
          classes={{
            root: classes[data.type],
          }}
          action={(
            <>
              <IconButton
                aria-label="close"
                color="inherit"
                sx={{ p: 0.5 }}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </>
          )}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.alertReducer,
});

export default connect(mapStateToProps)(Alert);
