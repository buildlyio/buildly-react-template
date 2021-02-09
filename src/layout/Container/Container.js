import React from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext, getUser } from "@context/User.context";
import TopBar from "@layout/TopBar/TopBar";
import Profile from "@pages/Profile/Profile";
import UserManagement from "@pages/UserManagement/UserManagement";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { routes } from "@routes/routesConstants";

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
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <UserContext.Provider value={getUser()}>
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
      </UserContext.Provider>
    </div>
  );
}

export default ContainerDashboard;
