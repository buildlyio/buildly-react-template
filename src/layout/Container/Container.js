import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import _ from 'lodash';
import { Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  UserContext,
  getUser,
} from '../../context/User.context';
import NavBar from '../NavBar/NavBar';
import TopBar from '../TopBar/TopBar';
import AboutPlatform from '../../pages/AboutPlatform/AboutPlatform';
import AdminPanel from '../../pages/AdminPanel/AdminPanel';
import Custodians from '../../pages/Custodians/Custodians';
import Items from '../../pages/Items/Items';
import MyAccount from '../../pages/MyAccount/MyAccount';
import PushNotification from '../../pages/PushNotification/PushNotification';
import Reporting from '../../pages/Reporting/Reporting';
import Gateway from '../../pages/SensorsGateway/Gateway';
import CreateShipment from '../../pages/Shipment/CreateShipment';
import Shipment from '../../pages/Shipment/Shipment';
import UserManagement from '../../pages/UserManagement/UserManagement';
import { routes } from '../../routes/routesConstants';
import {
  checkForAdmin,
  checkForGlobalAdmin,
} from '../../utils/utilMethods';
import { isMobile } from '../../utils/mediaQuery';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  content: {
    flexGrow: 1,
    height: '100%',
    paddingTop: '5.25em',
    paddingBottom: theme.spacing(1.5),
  },
  contentMaxWidth: {
    width: 'calc(100vw - 240px)',
    maxWidth: '100%',
  },
}));

/**
 * Container for the app layout when the user is authenticated.
 */
const ContainerDashboard = ({ location, history }) => {
  const classes = useStyles();
  const userData = getUser();
  const [navHidden, setNavHidden] = useState(false);
  let subNavItems = [];

  if (_.includes(location.pathname, 'profile')) {
    subNavItems = [
      { label: 'Dashboard', value: 'dashboard' },
      { label: 'Custodians', value: 'custodians' },
    ];
  }

  return (
    <div className={classes.root}>
      <UserContext.Provider value={getUser()}>
        <TopBar
          navHidden={navHidden}
          setNavHidden={setNavHidden}
          options={subNavItems}
          location={location}
          history={history}
        />
        {!_.includes(location.pathname, routes.MY_ACCOUNT)
        && (
          <NavBar
            navHidden={navHidden}
            setNavHidden={setNavHidden}
            location={location}
            history={history}
          />
        )}
        <Container
          className={`${classes.content} ${!isMobile() && classes.contentMaxWidth}`}
        >
          <Route
            exact
            path={routes.APP}
            render={() => <Redirect to={routes.SHIPMENT} />}
          />
          {(checkForAdmin(userData)
          || checkForGlobalAdmin(userData))
          && (
            <Route
              path={routes.USER_MANAGEMENT}
              component={UserManagement}
            />
          )}
          <Route
            path={routes.CUSTODIANS}
            component={Custodians}
          />
          <Route
            path={routes.MY_ACCOUNT}
            component={MyAccount}
          />
          <Route
            path={routes.ABOUT_PLATFORM}
            component={AboutPlatform}
          />
          <Route
            path={routes.ITEMS}
            component={Items}
          />
          <Route
            path={routes.TRACKERS}
            component={Gateway}
          />
          <Route
            path={routes.SHIPMENT}
            component={Shipment}
          />
          <Route
            path={routes.REPORTING}
            component={Reporting}
          />
          <Route
            path={routes.ADMIN_PANEL}
            component={AdminPanel}
          />
          <Route
            path={routes.CREATE_SHIPMENT}
            component={CreateShipment}
          />
        </Container>
        <PushNotification />
      </UserContext.Provider>
    </div>
  );
};

export default ContainerDashboard;
