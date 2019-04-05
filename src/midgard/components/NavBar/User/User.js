import React from 'react'
import './User.scss'
import { oauthService } from 'midgard/modules/oauth/oauth.service'
import Menu from '../../Menu/Menu'
import { connect } from 'react-redux'
import { logout } from 'store/actions/authActions'

class NavBarUser extends React.Component {
  constructor(props) {
    super(props);
    const lastLoginDate = Date.parse(localStorage.getItem('token_stored_at'));
    const time = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(lastLoginDate);
    const day = new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(lastLoginDate);
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(lastLoginDate);
    const lastLogin = `${time} ${day}, ${month}`;
    this.state = {
      user: oauthService.getOauthUser().data,
      lastLogin: lastLogin,
      open: false,
      menuItems: [
        {id: 'profile', title: 'Profile settings'},
        {id: 'logout', title: 'Logout'}
      ],
      action: undefined,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.openProfile = this.openProfile.bind(this);
    this.logout = this.logout.bind(this);
  }

  /**
   * Toggles the open state of the user menu.
   */
  toggleMenu() {
    this.setState({open: !this.state.open});
  }

  /**
   * Navigates to the profile screen.
   */
  openProfile() {
    const { from } = this.props.location.state || { from: { pathname: 'profile' } };
    this.props.history.push(from);
  }

  /**
   * Clears authentication and redirects to the login screen.
   */
  logout() {
    this.props.dispatch(logout());
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    this.props.history.push(from);
  }

  /**
   * Closes the menu if the user clicks outside of the specified wrapper element.
   * @param {Event} event the click event.
   */
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({open: false});
    }
  };

  /**
   * Sets the wrapper element. 
   * @param ref the element to set.
   */
  setWrapperRef(ref) {
    this.wrapperRef = ref;
  }
 
  /**
   * Handles the action.
   * @param {string} action 
   * @param {React.Component} component 
   */
  selectAction(action, component) {
    switch(action) {
      case 'profile':
        return component.openProfile();
      case 'logout':
        return component.logout();
      default:
        return;
    }
  }
  
  componentWillMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  copmonentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  render() {
    const { user, lastLogin, open } = this.state;
    const { location } = this.props;
    return (
      <div
        ref={this.setWrapperRef}
        className={'nav-bar-user' + (open ? ' nav-bar-user--open' : '') + (location.pathname.includes('profile') ? ' nav-bar-user--active' : '')}
        onClick={this.toggleMenu}>
        <Menu xPosition="right" yPosition="top" open={open} menuAction={(e) => {this.selectAction(e, this)}} menuItems={this.state.menuItems}/>
        <div className="nav-bar-user__icon">
          <span className="nav-bar-user__icon__initials">
            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
          </span>
        </div>
        <div className="nav-bar-user__container">
          <div className="nav-bar-user__name">
            {user.first_name} {user.last_name}
          </div>
          <div className="nav-bar-user__last-login">
            Last login {lastLogin}
          </div>
        </div>
        <div className="nav-bar-user__menu-toggle"></div>
      </div>
    )
  }
}

export default connect()(NavBarUser);
