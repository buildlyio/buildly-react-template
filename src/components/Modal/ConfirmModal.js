import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

const ConfirmModal = ({
  open,
  setOpen,
  submitAction,
  title,
  submitText,
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
        <DialogContent />
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained" type="button">
            Cancel
          </Button>
          <Button
            onClick={submitAction}
            color="primary"
            variant="contained"
            type="button"
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
