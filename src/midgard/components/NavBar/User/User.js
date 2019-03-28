import React from 'react'
import './User.scss'
import { oauthService } from 'midgard/modules/oauth/oauth.service'
import NavBarMenu from '../Menu/Menu';

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
      open: false
    };
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  toggleOpen() {
    this.setState({open: !this.state.open});
  }

  render() {
    const { user, lastLogin, open } = this.state;
    const { location, history } = this.props;
    return (
      <div className={'nav-bar-user ' + (open ? 'nav-bar-user--open' : '')} onClick={this.toggleOpen}>
        <NavBarMenu open={open} location={location} history={history} />
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

export default NavBarUser;