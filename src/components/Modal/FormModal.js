import React from 'react';
import {
  withStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
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
    color: theme.palette.grey[500],
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
    disableTypography
    className={classes.root}
    {...other}
  >
    <Typography className={titleClass} variant="h6">
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
