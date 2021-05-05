import React from 'react';
import {
  withStyles,
  Dialog,
  DialogContent,
  DialogTitle as MuiDialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

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

const DialogTitle = withStyles(styles)((props) => {
  const {
    children, classes, onClose, titleClass, ...other
  } = props;
  return (
    <MuiDialogTitle
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
    </MuiDialogTitle>
  );
});

const Modal = ({
  open,
  setOpen,
  title,
  children,
  titleClass,
  maxWidth,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    setOpen(false);
  };

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
        <DialogTitle
          id="customized-dialog-title"
          titleClass={titleClass}
          onClose={handleClose}
        >
          {title}
        </DialogTitle>
        <DialogContent>
          {children}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Modal;
