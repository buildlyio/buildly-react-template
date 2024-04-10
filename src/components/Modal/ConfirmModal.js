import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

const ConfirmModal = ({
  open,
  setOpen,
  submitAction,
  title,
  submitText,
  msg1,
  msg2,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          {msg1 && (<Typography variant="body1" textAlign="center" width="100%">{msg1}</Typography>)}
          {msg2 && (<Typography variant="body1" textAlign="center" width="100%">{msg2}</Typography>)}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submitAction}
            color="primary"
            autoFocus
          >
            {submitText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmModal;
