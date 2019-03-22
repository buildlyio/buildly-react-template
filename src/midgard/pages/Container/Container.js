import React from 'react'

import './Container.scss'
import NavBar from 'midgard/components/NavBar/NavBar'
import TopBar from 'midgard/components/TopBar/TopBar'
import Profile from './../Profile/Profile'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

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
    return (
      <div className="container">
        <div className="container__column">
          <TopBar navHidden={navHidden} action={this.toggleNav} />
          <div className="container__row">
            <NavBar navHidden={navHidden} />          
            <Route path="/" component={Profile} />
          </div>
        </div>
      </div>
    )
  }
}

export default Container;