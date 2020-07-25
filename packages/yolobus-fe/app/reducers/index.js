import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

import home from 'app/screens/home/reducer';

export default {
  routing: routerReducer,
  reduxAsyncConnect,
  home,
};
