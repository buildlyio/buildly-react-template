import React from 'react'
import { oauthService } from '../../modules/oauth/oauth.service';

import './Profile.scss';
import { logout } from 'store/actions/authActions';
import { connect } from 'react-redux';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: oauthService.getOauthUser().data
    };
    this.logout = this.logout.bind(this);
  }

  /**
   * Clears authentication and redirects to the login screen
   */
  logout() {
    this.props.dispatch(logout());
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    this.props.history.push(from);
  }

  render() {
    const { user } = this.state;
    if (!user) {
      return <Redirect push to="/" />;
    }
    return (
      <div className="profile">
        <div className="profile__container">
          <h3>Settings</h3>
          <div className="profile__field">
            <label className="profile__field__label">First and last name</label>
            <div className="profile__field__value profile__field__value--bold">{user.first_name} {user.last_name}</div>
          </div>
          <div className="profile__field">
            <label className="profile__field__label">Email</label>
            <div className="profile__field__value">{user.email}</div>
          </div>

          <button
            className="profile__logout"
            onClick={this.logout}
            type="button">
            Logout
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({...ownProps, ...state.authReducer});
export default connect(mapStateToProps)(Profile);