import React, { useContext, useState, useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Hidden from "@material-ui/core/Hidden";
import { AppContext } from "midgard/context/App.context";
import { SubNavContext } from "midgard/context/SubNav.context";
import logo from "assets/tp-logo.png";
import { logout, getUser } from "../../redux/authuser/actions/authuser.actions";
import AccountMenu from "./AccountMenu";
import { routes } from "../../routes/routesConstants";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#383636",
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    maxWidth: 160,
  },
  menuRight: {
    marginLeft: "auto",
  },
  paper: {
    border: "1px solid",
  },
}));

/**
 * Component for the top bar header.
 */
function TopBar({
  navHidden,
  setNavHidden,
  history,
  location,
  dispatch,
  data,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  console.log("data", data);

  let user;

  if (data && data.data) {
    user = data.data;
  }

  useEffect(() => {
    dispatch(getUser());
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogoutClick = () => {
    dispatch(logout());
    history.push("/");
  };

  const handleMyAccountClick = () => {
    history.push(routes.MY_ACCOUNT, { user });
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Hidden mdUp>
          <IconButton
            edge="start"
            className={classes.menuButton}
            onClick={() => setNavHidden(!navHidden)}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <img src={logo} className={classes.logo} />

        <div className={classes.menuRight}>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle fontSize="large" />
          </IconButton>
          <AccountMenu
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            user={user}
            handleLogoutClick={handleLogoutClick}
            handleMyAccountClick={handleMyAccountClick}
          />
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
