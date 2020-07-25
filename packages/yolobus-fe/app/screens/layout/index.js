import React from 'react';
import Loadable from 'react-loadable';

const Layout = Loadable({
  loader: () => import(/* webpackChunkName: 'main-layout' */ './Layout'),
  loading: () => null
});

export default Layout;
