// react library imports
import { all } from 'redux-saga/effects';
import crudSaga from '@modules/crud/redux/crud.saga';
import authSaga from './authuser/sagas/authuser.saga';
import consortiumSaga from './consortium/sagas/consortium.saga';
import coreGroupSaga from './coregroup/sagas/coregroup.saga';
import coreUserSaga from './coreuser/coreuser.saga';
import custodianSaga from './custodian/sagas/custodian.saga';
import importExportSaga from './importExport/sagas/importExport.saga';
import itemSaga from './items/sagas/items.saga';
import sensorsGatewaySaga from './sensorsGateway/sagas/sensorsGateway.saga';
import shipmentSaga from './shipment/sagas/shipment.saga';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    // import all sagas and call them here:
    authSaga(),
    consortiumSaga(),
    custodianSaga(),
    coreUserSaga(),
    coreGroupSaga(),
    crudSaga(),
    itemSaga(),
    sensorsGatewaySaga(),
    shipmentSaga(),
    importExportSaga(),
  ]);
}
