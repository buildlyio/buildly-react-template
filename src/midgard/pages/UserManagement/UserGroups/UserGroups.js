import React, { useState } from 'react'
import styled from 'styled-components'
import { FjButton, FjTable, FjContentSwitcher, FjMenu, FjToggle, FjInlineEditor } from 'freyja-react'
import Crud, { CrudContext } from 'midgard/modules/crud/Crud';

const UserGroupsWrapper = styled.div`
    width: 100%;
    .create__button {
        display: flex;
        justify-content: flex-end
    }
    
  }
`

/**
 * Manage user groups
 */
function UserGroups() {

    // state to toggle actions menus
    const [menuState, setMenuState] = useState({opened: false, id: ''});

    const permissionCellTemplate = (row, crud, operation) => {
        return <FjToggle
            size="micro"
            checked={
                [row.permissions[operation], () => {
                row.permissions[operation] = !row.permissions[operation];
                crud.updateItem(row)
            }]}
        />
    };
    /**
     * Clears authentication and redirects to the login screen.
     */
    const addGroup = (crud) => {
        let item = {
            "name": "custom"
        };
        crud.createItem(item);
    };


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
                }
            }}
        >
            <FjButton variant="secondary" size="small" onClick={() => setMenuState({opened: !menuState.opened, id: row.id})}>•••</FjButton>
        </FjMenu>
    };
    const update = (crud, row, value) => {
        row.name = value;
        crud.updateItem(row);
    };
    const nameTemplate = (row, crud) =>{
        return <FjInlineEditor
            tag="h4"
            id={row.id}
            value={row.name}
            onChange={(event) => update(crud, row, event)} />
    };
    return (
        <UserGroupsWrapper>
            <Crud
                deleteAction="DELETE_COREGROUP"
                updateAction="UPDATE_COREGROUP"
                createAction="CREATE_COREGROUP"
                loadAction="LOAD_DATA_COREGROUP"
                reducer="coreGroupReducer"
               >
                <CrudContext.Consumer>{ crud => {
                    if (crud.getData()) {
                        crud.getData().forEach(row => {
                            row.actions = [{value: 'delete', label: 'Delete'}];
                        });
                    }

                    return (
                        <div>
                        <div className="create__button">
                            <FjButton variant="secondary" size="small" onClick={() => addGroup(crud)}>Create a group</FjButton>
                        </div>
                        <FjTable
                            columns={[
                                {label: 'Group Type', prop: 'name', flex: '1', template: (row) => nameTemplate(row, crud )},
                                {label: 'Create', prop: 'Create', template: (row) => permissionCellTemplate(row, crud, 'create' )},
                                {label: 'Read', prop: 'Read', template: (row) => permissionCellTemplate(row, crud, 'read')},
                                {label: 'Update', prop: 'Update', template: (row) => permissionCellTemplate(row, crud, 'update')},
                                {label: 'Delete', prop: 'Delete', template: (row) => permissionCellTemplate(row, crud, 'delete'), flex: '2'},
                                {
                                    label: 'Actions',
                                    prop: 'options',
                                    template: (row) => actionsTemplate(row, crud),
                                    flex: '1'
                                },
                            ]}
                            rows={crud.getData()}
                            {...console.log(crud.getData())}
                        />
                        </div>
                            )
                }
               }
                </CrudContext.Consumer>
            </Crud>
        </UserGroupsWrapper>
    )
}

export default UserGroups
