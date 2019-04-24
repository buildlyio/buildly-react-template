import React from 'react'
import { oauthService } from 'midgard/modules/oauth/oauth.service'
import Menu from 'midgard/components/Menu/Menu'
import { connect } from 'react-redux'
import { logout } from 'redux/actions/Auth.actions'
import NavItem from 'midgard/components/NavItem/NavItem'

class NavUser extends React.Component {
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
        {value: 'profile', label: 'Profile settings'},
        {value: 'logout', label: 'Logout'}
      ],
      action: undefined,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
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

  render() {
    const { user, lastLogin, open } = this.state;
    const { location } = this.props;
    return (
      <Menu
        xPosition="right"
        yPosition="top"
        open={open}
        setOpen={() => this.setState({open: !open})}
        onActionClicked={(e) => {this.selectAction(e, this)}}
        menuItems={this.state.menuItems}>
        <div onClick={this.toggleMenu}>
          <NavItem
            toggle
            defaultImage
            title={user.first_name + ' ' + user.last_name}
            description={'Last login ' + lastLogin}
            active={location.pathname.includes('profile')}
            action={() => {}}>
          </NavItem>
        </div>
      </Menu>
    )
  }
}

export default connect()(NavUser);
