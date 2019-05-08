import productsReducer from 'clients/Products/src/redux/Products.reducer'; 
import documentsReducer from 'clients/Documents/src/redux/Documents.reducer'; 
// react library imports
import { combineReducers } from 'redux';
import authReducer from './Auth.reducer';

const rootReducer = combineReducers({
  //entryPointForGulpStart
  productsReducer,
  documentsReducer,
  //entryPointForGulpEnd
  authReducer
});

export default rootReducer;