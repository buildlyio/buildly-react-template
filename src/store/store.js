import { redux } from 'midgard-core';

import createSagaMiddleware from 'redux-saga';

import rootReducer from './reducers/rootReducer';
import rootSaga from './sagas/rootSaga';

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  return {
    ...redux.createStore(
      rootReducer,
      redux.applyMiddleware(sagaMiddleware)
    ),
    runSaga: sagaMiddleware.run(rootSaga)
  };
};

export const dispatch = type => store.dispatch({type});

export default configureStore;