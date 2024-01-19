import React from 'react';
import { NavLink } from 'react-router-dom';
import _ from 'lodash';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from '@mui/material';
import { isMobile } from '../../utils/mediaQuery';
import { NAVIGATION_ITEMS } from './NavBarConstants';
import './NavBarStyles.css';

const NavBar = ({ navHidden, setNavHidden, data }) => {
  const theme = useTheme();
  const isMobileDevice = isMobile();

  const isAdmin = false;

  const handleListItemClick = (event, index, item) => {
    if (isMobileDevice) {
      setNavHidden(!navHidden);
    }
  };

  const drawer = (
    <div>
      <div className="toolbar" />
      <List>
        {_.map(NAVIGATION_ITEMS, (item, index) => (
          <React.Fragment
            key={`navItem${index}${item.id}`}
          >
            <NavLink
              to={item.link}
              activeClassName="active"
              title={item.name}
              className="navLink"
            >
              <ListItem
                button
                className="navItems"
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
      className="drawer"
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
          paper: 'drawerPaper',
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
          paper: 'drawerPaper',
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
