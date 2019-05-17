import React, { useState } from 'react'
import { connect } from 'react-redux'
import { colors } from 'colors'
import styled from 'styled-components'
import { rem } from 'polished'
import { FjContentSwitcher, FjButton, FjInputField  } from 'freyja-react'
import InviteForm from 'midgard/components/InviteForm/InviteForm'
import { invite } from 'redux/actions/Auth.actions'
import {useInput} from "midgard/hooks/useInput";
import Modal from "react-responsive-modal";
import {NotificationContainer, NotificationManager } from 'react-notifications';


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
    &__header {
      display: flex;
      align-items: center;
        &__name {
           padding-right: ${rem(12)};
        }   
    }
  }
`


/**
 * Outputs the profile page for the user.
 */
function UserManagement({dispatch, history, location, loading, error, user}) {
    const email = useInput('', { required: true });
    const message = useInput('', { required: true });
    const [open, setOpen] = useState(false);
    const [inviteCall, setinviteCall] = useState(false);

    if (user && user.data && user.data.detail && inviteCall && !error) {
        NotificationManager.success( user.data.detail, 'Success');
        setOpen(false);
        setinviteCall(false);
    }

    const onOpenModal = () => {
        setOpen(true);
    };

    const onCloseModal = () => {
        setOpen(false);
    };

    const submit = (event) => {
        event.preventDefault();
        const inviteFormValue = {
            emails: [email.value],
        };
        setinviteCall(true);
        dispatch(invite(inviteFormValue));

    }


    return (
    <UserManagementWrapper className="profile">
      <div className="profile__container">
       <div className="profile__header">
        <h3 className="profile__header__name">People using this system</h3>
            <FjButton
                size="small"
                onClick={onOpenModal}
                type="submit">
                invite
            </FjButton>
      </div>
          <Modal open={open} onClose={onCloseModal}>
              <InviteForm onSubmit={submit}>
                  <div className="invite__form__header"> Invite user to platform</div>
                  <FjInputField
                      label="Emails"
                      id="email"
                      type="text"
                      placeholder="abc@xcy.com, 123@zxc.com"
                      error = {error}
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
          </Modal>
        <FjContentSwitcher size="small" active={useState('current')} options={[
          { label: 'Current users', value: 'current' },
          { label: 'Inactive users', value: 'inactive' },
          { label: 'User groups', value: 'groups' },
        ]} />
      </div>
        <NotificationContainer/>
    </UserManagementWrapper>
  )
}

const mapStateToProps = (state, ownProps) => ({...ownProps, ...state.authReducer});
export default connect(mapStateToProps)(UserManagement);