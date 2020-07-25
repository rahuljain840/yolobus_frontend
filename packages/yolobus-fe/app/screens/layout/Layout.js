import React from 'react';
import PropTypes from 'prop-types';

import Footer from 'app/modules/footer';
import Header from 'app/modules/header/Header';

class Layout extends React.Component {

  static propTypes = {
    children: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <Header/>
        {this.props.children}
        <Footer/>
      </div>
    );
  }
};

export default Layout;

