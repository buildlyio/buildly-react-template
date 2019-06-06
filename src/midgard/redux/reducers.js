import productsReducer from './src/clients/Products/src/redux/Products.reducer'; 
import documentsReducer from './src/clients/Documents/src/redux/Documents.reducer'; 
import blueprintReducer from './src/clients/Blueprint/src/redux/Blueprint.reducer'; 
// react library imports
import { combineReducers } from 'redux';
import authReducer from './authuser/reducers/authuser.reducer';
import coreuserReducer from './coreuser/coreuser.reducer';
import coreGroupReducer from './coregroup/reducers/coregroup.reducer'

const rootReducer = combineReducers(
  {
    //entryPointForGulpStart
    productsReducer,
    documentsReducer,
    blueprintReducer,
    //entryPointForGulpEnd
    authReducer,
    coreuserReducer,
    coreGroupReducer
  }
);

export default rootReducer;
