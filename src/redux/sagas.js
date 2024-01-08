import { all } from 'redux-saga/effects';
import crudSaga from '@modules/crud/redux/crud.saga';
import authSaga from './authuser/sagas/authuser.saga';
import coreGroupSaga from './coregroup/sagas/coregroup.saga';
import coreUserSaga from './coreuser/coreuser.saga';
import custodianSaga from './custodian/sagas/custodian.saga';
import sensorsGatewaySaga from './sensorsGateway/sagas/sensorsGateway.saga';
import shipmentSaga from './shipment/sagas/shipment.saga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    custodianSaga(),
    coreUserSaga(),
    coreGroupSaga(),
    crudSaga(),
    sensorsGatewaySaga(),
    shipmentSaga(),
  ]);
}
