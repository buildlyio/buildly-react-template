import React from 'react'
import './NavBar.scss'
import NavBarUser from './User/User';
import NavBarItem from './Item/Item';
import logo from 'assets/midgard-logo.svg';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.gotoProfile = this.gotoProfile.bind(this);
    this.state = {
      navItems: [
        { id: 0, title: 'Dashboard', description: 'Monitoring the most important' },
        { id: 1, title: 'Forms', description: 'Collecting information' }
      ],
      active: 0
    };
    this.setActive = this.setActive.bind(this);
    this.createItems = this.createItems.bind(this);
  }

  gotoProfile() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    this.props.history.push(from);
  }

  setActive(active) {
    this.setState({ active });
  }

  createItems() {
    const items = [];
    for (const item of this.state.navItems) {
      items.push(<NavBarItem
        key={item.id}
        id={item.id}
        title={item.title}
        description={item.description}
        active={this.state.active === item.id}
        action={this.setActive} />);
    }
    return items;
  }

  render() {
    return (
      <div className={ 'nav-bar ' + (this.props.navHidden ? 'nav-bar--hidden' : '') }>
        <div className="nav-bar__container">
          <div className="nav-bar__elements">
            {this.createItems()}
          </div>
          <NavBarUser onClick={this.gotoProfile} />
        </div>
      </div>
    )
  }
}

export default NavBar;