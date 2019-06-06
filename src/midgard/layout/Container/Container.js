import Products from 'clients/Products/src/Products'; 
import Documents from 'clients/Documents/src/Documents'; 
import Blueprint from 'clients/Blueprint/src/Blueprint'; 
// react library imports
import React, { useState } from 'react'
import { Route, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { colors } from 'colors'

// react user imports
import NavBar from 'midgard/layout/NavBar/NavBar'
import TopBar from 'midgard/layout/TopBar/TopBar'
import Profile from 'midgard/pages/Profile/Profile'
import UserManagement from 'midgard/pages/UserManagement/UserManagement'

import { user, UserContext } from 'midgard/context/User.context'
import { subNav, SubNavContext } from 'midgard/context/SubNav.context'

const ContainerWrapper = styled.div`
  height: 100%;
  display: flex;
  background-color: ${colors.baseLighter};

  .container {
    &__row {
      display: flex;
      flex: 1;
    }

    &__column {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    &__scroll {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: scroll;
    }
  }
`

/**
 * Container for the app layout when the user is authenticated.
 */
function Container({ location, history }) {
  const [navHidden, setNavHidden] = useState(false);
  const routeItems = [];
    //entryPointForGulpStart
    routeItems.push(<Route key="products" path="/app/products/" component={Products} />);
    routeItems.push(<Route key="documents" path="/app/documents/" component={Documents} />);
    routeItems.push(<Route key="blueprint" path="/app/blueprint/" component={Blueprint} />);
    //entryPointForGulpEnd

  let subNavItems = subNav;
  if (location.pathname.includes('profile')) {
    subNavItems = [{ label: 'Profile settings', value: 'profile/settings' }, { label: 'User management', value: 'profile/users/current-users' }];
  }

  return (
    <ContainerWrapper className="container">
      <UserContext.Provider value={user}>
        <div className="container__column">
          <SubNavContext.Provider value={subNavItems}>
            <TopBar navHidden={navHidden} setNavHidden={setNavHidden} options={subNavItems} location={location} history={history} />
          </SubNavContext.Provider>
          <div className="container__row">
            <NavBar navHidden={navHidden} location={location} history={history} />
            <div className="container__scroll">
              <Route exact path="/app" render={() => (
                <Redirect to="/app/profile"/>
              )} />
              <Route exact path="/app/profile" render={() => (
                <Redirect to="/app/profile/settings"/>
              )} />
              <Route path="/app/profile/settings" component={Profile} />
              <Route path="/app/profile/users" component={UserManagement} />
              {routeItems}
            </div>
          </div>
        </div>
      </UserContext.Provider>
    </ContainerWrapper>
  )
}

export default Container;
