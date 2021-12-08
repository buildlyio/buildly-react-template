// react library imports
import { combineReducers } from 'redux';
import crudDataReducer from '@modules/crud/redux/crud.reducer';
import alertReducer from './alert/reducers/alert.reducer';
import authReducer from './authuser/reducers/authuser.reducer';
import coregroupReducer from './coregroup/reducers/coregroup.reducer';
import coreuserReducer from './coreuser/coreuser.reducer';
import dashboardReducer from './dashboard/reducers/dashboard.reducer';
import googleSheetReducer from './googleSheet/reducers/googleSheet.reducer';
import devPartnerReducer from './devpartner/reducers/devpartner.reducer';
import projectReducer from './project/reducers/project.reducer';
import releaseReducer from './release/reducers/release.reducer';
import { LOGOUT_SUCCESS } from './authuser/actions/authuser.actions';

const appReducer = combineReducers({
  alertReducer,
  authReducer,
  coregroupReducer,
  coreuserReducer,
  crudDataReducer,
  dashboardReducer,
  googleSheetReducer,
  devPartnerReducer,
  projectReducer,
  releaseReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_SUCCESS) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
