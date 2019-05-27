import React, { useState } from 'react'
import styled from 'styled-components'
import { FjButton, FjTable, FjContentSwitcher, FjMenu } from 'freyja-react'

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

  const permissionCellTemplate = (row) => {
    return <FjContentSwitcher
      size="small"
      options={permissions}
      active={
        [row.permission, (item) => {
          row.permission = item;
        }]}/>
  }

  return (
    <UsersWrapper>
    <FjTable
      columns={[
        { label: 'Full name', prop: 'name', template: (row) => {return <b>{row.name}</b>}, flex: '1' },
        { label: 'Email', prop: 'email', flex: '2' },
        { label: 'Last activity', prop: 'activity', template: (row) => {return <small style={{'color': '#aaa'}}>{row.activity}</small>}, flex: '1' },
        { label: 'Permissions', prop: 'permission', template: permissionCellTemplate, flex: '2' },
        { label: 'Actions', prop: 'options', template: () => {return <FjButton variant="secondary" size="small">•••</FjButton>}, flex: '1' },
      ]}
      rows={[
        { name: 'Arthur Bailey', email: 'arthur-93@example.com', activity: 'Today', permission: 'admin' },
        { name: 'Billy West', email: 'billy.west@example.com', activity: 'Yesterday', permission: 'guest' },
        { name: 'Douglas Weaver', email: 'douglas-89@example.com', activity: '2 days ago', permission: 'guest' }
      ]}
    />
  </UsersWrapper>
  )
}

export default Users;
