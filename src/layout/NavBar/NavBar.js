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
  useTheme,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { isMobile } from '../../utils/mediaQuery';
import { NAVIGATION_ITEMS } from './NavBarConstants';

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: 240,
      flexShrink: 0,
    },
    backgroundColor: theme.palette.common.drawer,
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: 240,
    backgroundColor: theme.palette.background.dark,
    color: theme.palette.secondary.main,
  },
  active: {
    backgroundColor: '#887C5E !important',
    borderRightColor: theme.palette.primary.main,
    borderRightWidth: 10,
    borderRightStyle: 'solid',
    fontWeight: 'bold',
  },
  navLink: {
    display: 'block',
    textDecoration: 'none',
    color: theme.palette.secondary.main,
  },
  navItems: {
    padding: theme.spacing(3, 4),
    textAlign: 'left',
  },
}));

/**
 * Component for the side navigation.
 */
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
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: {
            xs: 'block',
            md: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        classes={{
          paper: classes.drawerPaper,
        }}
        variant="permanent"
        open
        sx={{
          display: {
            xs: 'none',
            md: 'block',
          },
        }}
      >
        {drawer}
      </Drawer>
    </nav>
  );
};

export default NavBar;
