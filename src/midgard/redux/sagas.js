// react library imports
import authSaga from "./authuser/sagas/authuser.saga";
import crudSaga from "midgard/modules/crud/redux/crud.saga";
import { all } from "redux-saga/effects";
import coreuserSaga from "midgard/redux/coreuser/coreuser.saga";
import coregroupSaga from "./coregroup/sagas/coregroup.saga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    coreuserSaga(),
    coregroupSaga(),
    crudSaga(),
  ]);
}
