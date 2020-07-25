/* eslint-disable */
import React from 'react';

import { App, Home } from './screens';

const routes = [
  {
    path: '/',
    component: App,
    default: true,
    routes: [
      {
        path: '/',
        component: Home,
        exact: true
      }
    ]
  }
];


export default routes;
