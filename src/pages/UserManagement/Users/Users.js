import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { rem } from 'polished';
import {
  Button,
  IconButton,
  ButtonGroup,
  Menu,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { MoreHoriz } from '@mui/icons-material';
import {
  PermissionsTable,
} from '../../../components/PermissionsTable/PermissionsTable';
import { getUser } from '../../../context/User.context';
import Crud from '../../../modules/crud/Crud';
import {
  getCoregroups,
} from '../../../redux/coregroup/actions/coregroup.actions';
import { checkForAdmin } from '../../../utils/utilMethods';

const useStyles = makeStyles((theme) => ({
  btnPermission: {
    fontSize: rem(10),
  },
}));

/**
 * Current users list
 */
const Users = ({ data, dispatch }) => {
  const classes = useStyles();
  // state to toggle actions menus
  const [menu, setMenu] = useState({ row: null, element: null });
  const [coreGroupsLoaded, setCoreGroupsLoaded] = useState(false);
  const [permissions, setPermissions] = useState([]);
  // to get currently logged in user
  const user = getUser();
  const isOrganizationAdmin = checkForAdmin(user);

  useEffect(() => {
    if (!coreGroupsLoaded) {
      dispatch(getCoregroups());
      setCoreGroupsLoaded(true);
    } else {
      // define permissions
      setPermissions(data.map((coregroup) => ({
        label: coregroup.name,
        value: coregroup.id,
      })));
    }
  }, [data]);

  // table templates
  const permissionsTemplate = (row, crud) => {
    const [active, setActive] = useState(
      (row.core_groups[0] && row.core_groups[0].id)
      || row.core_groups[0],
    );

    return coreGroupsLoaded ? (
      <ButtonGroup
        disableElevation
        color="primary"
        size="small"
        disabled={
          !row.is_active
          || user.core_user_uuid === row.core_user_uuid
        }
      >
        {permissions.map((permission, index) => (
          <Button
            className={classes.btnPermission}
            key={`btnGroup${index}`}
            variant={
              permission.value === active
                ? 'contained'
                : 'outlined'
            }
            onClick={() => {
              setActive(permission.value);
              crud.updateItem({
                id: row.id,
                core_groups: [permission.value],
              });
            }}
          >
            {permission.label}
          </Button>
        ))}
      </ButtonGroup>
    ) : (
      <></>
    );
  };

  const actionsTemplate = (row, crud) => {
    const handleMenuClick = (event) => {
      setMenu({ row, element: event.currentTarget });
    };

    const handleMenuItemClick = (action) => {
      if (action === 'delete') {
        crud.deleteItem(menu.row);
      } else if (action === 'deactivate') {
        crud.updateItem({ id: menu.row.id, is_active: false });
      } else {
        crud.updateItem({ id: menu.row.id, is_active: true });
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
          open={!!(menu.row && (menu.row.id === row.id))}
          onClose={handleMenuClose}
        >
          {row.actions.filter((option) => !(option.value === 'delete' && row.is_active)).map((option) => (
            <MenuItem
              key={`userActions${row.id}:${option.value}`}
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
    <Box sx={{
      overflowX: 'auto',
    }}
    >
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
            isOrganizationAdmin
              ? (
                <PermissionsTable
                  columns={[
                    {
                      label: 'Full name',
                      prop: 'name',
                      flex: '1',
                      template: (row) => {
                        const { is_active, first_name, last_name } = row;
                        return (
                          <Typography
                            variant="body1"
                            style={
                              !is_active
                                ? { color: '#aaa' }
                                : null
                            }
                          >
                            {`${first_name} ${last_name}`}
                          </Typography>
                        );
                      },
                    },
                    {
                      label: 'Email',
                      prop: 'email',
                      flex: '2',
                      template: (row) => {
                        const { is_active, email } = row;
                        return (
                          <Typography
                            variant="body2"
                            style={
                            !is_active
                              ? { color: '#aaa' }
                              : null
                          }
                          >
                            {email}
                          </Typography>
                        );
                      },
                    },
                    {
                      label: 'Last activity',
                      prop: 'activity',
                      flex: '1',
                      template: () => (
                        <Typography
                          variant="caption"
                          style={{ color: '#aaa' }}
                        >
                          Today
                        </Typography>
                      ),
                    },
                    {
                      label: 'Permissions',
                      prop: 'permission',
                      flex: '2',
                      template: (row) => permissionsTemplate(row, crud, classes),
                    },
                    {
                      label: 'Actions',
                      prop: 'options',
                      flex: '1',
                      template: (row) => actionsTemplate(row, crud),
                    },
                  ]}
                  rows={crud.getData()}
                  sortFn={(a, b) => {
                    if (a.core_user_uuid === user.core_user_uuid) {
                      return -1;
                    }
                    if (b.core_user_uuid === user.core_user_uuid) {
                      return 1;
                    }
                    return 0;
                  }}
                />
              )
              : (
                <PermissionsTable
                  columns={[
                    {
                      label: 'Full name',
                      prop: 'name',
                      flex: '1',
                      template: (row) => {
                        const { is_active, first_name, last_name } = row;
                        return (
                          <Typography
                            variant="body1"
                            style={
                            !is_active
                              ? { color: '#aaa' }
                              : null
                          }
                          >
                            {`${first_name} ${last_name}`}
                          </Typography>
                        );
                      },
                    },
                    {
                      label: 'Email',
                      prop: 'email',
                      flex: '2',
                      template: (row) => {
                        const { is_active, email } = row;
                        return (
                          <Typography
                            variant="body2"
                            style={
                            !is_active
                              ? { color: '#aaa' }
                              : null
                          }
                          >
                            {email}
                          </Typography>
                        );
                      },
                    },
                    {
                      label: 'Organization name',
                      prop: 'organization',
                      flex: '2',
                      template: (row) => {
                        const { is_active, organization, organization_name } = row;
                        return (
                          <Typography
                            variant="body2"
                            style={
                            !is_active
                              ? { color: '#aaa' }
                              : null
                          }
                          >
                            {organization.name || organization_name}
                          </Typography>
                        );
                      },
                    },
                    {
                      label: 'Last activity',
                      prop: 'activity',
                      flex: '1',
                      template: () => (
                        <Typography
                          variant="caption"
                          style={{ color: '#aaa' }}
                        >
                          Today
                        </Typography>
                      ),
                    },
                    {
                      label: 'Permissions',
                      prop: 'permission',
                      flex: '2',
                      template: (row) => permissionsTemplate(row, crud, classes),
                    },
                    {
                      label: 'Actions',
                      prop: 'options',
                      flex: '1',
                      template: (row) => actionsTemplate(row, crud),
                    },
                  ]}
                  rows={crud.getData()}
                  sortFn={(a, b) => {
                    if (a.core_user_uuid === user.core_user_uuid) {
                      return -1;
                    }
                    if (b.core_user_uuid === user.core_user_uuid) {
                      return 1;
                    }
                    return 0;
                  }}
                />
              )
          );
        }}
      </Crud>
    </Box>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.coreGroupReducer,
});

export default connect(mapStateToProps)(Users);
