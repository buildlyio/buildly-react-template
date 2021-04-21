import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

export default ConfirmModal = (props) => {
  const { open, setOpen, submitAction, title, submitText } = props;
  
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText id='alert-dialog-description'>
            {title}
          </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={submitAction} color='primary' autoFocus>
            {submitText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
