import React, { useState } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Container } from '@mui/material';
import { UserContext, getUser } from '@context/User.context';
import TopBar from '@layout/TopBar/TopBar';
import Roadmap from '@pages/Roadmap/Roadmap';
import UserManagement from '@pages/UserManagement/UserManagement';
import { routes } from '@routes/routesConstants';
import NewProduct from '@pages/NewProduct/NewProduct';
import DeveloperForm from '@pages/DeveloperForm/DeveloperForm';
import Products from '@pages/Products/Products';
import UserProfile from '@pages/UserProfile/UserProfile';
import ReleaseList from '../../modules/release/list/ReleaseList';
import ReleaseDetails from '../../modules/release/details/ReleaseDetails';
import { GlobalStateProvider } from '../../context/globalState';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    paddingTop: '3.5em',
    maxWidth: '100% !important',
  },
}));

/**
 * Container for the app layout when the user is authenticated.
 */
const ContainerDashboard = ({ location, history }) => {
  const classes = useStyles();
  const [navHidden, setNavHidden] = useState(false);

  return (
    <div className={classes.root}>
      <GlobalStateProvider>
        <UserContext.Provider value={getUser()}>
          <TopBar
            navHidden={navHidden}
            setNavHidden={setNavHidden}
            location={location}
            history={history}
          />
          <Container className={classes.content}>
            <Switch>
              <Route
                exact
                path={routes.APP}
                render={() => <Redirect to={routes.ROADMAP} />}
              />
              <Route exact path={`${routes.RELEASE}/:releaseUuid`} component={ReleaseDetails} />
              <Route path={routes.ROADMAP} component={Roadmap} />
              <Route path={routes.USER_PROFILE} component={UserProfile} />
              <Route path={routes.USER_MANAGEMENT} component={UserManagement} />
              <Route path={routes.NEW_PRODUCT} component={NewProduct} />
              <Route path={routes.DEVELOPER_FORM} component={DeveloperForm} />
              <Route path={routes.PRODUCTS} component={Products} />
              <Route path={routes.RELEASE} component={ReleaseList} />
            </Switch>
          </Container>
        </UserContext.Provider>
      </GlobalStateProvider>
    </div>
  );
};

export default ContainerDashboard;
