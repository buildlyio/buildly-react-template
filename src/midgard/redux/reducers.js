// react library imports
import { combineReducers } from 'redux';
import authReducer from './authuser/reducers/authuser.reducer';
import coreuserReducer from './coreuser/coreuser.reducer';
import coreGroupReducer from './coregroup/reducers/coregroup.reducer'



const rootReducer = combineReducers(
  {
    //entryPointForGulpStart
    //entryPointForGulpEnd
    authReducer,
    coreuserReducer,
    coreGroupReducer
  }
);

export default rootReducer;
