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
      <div className="navbarToolbar" />
      <List>
        {_.map(NAVIGATION_ITEMS, (item, index) => (
          <React.Fragment
            key={`navItem${index}${item.id}`}
          >
            <NavLink
              to={item.link}
              activeClassName="navbarActive"
              title={item.name}
              className="navbarNavLink"
            >
              <ListItem
                button
                className="navbarNavItems"
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
      className="navbarDrawer"
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
          paper: 'navbarDrawerPaper',
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
          paper: 'navbarDrawerPaper',
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
