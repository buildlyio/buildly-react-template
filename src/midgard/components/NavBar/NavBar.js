import React from 'react'
import './NavBar.scss'
import NavBarUser from './User/User';
import NavBarItem from './Item/Item';
import { NavBarItems } from './NavBarItems'
import logo from 'assets/midgard-logo.svg';

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

  setActive(active) {
    const { from } = this.props.location.state || { from: { pathname: active } };
    this.props.history.push(from);
  }

  createItems() {
    const items = [];
    if (this.state.navItems.length) {
      for (const item of this.state.navItems) {
        items.push(<NavBarItem
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
      <div className={ 'nav-bar ' + (this.props.navHidden ? 'nav-bar--hidden' : '') }>
        <div className="nav-bar__container">
          <div className="nav-bar__elements">
            {this.createItems()}
          </div>
          <NavBarUser location={this.props.location} history={this.props.history} />
        </div>
      </div>
    )
  }
}

export default NavBar;