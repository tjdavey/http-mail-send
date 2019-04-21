import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers/root';
import EmailSender from './containers/EmailSender';

import './../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Setup the redux store with thunk and our reducers.
export const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

// Attach the redux store with a provider and render the EmailSender container.
ReactDOM.render(
  <Provider store={store}>
    <EmailSender />
  </Provider>
  , document.getElementById('root')
);
