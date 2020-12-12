import React, { useState } from 'react';
import styled from 'styled-components';
import { FjTable, FjMenu, FjInlineEditor } from 'freyja-react'
import Crud from 'midgard/modules/crud/Crud';
import { rem } from 'polished';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import Switch from '@material-ui/core/Switch';

const UserGroupsLayout = styled.div`
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${rem(10)};
`;

/**
 * Manage user groups
 */
function UserGroups() {
  // state to toggle actions menus
  const [menu, setMenu] = useState({ row: null, element: null });

  const permissionCellTemplate = (row, crud, operation) => {
    return (
      <Switch
        size="small"
        checked={row.permissions[operation]}
        onChange={() => {
          row.permissions[operation] = !row.permissions[operation];
          crud.updateItem(row);
        }}
      />
    );
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
    const handleMenuClick = (event) => {
      setMenu({ row: row, element: event.currentTarget });
    };

    const handleMenuItemClick = (action) => {
      if (action === 'delete') {
        crud.deleteItem(menu.row);
      }
      setMenu({ row: null, element: null });
    };

    const handleMenuClose = () => {
      setMenu({ row: null, element: null });
    };
    
    return (
      <React.Fragment>
        <IconButton
          aria-label="more"
          aria-controls={'group-actions-menu-' + row.id}
          aria-haspopup="true"
          onClick={handleMenuClick}
        >
          <MoreHoriz />
        </IconButton>
        <Menu
          id={'group-actions-menu-' + row.id}
          anchorEl={menu.element}
          keepMounted
          open={Boolean(menu.row && (menu.row.id === row.id))}
          onClose={handleMenuClose}
        >
          {row.actions.map((option) => (
          <MenuItem
            key={'group-actions-' + row.id + '-' + option.value}
            onClick={() => handleMenuItemClick(option.value)}
          >
            {option.label}
          </MenuItem>))}
        </Menu>
      </React.Fragment>
    );
  };

  const update = (crud, row, value) => {
    row.name = value;
    crud.updateItem(row);
  };

  const nameTemplate = (row, crud) => {
    return (
      <FjInlineEditor
        tag="h4"
        id={row.id}
        value={row.name}
        onChange={(event) => update(crud, row, event)}
      />
    );
  };

  return (
    <UserGroupsLayout>
      <Crud
        deleteAction="DELETE_COREGROUP"
        updateAction="UPDATE_COREGROUP"
        createAction="CREATE_COREGROUP"
        loadAction="LOAD_DATA_COREGROUP"
        reducer="coregroupReducer"
      >
        {
          crud => {
            if (crud.getData()) {
              crud.getData().forEach(row => {
                row.actions = [{value: 'delete', label: 'Delete'}];
              });
            }

            return (
              <React.Fragment>
                <ButtonContainer>
                  <Button variant="outlined" size="small" onClick={() => addGroup(crud)}>Create a group</Button>
                </ButtonContainer>
                <FjTable
                  columns={[
                    { label: 'Group Type', prop: 'name', flex: '1', template: (row) => nameTemplate(row, crud ) },
                    { label: 'Create', prop: 'Create', template: (row) => permissionCellTemplate(row, crud, 'create' ) },
                    { label: 'Read', prop: 'Read', template: (row) => permissionCellTemplate(row, crud, 'read') },
                    { label: 'Update', prop: 'Update', template: (row) => permissionCellTemplate(row, crud, 'update') },
                    { label: 'Delete', prop: 'Delete', template: (row) => permissionCellTemplate(row, crud, 'delete'), flex: '2' },
                    {
                      label: 'Actions',
                      prop: 'options',
                      template: (row) => actionsTemplate(row, crud),
                      flex: '1'
                    },
                  ]}
                  rows={crud.getData()}
                />
              </React.Fragment>
            );
          }
        }
      </Crud>
    </UserGroupsLayout>
  );
}

export default UserGroups;