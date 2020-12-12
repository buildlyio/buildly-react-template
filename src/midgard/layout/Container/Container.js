// react library imports
import React, { useState } from "react";
import { Route, Redirect } from "react-router-dom";

// react user imports
import TopBar from "midgard/layout/TopBar/TopBar";
import Profile from "midgard/pages/Profile/Profile";
import UserManagement from "midgard/pages/UserManagement/UserManagement";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { routes } from "midgard/routes/routesConstants";

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
  },
}));

/**
 * Container for the app layout when the user is authenticated.
 */
function ContainerDashboard({ location, history }) {
  const routeItems = [];
  const classes = useStyles();
  //entryPointForGulpStart
    //entryPointForGulpEnd

  return (
    <div className={classes.root}>
      <TopBar
        location={location}
        history={history}
      />
      <Container className={classes.content}>
        <Route
          exact
          path={routes.APP}
          render={() => <Redirect to={routes.DASHBOARD} />}
        />
        <Route path={routes.DASHBOARD} component={Profile} />
        <Route path={routes.USER_MANAGEMENT} component={UserManagement} />
      </Container>
      {routeItems}
    </div>
  );
}

export default ContainerDashboard;
