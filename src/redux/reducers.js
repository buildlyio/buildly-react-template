// react library imports
import { combineReducers } from 'redux';
import crudDataReducer from '../modules/crud/redux/crud.reducer';
import alertReducer from './alert/reducers/alert.reducer';
import authReducer from './authuser/reducers/authuser.reducer';
import consortiumReducer from './consortium/reducers/consortium.reducer';
import coreGroupReducer from './coregroup/reducers/coregroup.reducer';
import coreuserReducer from './coreuser/coreuser.reducer';
import custodianReducer from './custodian/reducers/custodian.reducer';
import importExportReducer from './importExport/reducers/importExport.reducer';
import itemsReducer from './items/reducers/items.reducer';
import optionsReducer from './options/reducers/options.reducer';
import sensorsGatewayReducer from './sensorsGateway/reducers/sensorsGateway.reducer';
import shipmentReducer from './shipment/reducers/shipment.reducers';
import { LOGOUT_SUCCESS } from './authuser/actions/authuser.actions';

const appReducer = combineReducers({
  alertReducer,
  authReducer,
  consortiumReducer,
  coreGroupReducer,
  coreuserReducer,
  crudDataReducer,
  custodianReducer,
  importExportReducer,
  itemsReducer,
  optionsReducer,
  sensorsGatewayReducer,
  shipmentReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_SUCCESS) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
