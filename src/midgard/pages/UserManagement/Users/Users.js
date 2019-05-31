import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FjButton, FjTable, FjContentSwitcher, FjMenu } from 'freyja-react'
import Crud, { CrudContext } from 'midgard/modules/crud/Crud';
import { getCoreGroups } from 'midgard/redux/coregroup/actions/coregroup.actions'
import { connect } from 'react-redux'

const UsersWrapper = styled.div`
  width: 100%;
`;

/**
 * Current users list
 */
function Users({ location, history, data, dispatch }) {

  // state to toggle actions menus
  const [menuState, setMenuState] = useState({opened: false, id: ''});
  const [coreGroupsLoaded, setCoreGroupsLoaded] = useState(false);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (!coreGroupsLoaded) {
      dispatch(getCoreGroups());
      setCoreGroupsLoaded(true);
    } else {
      // define permissions
      setPermissions(data.map(coregroup => {
        return {label: coregroup.name, value: coregroup.id}
      }))
    }
  }, [data]);


  // table templates
  const permissionsTemplate = (row, crud) => {
    if (coreGroupsLoaded) {
      return <FjContentSwitcher
        size="small"
        options={permissions}
        active={
          [row.core_groups[0] && row.core_groups[0].id || row.core_groups[0], (item) => {
            crud.updateItem({id: row.id, core_groups: [item]})
          }]}/>
    }
  }

  const actionsTemplate = (row, crud) => {
    return <FjMenu
      menuItems={row.actions}
      xPosition="right"
      yPosition="down"
      open={menuState.id === row.id ? menuState.opened: null}
      setOpen={() => setMenuState({opened: !menuState.opened, id: row.id})}
      onActionClicked={(action) => {
        if (action === 'delete') {
          crud.deleteItem(row)
        } else if (action === 'deactivate') {
          crud.updateItem({id: row.id, is_active: false})
        } else {
          crud.updateItem({id: row.id, is_active: true})
        }
      }}
    >
      <FjButton variant="secondary" size="small" onClick={() => setMenuState({opened: !menuState.opened, id: row.id})}>•••</FjButton>
    </FjMenu>
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
        { crud => {
          if (crud.getData()) {
            crud.getData().forEach(row => {
              if(row.is_active) {
                row.actions = [
                  { value: 'deactivate', label: 'Deactivate' },
                  { value: 'delete', label: 'Delete' }
                ];
              } else {
                row.actions = [
                  { value: 'activate', label: 'Activate' },
                  { value: 'delete', label: 'Delete' }
                ];
              }
            });
          }
          return (
          <FjTable
            columns={[
              { label: 'Full name', prop: 'name', template: (row) => {return <b style={!row.is_active? {'color': '#aaa'}: null}>{row.first_name} {row.last_name}</b>}, flex: '1' },
              { label: 'Email', prop: 'email', flex: '2', template: (row) => {return <span style={!row.is_active? {'color': '#aaa'}: null}> {row.email} </span>}},
              { label: 'Last activity', prop: 'activity', template: (row) => {return <small style={{'color': '#aaa'}}>Today</small>}, flex: '1' },
              { label: 'Permissions', prop: 'permission', template: (row) => permissionsTemplate(row,crud), flex: '2' },
              { label: 'Actions', prop: 'options', template: (row) => actionsTemplate(row, crud), flex: '1' },
            ]}
            rows={crud.getData()}
          />)
        }}
      </Crud>
  </UsersWrapper>
  )
}

const mapStateToProps = (state, ownProps) => ({...state.coreGroupReducer, ...ownProps});

export default connect(mapStateToProps)(Users);
