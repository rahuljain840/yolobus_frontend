import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CheckBoxButton from './CheckBoxButton';
import {showDefaultSelected} from 'app/helpers/listing';

class CheckBoxFilter extends Component {
  constructor(props) {
    super(props);

    const values = props.defaultValues ? [...props.defaultValues] : [];

    this.state = {values: values};
  }

  handleClick = (item) => {
    const {handleSubmit} = this.props;

    const values = [...this.state.values];

    if (item.selected) {
      values.push({value: item.itemId});
    } else {
      const index = values.findIndex(v => v.value === item.itemId);
      if (index > -1) {
        values.splice(index, 1);
      }
    }

    this.setState({values: values}, () => {
      handleSubmit(this.state.values);
    });
  };

  render() {
    const {type, data} = this.props;
    const {values} = this.state;

    if (!data) {
      return null;
    }

    return (
      <div>
        <p>{type}</p>
        <ul>
          {
            data.map((item, index) => <div key={index}>
              <CheckBoxButton defaultSelected={showDefaultSelected(values, item)} item={item}
                              handleSubmit={this.handleClick}/>
            </div>)
          }
        </ul>
      </div>
    );
  }
}

CheckBoxFilter.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  defaultValues: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default CheckBoxFilter;
