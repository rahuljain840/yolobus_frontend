import { createStore as _createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

import reducers from 'app/reducers';
import { clientMiddleware } from 'app/helpers/ApiClient';
import { INITIAL_STATE } from 'app/helpers/reducer';

let initialReducers = reducers;
let store;

export default function createStore(history, client, data) {
  const middleware = [
    clientMiddleware(client),
    routerMiddleware(history),
    thunk,
  ];

  let finalCreateStore;

  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {

    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension && window.devToolsExtension(),
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  if (data) {
    addMissingReducers(initialReducers, data);
  }

  store = finalCreateStore(combineReducers(initialReducers), data);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('app/reducers', () => {
      initialReducers = {
        ...initialReducers,
        ...require('app/reducers')
      };

      store.replaceReducer(initialReducers);
    });
  }

  return store;
}

const addMissingReducers = (initialReducers, data) => {
  const dataKeys = Object.keys(data);
  dataKeys.forEach(key => {
    if (!initialReducers[key]) {
      initialReducers[key] = (state = INITIAL_STATE) => state;
      initialReducers[key].emptyReducer = true;
    }
  });
};
