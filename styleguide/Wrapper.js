import React, { Component } from 'react'
import ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import configureStore from '../src/redux/storeMock'
const initialState = {
  app: {
    name: 'Pizza Delivery'
  }
}
const store = configureStore({ initialState });
export default class Wrapper extends Component {
  render() {
    return <Provider store={store}>{this.props.children}</Provider>
  }
}
