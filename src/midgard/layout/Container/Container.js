// react library imports
import React, { useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import NavBar from "midgard/layout/NavBar/NavBar";
import TopBar from "midgard/layout/TopBar/TopBar";
import UserManagement from "midgard/pages/UserManagement/UserManagement";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

// react user imports
import { user, UserContext } from "midgard/context/User.context";
import { subNav, SubNavContext } from "midgard/context/SubNav.context";
import { routes } from "../../routes/routesConstants";
import Custodians from "../../pages/Custodians/Custodians";
import MyAccount from "../../pages/MyAccount/MyAccount";
import Items from "../../pages/Items/Items";
import SensorsGateway from "../../pages/SensorsGateway/SensorsGateway";
import Shipment from "../../pages/Shipment/Shipment";
import Dashboard from "../../pages/Dashboard/Dashboard";
import { checkForGlobalAdmin } from "../../utils/utilMethods";
import { isMobile } from "../../utils/mediaQuery";

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
function ContainerDashboard({ location, history, data }) {
  const [navHidden, setNavHidden] = useState(false);
  const routeItems = [];
  const classes = useStyles();

  //entryPointForGulpStart
  //entryPointForGulpEnd

  let userData = "";

  if (data && data.data) {
    userData = data.data;
  }

  let subNavItems = subNav;
  if (location.pathname.includes("profile")) {
    subNavItems = [
      { label: "Dashboard", value: "dashboard" },
      { label: "Custodians", value: "custodians" },
    ];
  }

  return (
    <div className={classes.root}>
      <UserContext.Provider value={user}>
        <SubNavContext.Provider value={subNavItems}>
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
              userData={userData}
            />
          )}
        </SubNavContext.Provider>
        <Container className={`${classes.content} ${!isMobile() && classes.contentMaxWidth}`}>
          <Route
            exact
            path={routes.APP}
            render={() => <Redirect to={routes.DASHBOARD} />}
          />
          <Route path={routes.DASHBOARD} component={Dashboard} />
          {checkForGlobalAdmin(userData) && (
            <Route path={routes.USER_MANAGEMENT} component={UserManagement} />
          )}
          <Route path={routes.CUSTODIANS} component={Custodians} />
          <Route path={routes.MY_ACCOUNT} component={MyAccount} />
          <Route path={routes.ITEMS} component={Items} />
          <Route path={routes.SENSORS_GATEWAY} component={SensorsGateway} />
          <Route path={routes.SHIPMENT} component={Shipment} />
        </Container>
        {routeItems}
      </UserContext.Provider>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
});

export default connect(mapStateToProps)(ContainerDashboard);
