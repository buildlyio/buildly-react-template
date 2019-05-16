import React from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'colors'
import { rem } from 'polished'

const NavItemWrapper = styled.div`
  position: relative;
  display: flex;
  height: ${rem(54)};
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  user-select: none;

  .nav-item {
    &__title {
      font-size: ${rem(16)};
      line-height: ${rem(20)};
      color: ${colors.text};
      white-space: nowrap;
      text-transform: capitalize;
    }
    &__description {
      font-size: ${rem(10)};
      color: ${colors.grayDarkest};
      white-space: nowrap;
    }
    &__container {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 ${rem(10)};
    }
    &__text-container {
      display: flex;
      flex-direction: column;
    }
    &__toggle {
      border: solid ${colors.primary};
      border-width: 0 ${rem(1)} ${rem(1)} 0;
      display: inline-block;
      padding: ${rem(4)};
      margin: 0 0 0 ${rem(16)};
      transform: rotate(45deg);
    }
    &__icon {
      background-color: ${colors.baseLightest};
      padding: ${rem(5)};
      margin: ${rem(5)};
      height: ${rem(32)};
      width: ${rem(32)};
      box-sizing: border-box;
      border-radius: 50%;
      border: ${rem(1)} solid ${colors.grayDarkest};
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    &__initials {
      color: ${colors.grayDarkest};
    }
  }
  &:hover {
    background-color: ${colors.baseDarker};
    .nav-item {
      &__title,
      &__description {
        color: ${colors.primary}
      }
    }
  }
  
  ${props => props.active && css`
    background-color: ${colors.primaryOverlay};
    .nav-item {
      &__title,
      &__description {
        color: ${colors.primary}
      }
    }
  `}
`

/**
 * Component for an individual item that appears in the sidebar navigation.
 */
function NavItem({action, id, title, description, image, defaultImage, toggle, active}) {
  /**
   * Updates the active state of the nav bar item.
   */
  const updateActive = () => {
    action(id);
  }

  return (
    <NavItemWrapper className="nav-item" active={active} onClick={updateActive}>
      <div className="nav-item__container">
        {image &&
          (<img src={image} alt={title} />)
        }
        {!image && defaultImage && <div className="nav-item__icon">
          <span className="nav-item__initials">
            {title.charAt(0)}
          </span>
        </div>}
        <div className="nav-item__text-container">
          <div className="nav-item__title">
            {title}
          </div>
          <div className="nav-item__description">
            {description}
          </div>
        </div>
        {toggle && <div className="nav-item__toggle"></div>}
      </div>
    </NavItemWrapper>
  )
}

export default NavItem;
