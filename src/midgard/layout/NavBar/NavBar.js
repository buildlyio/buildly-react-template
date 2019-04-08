import React from 'react'
import NavUser from 'midgard/components/NavUser/NavUser';
import NavItem from 'midgard/components/NavItem/NavItem';
import { NavBarItems } from './NavBarItems'
import { colors } from 'colors'
import styled, { css } from 'styled-components'
import { rem } from 'polished'

const NavBarWrapper = styled.div`
  display: flex;
  max-width: ${rem(220)};
  width: ${rem(220)};
  height: 100%;
  background-color: ${colors.backgroundPrimary};
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

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navItems: NavBarItems,
      active: ''
    };
    this.setActive = this.setActive.bind(this);
    this.createItems = this.createItems.bind(this);
  }

  /**
   * Sets the active item.
   * @param {string} active the active nav item
   */
  setActive(active) {
    const { from } = this.props.location.state || { from: { pathname: active } };
    this.props.history.push(from);
  }

  /**
   * Creates the list of nav items.
   */
  createItems() {
    const items = [];
    if (this.state.navItems.length) {
      for (const item of this.state.navItems) {
        items.push(<NavItem
          key={item.id}
          id={item.id}
          title={item.title}
          description={item.description}
          active={this.props.location.pathname.includes(item.id)}
          action={this.setActive}/>);
      }
      return items;
    }
  }

  render() {
    return (
      <NavBarWrapper className="nav-bar" hidden={this.props.navHidden}>
        <div className="nav-bar__container">
          <div className="nav-bar__elements">
            {this.createItems()}
          </div>
          <NavUser location={this.props.location} history={this.props.history} />
        </div>
      </NavBarWrapper>
    )
  }
}

export default NavBar;