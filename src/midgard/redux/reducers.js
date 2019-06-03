import blueprintReducer from 'clients/Blueprint/src/redux/Blueprint.reducer'; 
import productsReducer from 'clients/Products/src/redux/Products.reducer'; 
// react library imports
import { combineReducers } from 'redux';
import authReducer from './authuser/reducers/authuser.reducer';
import coreuserReducer from './coreuser/coreuser.reducer';
import coreGroupReducer from './coregroup/reducers/coregroup.reducer'



const rootReducer = combineReducers(
  {
    //entryPointForGulpStart
    blueprintReducer,
    productsReducer,
    //entryPointForGulpEnd
    authReducer,
    coreuserReducer,
    coreGroupReducer
  }
);

export default rootReducer;
