import React from 'react';
import { connect } from 'react-redux';
import {
  Snackbar, Slide, IconButton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import { hideAlert } from '../../redux/alert/actions/alert.actions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    '& .MuiSnackbarContent-root': {
      backgroundColor: 'transparent',
    },
  },
  success: {
    backgroundColor: theme.palette.success.main,
  },
  info: {
    backgroundColor: theme.palette.info.main,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
}));

const Alert = ({ data, dispatch }) => {
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideAlert());
    if (data && data.onClose) {
      data.onClose(data.id);
    }
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
