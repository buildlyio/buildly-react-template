import styled, { css } from 'styled-components'
import { colors } from 'colors'
import { rem } from 'polished'

export const Button = styled.button`
  display: inline-block;
  border-radius: ${rem(4)};
  height: ${rem(40)};
  padding: 0 ${rem(12)};
  transition: all 0.2s linear;
  font-weight: 600;
  background-color: ${colors.primary};
  border: ${rem(1)} solid ${colors.primary};
  color: ${colors.white};
  cursor: pointer;
  outline: none;
  margin: ${rem(4)} 0;

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
    height: ${rem(32)};
  `}
`