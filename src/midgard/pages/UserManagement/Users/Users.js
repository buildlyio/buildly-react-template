import React, { useState } from 'react'
import styled from 'styled-components'
import { FjButton, FjTable, FjContentSwitcher } from 'freyja-react'

const UsersWrapper = styled.div`
  width: 100%;
`;

/**
 * Current users list
 */
function Users({ location, history }) {

  const permissions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Guest', value: 'guest' },
    { label: 'Read-Only', value: 'read-only' },
  ];


  const setPermission = () => {
    return false;
  };

  return (
    <UsersWrapper>
    <FjTable
      columns={[
        { label: 'Full name', prop: 'name', template: (item) => {return <b>{item}</b>}, flex: '1' },
        { label: 'Email', prop: 'email', flex: '2' },
        { label: 'Last activity', prop: 'activity', template: (item) => {return <small style={{'color': '#aaa'}}>{item}</small>}, flex: '1' },
        { label: 'Permissions', prop: 'permissions', template: (item) => {return <FjContentSwitcher size="small" options={permissions} active={['admin', setPermission()]} />}, flex: '2' },
        { label: 'Actions', prop: 'options', template: () => {return <FjButton variant="secondary" size="small">•••</FjButton>}, flex: '1' },
      ]}
      rows={[
        { name: 'Arthur Bailey', email: 'arthur-93@example.com', activity: 'Today' },
        { name: 'Billy West', email: 'billy.west@example.com', activity: 'Yesterday' },
        { name: 'Douglas Weaver', email: 'douglas-89@example.com', activity: '2 days ago' }
      ]}
    />
  </UsersWrapper>
  )
}

export default Users;
