import productsSaga from 'clients/products/src/redux/products.saga'; 
import documentsSaga from 'clients/documents/src/redux/documents.saga'; 
import blueprintSaga from 'clients/blueprint/src/redux/blueprint.saga'; 
// react library imports
import authSaga from "./authuser/sagas/authuser.saga"
import { all } from 'redux-saga/effects'
import coreUserSaga from "midgard/redux/coreuser/coreuser.saga";
import coreGroupSaga from "./coregroup/sagas/coregroup.saga"

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    // import all sagas and call them here:
    //entryPointForGulpStart
    productsSaga(),
    documentsSaga(),
    blueprintSaga(),
    //entryPointForGulpEnd
    authSaga(),
    coreUserSaga(),
    coreGroupSaga()
  ])
}
