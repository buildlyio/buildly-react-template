// react library imports
import authSaga from './authuser/sagas/authuser.saga';
import { all } from 'redux-saga/effects';
import crudSaga from '@modules/crud/redux/crud.saga';
import coreUserSaga from './coreuser/coreuser.saga';
import coreGroupSaga from './coregroup/sagas/coregroup.saga';
import custodianSaga from './custodian/sagas/custodian.saga';
import itemSaga from './items/sagas/items.saga';
import sensorsGatewaySaga from './sensorsGateway/sagas/sensorsGateway.saga';
import shipmentSaga from './shipment/sagas/shipment.saga';
import importExportSaga from './importExport/sagas/importExport.saga';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    // import all sagas and call them here:
    authSaga(),
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
