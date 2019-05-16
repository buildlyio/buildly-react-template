import React, { useContext, useState } from 'react'
import { connect } from 'react-redux'
import { Button } from 'ui/Button/Button'
import TextField from 'ui/TextField/TextField'
import { colors } from 'colors'
import styled from 'styled-components'
import { rem } from 'polished'
import { UserContext } from 'midgard/context/User.context'
import { Redirect } from 'react-router-dom'
import InlineEditor from 'ui/InlineEditor/InlineEditor'
import { updateUser, logout } from 'redux/actions/Auth.actions'

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
 * Outputs the profile page for the user.
 */
function Profile({dispatch, history, location}) {
  /**
   * The current oauth user.
   */
  let user = JSON.parse(localStorage.getItem('currentUser'));

  if (!user) {
    return <Redirect push to="/" />;
  }

  /**
   * Clears authentication and redirects to the login screen.
   */
  const logoutUser = () => {
    dispatch(logout());
    const { from } = location.state || { from: { pathname: "/" } };
    history.push(from);
  }

    const onChange = (name,type , payload, data) => {
        let nameUpdate = {};
        let userData = {
        contact_info: null,
        core_groups: [],
        core_user_uuid: "",
        email: "",
        first_name: "",
        last_name: "",
        organization: null,
        title: null,
        username: ""}
        nameUpdate[name] = data;
        user = {...user, ...nameUpdate};
        dispatch(updateUser(user));

    }

    return (
    <ProfileWrapper className="profile">
      <div className="profile__container">
        <h3>Settings</h3>
          <InlineEditor
              label="first name"
              value={user.first_name}
              onChange={(event) => onChange("first_name", 'update', user, event)}
          />
          <InlineEditor
              label="first name"
              value={user.last_name}
              onChange={(event) => onChange("first_name", 'update', user, event)}
          />

        <TextField label="Email" value={user.email} />
        <TextField label="Organization" value={user.organization? user.organization.name: ''} />
        <Button
          size="small"
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