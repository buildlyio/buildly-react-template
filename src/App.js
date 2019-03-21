import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { PrivateRoute } from './midgard/routes/PrivateRoute';
import { oauthService } from './midgard/modules/oauth/oauth.service';

import './App.scss';
import Login from './midgard/pages/Login/Login';
import Container from './midgard/pages/Container/Container';

class App extends Component{
  render(){
    return(
      <Router>
        <div className="app">
          <Route exact path="/" render={() => (
            oauthService.hasValidAccessToken() ? (
              <Redirect to="/profile"/>
            ) : (
              <Redirect to="/login"/>
            )
          )}/>
          <Route path="/login" component={Login} />
          <PrivateRoute path="/profile" component={Container} />
        </div>
      </Router>
    );
  }
}

export default hot(module)(App);