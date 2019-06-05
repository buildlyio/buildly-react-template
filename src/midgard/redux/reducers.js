import productsReducer from 'clients/products/src/redux/products.reducer';
import documentsReducer from 'clients/documents/src/redux/documents.reducer';
import blueprintReducer from 'clients/blueprint/src/redux/blueprint.reducer';
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
