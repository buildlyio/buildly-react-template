import React, { useContext } from 'react'
import { logout } from 'redux/actions/Auth.actions'
import { connect } from 'react-redux'
import { Button } from 'ui/Button/Button'
import TextField from 'ui/TextField/TextField'
import { colors } from 'colors'
import styled from 'styled-components'
import { rem } from 'polished'
import { UserContext } from 'midgard/context/User.context'
import { Redirect } from 'react-router-dom'


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

function Profile({dispatch, history, location}) {
  const user = useContext(UserContext) ?useContext(UserContext) : JSON.parse(localStorage.getItem('oauthUser')).data;

  if (!user) {
    return <Redirect push to="/" />;
  }

  /**
   * Clears authentication and redirects to the login screen
   */
  const logoutUser = () => {
    dispatch(logout());
    const { from } = location.state || { from: { pathname: "/" } };
    history.push(from);
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
          onClick={logoutUser}
          type="button">
          Logout
        </Button>
      </div>
    </ProfileWrapper>
  )
}

const mapStateToProps = (state, ownProps) => ({...ownProps, ...state.authReducer});
export default connect(mapStateToProps)(Profile);