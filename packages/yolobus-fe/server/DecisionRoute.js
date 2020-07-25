import { Route, Redirect } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';

const DecisionRoute = ({ component: Component, decisionFunction, isAuthenticated, isAuthLoaded, loadUserDetails,
                         history, ...rest }) => {
  return (
    <Route
      {...rest}
      render={matchProps => {
        const decision = decisionFunction({ isAuthenticated, history });
        if(decision) {
          return(
            <Component route={rest} {...matchProps} />
          );
        }
        return null;
      }}
    />
  );
};

DecisionRoute.propTypes = {
  component: PropTypes.object.isRequired,
  decisionFunction: PropTypes.func,
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthLoaded: PropTypes.bool.isRequired,
  loadUserDetails: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

DecisionRoute.defaultProps = {
  decisionFunction: () => {
    return true;
  }
};

export default DecisionRoute;
