import React from 'react';
import { NavLink } from 'react-router-dom';
import _ from 'lodash';
import {
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import { isMobile } from '@utils/mediaQuery';
import { NAVIGATION_ITEMS } from './NavBarConstants';

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: 240,
      flexShrink: 0,
    },
    backgroundColor: theme.palette.neutral.light,
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: 240,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  active: {
    backgroundColor: theme.palette.neutral.dark,
    borderRightColor: theme.palette.primary.main,
    borderRightWidth: 10,
    borderRightStyle: 'solid',
    fontWeight: 'bold',
  },
  navLink: {
    display: 'block',
    textDecoration: 'none',
    color: theme.palette.secondary.contrastText,
  },
  navItems: {
    padding: theme.spacing(3, 4),
    textAlign: 'left',
  },
}));


const NavBar = ({ navHidden, setNavHidden }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobileDevice = isMobile();

  const handleListItemClick = (event, index, item) => {
    if (isMobileDevice) {
      setNavHidden(!navHidden);
    }
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        {_.map(NAVIGATION_ITEMS, (item, index) => (
          <React.Fragment
            key={`navItem${index}${item.id}`}
          >
            <NavLink
              to={item.link}
              activeClassName={classes.active}
              title={item.name}
              className={classes.navLink}
            >
              <ListItem
                button
                className={classes.navItems}
                onClick={(event) => {
                  handleListItemClick(event, index, item);
                }}
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
    <nav
      className={classes.drawer}
      aria-label="mailbox folders"
    >
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={
            theme.direction === 'rtl'
              ? 'right'
              : 'left'
          }
          open={navHidden}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
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
};

export default NavBar;
