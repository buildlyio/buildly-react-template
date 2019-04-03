import React from 'react'
import styled from 'styled-components'
import { colors } from 'colors'

const InputFieldWrapper = styled.div`
  display: flex;
  align-items: stretch;
  flex-direction: column;

  .input-field {
    margin-bottom: 8px;
    display: flex;
    flex-direction: column;
  
    &__label {
      font-size: 12px;
    }

    &__input {
      margin-top: 4px;
      border: 1px solid ${colors.grayLighter};
      border-radius: 4px;
      height: 40px;
      font-size: 15px;
      box-sizing: border-box;
      padding: 8px 12px;
      transition: all 0.2s linear;
      outline: none;

      &:focus {
        border-color: ${colors.primary};
      }
    }

    &__spacer {
      min-height: 16px;
      display: flex;
    }

    &__error {
      color: ${colors.danger};
      line-height: 12px;
      font-size: 10px;
      padding: 2px 0;
    }
  }
`

class InputField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const required = this.props.required ? '*' : '';
    return (
      <InputFieldWrapper>
        <div className="input-field">
          <label
            className="input-field__label"
            htmlFor={this.props.id}>
            {this.props.label}{required}
          </label>
          <input
            className="input-field__input"
            name={this.props.id}
            type={this.props.type}
            placeholder={this.props.placeholder}
            value={this.props.username}
            onChange={this.props.change} />
          <div className="input-field__spacer">
            <small className="input-field__error">{this.props.error}</small>
          </div>
        </div>
      </InputFieldWrapper>
    )
  }
}

export default InputField;