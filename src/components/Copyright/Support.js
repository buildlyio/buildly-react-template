import React, { useState } from 'react';
import { Button, Link, Menu, MenuItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { routes } from '@routes/routesConstants';

const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: theme.spacing(1),
  },
  link: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

const Support = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <Button
        aria-controls="buildly-support-menu"
        aria-haspopup="true"
        color="primary"
        variant="contained"
        onClick={handleClick}
      >
        Buildly Support
      </Button>
      <Menu
        id="buildly-support-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleClose}>
          <Link className={classes.link} href={routes.HELP}>
            Request Help
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link className={classes.link} href={routes.TICKET_STATUS}>
            Status of Ticket
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link
            className={classes.link}
            href="https://buildly.io/developer-community/"
            target="_blank"
            rel="noopener"
          >
            Community
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link
            className={classes.link}
            href="https://buildly.io/contact-us/"
            target="_blank"
            rel="noopener"
          >
            Contact us
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link
            className={classes.link}
            href="https://buildly.io/"
            target="_blank"
            rel="noopener"
          >
            Accessibility
          </Link>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Support;
