import React from 'react'
import { oauthService } from '../../modules/oauth/oauth.service';

import './Profile.scss';
import { logout } from 'store/actions/authActions';
import { connect } from 'react-redux';
import { Button } from 'ui/Button/Button';
import TextField from 'ui/TextField/TextField';

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
          <TextField bold label="First and last name" value={user.first_name + ' ' + user.last_name} />
          <TextField label="Email" value={user.email} />
          <TextField label="Organization" value={user.organization.name} />
          <Button
            small
            onClick={this.logout}
            type="button">
            Logout
          </Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({...ownProps, ...state.authReducer});
export default connect(mapStateToProps)(Profile);