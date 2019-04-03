import React from 'react'
import styled from 'styled-components'
import { colors } from 'colors'

const TextFieldWrapper = styled.div`
  display: flex;
  align-items: stretch;
  flex-direction: column;

  .text-field {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;

    &__label {
      font-size: 10px;
      color: ${colors.grayMedium};
    }

    &__value {
      line-height: 18px;
      font-size: 14px;
      font-weight: ${props => props.bold ? 'bold' : 'normal'};
    }
  }
`

class TextField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let field = '';
    if (this.props.value) {
      field = (<TextFieldWrapper bold={this.props.bold}>
        <div className="text-field">
          <label className="text-field__label">{this.props.label}</label>
          <div className="text-field__value">{this.props.value}</div>
        </div>
      </TextFieldWrapper>);
    }
    return (
      field
    )
  }
}

export default TextField;