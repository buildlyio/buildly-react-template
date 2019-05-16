import React, { useState } from 'react'
import { connect } from 'react-redux'
import { colors } from 'colors'
import styled from 'styled-components'
import { rem } from 'polished'
import { FjContentSwitcher, FjButton, FjInputField  } from 'freyja-react'
import InviteForm from 'midgard/components/InviteForm/InviteForm'
import { invite } from 'redux/actions/Auth.actions'
import {useInput} from "midgard/hooks/useInput";


/**
 * Styled component for the profile page.
 */
const UserManagementWrapper = styled.div`
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
function UserManagement({dispatch, history, location, loading}) {
    const email = useInput('', { required: true });
    const message = useInput('', { required: true });

    const submit = (event) => {
        event.preventDefault();
        const inviteFormValue = {
            emails: [email.value],
        };
        dispatch(invite(inviteFormValue));
    }


    return (
    <UserManagementWrapper className="profile">
      <div className="profile__container">
        <h3>People using this system</h3>
        <FjContentSwitcher size="small" active={useState('current')} options={[
          { label: 'Current users', value: 'current' },
          { label: 'Inactive users', value: 'inactive' },
          { label: 'User groups', value: 'groups' },
        ]} />
          <InviteForm onSubmit={submit}>
              <FjInputField
                  label="Emails"
                  id="email"
                  type="text"
                  placeholder="abc@xcy.com, 123@zxc.com"
                  {...email.bind} />
              <FjInputField
                  label="Message"
                  id="Message"
                  type="text"
                  placeholder="Enter message"
                  {...message.bind} />
              <FjButton
                  disabled={loading}
                  type="submit">
                  Invite
              </FjButton>
          </InviteForm>
      </div>
    </UserManagementWrapper>
  )
}

const mapStateToProps = (state, ownProps) => ({...ownProps, ...state.authReducer});
export default connect(mapStateToProps)(UserManagement);