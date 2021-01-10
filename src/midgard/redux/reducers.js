// react library imports
import { combineReducers } from "redux";
import authReducer from "./authuser/reducers/authuser.reducer";
import coreuserReducer from "./coreuser/coreuser.reducer";
import coregroupReducer from "./coregroup/reducers/coregroup.reducer";
import crudDataReducer from "midgard/modules/crud/redux/crud.reducer";
import alertReducer from "./alert/reducers/alert.reducer";
import { LOGOUT_SUCCESS } from "./authuser/actions/authuser.actions";

const appReducer = combineReducers({
  authReducer,
  coreuserReducer,
  coregroupReducer,
  crudDataReducer,
  alertReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_SUCCESS) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
