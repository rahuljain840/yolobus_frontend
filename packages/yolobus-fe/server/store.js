import {createStore as _createStore, applyMiddleware, combineReducers, compose} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import thunk from 'redux-thunk';
import {reducer as reduxAsyncConnect} from 'redux-connect';

import reducers from 'app/reducers/index';
import {clientMiddleware} from 'app/helpers/ApiClient';
import {INITIAL_STATE} from 'app/helpers/reducer';

let initialReducers = reducers;
let store;

export const replaceReducer = newReducers => {
  const reducerKeys = Object.keys(newReducers);
  if (newReducers instanceof Object && reducerKeys.length > 0) {
    const key = reducerKeys[0];
    // if already exist return
    // find a better solution
    if (initialReducers[key] && !initialReducers[key].emptyReducer) {
      return;
    }
    initialReducers = {...initialReducers, ...newReducers, reduxAsyncConnect};
    store.replaceReducer(combineReducers(initialReducers));
  }
};

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
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
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
        ...require('app/reducers/index')
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
