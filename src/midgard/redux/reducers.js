// react library imports
import { combineReducers } from "redux";
import authReducer from "./authuser/reducers/authuser.reducer";
import coreuserReducer from "./coreuser/coreuser.reducer";
import coreGroupReducer from "./coregroup/reducers/coregroup.reducer";
import crudDataReducer from "midgard/modules/crud/redux/crud.reducer";
import alertReducer from "./alert/reducers/alert.reducer";
import custodianReducer from "./custodian/reducers/custodian.reducer";
import itemsReducer from "./items/reducers/items.reducer";
import sensorsGatewayReducer from "./sensorsGateway/reducers/sensorsGateway.reducer";
import shipmentReducer from "./shipment/reducers/shipment.reducers";

const rootReducer = combineReducers({
  //entryPointForGulpStart
  //entryPointForGulpEnd
  authReducer,
  coreuserReducer,
  coreGroupReducer,
  crudDataReducer,
  alertReducer,
  custodianReducer,
  itemsReducer,
  sensorsGatewayReducer,
  shipmentReducer,
});

export default rootReducer;
