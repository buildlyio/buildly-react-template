import React, { Component } from "react";
import { hot } from "react-hot-loader";

import { dispatch } from "./store/store"

import "./App.scss";
import Login from './midgard/pages/login/Login';

class App extends Component{
  render(){
    return(
      <div className="app">
        <Login />
        {/* <button onClick={ () => {dispatch({type: "TEST_ACTION"});}}> Hello, World! </button> */}
      </div>
    );
  }
}

export default hot(module)(App);