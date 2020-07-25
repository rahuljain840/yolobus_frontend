import React, {Component} from 'react';
import PropTypes from 'prop-types';

class CheckBoxButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: props.defaultSelected
    };
  }

  handleInputChange = () => {
    this.setState({selected: !this.state.selected}, () => {
      this.props.handleSubmit({itemId: this.props.item.value, selected: this.state.selected});
    });
  };

  render() {
    const {item} = this.props;

    if (!item) {
      return null;
    }

    return (
      <div>
        <input
          name={item.value}
          type="checkbox"
          checked={this.state.selected}
          onChange={this.handleInputChange}/>
        <label>{item.value}</label>
      </div>
    );
  }
}

CheckBoxButton.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  defaultSelected: PropTypes.bool.isRequired
};

export default CheckBoxButton;
