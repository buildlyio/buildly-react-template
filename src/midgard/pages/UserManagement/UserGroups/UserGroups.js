import React, { useState, useContext } from 'react';
import { UserContext } from "midgard/context/User.context";
import { InlineEditor } from 'midgard/components/InlineEditor/InlineEditor';
import { StyledTable } from 'midgard/components/StyledTable/StyledTable';
import Crud from 'midgard/modules/crud/Crud';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import Switch from '@material-ui/core/Switch';
import Box from "@material-ui/core/Box";
import AddIcon from "@material-ui/icons/AddCircle";

/**
 * Manage user groups
 */
function UserGroups() {
  // state to toggle actions menus
  const [menu, setMenu] = useState({ row: null, element: null });
  const user = useContext(UserContext);

  const permissionCellTemplate = (row, crud, operation) => {
    return (
      <Switch
        size="small"
        color="primary"
        disabled={user.core_groups[0].id === row.id || !row.organization}
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
          aria-controls={`groupActions${row.id}`}
          aria-haspopup="true"
          disabled={user.core_groups[0].id === row.id || !row.organization}
          onClick={handleMenuClick}
        >
          <MoreHoriz />
        </IconButton>
        <Menu
          id={`groupActions${row.id}`}
          anchorEl={menu.element}
          keepMounted
          open={menu.row && (menu.row.id === row.id) || false}
          onClose={handleMenuClose}
        >
          {row.actions.map((option) => (
          <MenuItem
            key={`groupActions${row.id}:${option.value}`}
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
      <InlineEditor
        tag="body1"
        id={row.id}
        disabled={!row.organization}
        value={row.name}
        placeholder="Group type"
        onChange={(event) => update(crud, row, event)}
      />
    );
  };

  return (
    <Box>
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
                <Grid container justify="flex-end">
                  <Grid item>
                    <Button
                      color="primary"
                      size="small"
                      variant="outlined"
                      onClick={() => addGroup(crud)}
                      startIcon={<AddIcon />}>
                      Add group
                    </Button>
                  </Grid>
                </Grid>
                <StyledTable
                  columns={[
                    { label: 'Group type', prop: 'name', template: (row) => nameTemplate(row, crud ) },
                    { label: 'Create', prop: 'Create', template: (row) => permissionCellTemplate(row, crud, 'create' ) },
                    { label: 'Read', prop: 'Read', template: (row) => permissionCellTemplate(row, crud, 'read') },
                    { label: 'Update', prop: 'Update', template: (row) => permissionCellTemplate(row, crud, 'update') },
                    { label: 'Delete', prop: 'Delete', template: (row) => permissionCellTemplate(row, crud, 'delete') },
                    {
                      label: 'Actions',
                      prop: 'options',
                      template: (row) => actionsTemplate(row, crud),
                    },
                  ]}
                  rows={crud.getData()}
                />
              </React.Fragment>
            );
          }
        }
      </Crud>
    </Box>
  );
}

export default UserGroups;