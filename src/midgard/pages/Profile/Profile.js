import React from 'react'
import { oauthService } from 'midgard/modules/oauth/oauth.service'
import { logout } from 'redux/actions/Auth.actions'
import { connect } from 'react-redux'
import { Button } from 'ui/Button/Button'
import TextField from 'ui/TextField/TextField'
import { colors } from 'colors'
import styled from 'styled-components'
import { rem } from 'polished'

const ProfileWrapper = styled.div`
  height: 100%;
  display: flex;
  flex: 1;
  background-color: ${colors.backgroundSecondary};

  .profile {
    &__container {
      display: flex;
      flex-direction: column;
      flex: 1;
      align-items: flex-start;
      margin: 0 ${rem(24)};
    }
  }
`

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
      <ProfileWrapper className="profile">
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
      </ProfileWrapper>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({...ownProps, ...state.authReducer});
export default connect(mapStateToProps)(Profile);