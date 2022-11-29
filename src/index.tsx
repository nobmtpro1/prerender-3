import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './redux/store';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: 'https://c7017ec7cd8844ada2d2315dee778407@o1151904.ingest.sentry.io/4504010062364672',
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

const store = configureStore();
ReactDOM.render(
  <HelmetProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </HelmetProvider>,
  document.getElementById('root'),
);

reportWebVitals();
