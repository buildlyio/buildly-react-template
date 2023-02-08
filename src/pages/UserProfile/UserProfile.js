import React, { useEffect, useState } from 'react';
import {
  Grid, Tabs, Tab, Typography,
} from '@mui/material';
import { Route } from 'react-router-dom';
import { routes } from '@routes/routesConstants';
import EditUserProfile from './EditUserProfile/EditUserProfile';
import Subscriptions from './Subscriptions/Subscriptions';

const UserProfile = ({ history, location }) => {
  const subNav = [
    {
      label: 'My profile',
      value: 'edit-profile',
    },
    {
      label: 'Subscriptions',
      value: 'subscriptions',
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
          User profile
        </Typography>
      </Grid>
      <Grid mb={3} container justifyContent="center">
        <Grid item>
          <Tabs value={view} onChange={(event, vw) => setView(vw)}>
            {subNav.map((itemProps, index) => (
              <Tab {...itemProps} key={`tab${index}:${itemProps.value}`} />
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
