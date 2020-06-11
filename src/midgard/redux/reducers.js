// react library imports
import { combineReducers } from "redux";
import authReducer from "./authuser/reducers/authuser.reducer";
import coreuserReducer from "./coreuser/coreuser.reducer";
import coreGroupReducer from "./coregroup/reducers/coregroup.reducer";
import crudDataReducer from "midgard/modules/crud/redux/crud.reducer";
import alertReducer from "./alert/reducers/alert.reducer";
import custodianReducer from "./custodian/reducers/custodian.reducer";

const rootReducer = combineReducers({
  //entryPointForGulpStart
  //entryPointForGulpEnd
  authReducer,
  coreuserReducer,
  coreGroupReducer,
  crudDataReducer,
  alertReducer,
  custodianReducer,
});

export default rootReducer;
