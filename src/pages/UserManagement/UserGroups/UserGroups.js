import React, { useState, useContext } from 'react';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  MoreHoriz,
  Add as AddIcon,
} from '@mui/icons-material';
import { InlineEditor } from '../../../components/InlineEditor/InlineEditor';
import { PermissionsTable } from '../../../components/PermissionsTable/PermissionsTable';
import { UserContext } from '../../../context/User.context';
import Crud from '../../../modules/crud/Crud';

const useStyles = makeStyles((theme) => ({
  addButton: {
    marginBottom: '1.5em',
  },
}));

/**
 * Manage user groups
 */
const UserGroups = () => {
  const classes = useStyles();
  // state to toggle actions menus
  const [menu, setMenu] = useState({ row: null, element: null });
  const user = useContext(UserContext);

  const permissionCellTemplate = (row, crud, operation) => (
    <Switch
      size="small"
      color="primary"
      disabled={
          user.core_groups[0].id === row.id
          || !row.organization
        }
      checked={row.permissions[operation]}
      onChange={() => {
        row.permissions[operation] = !row.permissions[operation];
        crud.updateItem(row);
      }}
    />
  );

  /**
   * Clears authentication and redirects to the login screen.
   */
  const addGroup = (crud) => {
    const item = {
      name: 'custom',
    };
    crud.createItem(item);
  };

  const actionsTemplate = (row, crud) => {
    const handleMenuClick = (event) => {
      setMenu({ row, element: event.currentTarget });
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
      <>
        <IconButton
          aria-label="more"
          aria-controls={`groupActions${row.id}`}
          aria-haspopup="true"
          disabled={
            user.core_groups[0].id === row.id
            || !row.organization
          }
          onClick={handleMenuClick}
        >
          <MoreHoriz />
        </IconButton>
        <Menu
          id={`groupActions${row.id}`}
          anchorEl={menu.element}
          keepMounted
          open={(menu.row && (menu.row.id === row.id)) || false}
          onClose={handleMenuClose}
        >
          {row.actions.map((option) => (
            <MenuItem
              key={`groupActions${row.id}:${option.value}`}
              onClick={() => handleMenuItemClick(option.value)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  };

  const update = (crud, row, value) => {
    row.name = value;
    crud.updateItem(row);
  };

  const nameTemplate = (row, crud) => (
    <InlineEditor
      tag="body1"
      id={row.id}
      disabled={!row.organization}
      value={row.name}
      placeholder="Group type"
      onChange={(event) => update(crud, row, event)}
    />
  );

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
          (crud) => {
            if (crud.getData()) {
              crud.getData().forEach((row) => {
                row.actions = [{ value: 'delete', label: 'Delete' }];
              });
            }

            return (
              <>
                <Button
                  className={classes.addButton}
                  color="primary"
                  variant="contained"
                  onClick={() => addGroup(crud)}
                >
                  <AddIcon />
                  {' '}
                  Add Group
                </Button>
                <PermissionsTable
                  columns={[
                    {
                      label: 'Group type',
                      prop: 'name',
                      flex: '1',
                      template: (row) => nameTemplate(row, crud),
                    },
                    {
                      label: 'Create',
                      prop: 'Create',
                      template: (row) => permissionCellTemplate(row, crud, 'create'),
                    },
                    {
                      label: 'Read',
                      prop: 'Read',
                      template: (row) => permissionCellTemplate(row, crud, 'read'),
                    },
                    {
                      label: 'Update',
                      prop: 'Update',
                      template: (row) => permissionCellTemplate(row, crud, 'update'),
                    },
                    {
                      label: 'Delete',
                      prop: 'Delete',
                      flex: '2',
                      template: (row) => permissionCellTemplate(row, crud, 'delete'),
                    },
                    {
                      label: 'Actions',
                      prop: 'options',
                      flex: '1',
                      template: (row) => actionsTemplate(row, crud),
                    },
                  ]}
                  rows={crud.getData()}
                />
              </>
            );
          }
        }
      </Crud>
    </Box>
  );
};

export default UserGroups;
