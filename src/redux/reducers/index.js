import productsReducer from 'clients/Products/src/redux/Products.reducer'; 
import documentsReducer from 'clients/Documents/src/redux/Documents.reducer'; 
import { combineReducers } from 'redux';
import authReducer from './Auth.reducer';

const rootReducer = combineReducers({

    productsReducer,
    documentsReducer,
    //entryPointForGulp
    authReducer
});

export default rootReducer;