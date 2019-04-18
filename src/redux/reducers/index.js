
import { combineReducers } from 'redux';
import productReducer from "clients/Products/src/redux/Products.reducer"
import authReducer from './Auth.reducer';

const rootReducer = combineReducers({
  authReducer,
  productReducer
});

export default rootReducer;