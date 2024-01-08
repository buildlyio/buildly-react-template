import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import './i18n';
import configureStore from './redux/store';
import registerServiceWorker from './serviceWorkerRegistration';
import { QueryClient, QueryClientProvider } from 'react-query';

const store = configureStore();

const queryClient = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
  </QueryClientProvider>,
  document.getElementById('root'),
);

registerServiceWorker();
