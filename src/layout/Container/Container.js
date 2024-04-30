import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import _ from 'lodash';
import { Container } from '@mui/material';
import { UserContext, getUser } from '@context/User.context';
import TopBar from '../TopBar/TopBar';;
import UserManagement from '@pages/UserManagement/UserManagement';
import { routes } from '@routes/routesConstants';
import { hasAdminRights, hasGlobalAdminRights } from '@utils/permissions';
import { isMobile } from '@utils/mediaQuery';
import './ContainerStyles.css';

const ContainerDashboard = ({ location, history }) => {
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
    <div className="containerRoot">
      <UserContext.Provider value={getUser()}>
        <TopBar
          navHidden={navHidden}
          setNavHidden={setNavHidden}
          options={subNavItems}
          location={location}
          history={history}
        />
        <Container
          className={`containerContent ${!isMobile() && 'containerContentMaxWidth'}`}
        >
          <Route
            exact
            path={routes.APP}
            render={() => <Redirect to={routes.DASHBOARD} />}
          />
          {(hasAdminRights(userData)
            || hasGlobalAdminRights(userData))
            && (
              <Route
                path={routes.USER_MANAGEMENT}
                component={UserManagement}
              />
            )}
        </Container>
      </UserContext.Provider>
    </div>
  );
};

export default ContainerDashboard;
