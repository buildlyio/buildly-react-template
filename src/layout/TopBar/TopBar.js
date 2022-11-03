import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import {
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Menu,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  ExitToApp as ExitToAppIcon,
  Group as GroupIcon,
  KeyboardArrowDown,
} from '@mui/icons-material';
import logo from '@assets/insights-logo.png';
import { UserContext } from '@context/User.context';
import { logout, loadOrgNames } from '@redux/authuser/actions/authuser.actions';
import { routes } from '@routes/routesConstants';
import { hasGlobalAdminRights, hasAdminRights } from '@utils/permissions';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.contrast.main,
    zIndex: theme.zIndex.drawer + 1,
    width: '100%',
  },
  logo: {
    maxWidth: 144,
    objectFit: 'contain',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  menuRight: {
    marginLeft: 'auto',
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

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Link to={routes.DASHBOARD}>
          <img src={logo} alt="Logo" className={classes.logo} />
        </Link>

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

          <>
            <Button
              id="topbar-menu"
              aria-controls="topbar-menu"
              aria-haspopup="true"
              variant="contained"
              disableElevation
              endIcon={<KeyboardArrowDown />}
              className={classes.navMenu}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              Navigate To
            </Button>

            <StyledMenu
              id="topbar-menu"
              MenuListProps={{
                'aria-labelledby': 'topbar-menu',
              }}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem
                disabled={
                  (location.pathname === routes.DASHBOARD_LIST)
                  || (location.pathname === routes.DASHBOARD_KANBAN)
                }
                onClick={() => {
                  setAnchorEl(null);
                  history.push(routes.DASHBOARD);
                }}
              >
                Dashboard
              </MenuItem>

              <MenuItem
                disabled={location.pathname === routes.PRODUCTS}
                onClick={() => {
                  setAnchorEl(null);
                  history.push(routes.PRODUCTS);
                }}
              >
                Products
              </MenuItem>

              <MenuItem
                disabled={location.pathname === routes.RELEASE}
                onClick={() => {
                  setAnchorEl(null);
                  history.push(routes.RELEASE);
                }}
              >
                Releases
              </MenuItem>
            </StyledMenu>
          </>

          {isAdmin && (
            <Link to={routes.USER_MANAGEMENT}>
              <IconButton aria-label="user-management" color="inherit" size="large">
                <GroupIcon fontSize="large" className={classes.menuIcon} />
              </IconButton>
            </Link>
          )}

          <IconButton
            aria-label="logout"
            color="inherit"
            onClick={handleLogoutClick}
            size="large"
          >
            <ExitToAppIcon fontSize="large" className={classes.menuIcon} />
          </IconButton>
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
