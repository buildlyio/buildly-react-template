import React, { Component } from "react";
import { hot } from "react-hot-loader";

import { dispatch } from "./store/store"

import "./App.css";

class App extends Component{
  render(){
    return(
      <div className="App">
        <button onClick={ () => {dispatch({type: "TEST_ACTION"});}}> Hello, World! </button>
      </div>
    );
  }
}

export default hot(module)(App);