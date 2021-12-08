import { redux } from 'midgard-core';
import rootReducer from './reducers';

const configureStore = () => ({ ...redux.createStore(rootReducer) });
// eslint-disable-next-line no-undef
export const dispatch = (type) => store.dispatch({ type });

export default configureStore;
