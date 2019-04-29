import React from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'colors'
import { rem } from 'polished'

const SwitcherItem = styled.button`
  color: ${colors.primary};
  padding: ${rem(6)} ${rem(8)};
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  display: inline-flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }

  img {
    height: ${rem(12)};
    width: ${rem(12)};
    margin-right: ${rem(4)};
  }

  ${props => props.active && css`  
    background-color: ${colors.primaryLighter};
    border-radius: ${rem(4)};
  `}
`

function ViewSwitcher({ options, action }) {
  const items = [];
  for (let option of options) {
    items.push(
      <SwitcherItem
        key={option.value}
        active={option.active}
        onClick={() => {action(option.value)}}>
        <img src={option.icon} />
        <span>{option.name}</span>
      </SwitcherItem>
    );
  }
  return (
    <div className="view-switcher">
      {items}
    </div>
  );
}

export default ViewSwitcher;
