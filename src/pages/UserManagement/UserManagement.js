import React, { useEffect, useState } from 'react';
import { Route, useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Tab,
  Tabs,
} from '@mui/material';
import { getUser } from '@context/User.context';
import { checkForGlobalAdmin } from '@utils/utilMethods';
import { routes } from '@routes/routesConstants';
import Users from './Users/Users';
import UserGroups from './UserGroups/UserGroups';
import AddOrganization from './forms/AddOrganization';
import AddUser from './forms/AddUser';

const UserManagement = () => {
  const history = useHistory();
  const subNav = [
    { label: 'Current users', value: 'current-users' },
    { label: 'User groups', value: 'groups' },
  ];
  const viewPath = (
    subNav.find((item) => location.pathname.endsWith(item.value)) || subNav[0]
  ).value;
  const [view, setView] = useState(viewPath);
  const [showAddOrganization, setShowAddOrganization] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  const user = getUser();
  let isSuperAdmin = false;

  useEffect(() => {
    history.push(`/app/profile/users/${view || location.state}`);
  }, [view]);

  const viewTabClicked = (event, newView) => {
    setView(newView);
  };

  if (user) {
    isSuperAdmin = checkForGlobalAdmin(user);
  }

  return (
    <Box mt={5} mb={3}>
      {isSuperAdmin
        && (
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={() => setShowAddOrganization(true)}
          >
            + Add Organization
          </Button>
        )}
      <Button
        type="button"
        variant="contained"
        color="primary"
        onClick={() => setShowAddUser(true)}
        style={{ marginLeft: isSuperAdmin ? '20px' : '0px' }}
      >
        + Add Users
      </Button>
      <Box mb={3} mt={2}>
        <Tabs value={view} onChange={viewTabClicked}>
          {subNav.map((itemProps, index) => (
            <Tab {...itemProps} key={`tab${index}:${itemProps.value}`} />
          ))}
        </Tabs>
      </Box>
      <Route path={routes.CURRENT_USERS} component={Users} />
      <Route path={routes.USER_GROUPS} component={UserGroups} />
      <AddOrganization open={showAddOrganization} setOpen={setShowAddOrganization} />
      <AddUser open={showAddUser} setOpen={setShowAddUser} />
    </Box>
  );
};

export default UserManagement;
