import { redux } from 'midgard-core';

import createSagaMiddleware from 'redux-saga'

import rootReducer from './reducers/rootReducer'
import rootSaga from './sagas/rootSaga'

const sagaMiddleware = createSagaMiddleware()

export const store = redux.createStore(
  rootReducer,
  redux.applyMiddleware(sagaMiddleware)
  );
  
sagaMiddleware.run(rootSaga);
  
export const dispatch = type => store.dispatch({type})
  