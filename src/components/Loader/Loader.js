import React from 'react';
import {
  Backdrop,
  CircularProgress,
  Box,
  Typography,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const Loader = (props) => {
  const classes = useStyles();
  const { open, setOpen, label } = props;

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
        <Box
          top={-80}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h6" color="inherit">
            {label}
          </Typography>
        </Box>
      </Backdrop>
    </div>
  );
};

export default Loader;
