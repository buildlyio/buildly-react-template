// react library imports
import { all } from 'redux-saga/effects';
import crudSaga from '@modules/crud/redux/crud.saga';
import authSaga from './authuser/sagas/authuser.saga';
import coregroupSaga from './coregroup/sagas/coregroup.saga';
import coreuserSaga from './coreuser/coreuser.saga';
import googleSheetSaga from './googleSheet/sagas/googleSheet.saga';
import productSaga from './product/sagas/product.saga';
import decisionSaga from './decision/sagas/decision.saga';
import devpartnerSaga from './devpartner/sagas/devpartner.saga';
import milestoneSaga from './milestone/sagas/milestone.saga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    coregroupSaga(),
    coreuserSaga(),
    crudSaga(),
    googleSheetSaga(),
    productSaga(),
    decisionSaga(),
    devpartnerSaga(),
    milestoneSaga()
  ]);
}
