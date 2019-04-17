import { redux } from 'midgard-core';

import createSagaMiddleware from 'redux-saga';

import rootReducer from './reducers';
import rootSaga from './sagas';

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