import styled, { css } from 'styled-components'
import { colors } from 'colors'
import { rem } from 'polished'

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
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
  font-size: ${rem(14)};

  img {
    max-height: ${rem(18)};
    max-width: ${rem(18)};
    margin-right: ${rem(4)};
  }

  &:hover {
    background-color: ${colors.primaryDarker};
  }

  &:disabled {
    background-color: ${colors.grayLightest};
    border-color: ${colors.grayLightest};
    color: ${colors.grayDarkest};
    cursor: default;
  }

  ${props => props.variant === 'secondary' && css`
    background: ${colors.white};
    color: ${colors.primary};
    border-color: ${colors.primary};

    &:hover {
      background-color: ${colors.primaryOverlay};
    }
  `}

  ${props => props.size === 'small' && css`
    height: ${rem(32)};
    font-size: ${rem(12)};
    padding: 0 ${rem(10)};
  `}

  ${props => props.size === 'micro' && css`
    height: ${rem(24)};
    font-size: ${rem(10)};
    padding: 0 ${rem(8)};
  `}

  ${props => props.upload && css`
    position: relative;

    input {
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      opacity: 0;
    }
  `}
`