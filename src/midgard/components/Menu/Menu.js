import React from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'colors'
import { rem } from 'polished'

const menuWidth = rem(180);

const MenuWrapper = styled.div`
  position: relative;

  .menu {
    right: 0;
    top: 0;
    width: ${menuWidth};
    position: absolute;
    box-shadow: 0 ${rem(2)} ${rem(8)} 0 ${colors.shadow};
    border-radius: ${rem(4)};
    background-color: ${colors.white};
    cursor: pointer;
    display: none;
    color: ${colors.grayMediumDarker};
    z-index: 3;

    &__container {
      display: flex;
      flex-direction: column;
      padding: 0;
      margin: 0;
    }

    &__item {
      display: flex;
      flex: 1;
      align-items: center;
      height: ${rem(40)};
      padding: 0 ${rem(10)};
      font-size: ${rem(16)};
      line-height: ${rem(20)};

      &:hover {
        background-color: ${colors.primaryLighter}
      }
    }

    ${props => props.open && css`
      display: block;
    `}

    ${props => props.xPosition === 'left' && css`
      left: calc(-${menuWidth} / 4);
    `}

    ${props => props.xPosition === 'center' && css`
      left: 50%;
      right: auto;
      transform: translateX(-50%);
    `}

    ${props => props.xPosition === 'right' && css`
      right: calc(-${menuWidth} / 4);
    `}

    ${props => props.yPosition === 'top' && css`
      bottom: 100%;
      top: auto;
    `}

    ${props => props.yPosition === 'center' && css`
      top: 50%;
      transform: translateY(-50%);
    `}

    ${props => props.yPosition === 'bottom' && css`
      top: 100%;
      bottom: auto;
    `}
  }
`

class Menu extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Outputs the menu items.
   */
  listItems() {
    const items = [];
    for (const item of this.props.menuItems) {
      items.push(<li className="menu__item"
        key={item.id}
        onClick={() => {this.props.menuAction(item.id)}}>
        {item.title}
      </li>);
    }
    return items;
  }

  render() {
    const { open, xPosition, yPosition } = this.props;
    return (
      <MenuWrapper open={open} xPosition={xPosition} yPosition={yPosition}>
        <div className="menu">
          <ul className="menu__container">
            {this.listItems()}
          </ul>
        </div>
      </MenuWrapper>
    )
  }
}

export default Menu;
