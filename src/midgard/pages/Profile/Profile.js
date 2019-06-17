import React from 'react'
import { connect } from 'react-redux'
import { FjButton, FjInlineEditor } from 'freyja-react'
import TextField from 'midgard/components/TextField/TextField'
import { colors } from 'colors'
import styled from 'styled-components'
import { rem } from 'polished'
import { Redirect } from 'react-router-dom'
import { updateUser, logout } from 'midgard/redux/authuser/actions/authuser.actions'

/**
 * Styled component for the profile page.
 */
const ProfileWrapper = styled.div`
  height: 100%;
  display: flex;
  flex: 1;
  background-color: ${colors.baseLighter};

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

/**
 * The current oauth user.
 */
let user = JSON.parse(localStorage.getItem('currentUser'));

/**
 * Outputs the profile page for the user.
 */
function Profile({dispatch, history, location}) {
  if (!user) {
    return <Redirect push to="/" />;
  }
  if (user !== JSON.parse(localStorage.getItem('currentUser'))) {
    user = JSON.parse(localStorage.getItem('currentUser'));
  }

  /**
   * Clears authentication and redirects to the login screen.
   */
  const logoutUser = () => {
    dispatch(logout());
    const { from } = location.state || { from: { pathname: "/" } };
    history.push(from);
  }

  /**
   * Called when the inline editor value is changed.
   * @param prop the property to update
   * @param value the new value to set
   */
  const onChange = (prop, value) => {
    let nameUpdate = {};
    nameUpdate[prop] = value;
    user = { ...user, ...nameUpdate };
    dispatch(updateUser(user));
  }

  return (
    <ProfileWrapper className="profile">
      <div className="profile__container">
        <h3>Settings</h3>
        <FjInlineEditor
          label="First name"
          value={user.first_name}
          onChange={(event) => onChange('first_name', event)} />
        <FjInlineEditor
          label="Last name"
          value={user.last_name}
          onChange={(event) => onChange('last_name', event)} />
        <TextField label="Email" value={user.email} />
        <TextField label="Organization" value={user.organization ? user.organization.name: ''} />
        <FjButton
          variant="danger"
          size="small"
          onClick={logoutUser}
          type="button">
          Logout
        </FjButton>
      </div>
    </ProfileWrapper>
  )
}

const mapStateToProps = (state, ownProps) => ({...ownProps, ...state.authReducer});
export default connect(mapStateToProps)(Profile);
