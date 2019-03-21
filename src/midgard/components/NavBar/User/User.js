import React from 'react'
import './User.scss'
import { oauthService } from 'midgard/modules/oauth/oauth.service'

class NavBarUser extends React.Component {
  constructor(props) {
    super(props);
    const lastLogin = localStorage.getItem('last_login');
    const options = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' };
    if (!lastLogin) {
      localStorage.setItem('last_login', Date.now());
    }
    this.state = {
      user: oauthService.getOauthUser().data,
      lastLogin: new Intl.DateTimeFormat('de-DE', options).format(localStorage.getItem('last_login'))
    };
  }

  render() {
    const { user, lastLogin } = this.state;
    return (
      <div className="nav-bar-user">
        <div className="nav-bar-user__icon">
          <span className="nav-bar-user__icon__initials">
            {`${user.first_name.charAt(0)}${user.last_name.charAt(0)}`}
          </span>
        </div>
        <div className="nav-bar-user__container">
          <div className="nav-bar-user__name">
            {`${user.first_name} ${user.last_name}`}
          </div>
          <div className="nav-bar-user__last-login">
            Last login: {`${lastLogin}`}
          </div>
        </div>
        <div className="nav-bar-user__menu-toggle"></div>
      </div>
    )
  }
}

export default NavBarUser;