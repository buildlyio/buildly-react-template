import React, { useState } from 'react'
import styled from 'styled-components'
import { FjButton, FjTable, FjContentSwitcher, FjMenu, FjToggle } from 'freyja-react'
import Crud, { CrudContext } from 'midgard/modules/crud/Crud';

const UserGroupsWrapper = styled.div`
    width: 100%;
  }
`

/**
 * Manage user groups
 */
function UserGroups({history, location}) {

    // dropdown options
    const actions = [
        { value: 'delete', label: 'Delete' }
    ];


    const permissionCellTemplate = (row) => {
        return <FjToggle
            size="micro"
            />
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
                <CrudContext.Consumer>{ crud => (
                    <FjTable
                        columns={[
                            { label: 'Group Type', prop: 'name', flex: '1', template: (row) => {return <b>{row.name}</b>} },
                            { label: 'Create', prop: 'Create',template: permissionCellTemplate, },
                            { label: 'Read', prop: 'Read', template: permissionCellTemplate },
                            { label: 'Update', prop: 'Update', template: permissionCellTemplate },
                            { label: 'Delete', prop: 'Delete', template: permissionCellTemplate,flex: '2'},
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
                }
                </CrudContext.Consumer>
            </Crud>
        </UserGroupsWrapper>
    )
}

export default UserGroups
