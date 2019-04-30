import React from 'react'
import NavBar from 'midgard/layout/NavBar/NavBar'
import TopBar from 'midgard/layout/TopBar/TopBar'
import Profile from 'midgard/pages/Profile/Profile'
import { Route, Redirect } from 'react-router-dom'
import { colors } from 'colors'
import styled from 'styled-components'

const ContainerWrapper = styled.div`
  height: 100%;
  display: flex;
  background-color: ${colors.backgroundSecondary};

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

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navHidden: false
    };
    this.toggleNav = this.toggleNav.bind(this);
  }

  toggleNav(navHidden) {
    this.setState({navHidden: navHidden});
  }

  render() {
    const { navHidden } = this.state;
    const { location, history } = this.props;
    const routeItems = [];
    //entryPointForGulp
    return (
      <ContainerWrapper className="container">
        <div className="container__column">
          <TopBar navHidden={navHidden} action={this.toggleNav} />
          <div className="container__row">
            <NavBar navHidden={navHidden} location={location} history={history} />
            <div className="container__scroll">
              <Route exact path="/app" render={() => (
                <Redirect to="/app/profile"/>
              )} />
              <Route path="/app/profile" component={Profile} />
              {routeItems}
            </div>
          </div>
        </div>
      </ContainerWrapper>
    )
  }
}

export default Container;