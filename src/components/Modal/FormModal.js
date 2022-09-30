import React from 'react';
import withStyles from '@mui/styles/withStyles';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
  },
});

const StyledDialogTitle = withStyles(styles)(({
  children,
  classes,
  onClose,
  titleClass,
  ...other
}) => (
  <DialogTitle className={classes.root} {...other}>
    <Typography className={titleClass}>
      {children}
    </Typography>
    {onClose ? (
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={onClose}
        size="large"
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
  wantConfirm,
  openConfirmModal,
  setConfirmModal,
  handleConfirmModal,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      {wantConfirm && (
        <ConfirmModal
          open={openConfirmModal}
          setOpen={setConfirmModal}
          submitAction={handleConfirmModal}
          title="Your changes are unsaved and will be discarded. Are you sure to leave?"
          submitText="Yes"
        />
      )}
    </div>
  );
};

export default FormModal;
