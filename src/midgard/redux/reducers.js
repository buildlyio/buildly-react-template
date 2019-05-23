// react library imports
import { combineReducers } from 'redux';
import authReducer from './authuser/reducers/authuser.reducer';

const rootReducer = combineReducers(
  {
    //entryPointForGulpStart
    //entryPointForGulpEnd
    authReducer
  }
);

export default rootReducer;
