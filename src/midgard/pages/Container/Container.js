import React from 'react'

import './Container.scss'
import NavBar from 'midgard/components/NavBar/NavBar'
import TopBar from 'midgard/components/TopBar/TopBar'
import Profile from './../Profile/Profile'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

class Container extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div className="container__row">
          <NavBar />
          <div className="container__column">
            <TopBar />          
            <Route path="/" component={Profile} />
          </div>
        </div>
      </div>
    )
  }
}

export default Container;