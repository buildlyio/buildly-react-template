import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import GroupIcon from "@material-ui/icons/Group";
import logo from "assets/topbar-logo.png";
import { logout } from "midgard/redux/authuser/actions/authuser.actions";
import { routes } from "midgard/routes/routesConstants";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#2A3744",
    zIndex: theme.zIndex.drawer + 1,
  },
  logo: {
    maxWidth: 50,
    objectFit: "contain",
  },
  menuRight: {
    marginLeft: "auto",
  },
  menuIcon: {
    color: "#fff",
  },
  paper: {
    border: "1px solid",
  },
}));

/**
 * Component for the top bar header.
 */
function TopBar({
  history,
  location,
  dispatch,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogoutClick = () => {
    dispatch(logout());
    history.push("/");
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Link to={routes.DASHBOARD}>
          <img src={logo} className={classes.logo} />
        </Link>

        <div className={classes.menuRight}>
          <Link to={routes.USER_MANAGEMENT}>
            <IconButton aria-label="user-management" color="inherit">
              <GroupIcon fontSize="large" className={classes.menuIcon} />
            </IconButton>
          </Link>
          <IconButton aria-label="logout" color="inherit" onClick={handleLogoutClick}>
            <ExitToAppIcon fontSize="large" className={classes.menuIcon} />
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
