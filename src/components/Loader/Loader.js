import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Backdrop, CircularProgress } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const Loader = (props) => {
  const classes = useStyles();
  const { open, setOpen } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Loader;
