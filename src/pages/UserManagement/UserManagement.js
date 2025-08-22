import React, { useEffect, useState } from 'react';
import {
  Routes, Route, useNavigate, useLocation,
} from 'react-router-dom';
import {
  Box,
  Button,
  Tab,
  Tabs,
} from '@mui/material';
import { getUser } from '@context/User.context';
import { hasGlobalAdminRights } from '@utils/permissions';
import { routes } from '@routes/routesConstants';
import Users from './Users/Users';
import UserGroups from './UserGroups/UserGroups';
import InviteUser from './forms/InviteUser';

function UserManagement() {
  const navigate = useNavigate();
  const location = useLocation();
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
    navigate(`/app/profile/users/${view || location.state}`);
  }, [view]);

  const viewTabClicked = (event, newView) => {
    setView(newView);
  };

  if (user) {
    isSuperAdmin = hasGlobalAdminRights(user);
  }

  return (
    <Box
      mt={5}
      mb={3}
      sx={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        paddingLeft: '4rem',
        paddingRight: '2rem',
      }}
    >
      <Button
        type="button"
        variant="contained"
        color="primary"
        onClick={() => setShowAddUser(true)}
        style={{ marginLeft: isSuperAdmin ? '20px' : '0px' }}
      >
        + Invite Users
      </Button>
      <Box mb={3} mt={2}>
        <Tabs value={view} onChange={viewTabClicked}>
          {subNav.map((itemProps, index) => (
            <Tab {...itemProps} key={`tab${index}:${itemProps.value}`} />
          ))}
        </Tabs>
      </Box>
      <Routes>
        <Route path="current-users" element={<Users />} />
        <Route path="groups" element={<UserGroups />} />
      </Routes>
      <InviteUser open={showAddUser} setOpen={setShowAddUser} />
    </Box>
  );
}

export default UserManagement;
