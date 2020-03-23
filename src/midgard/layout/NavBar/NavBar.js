import React, { useContext } from 'react'
import NavUser from 'midgard/components/NavUser/NavUser';
import NavItem from 'midgard/components/NavItem/NavItem';
import { AppContext } from 'midgard/context/App.context';
import { colors } from 'colors'
import styled, { css } from 'styled-components'
import { rem } from 'polished'

const NavBarWrapper = styled.div`
  display: flex;
  max-width: ${rem(220)};
  width: ${rem(220)};
  height: 100%;
  background-color: ${colors.base};
  min-height: calc(100vh - ${rem(60)});
  transition: max-width 0.3s ease-in-out;
  margin-top: ${rem(-60)};
  padding-top: ${rem(60)};

  .nav-bar {
    &__container {
      display: flex;
      margin: 0 ${rem(10)};
      flex-flow: column nowrap;
      width: ${rem(200)};
      height: calc(100vh - ${rem(60)});
      padding-bottom: ${rem(16)};
      box-sizing: border-box;
      transition: all 0.3s ease-in-out;
    }
    &__elements {
      flex: 3;
    }
  }

  ${props => props.hidden && css`
    max-width: 0;
    overflow: hidden;
    margin-right: ${rem(40)};
  `}
`

/**
 * Component for the side navigation.
 */
function NavBar({navHidden, location, history}) {
  const app = useContext(AppContext);

  /**
   * Sets the active item.
   * @param {string} active the active nav item
   */
  const setActive = (active) => {
    const { from } = location.state || { from: { pathname: `/app/${active}` } };
    history.push(from);
  }
  
  return (
    <NavBarWrapper className="nav-bar" hidden={navHidden}>
      <div className="nav-bar__container">
        <div className="nav-bar__elements">
        </div>
        <NavUser location={location} history={history} />
      </div>
    </NavBarWrapper>
  )
}

export default NavBar;