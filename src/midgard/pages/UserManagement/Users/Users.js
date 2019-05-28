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
        ['admin', (item) => {
          row.permission = 'admin';
        }]}/>
  };

  return (
    <UsersWrapper>
      <Crud
        deleteAction="DELETE_COREUSER"
        updateAction="UPDATE_COREUSER"
        createAction="CREATE_COREUSER"
        loadAction="LOAD_DATA_COREUSER"
        reducer="coreuserReducer"
      >
        <CrudContext.Consumer>{ crud => {
          return (
          <FjTable
            columns={[
              { label: 'Full name', prop: 'name', template: (row) => {return <b>{row.first_name} {row.last_name}</b>}, flex: '1' },
              { label: 'Email', prop: 'email', flex: '2' },
              { label: 'Last activity', prop: 'activity', template: (row) => {return <small style={{'color': '#aaa'}}>Today</small>}, flex: '1' },
              { label: 'Permissions', prop: 'permission', template: permissionCellTemplate, flex: '2' },
              { label: 'Actions', prop: 'options', template: (row) => {
                  const [open, setOpen] = useState(false);
                  return <FjMenu
                    menuItems={actions}
                    xPosition="right"
                    yPosition="down"
                    open={open}
                    setOpen={() => setOpen(!open)}
                    onActionClicked={(action) => {
                      if (action === 'delete') {
                        crud.deleteItem(row)
                      }
                    }}
                  >
                    <FjButton variant="secondary" size="small" onClick={() => setOpen(!open)}>•••</FjButton>
                  </FjMenu>
                }, flex: '1' },
            ]}
            rows={crud.getData()}
          />)
        }}
        </CrudContext.Consumer>
      </Crud>
  </UsersWrapper>
  )
}

export default Users;
