import React, { useState } from 'react'
import { connect } from 'react-redux'
import { colors } from 'colors'
import styled from 'styled-components'
import { rem } from 'polished'
import FjContentSwitcher from 'ui/ContentSwitcher/ContentSwitcher';

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
function UserManagement({dispatch, history, location}) {
  
  return (
    <UserManagementWrapper className="profile">
      <div className="profile__container">
        <h3>People using this system</h3>
        <FjContentSwitcher size="small" active={useState('current')} options={[
          { label: 'Current users', value: 'current' },
          { label: 'Inactive users', value: 'inactive' },
          { label: 'User groups', value: 'groups' },
        ]} />
      </div>
    </UserManagementWrapper>
  )
}

const mapStateToProps = (state, ownProps) => ({...ownProps, ...state.authReducer});
export default connect(mapStateToProps)(UserManagement);