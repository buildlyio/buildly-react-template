import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext, getUser } from 'midgard/context/User.context';
import TopBar from '@layout/TopBar/TopBar';
import UserManagement from '@pages/UserManagement/UserManagement';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { routes } from '@routes/routesConstants';
import NavBar from '@layout/NavBar/NavBar';
import Custodians from '@pages/Custodians/Custodians';
import MyAccount from '@pages/MyAccount/MyAccount';
import Items from '@pages/Items/Items';
import SensorsGateway from '@pages/SensorsGateway/SensorsGateway';
import Shipment from '@pages/Shipment/Shipment';
import Dashboard from '@pages/Dashboard/Dashboard';
import Reporting from '@pages/Reporting/Reporting';
import { checkForAdmin, checkForGlobalAdmin } from '@utils/utilMethods';
import { isMobile } from '@utils/mediaQuery';
import AdminPanel from '@pages/AdminPanel/AdminPanel';

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
    paddingTop: '6em',
    paddingBottom: theme.spacing(1.5)
  },
  contentMaxWidth: {
    width: 'calc(100vw - 240px)',
    maxWidth: theme.breakpoints.values.lg
  }
}));

/**
 * Container for the app layout when the user is authenticated.
 */
const ContainerDashboard = ({ location, history }) => {
  const [navHidden, setNavHidden] = useState(false);
  const routeItems = [];
  const classes = useStyles();
  const userData = getUser();
  let subNavItems = [];

  if (location.pathname.includes("profile")) {
    subNavItems = [
      { label: "Dashboard", value: "dashboard" },
      { label: "Custodians", value: "custodians" },
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
        {!location.pathname.includes(routes.MY_ACCOUNT) && (
          <NavBar
            navHidden={navHidden}
            setNavHidden={setNavHidden}
            location={location}
            history={history}
          />
        )}
        <Container className={`${classes.content} ${!isMobile() && classes.contentMaxWidth}`}>
          {/* <Route
            exact
            path={routes.APP}
            render={() => <Redirect to={routes.DASHBOARD} />}
          /> */}
          <Route
            exact
            path={routes.APP}
            render={() => <Redirect to={routes.SHIPMENT} />}
          />
          {/* <Route path={routes.DASHBOARD} component={Dashboard} /> */}
          {(checkForAdmin(userData) || checkForGlobalAdmin(userData)) && (
            <Route path={routes.USER_MANAGEMENT} component={UserManagement} />
          )}
          <Route path={routes.CUSTODIANS} component={Custodians} />
          <Route path={routes.MY_ACCOUNT} component={MyAccount} />
          <Route path={routes.ITEMS} component={Items} />
          <Route path={routes.SENSORS_GATEWAY} component={SensorsGateway} />
          <Route path={routes.SHIPMENT} component={Shipment} />
          <Route path={routes.REPORTING} component={Reporting} />
          <Route path={routes.ADMIN_PANEL} component={AdminPanel} />
        </Container>
        {routeItems}
      </UserContext.Provider>
    </div>
  );
}

export default ContainerDashboard;
