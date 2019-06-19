import productsSaga from 'clients/Products/src/redux/products.saga'; 
import blueprintSaga from 'clients/Blueprint/src/redux/blueprint.saga'; 
// react library imports
import authSaga from "./authuser/sagas/authuser.saga"
import crudSaga from "midgard/modules/crud/redux/crud.saga"
import { all } from 'redux-saga/effects'
import coreUserSaga from "midgard/redux/coreuser/coreuser.saga";
import coreGroupSaga from "./coregroup/sagas/coregroup.saga"

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    // import all sagas and call them here:
    //entryPointForGulpStart
    productsSaga(),
    blueprintSaga(),
    //entryPointForGulpEnd
    authSaga(),
    coreUserSaga(),
    coreGroupSaga(),
    crudSaga()
  ])
}
