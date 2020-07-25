import React from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { Router } from 'react-router-dom';
import { ReduxAsyncConnect } from 'redux-connect';
import { CookiesProvider } from 'react-cookie';

import routes from 'app/routes';

const onUpdate = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }
};
const Root = ({ store, client, history }) => {
  return (
    <Provider store={store} key="provider">
      <Router history={history}>
        <CookiesProvider>
          <ReduxAsyncConnect
            helpers={{ client }}
            routes={routes}
          />
        </CookiesProvider>
      </Router>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired
};

export default Root;
