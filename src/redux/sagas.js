// react library imports
import { all } from 'redux-saga/effects';
import crudSaga from '@modules/crud/redux/crud.saga';
import authSaga from './authuser/sagas/authuser.saga';
import coregroupSaga from './coregroup/sagas/coregroup.saga';
import coreuserSaga from './coreuser/coreuser.saga';

export default function* rootSaga() {
  yield all([authSaga(), coregroupSaga(), coreuserSaga(), crudSaga()]);
}
