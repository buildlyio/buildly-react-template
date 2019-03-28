import React from 'react'

import './Container.scss'
import NavBar from 'midgard/components/NavBar/NavBar'
import TopBar from 'midgard/components/TopBar/TopBar'
import Profile from './../Profile/Profile'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
//import Products from '../../../clients/products/src/Products';

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
    return (
      <div className="container">
        <div className="container__column">
          <TopBar navHidden={navHidden} action={this.toggleNav} />
          <div className="container__row">
            <NavBar navHidden={navHidden} location={location} history={history} />
            <Route exact path="/app" render={() => (
              <Redirect to="/app/profile"/>
            )} />
            <Route path="/app/profile" component={Profile} />
            <Route path="/app/products" component={Products} />
          </div>
        </div>
      </div>
    )
  }
}

export default Container;