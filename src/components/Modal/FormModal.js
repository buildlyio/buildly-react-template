import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import { Close as CloseIcon } from '@mui/icons-material';
import ConfirmModal from './ConfirmModal';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.background.dark,
  },
});

const StyledDialogTitle = withStyles(styles)(({
  children,
  classes,
  onClose,
  titleClass,
  ...other
}) => (
  <DialogTitle
    className={classes.root}
    {...other}
  >
    <Typography className={titleClass} variant="inherit">
      {children}
    </Typography>
    {onClose ? (
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    ) : null}
  </DialogTitle>
));

const FormModal = ({
  open,
  handleClose,
  title,
  children,
  titleClass,
  maxWidth,
  openConfirmModal,
  setConfirmModal,
  handleConfirmModal,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        fullScreen={isMobile}
        maxWidth={maxWidth}
        aria-labelledby="form-dialog-title"
      >
        <StyledDialogTitle
          id="customized-dialog-title"
          titleClass={titleClass}
          onClose={handleClose}
        >
          {title}
        </StyledDialogTitle>
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
};

export default FormModal;
