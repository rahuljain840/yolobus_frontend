import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

class PlacesToVisit extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (<div>
      Places To Visit
    </div>);
  }
}

PlacesToVisit.propTypes = {
  homePageDetails: PropTypes.object
};

export default PlacesToVisit;
