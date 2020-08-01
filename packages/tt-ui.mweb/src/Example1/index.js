import React, {Component} from 'react';
import styled from '@emotion/styled'

import CalendarIcon from '@rahuljain840/icons/CalendarIcon';

const Button = styled.button({
  padding: '32px',
  backgroundColor: 'yellow',
  fontSize: '24px',
  borderRadius: '4px',
  color: 'black',
  fontWeight: 'bold'
});

class Example extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <CalendarIcon height="25px" width="25px"/>
        <Button>Example</Button>
      </div>
    );
  }
}

export default Example;
