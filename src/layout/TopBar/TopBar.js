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
import {
  Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Divider, Grid, ListItemIcon, Tooltip, Typography,
} from '@mui/material';
import logo from '@assets/insights-orange-white.png';
import { UserContext } from '@context/User.context';
import {
  logout, loadOrgNames, loadStripeProducts, VERIFY_EMAIL_SUCCESS, getUser,
} from '@redux/authuser/actions/authuser.actions';
import { routes } from '@routes/routesConstants';
import { hasGlobalAdminRights, hasAdminRights } from '@utils/permissions';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import StripeCard from '@components/StripeCard/StripeCard';
import { isMobile } from '@utils/mediaQuery';
import { useInput } from '@hooks/useInput';
import { validators } from '@utils/validators';
import { httpService } from '@modules/http/http.service';

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
    '&:active': {
      backgroundColor: theme.palette.contrast.text,
      color: theme.palette.secondary.main,
      borderRadius: 32,
      paddingLeft: 16,
      paddingRight: 16,
    },
    '&:disabled': {
      color: theme.palette.secondary.dark,
      cursor: 'not-allowed',
    },
  },
  isActive: {
    backgroundColor: theme.palette.contrast.text,
    color: theme.palette.secondary.main,
    borderRadius: 32,
    paddingLeft: 16,
    paddingRight: 16,
    '&:hover': {
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
  dialogActionButtons: {
    padding: theme.spacing(0, 2.5, 2, 0),
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
  history,
  dispatch,
  orgNames,
  location,
  stripeProducts,
}) => {
  const classes = useStyles();
  const user = useContext(UserContext);
  const isAdmin = hasAdminRights(user) || hasGlobalAdminRights(user);
  const isSuperAdmin = hasGlobalAdminRights(user);

  const [organization, setOrganization] = useState(null);

  // Check if there is an active subscription
  const maxDate = new Date();
  maxDate.setHours(0, 0, 0, 0);
  maxDate.setDate(maxDate.getDate() + 1);

  const activePlan = user.subscriptions
    .find((subscription) => new Date(subscription.subscription_end_date) > maxDate);

  const pages = [{
    label: 'Dashboard',
    value: routes.DASHBOARD,
    pathName: [routes.DASHBOARD, routes.DASHBOARD_TABULAR, routes.DASHBOARD_KANBAN, routes.DASHBOARD_REPORT],
  },
  {
    label: 'Products',
    value: routes.PRODUCTS,
    pathName: [routes.PRODUCTS],
  },
  {
    label: 'Releases',
    value: routes.RELEASE,
    pathName: [routes.RELEASE],
    disabled: !activePlan,
  }];

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [planDialogOpen, setOpen] = React.useState(false);

  const product = useInput('', { required: true });
  const [formError, setFormError] = useState({});

  if (!organization) {
    setOrganization(user.organization.name);
  }

  // Open upgrade plan dialog
  const handleDialogOpen = () => {
    setOpen(true);
  };

  // Close upgrade plan dialog
  const handleDialogClose = (event, reason) => {
    if (reason && reason === ('backdropClick' || 'escapeKeyDown')) {
      return;
    }
    setOpen(false);
  };

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

  useEffect(() => {
    if (!orgNames) {
      dispatch(loadOrgNames());
    }
    if (window.env.STRIPE_KEY && !stripeProducts) {
      dispatch(loadStripeProducts());
    }

    if (organization) {
      setShowProducts(true);
    } else {
      setShowProducts(false);
    }
  }, []);

  /**
   * Handle input field blur event
   * @param {Event} e Event
   * @param {String} validation validation type if any
   * @param {Object} input input field
   */
  const handleBlur = (e, validation, input) => {
    const validateObj = validators(validation, input);
    const prevState = { ...formError };
    if (validateObj && validateObj.error) {
      setFormError({
        ...prevState,
        [e.target.id]: validateObj,
      });
    } else {
      setFormError({
        ...prevState,
        [e.target.id]: {
          error: false,
          message: '',
        },
      });
    }
  };

  /**
   * Enable/Disable upgrade plan submit button
   * @returns {boolean}
   */
  const submitDisabled = () => {
    try {
      if (
        (showProducts && !product.value)
        || (showProducts && cardError)
        || (showProducts && !elements)
        // eslint-disable-next-line no-underscore-dangle
        || (showProducts && elements && elements.getElement('card')._empty)
      ) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return !!Object.keys(formError)
      .find((key) => formError[key].error);
  };

  /**
   * Submit the upgrade plan form
   * @param {Event} event the default submit event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    let validationError = '';

    if (showProducts) {
      const {
        error,
        paymentMethod,
      } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement('card'),
        billing_details: {
          email: user.email,
          name: organization,
        },
      });
      validationError = error;
      const formValue = {
        product: product.value,
        card_id: paymentMethod?.id,
      };

      if (!validationError) {
        // save subscription
        try {
          httpService.makeRequest('post',
            `${window.env.API_URL}subscription/`,
            formValue)
            .then(() => {
              dispatch(getUser());
            });
        } catch (httpError) {
          console.log('httpError : ', httpError);
        }

        handleDialogClose();
      }
    }
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
              sx={{
                m: 1,
                display: 'block',
              }}
              className={`${classes.navButton} ${page.pathName.includes(location.pathname) ? classes.isActive : ''}`}
              disabled={page.disabled}
              onClick={() => {
                setAnchorEl(null);
                history.push(page.value);
              }}
            >
              {page.label}
            </Button>
          ))}

          {
            !(user && user.subscriptions && user.subscriptions.length) && (
              <Button
                variant="contained"
                size="small"
                onClick={handleDialogOpen}
              >
                Upgrade plan
              </Button>
            )
          }
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
              <Avatar
                className={classes.accountMenuIcon}
                sx={{
                  width: 32,
                  height: 32,
                }}
              >
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
            transformOrigin={{
              horizontal: 'right',
              vertical: 'top',
            }}
            anchorOrigin={{
              horizontal: 'right',
              vertical: 'bottom',
            }}
          >
            <MenuItem
              className={classes.accountMenuIItem}
              onClick={() => {
                history.push(routes.USER_PROFILE);
              }}
            >
              <Person />
              {' '}
              My profile
            </MenuItem>
            {isAdmin && (
              <MenuItem
                className={classes.accountMenuIItem}
                onClick={() => {
                  history.push(routes.USER_MANAGEMENT);
                }}
              >
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

        {/* Upgrade plan dialogue */}
        <Dialog open={planDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>Upgrade plan</DialogTitle>
          <DialogContent>
            <Grid
              className={showProducts ? '' : classes.hidden}
              container
              spacing={isMobile() ? 0 : 3}
            >
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  id="product"
                  name="product"
                  required
                  label="Subscription to Product"
                  autoComplete="product"
                  error={formError.product && formError.product.error}
                  helperText={
                    formError.product ? formError.product.message : ''
                  }
                  onBlur={(e) => handleBlur(e, 'required', product)}
                  {...product.bind}
                >
                  <MenuItem value="">----------</MenuItem>
                  {stripeProducts && !_.isEmpty(stripeProducts)
                    && _.map(stripeProducts, (prd) => (
                      <MenuItem key={`sub-product-${prd.id}`} value={prd.id}>
                        {`${prd.name}`}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
            </Grid>
            <Grid
              className={showProducts ? '' : classes.hidden}
              container
              spacing={isMobile() ? 0 : 3}
            >
              <Grid item xs={12}>
                <StripeCard
                  cardError={cardError}
                  setCardError={setCardError}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className={classes.dialogActionButtons}>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button
              variant="contained"
              disabled={submitDisabled()}
              onClick={handleSubmit}
            >
              Upgrade
            </Button>
          </DialogActions>
        </Dialog>

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
