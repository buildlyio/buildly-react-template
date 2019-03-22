import React from 'react'
import './Menu.scss'
import { logout } from 'store/actions/authActions';
import { connect } from 'react-redux';

class NavBarMenu extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  /**
   * Clears authentication and redirects to the login screen
   */
  logout() {
    this.props.dispatch(logout());
  }

  render() {
    const { open } = this.props;
    return (
      <div className={'nav-bar-menu ' + (open ? 'nav-bar-menu--open' : '')}>
        <ul className="nav-bar-menu__list">
          <li className="nav-bar-menu__item">Profile settings</li>
          <li className="nav-bar-menu__item" onClick={this.logout}>Logout</li>
        </ul>
      </div>
    )
  }
}

export default connect()(NavBarMenu);