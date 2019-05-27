import React, { useState } from 'react'
import styled from 'styled-components'
import { FjButton, FjTable, FjContentSwitcher, FjMenu } from 'freyja-react'
import Crud, { CrudContext } from 'midgard/modules/crud/Crud';


const UsersWrapper = styled.div`
  width: 100%;
`;

/**
 * Current users list
 */
function Users({ location, history }) {

  // permissions options
  const permissions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Guest', value: 'guest' },
    { label: 'Read-Only', value: 'read-only' },
  ];

  // dropdown options
  const actions = [
    { value: 'deactivate', label: 'Deactivate' },
    { value: 'delete', label: 'Delete' }
  ];

  // table templates
  const permissionCellTemplate = (row) => {
    return <FjContentSwitcher
      size="small"
      options={permissions}
      active={
        [row.permission, (item) => {
          row.permission = item;
        }]}/>
  };

  const actionsCellTemplate = (row) => {
    const [open, setOpen] = useState(false);
    return <FjMenu
      menuItems={actions}
      xPosition="right"
      yPosition="down"
      open={open}
      setOpen={() => setOpen(!open)}
      onActionClicked={(e) => {return false}}
    >
      <FjButton variant="secondary" size="small" onClick={() => setOpen(!open)}>•••</FjButton>
    </FjMenu>
  };

  const handleUserDeleted = (user) => {
    return false;
  }
  return (
    <UsersWrapper>
      <Crud
        deleteAction="DELETE_ACTION"
        reducer="coreuserReducer"
        itemDeleted={handleUserDeleted}>
        <CrudContext.Consumer>{ crud => (
          <FjTable
            columns={[
              { label: 'Full name', prop: 'name', template: (row) => {return <b>{row.name}</b>}, flex: '1' },
              { label: 'Email', prop: 'email', flex: '2' },
              { label: 'Last activity', prop: 'activity', template: (row) => {return <small style={{'color': '#aaa'}}>{row.activity}</small>}, flex: '1' },
              { label: 'Permissions', prop: 'permission', template: permissionCellTemplate, flex: '2' },
              { label: 'Actions', prop: 'options', template: actionsCellTemplate, flex: '1' },
            ]}
            rows={[
              { name: 'Arthur Bailey', email: 'arthur-93@example.com', activity: 'Today', permission: 'admin' },
              { name: 'Billy West', email: 'billy.west@example.com', activity: 'Yesterday', permission: 'guest' },
              { name: 'Douglas Weaver', email: 'douglas-89@example.com', activity: '2 days ago', permission: 'guest' }
            ]}
          />)
        }
        </CrudContext.Consumer>
      </Crud>
  </UsersWrapper>
  )
}

export default Users;
