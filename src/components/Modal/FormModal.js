import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import ConfirmModal from './ConfirmModal';
import { isMobile } from '../../utils/mediaQuery';
import './ModalStyles.css';

const FormModal = ({
  open,
  handleClose,
  title,
  children,
  openConfirmModal,
  setConfirmModal,
  handleConfirmModal,
}) => (
  <div>
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      fullScreen={isMobile()}
      maxWidth="md"
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="dialog-title" className="modalRoot">
        <Typography className="modalTitle" variant="inherit">
          {title}
        </Typography>
        {handleClose ? (
          <IconButton
            aria-label="close"
            className="modalCloseButton"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
    <ConfirmModal
      open={openConfirmModal}
      setOpen={setConfirmModal}
      submitAction={handleConfirmModal}
      title="Your changes are unsaved and will be discarded. Are you sure to leave?"
      submitText="Yes"
    />
  </div>
);

export default FormModal;
