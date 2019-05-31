import blueprintReducer from 'clients/Blueprint/src/redux/Blueprint.reducer'; 
// react library imports
import { combineReducers } from 'redux';
import authReducer from './authuser/reducers/authuser.reducer';
import coreuserReducer from './coreuser/coreuser.reducer';
import coreGroupReducer from './coregroup/reducers/coregroup.reducer'



const rootReducer = combineReducers(
  {
    //entryPointForGulpStart
    blueprintReducer,
    //entryPointForGulpEnd
    authReducer,
    coreuserReducer,
    coreGroupReducer
  }
);

export default rootReducer;
