import authSaga from "./Auth.saga"
import productsSaga from "clients/Products/src/redux/Products.saga"
import { all } from 'redux-saga/effects'

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    // import all sagas and call them here:
    authSaga(),
    productsSaga()
  ])
}
