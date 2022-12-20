import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled, alpha } from '@mui/material/styles';
import {
  Group as GroupIcon,
  Logout, Person,
} from '@mui/icons-material';
import logo from '@assets/insights-blue-white.png';
import { UserContext } from '@context/User.context';
import { logout, loadOrgNames } from '@redux/authuser/actions/authuser.actions';
import { routes } from '@routes/routesConstants';
import { hasGlobalAdminRights, hasAdminRights } from '@utils/permissions';
import {
  Avatar,
  Divider, ListItemIcon, Tooltip, Typography,
} from '@mui/material';

const pages = [{ label: 'Dashboard', value: routes.DASHBOARD, pathName: [routes.DASHBOARD, routes.DASHBOARD_TABULAR, routes.DASHBOARD_KANBAN] },
  { label: 'Products', value: routes.PRODUCTS, pathName: [routes.PRODUCTS] },
  { label: 'Releases', value: routes.RELEASE, pathName: [routes.RELEASE] }];

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.secondary.main,
    zIndex: theme.zIndex.drawer + 1,
    width: '100%',
  },
  logo: {
    maxWidth: 176,
    objectFit: 'contain',
  },
  navItems: {
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
  },
  navButton: {
    textTransform: 'uppercase',
    fontSize: 15,
    lineHeight: 1.25,
    alignItems: 'center',
    textAlign: 'center',
    color: theme.palette.contrast.text,
    '&:disabled': {
      backgroundColor: theme.palette.contrast.text,
      color: theme.palette.secondary.main,
      borderRadius: 32,
      paddingLeft: 16,
      paddingRight: 16,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  menuRight: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'row',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    placeContent: 'flex-end center',
    alignItems: 'flex-end',
    color: theme.palette.contrast.text,
    '& p': {
      fontSize: 12,
    },
  },
  accountMenuIItem: {
    margin: 8,
  },
  accountMenuIcon: {
    backgroundColor: theme.palette.contrast.text,
  },
  userIcon: {
    fill: theme.palette.secondary.main,
  },
  menuIcon: {
    color: theme.palette.contrast.text,
  },
  globalFilter: {
    width: theme.spacing(24),
    marginTop: theme.spacing(1.5),
    '& .MuiOutlinedInput-input': {
      padding: theme.spacing(1, 3.5, 1, 2),
    },
  },
  navMenu: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(3),
  },
}));

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

/**
 * Component for the top bar header.
 */
const TopBar = ({
  history, dispatch, orgNames, location,
}) => {
  const classes = useStyles();
  const user = useContext(UserContext);
  const isAdmin = hasAdminRights(user) || hasGlobalAdminRights(user);
  const isSuperAdmin = hasGlobalAdminRights(user);

  const [organization, setOrganization] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  if (!organization) {
    setOrganization(user.organization.name);
  }

  useEffect(() => {
    if (!orgNames) {
      dispatch(loadOrgNames());
    }
  }, []);

  const handleLogoutClick = () => {
    dispatch(logout());
    history.push('/');
  };

  const handleOrganizationChange = (e) => {
    const organization_name = e.target.value;
    setOrganization(organization_name);
    history.push(routes.DASHBOARD);
  };

  // handleCollapseAccountMenu
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Link to={routes.DASHBOARD}>
          <img src={logo} alt="Logo" className={classes.logo} />
        </Link>

        <Box className={classes.navItems}>
          {pages.map((page) => (
            <Button
              key={page.value}
              sx={{ m: 1, display: 'block' }}
              className={classes.navButton}
              disabled={page.pathName.includes(location.pathname)}
              onClick={() => {
                setAnchorEl(null);
                history.push(page.value);
              }}
            >
              {page.label}
            </Button>
          ))}
        </Box>

        <div className={classes.menuRight}>
          {isSuperAdmin && (
            <TextField
              className={classes.globalFilter}
              variant="outlined"
              fullWidth
              id="org"
              label="Organization"
              select
              value={organization}
              onChange={handleOrganizationChange}
            >
              {_.map(orgNames, (org, index) => (
                <MenuItem
                  key={index}
                  value={org}
                >
                  {org}
                </MenuItem>
              ))}
            </TextField>
          )}

          <div className={classes.userInfo}>
            <Typography>{user.first_name}</Typography>
            <Typography>
              {user.organization.name}
              ,
              {' '}
              {user.user_type}
            </Typography>
          </div>
          <Tooltip title="Account settings">
            <IconButton
              size="small"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <Avatar className={classes.accountMenuIcon} sx={{ width: 32, height: 32 }}>
                <Person className={classes.userIcon} />
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem className={classes.accountMenuIItem}>
              <Person />
              {' '}
              My profile
            </MenuItem>
            {isAdmin && (
            <MenuItem className={classes.accountMenuIItem} to={routes.USER_MANAGEMENT}>
              <GroupIcon />
              {' '}
              User management
            </MenuItem>
            )}
            <Divider />
            <MenuItem className={classes.accountMenuIItem} onClick={handleLogoutClick}>
              <ListItemIcon aria-label="logout">
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
  ...state.googleSheetReducer,
});

export default connect(mapStateToProps)(TopBar);
