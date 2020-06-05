// react library imports
import React, { useState } from "react";
import { Route, Redirect } from "react-router-dom";
import styled from "styled-components";
import { colors } from "colors";

// react user imports
import NavBar from "midgard/layout/NavBar/NavBar";
import TopBar from "midgard/layout/TopBar/TopBar";
import Profile from "midgard/pages/Profile/Profile";
import UserManagement from "midgard/pages/UserManagement/UserManagement";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import { user, UserContext } from "midgard/context/User.context";
import { subNav, SubNavContext } from "midgard/context/SubNav.context";

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
    marginTop: "4em",
  },
}));

/**
 * Container for the app layout when the user is authenticated.
 */
function ContainerDashboard({ location, history }) {
  const [navHidden, setNavHidden] = useState(false);
  const routeItems = [];
  const classes = useStyles();
  //entryPointForGulpStart
  //entryPointForGulpEnd

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
          <NavBar
            navHidden={navHidden}
            setNavHidden={setNavHidden}
            location={location}
            history={history}
          />
        </SubNavContext.Provider>
        <Container className={classes.content}>
          <Route
            exact
            path="/app"
            render={() => <Redirect to="/dashboard" />}
          />
          <Route
            exact
            path="/app/profile"
            render={() => <Redirect to="/custordians" />}
          />
          <Route path="/app/dashboard" component={Profile} />
          <Route path="/app/profile/users" component={UserManagement} />
        </Container>
        {routeItems}
      </UserContext.Provider>
    </div>
  );
}

export default ContainerDashboard;
