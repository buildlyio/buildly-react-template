import productsSaga from 'clients/Products/src/redux/Products.saga'; 
import documentsSaga from 'clients/Documents/src/redux/Documents.saga'; 
// react library imports
import authSaga from "./Auth.saga"
import { all } from 'redux-saga/effects'

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    // import all sagas and call them here:
    //entryPointForGulpStart
    productsSaga(),
    documentsSaga(),
    //entryPointForGulpEnd
    authSaga()
  ])
}
