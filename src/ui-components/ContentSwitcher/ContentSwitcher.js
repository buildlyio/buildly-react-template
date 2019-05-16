import React from 'react'
import styled from 'styled-components'
import { rem } from 'polished'
import { FjButton } from 'freyja-react'

const FjContentSwitcherWrapper = styled.div`
  display: flex;
  margin: ${rem(4)} 0;
  align-items: flex-start;

  button:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left-width: 0;
  }

  button:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`

function FjContentSwitcher({options, active, size}) {
  let buttons = [];
  for (let option of options) {
    buttons.push(<FjButton
      size={size}
      id={option.value}
      key={option.value}
      variant={active[0] === option.value ? 'light' : 'secondary'}
      onClick={() => active[1](option.value)}>
      {option.label}
    </FjButton>)
  }

  return (
    <FjContentSwitcherWrapper>
      {buttons}
    </FjContentSwitcherWrapper>
  )
}

export default FjContentSwitcher;