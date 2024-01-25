import React from 'react';
import { Snackbar, Slide, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useStore } from '../../zustand/alert/alertStore';
import './AlertStyles.css';

const Alert = () => {
  const { data, hideAlert } = useStore();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    hideAlert();
    if (data && data.onClose) {
      data.onClose(data.id);
    }
  };

  return (
    <div className="alertRoot">
      {data && (
        <Snackbar
          key={`${data.type}-${data.message}`}
          open={data.open || false}
          autoHideDuration={2000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          message={data.message}
          TransitionComponent={(props) => <Slide {...props} direction="left" />}
          classes={{
            root: `${data.type}`,
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

export default Alert;
