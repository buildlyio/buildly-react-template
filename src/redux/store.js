import { redux } from 'midgard-core';
import { compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import rootSaga from './sagas';

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  return {
    ...redux.createStore(
      rootReducer,
      composeEnhancers(
        redux.applyMiddleware(sagaMiddleware, thunk),
      ),
    ),
    runSaga: sagaMiddleware.run(rootSaga),
  };
};

const store = configureStore();
export const dispatch = (type) => store.dispatch({ type });

export default configureStore;
