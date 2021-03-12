import { redux } from 'midgard-core';
import rootReducer from './reducers';

const configureStore = () => {
  // redux devtools
  return {
    ...redux.createStore(rootReducer),
  };
};

export const dispatch = (type) => store.dispatch({ type });

export default configureStore;
