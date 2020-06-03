import React, { useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { AppContext } from "midgard/context/App.context";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: 240,
      flexShrink: 0,
    },
    height: "100%",
    backgroundColor: "#646262",
  },
  drawerContainer: {
    overflow: "auto",
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${240}px)`,
      marginLeft: 240,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
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
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        {["Dashboard", "Shipment", "Items", "Custodian"].map((text, index) => (
          <React.Fragment>
            <ListItem
              button
              className={classes.navItems}
              key={text}
              classes={{ selected: classes.active }}
              selected={selectedIndex === index}
              onClick={(event) => handleListItemClick(event, index)}
            >
              <ListItemText primary={text} />
            </ListItem>
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
      <Hidden xsDown implementation="css">
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
  // const app = useContext(AppContext);
  // const setActive = (active) => {
  //   const { from } = location.state || { from: { pathname: `/app/${active}` } };
  //   history.push(from);
  // };
  // return (
  //   <NavBarWrapper className="nav-bar" hidden={navHidden}>
  //     <div className="nav-bar__container">
  //       <div className="nav-bar__elements"></div>
  //       <NavUser location={location} history={history} />
  //     </div>
  //   </NavBarWrapper>
  // );
}

export default NavBar;
