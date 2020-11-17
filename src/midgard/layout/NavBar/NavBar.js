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
import { checkForGlobalAdmin } from "../../utils/utilMethods";

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
    backgroundColor: "#887C5E !important",
    borderRightColor: theme.palette.primary.main,
    borderRightWidth: 10,
    borderRightStyle: "solid",
    fontWeight: "bold",
  },
  navLink: {
    display: "block",
    textDecoration: "none",
    color: "#fff",
  },
  navItems: {
    padding: theme.spacing(3, 4),
    textAlign: "left",
  },
}));

const getFilteredNavItems = (userData, navItems) => {
  let isGlobalAdmin = checkForGlobalAdmin(userData);

  if (isGlobalAdmin) return navItems;
  else
    return navItems.filter((nav) => {
      return nav.id !== "user_management";
    });
};

/**
 * Component for the side navigation.
 */
function NavBar({ navHidden, setNavHidden, location, history, userData }) {
  const classes = useStyles();
  const theme = useTheme();
  let isMobileDevice = isMobile();

  let navItems = getFilteredNavItems(userData, NAVIGATION_ITEMS);

  const handleListItemClick = (event, index, item) => {
    if (isMobileDevice) setNavHidden(!navHidden);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        {navItems.map((item, index) => (
          <React.Fragment key={`navItem${index}${item.id}`}>
            <NavLink
              to={item.link}
              activeClassName={classes.active}
              title={item.name}
              className={classes.navLink}
            >
              <ListItem
                button
                className={classes.navItems}
                onClick={(event) => handleListItemClick(event, index, item)}
              >
                <ListItemText primary={item.name} />
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
