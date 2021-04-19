import { redux } from 'midgard-core';
import rootReducer from './reducers';

const configureStore = () => {
  // redux devtools
  return {
    ...redux.createStore(
      rootReducer,
    ),
  };
};

const store = configureStore();
export const dispatch = (type) => store.dispatch({ type });

export default configureStore;
