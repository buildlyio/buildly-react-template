// react library imports
import { combineReducers } from 'redux';
import crudDataReducer from '@modules/crud/redux/crud.reducer';
import authReducer from './authuser/reducers/authuser.reducer';
import coreuserReducer from './coreuser/coreuser.reducer';
import coregroupReducer from './coregroup/reducers/coregroup.reducer';
import alertReducer from './alert/reducers/alert.reducer';
import { LOGOUT_SUCCESS } from './authuser/actions/authuser.actions';

const appReducer = combineReducers({
  authReducer,
  coreuserReducer,
  coregroupReducer,
  crudDataReducer,
  alertReducer,
});

const rootReducer = (state, action) => {
  let updatedState = state;
  if (action.type === LOGOUT_SUCCESS) {
    updatedState = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
