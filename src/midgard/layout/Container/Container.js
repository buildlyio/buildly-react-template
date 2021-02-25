import React, { useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext, getUser } from "midgard/context/User.context";
import TopBar from "midgard/layout/TopBar/TopBar";
import UserManagement from "midgard/pages/UserManagement/UserManagement";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { routes } from "midgard/routes/routesConstants";
import NavBar from "midgard/layout/NavBar/NavBar";
import Custodians from "midgard/pages/Custodians/Custodians";
import MyAccount from "midgard/pages/MyAccount/MyAccount";
import Items from "midgard/pages/Items/Items";
import SensorsGateway from "midgard/pages/SensorsGateway/SensorsGateway";
import Shipment from "midgard/pages/Shipment/Shipment";
import Dashboard from "midgard/pages/Dashboard/Dashboard";
import Reporting from "midgard/pages/Reporting/Reporting";
import { checkForAdmin, checkForGlobalAdmin } from "midgard/utils/utilMethods";
import { isMobile } from "midgard/utils/mediaQuery";
import AdminPanel from "midgard/pages/AdminPanel/AdminPanel";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  content: {
    flexGrow: 1,
    height: "100%",
    paddingTop: "6em",
    paddingBottom: theme.spacing(1.5)
  },
  contentMaxWidth: {
    width: "calc(100vw - 240px)",
    maxWidth: theme.breakpoints.values.lg
  }
}));

/**
 * Container for the app layout when the user is authenticated.
 */
function ContainerDashboard({ location, history }) {
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
