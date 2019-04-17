
import { combineReducers } from 'redux';
import authReducer from './Auth.reducer';

const rootReducer = combineReducers({
  authReducer,
});

export default rootReducer;