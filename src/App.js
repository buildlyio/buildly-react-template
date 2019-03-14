import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { PrivateRoute } from "./midgard/components/PrivateRoute";
import { oauthService } from "./midgard/modules/oauth/oauth.service"

import "./App.scss";
import Login from './midgard/pages/login/Login';
import Dashboard from './midgard/pages/dashboard/Dashboard';

class App extends Component{
  render(){
    return(
      <Router>
        <div className="app">
          <Route exact path="/" render={() => (
            oauthService.hasValidAccessToken() ? (
              <Redirect to="/dashboard"/>
            ) : (
              <Redirect to="/login"/>
            )
          )}/>
          <Route path="/login" component={Login} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
        </div>
      </Router>
    );
  }
}

export default hot(module)(App);