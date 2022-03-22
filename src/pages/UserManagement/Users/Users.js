/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '@context/User.context';
import { StyledTable } from '@components/StyledTable/StyledTable';
import Crud from '@modules/crud/Crud';
import { getCoregroups } from '@redux/coregroup/coregroup.actions';
import { connect } from 'react-redux';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';
import { rem } from 'polished';
import { Typography } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  btnPermission: {
    fontSize: rem(10),
  },
  table: {
    marginTop: theme.spacing(2),
  },
  textDisabled: {
    color: '#aaaaaa',
  },
}));

/**
 * Current users list
 */
function Users({
  location, history, data, dispatch,
}) {
  const classes = useStyles();
  // state to toggle actions menus
  const [menu, setMenu] = useState({ row: null, element: null });
  const [coregroupsLoaded, setCoregroupsLoaded] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const user = useContext(UserContext);

  useEffect(() => {
    if (!coregroupsLoaded) {
      dispatch(getCoregroups());
      setCoregroupsLoaded(true);
    } else {
      // define permissions
      setPermissions(data.map((coregroup) => ({ label: coregroup.name, value: coregroup.id })));
    }
  }, [data]);

  // table templates
  // eslint-disable-next-line consistent-return
  const permissionsTemplate = (row, crud, classes) => {
    if (coregroupsLoaded) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [active, setActive] = useState(row.core_groups[0]
        // eslint-disable-next-line no-mixed-operators
        && row.core_groups[0].id || row.core_groups[0]);
      return (
        <ButtonGroup disableElevation color="primary" size="small" disabled={!row.is_active || user.core_user_uuid === row.core_user_uuid}>
          {permissions.map((permission, index) => (
            <Button
              className={classes.btnPermission}
              key={`btnGroup${index}`}
              variant={permission.value === active ? 'contained' : 'outlined'}
              onClick={() => {
                setActive(permission.value);
                crud.updateItem({ id: row.id, core_groups: [permission.value] });
              }}
            >
              {permission.label}
            </Button>
          ))}
        </ButtonGroup>
      );
    }
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
          size="large"
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
            <StyledTable
              className={classes.table}
              columns={[
                {
                  label: 'Full name',
                  prop: 'name',
                  template: (row) => (
                    <Typography variant="body1" className={row.is_active ? '' : classes.textDisabled}>
                      {row.first_name}
                      {' '}
                      {row.last_name}
                    </Typography>
                  ),
                },
                {
                  label: 'Email',
                  prop: 'email',
                  template: (row) => (
                    <Typography variant="body2" className={row.is_active ? '' : classes.textDisabled}>
                      {' '}
                      {row.email}
                    </Typography>
                  ),
                },
                { label: 'Last activity', prop: 'activity', template: (row) => (<Typography variant="caption" className={classes.textDisabled}>Today</Typography>) },
                { label: 'Permissions', prop: 'permission', template: (row) => permissionsTemplate(row, crud, classes) },
                { label: 'Actions', prop: 'options', template: (row) => actionsTemplate(row, crud) },
              ]}
              rows={crud.getData()}
              // eslint-disable-next-line no-nested-ternary
              sortFn={(a, b) => (a.core_user_uuid === user.core_user_uuid
                ? -1 : b.core_user_uuid === user.core_user_uuid ? 1 : 0)}
            />
          );
        }}
      </Crud>
    </Box>
  );
}

const mapStateToProps = (state, ownProps) => ({ ...state.coregroupReducer, ...ownProps });

export default connect(mapStateToProps)(Users);
