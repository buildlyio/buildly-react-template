// react library imports
import { all } from 'redux-saga/effects';
import crudSaga from '@modules/crud/redux/crud.saga';
import authSaga from './authuser/sagas/authuser.saga';
import coregroupSaga from './coregroup/sagas/coregroup.saga';
import coreuserSaga from './coreuser/coreuser.saga';
import googleSheetSaga from './googleSheet/sagas/googleSheet.saga';
import devPartnerSaga from './devpartner/sagas/devpartner.saga';
import projecttoolSaga from './project/sagas/project.saga';
import releaseSaga from './release/sagas/release.saga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    coregroupSaga(),
    coreuserSaga(),
    crudSaga(),
    googleSheetSaga(),
    devPartnerSaga(),
    projecttoolSaga(),
    releaseSaga(),
  ]);
}
