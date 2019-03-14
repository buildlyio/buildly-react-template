import React from 'react'
import { oauthService } from '../../modules/oauth/oauth.service';

import './Dashboard.scss'

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: oauthService.getOauthUser().data
    };
    this.logout = this.logout.bind(this);
  }

  /**
   * Clears authentication
   */
  logout() {
    oauthService.logout();
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    this.props.history.push(from);
  }

  render() {
    const { user } = this.state;
    return (
      <div className="dashboard">
        <p>{`Welcome ${user.first_name} ${user.last_name}!`}</p>

        <button
          className="dashboard__logout"
          onClick={this.logout}
          type="button">
          Logout
        </button>
      </div>
    )
  }
}

export default Dashboard;