import styled, { css } from 'styled-components'
import { colors } from 'colors'

export const Button = styled.button`
  display: inline-block;
  border-radius: 4px;
  height: 40px;
  padding: 0 12px;
  transition: all 0.2s linear;
  font-weight: 600;
  background-color: ${colors.primary};
  border: 1px solid ${colors.primary};
  color: ${colors.white};
  cursor: pointer;
  outline: none;
  margin: 4px 0;

  &:hover {
    background-color: ${colors.primaryDarker};
  }

  &:disabled {
    background-color: ${colors.grayLight};
    border-color: ${colors.grayLight};
    color: ${colors.gray};
    cursor: default;
  }

  ${props => props.secondary && css`
    background: ${colors.white};
    color: ${colors.primary};
    border-color: ${colors.primary};

    &:hover {
      background-color: ${colors.primaryLightest};
    }
  `}

  ${props => props.small && css`
    height: 32px;
  `}
`