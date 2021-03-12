import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles, AppBar, Toolbar, IconButton } from '@material-ui/core';
import {
  ExitToApp as ExitToAppIcon,
  Group as GroupIcon,
} from '@material-ui/icons';
import logo from '@assets/topbar-logo.png';
import { logout } from '@redux/authuser/actions/authuser.actions';
import { routes } from '@routes/routesConstants';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.secondary.light,
    zIndex: theme.zIndex.drawer + 1,
  },
  logo: {
    maxWidth: 50,
    objectFit: 'contain',
  },
  menuRight: {
    marginLeft: 'auto',
  },
  menuIcon: {
    color: theme.palette.secondary.contrastText,
  },
  paper: {
    border: '1px solid',
  },
}));

/**
 * Component for the top bar header.
 */
function TopBar({ history, location, dispatch }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogoutClick = () => {
    dispatch(logout());
    history.push('/');
  };

  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar>
        <Link to={routes.DASHBOARD}>
          <img src={logo} className={classes.logo} />
        </Link>

        <div className={classes.menuRight}>
          <Link to={routes.USER_MANAGEMENT}>
            <IconButton aria-label='user-management' color='inherit'>
              <GroupIcon fontSize='large' className={classes.menuIcon} />
            </IconButton>
          </Link>
          <IconButton
            aria-label='logout'
            color='inherit'
            onClick={handleLogoutClick}
          >
            <ExitToAppIcon fontSize='large' className={classes.menuIcon} />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
});

export default connect(mapStateToProps)(TopBar);
