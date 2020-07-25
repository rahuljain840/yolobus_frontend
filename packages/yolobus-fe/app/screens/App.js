import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { asyncConnect } from 'redux-connect';
import { Redirect, Route } from 'react-router';
import { matchRoutes } from 'react-router-config';

import Layout from 'app/screens/layout';

import 'app/theme/common.scss';

class App extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
  };

  render() {
    const { location: { pathname }, route} = this.props;
    const branch = matchRoutes(route.routes, pathname);

    const renderRoute = () => {
      if (branch.length) {
        const { route: { component: Component, ...rest }, match } = branch[0];
        return (
          <Route
            {...rest}
            render={matchProps => {
              return(
                <Component route={rest} {...matchProps} />
              );
            }}
          />
        );
      }
      return (<Redirect to='/page-not-found' />);
    };

    return (
      <div>
        <Layout {...this.props}>
          { renderRoute() }
        </Layout>
      </div>
    );
  }
}

export default asyncConnect
(
  [
    {
      promise: props => {
        return Promise.resolve();
      }
    }
  ],
  state => ({}),
  {}
)(App);

