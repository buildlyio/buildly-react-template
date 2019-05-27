import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { colors } from 'colors'
import styled from 'styled-components'
import { rem } from 'polished'
import { FjButton, FjInputField } from 'freyja-react'
import InviteForm from 'midgard/components/InviteForm/InviteForm'
import { invite } from 'midgard/redux/authuser/actions/authuser.actions'
import { useInput } from "midgard/hooks/useInput";
import { FjContentSwitcher } from "freyja-react"
import Popup from 'reactjs-popup'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Users from "./Users/Users";
import UserGroups from "./UserGroups/UserGroups";
import { Route, Redirect } from 'react-router-dom'

/**
 * Styled component for the user management page.
 */
const UserManagementWrapper = styled.div`
  height: 100%;
  display: flex;
  flex: 1;
  background-color: ${colors.baseLighter};
  .invite_button {
    border: ${rem(1)} solid ${colors.primary};
    color: ${colors.white};
  }
  .profile {
    &__container {
      display: flex;
      flex-direction: column;
      flex: 1;
      align-items: flex-start;
      margin: 0 ${rem(24)};
    }
    &__header {
      display: flex;
      align-items: center;
      margin-bottom: ${rem(30)};
      &__name {
        padding-right: ${rem(12)};
      }   
    }
    &__users {
      width: 100%;
    }
  }
  
  .content-switcher {
    margin-top: ${rem(-22)};
    &__container {
      width: 100%;
      display: flex;
      justify-content: center;
      align-content: center;
      border-top: 1px solid #e1e1e1;
      margin-bottom: ${rem(30)};
    }   
  }
`;

/**
 * The current oauth user.
 */
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

/**
 * Outputs the user management page.
 */
function UserManagement({dispatch, loading, error, user, history, location}) {
  const email = useInput('', { required: true });
  const [inviteCall, setinviteCall] = useState(false);
  const subNav = [
    { label: 'Current users', value: 'current-users' },
    { label: 'Inactive users', value: 'inactive' },
    { label: 'User groups', value: 'groups' },
  ];
  let viewState = useState('current-users');
  const [view, setView] = viewState;

  // this will be triggered whenever the content switcher is clicked to change the view
  useEffect(() => {
    history.push(`/app/profile/users/${view || location.state}`);
  }, [view]);


  if (user && user.data && user.data.detail && inviteCall && !error) {
    NotificationManager.success(user.data.detail, 'Success');
    setinviteCall(false);
  }


  const inviteUser = (event) => {
    event.preventDefault();
    const inviteFormValue = {
      emails: [email.value],
    };
    setinviteCall(true);
    dispatch(invite(inviteFormValue));
  };


  return (
    <UserManagementWrapper className="profile">
      <div className="profile__container">
       <div className="profile__header">
        <h3 className="profile__header__name">People using this system</h3>
           <Popup trigger={<FjButton size="small">Invite</FjButton>}
               position="bottom right"
               on="click"
               closeOnDocumentClick
               mouseLeaveDelay={300}
               mouseEnterDelay={0}
               contentStyle={{ padding: '0px', border: 'none', width:  `{rem(250)}` }}
               arrow={false}
           >
               <InviteForm onSubmit={inviteUser}>
                   <div className="invite__form__header"> Invite user to platform</div>
                   <div className="invite__form__input">
                       <FjInputField
                           label="Emails"
                           id="email"
                           type="text"
                           placeholder="abc@xcy.com, 123@zxc.com"
                           error = {error}
                           {...email.bind} />
                   </div>
                   <FjButton
                       size="small"
                       disabled={loading}
                       type="submit">
                       Send
                   </FjButton>
               </InviteForm>
           </Popup>
      </div>
        <div className="content-switcher__container">
          <div className="content-switcher">
            <FjContentSwitcher size="small" active={viewState} options={subNav} />
          </div>
        </div>
        <Route path="/app/profile/users/current-users" component={Users} />
        <Route path="/app/profile/users/groups" component={UserGroups} />
      </div>
      <NotificationContainer />
    </UserManagementWrapper>
  )
}

const mapStateToProps = (state, ownProps) => ({...ownProps, ...state.authReducer});
export default connect(mapStateToProps)(UserManagement);
