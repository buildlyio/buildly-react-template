import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    {!window.env.production && <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />}
  </QueryClientProvider>
);

