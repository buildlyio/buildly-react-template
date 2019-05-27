// react library imports
import { combineReducers } from 'redux';
import authReducer from './authuser/reducers/authuser.reducer';
import coreuserReducer from './coreuser/coreuser.reducer';


const rootReducer = combineReducers(
  {
    //entryPointForGulpStart
    //entryPointForGulpEnd
    authReducer,
    coreuserReducer
  }
);

export default rootReducer;
