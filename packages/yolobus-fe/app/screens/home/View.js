import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import PlacesToVisit from '../../modules/placesToVisit';
import Example from '@rahuljain840/ui.mweb/Example';

class View extends Component {

  constructor(props) {
    super(props);
  }

  handleSubmit = () => {

  };

  render() {
    console.log('homePageDetails...', this.props.homePageDetails);

    return (<div>
      Home Page
      <button onClick={() => this.props.fetchDetail({})}>Fetch</button>
      <PlacesToVisit/>
      <Example/>
    </div>);
  }
}

View.propTypes = {
  homePageDetails: PropTypes.object,
  fetchDetail: PropTypes.func
};

export default View;
