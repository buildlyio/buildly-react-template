import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux'
import { PermissionsTable } from '@components/PermissionsTable/PermissionsTable';
import Crud from '@modules/crud/Crud';
import { getCoregroups } from '@redux/coregroup/actions/coregroup.actions';
import {
  Button,
  IconButton,
  ButtonGroup,
  Menu,
  MenuItem,
  Box,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {MoreHoriz} from '@material-ui/icons';
import { rem } from 'polished';
import { checkForAdmin } from '@utils/utilMethods';
import { UserContext } from '@context/User.context';

const useStyles = makeStyles((theme) => ({
  btnPermission: {
    fontSize: rem(10),
  },
}));

/**
 * Current users list
 */
const Users = ({ location, history, data, dispatch }) => {
  const classes = useStyles();
  // state to toggle actions menus
  const [menu, setMenu] = useState({ row: null, element: null });
  const [coreGroupsLoaded, setCoreGroupsLoaded] = useState(false);
  const [permissions, setPermissions] = useState([]);
  // to get currently logged in user
  const user = useContext(UserContext);
  const isOrganizationAdmin = checkForAdmin(user);
 
  useEffect(() => {
    if (!coreGroupsLoaded) {
      dispatch(getCoregroups());
      setCoreGroupsLoaded(true);
    } else {
      // define permissions
      setPermissions(data.map(coregroup => ({
        label: coregroup.name,
        value: coregroup.id,
      })))
    }
  }, [data]);


  // table templates
  const permissionsTemplate = (row, crud, classes) => {
    if (coreGroupsLoaded) {
      const [active, setActive] = useState(row.core_groups[0] && row.core_groups[0].id || row.core_groups[0]);
      return (
        <ButtonGroup disableElevation color="primary" size="small" disabled={!row.is_active || user.core_user_uuid === row.core_user_uuid}>
          {permissions.map((permission, index) => (
            <Button
              className={classes.btnPermission}
              key={`btnGroup${index}`}
              variant={permission.value === active ? "contained" : "outlined"}
              onClick={() => {
                setActive(permission.value);
                crud.updateItem({id: row.id, core_groups: [permission.value]});
              }}>
              {permission.label}
            </Button>
          ))}
        </ButtonGroup>
      );
    }
  }

  const actionsTemplate = (row, crud) => {
    const handleMenuClick = (event) => {
      setMenu({ row, element: event.currentTarget });
    };

    const handleMenuItemClick = (action) => {
      if (action === 'delete') {
        crud.deleteItem(menu.row);
      } else if (action === 'deactivate') {
        crud.updateItem({id: menu.row.id, is_active: false});
      } else {
        crud.updateItem({id: menu.row.id, is_active: true});
      }
      setMenu({ row: null, element: null });
    };

    const handleMenuClose = () => {
      setMenu({ row: null, element: null });
    };
  
    return (
      <>
        <IconButton
          disabled={user.core_user_uuid === row.core_user_uuid}
          aria-label="more"
          aria-controls={`userActions${row.id}`}
          aria-haspopup="true"
          onClick={handleMenuClick}
        >
          <MoreHoriz />
        </IconButton>
        <Menu
          id={`userActions${row.id}`}
          anchorEl={menu.element}
          keepMounted
          open={Boolean(menu.row && (menu.row.id === row.id))}
          onClose={handleMenuClose}
        >
          {row.actions.filter(
            (option) => !(option.value === 'delete' && row.is_active),
          ).map((option) => (
            <MenuItem
              key={`userActions${row.id }:${option.value}`}
              onClick={() => handleMenuItemClick(option.value)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  };

  return (
    <Box>
      <Crud
        deleteAction="DELETE_COREUSER"
        updateAction="UPDATE_COREUSER"
        createAction="CREATE_COREUSER"
        loadAction="LOAD_DATA_COREUSER"
        reducer="coreuserReducer"
      >
        { (crud) => {
          if (crud.getData()) {
            crud.getData().forEach((row) => {
              if (row.is_active) {
                row.actions = [
                  { value: 'deactivate', label: 'Deactivate' },
                  { value: 'delete', label: 'Delete' },
                ];
              } else {
                row.actions = [
                  { value: 'activate', label: 'Activate' },
                  { value: 'delete', label: 'Delete' },
                ];
              }
            });
          }
          return (
            isOrganizationAdmin ?
            <PermissionsTable
              columns={[
                {
                  label: 'Full name',
                  prop: 'name',
                  template: (row) => (
                    <Typography
                      variant="body1"
                      style={!row.is_active ? {'color': '#aaa'} : null}
                    >
                      {row.first_name} {row.last_name}
                    </Typography>
                  ),
                  flex: '1',
                },
                {
                  label: 'Email',
                  prop: 'email',
                  flex: '2',
                  template: (row) => (
                    <Typography
                      variant="body2"
                      style={!row.is_active ? {'color': '#aaa'} : null}
                    >
                      {row.email}
                    </Typography>
                  ),
                },
                {
                  label: 'Last activity',
                  prop: 'activity',
                  template: (row) => (
                    <Typography
                      variant="caption"
                      style={{'color': '#aaa'}}
                    >
                      Today
                    </Typography>
                  ),
                  flex: '1',
                },
                {
                  label: 'Permissions',
                  prop: 'permission',
                  template: (row) => permissionsTemplate(row, crud, classes),
                  flex: '2',
                },
                {
                  label: 'Actions',
                  prop: 'options',
                  template: (row) => actionsTemplate(row, crud),
                  flex: '1',
                },
              ]}
              rows={crud.getData()}
              sortFn={(a, b) => (a.core_user_uuid === user.core_user_uuid ? -1 : b.core_user_uuid === user.core_user_uuid ? 1 : 0)}
            />
            :
            <PermissionsTable
              columns={[
                { label: 'Full name', prop: 'name', template: (row) => {return <Typography variant="body1" style={!row.is_active? {'color': '#aaa'}: null}>{row.first_name} {row.last_name}</Typography>}, flex: '1' },
                { label: 'Email', prop: 'email', flex: '2', template: (row) => {return <Typography variant="body2" style={!row.is_active? {'color': '#aaa'}: null}>{row.email}</Typography>}},
                { label: 'Organization name', prop: 'organization', flex: '2', template: (row) => {return <Typography variant="body2" style={!row.is_active? {'color': '#aaa'}: null}>{row.organization.name}</Typography>}},
                { label: 'Last activity', prop: 'activity', template: (row) => {return <Typography variant="caption" style={{'color': '#aaa'}}>Today</Typography>}, flex: '1' },
                { label: 'Permissions', prop: 'permission', template: (row) => permissionsTemplate(row, crud, classes), flex: '2' },
                { label: 'Actions', prop: 'options', template: (row) => actionsTemplate(row, crud), flex: '1' },
              ]}
              rows={crud.getData()}
              sortFn={(a, b) => (a.core_user_uuid === user.core_user_uuid ? -1 : b.core_user_uuid === user.core_user_uuid ? 1 : 0)}
            />
          );
        }}
      </Crud>
  </Box>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.coreGroupReducer,
});

export default connect(mapStateToProps)(Users);
