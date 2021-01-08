import React, { useState, useContext } from 'react';
import { UserContext } from "midgard/context/User.context";
import { InlineEditor } from 'midgard/components/InlineEditor/InlineEditor';
import { PermissionsTable } from 'midgard/components/PermissionsTable/PermissionsTable';
import Crud from 'midgard/modules/crud/Crud';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  addButton: {
    marginBottom: "1.5em",
  },
}));

/**
 * Manage user groups
 */
function UserGroups() {
  const classes = useStyles();
  // state to toggle actions menus
  const [menu, setMenu] = useState({ row: null, element: null });
  const user = useContext(UserContext);

  const permissionCellTemplate = (row, crud, operation) => {
    return (
      <Switch
        size="small"
        color="primary"
        disabled={user.core_groups[0].id === row.id}
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
          disabled={user.core_groups[0].id === row.id}
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
        reducer="coreGroupReducer"
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
                <Button className={classes.addButton} color="primary" variant="contained" onClick={() => addGroup(crud)}>
                  <AddIcon /> Add Group
                </Button>
                <PermissionsTable
                  columns={[
                    { label: 'Group type', prop: 'name', flex: '1', template: (row) => nameTemplate(row, crud ) },
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
    </Box>
  );
}

export default UserGroups;