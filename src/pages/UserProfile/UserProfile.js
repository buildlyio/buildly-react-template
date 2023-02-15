import React, { useEffect, useState } from 'react';
import {
  Grid, Tabs, Tab, Typography,
} from '@mui/material';
import { Route } from 'react-router-dom';
import { routes } from '@routes/routesConstants';
import EditUserProfile from './EditUserProfile/EditUserProfile';
import Subscriptions from './Subscriptions/Subscriptions';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const UserProfile = ({ history, location }) => {
  const subNav = [
    {
      label: 'Profile',
      value: 'edit-profile',
      icon: <PersonIcon />,
    },
    {
      label: 'Subscriptions',
      value: 'subscriptions',
      icon: <AccountBalanceWalletIcon />,
    },
  ];
  const viewPath = (
    subNav.find((item) => location.pathname.endsWith(item.value)) || subNav[0]
  ).value;
  const [view, setView] = useState(viewPath);

  useEffect(() => {
    history.push(`/app/profile/user/${view || location.state}`);
  }, [view]);

  return (
    <>
      <Grid container my={3} justifyContent="space-between" alignItems="start">
        <Typography variant="h4">
          My account
        </Typography>
      </Grid>
      <Grid mb={3} sx={{ width: '100%' }}>
        <Grid item>
          <Tabs value={view} onChange={(event, vw) => setView(vw)}>
            {subNav.map((itemProps, index) => (
              <Tab icon={itemProps.icon} iconPosition="start" {...itemProps} key={`tab${index}:${itemProps.value}`} />
            ))}
          </Tabs>
        </Grid>
      </Grid>
      <Route path={routes.EDIT_USER_PROFILE} component={EditUserProfile} />
      <Route path={routes.USER_SUBSCRIPTIONS} component={Subscriptions} />
    </>
  );
};

export default UserProfile;
