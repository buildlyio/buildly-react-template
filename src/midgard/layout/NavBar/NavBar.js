import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { AppContext } from "midgard/context/App.context";
import { NAVIGATION_ITEMS } from "./NavBarConstants";
import { isMobile } from "../../utils/mediaQuery";

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: 240,
      flexShrink: 0,
    },
    backgroundColor: "#646262",
  },
  drawerContainer: {
    overflow: "auto",
  },
  appBar: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${240}px)`,
      marginLeft: 240,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: 240,
    backgroundColor: "#383636",
    color: "#fff",
  },
  active: {
    backgroundColor: "#B46F04 !important",
    fontWeight: "bold",
  },
  navLink: {
    display: "block",
    textDecoration: "none",
    color: "#fff",
  },
  navItems: {
    padding: "24px",
    textAlign: "center",
  },
}));

/**
 * Component for the side navigation.
 */
function NavBar({ navHidden, setNavHidden, location, history }) {
  const classes = useStyles();
  const theme = useTheme();
  let isMobileDevice = isMobile();

  const handleListItemClick = (event, index, item) => {
    if (isMobileDevice) setNavHidden(!navHidden);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        {NAVIGATION_ITEMS.map((items, index) => (
          <React.Fragment key={`${items.id}${index}`}>
            <NavLink
              to={items.link}
              activeClassName={classes.active}
              title={items.name}
              className={classes.navLink}
            >
              <ListItem
                button
                className={classes.navItems}
                key={items.id}
                onClick={(event) => handleListItemClick(event, index, items)}
              >
                <ListItemText primary={items.name} />
              </ListItem>
            </NavLink>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
  const handleDrawerToggle = () => {
    setNavHidden(!navHidden);
  };

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={navHidden}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
}

export default NavBar;
