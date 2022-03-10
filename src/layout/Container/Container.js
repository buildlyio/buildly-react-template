import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext, getUser } from '@context/User.context';
import TopBar from '@layout/TopBar/TopBar';
import Profile from '@pages/Profile/Profile';
import UserManagement from '@pages/UserManagement/UserManagement';
import MatContainer from '@mui/material/Container';
import makeStyles from '@mui/styles/makeStyles';
import { routes } from '@routes/routesConstants';

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
  },
}));

/**
 * Container for the app layout when the user is authenticated.
 */
function Container({ location, history }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <UserContext.Provider value={getUser()}>
        <TopBar
          location={location}
          history={history}
        />
        <MatContainer className={classes.content}>
          <Route
            exact
            path={routes.APP}
            render={() => <Redirect to={routes.DASHBOARD} />}
          />
          <Route path={routes.DASHBOARD} component={Profile} />
          <Route path={routes.USER_MANAGEMENT} component={UserManagement} />
        </MatContainer>
      </UserContext.Provider>
    </div>
  );
}

export default Container;
