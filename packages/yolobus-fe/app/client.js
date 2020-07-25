import React from 'react';
import ReactDOM from 'react-dom';
import {syncHistoryWithStore} from 'react-router-redux';
import {createBrowserHistory} from 'history';
import Loadable from 'react-loadable';

import createStore from 'app/store';
import {ApiClient} from './helpers/ApiClient';

export const history = createBrowserHistory();

import './serviceWorker';
import Root from './helpers/Root';
import FontFaceObserver from 'fontfaceobserver';
import _get from 'lodash/get';

const client = new ApiClient();
const dest = document.getElementById('content');
const store = createStore(history, client, window.__data);
const historySync = syncHistoryWithStore(history, store);

const component = <Root store={store} client={client} history={historySync}/>;

historySync.listen((location) => {
  document.body.className = document.body.className.replace('addLayer', '');
  document.body.removeAttribute("style");
  document.documentElement.removeAttribute("style");
});

window.main = () => {
  Loadable.preloadReady().then(() => {
    ReactDOM.hydrate(component, dest);
  });
};

const fetchStore = (e) => {
  const state = store.getState();
  const dispatchData = {};
  e.detail && Array.isArray(e.detail) && e.detail.map((item) => {
    dispatchData[item] = _get(state, item);
  });

  const dispatchStoreEvent = new CustomEvent('dispatchStore', {
    detail: dispatchData
  });

  window.dispatchEvent(dispatchStoreEvent);
};
window.addEventListener('fetchStore', fetchStore, false);

window.addEventListener('load', function () {
  const latoLight = new FontFaceObserver('Lato', {
    weight: 300
  });

  Promise.all([latoLight.load()])
    .then(function () {
      document.documentElement.className += " fonts-loaded";
      console.log('Font is available');
    }, function (err) {
      console.error('Font is not available', err);
    });
});

if (__DEVELOPMENT__) {
  window.React = React;
}

if (module.hot) {
  const isString = string => typeof string === 'string';
  const _consoleError = console.error; // eslint-disable-line no-console
  console.error = (...args) => {
    // eslint-disable-line no-console
    if (
      args &&
      args.length === 1 &&
      isString(args[0]) &&
      args[0].indexOf('You cannot change <Router ') > -1
    ) {
      // React route changed
    } else {
      // Log the error as normally
      _consoleError.apply(console, args);
    }
  };

  module.hot.accept('./helpers/Root', () => {
    const UpdatedRoot = require('./helpers/Root').default;

    ReactDOM.hydrate(
      <UpdatedRoot store={store} history={historySync} client={client}/>,
      dest
    );
  });
}
