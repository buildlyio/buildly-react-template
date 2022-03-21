import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { invite } from '@redux/authuser/authuser.actions';
import { useInput } from '@hooks/useInput';
import Popup from 'reactjs-popup';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import { Route } from 'react-router-dom';
import { routes } from '@routes/routesConstants';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import EmailIcon from '@mui/icons-material/Email';
import { rem } from 'polished';
import Users from './Users/Users';
import UserGroups from './UserGroups/UserGroups';

const useStyles = makeStyles((theme) => ({
  userManagementHeading: {
    margin: theme.spacing(3, 0),
  },
  textField: {
    minHeight: rem(5),
    margin: theme.spacing(1, 0),
    width: '100%',
  },
  inviteForm: {
    padding: theme.spacing(3),
    minWidth: rem(25),
  },
}));

/**
 * Outputs the user management page.
 */
function UserManagement({
  dispatch, loading, error, user, history, location, loaded,
}) {
  const classes = useStyles();
  const email = useInput('', { required: true });
  const [inviteCall, setInviteCall] = useState(false);
  const subNav = [
    { label: 'Current users', value: 'current-users' },
    { label: 'User groups', value: 'groups' },
  ];
  const viewPath = (subNav.find((item) => location.pathname.endsWith(item.value))
  || subNav[0]).value;
  const [view, setView] = useState(viewPath);

  // this will be triggered whenever the content switcher is clicked to change the view
  useEffect(() => {
    history.push(`/app/profile/users/${view || location.state}`);
  }, [view]);

  if (user && user.data && user.data.detail && inviteCall && !error) {
    NotificationManager.success(user.data.detail, 'Success');
    setInviteCall(false);
  }

  const inviteUser = (event) => {
    event.preventDefault();
    const inviteFormValue = {
      emails: getEmailsFromInputValue(email.value),
    };
    setInviteCall(true);
    dispatch(invite(inviteFormValue));
    email.clear();
  };

  const getEmailsFromInputValue = (value) => value.split(',').map((item) => item.trim());

  // eslint-disable-next-line no-shadow
  const viewTabClicked = (event, view) => {
    setView(view);
  };

  return (
    <Box mt={1} mb={3}>
      <Grid container mb={3} justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography className={classes.userManagementHeading} variant="h4">
            People using this system
          </Typography>
        </Grid>
        <Grid item>
          <Popup
            trigger={(
              <Button
                type="button"
                variant="outlined"
                size="small"
                color="primary"
                startIcon={<EmailIcon />}
              >
                Invite users
              </Button>
            )}
            position="bottom right"
            on="click"
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            contentStyle={{
              padding: 0,
              border: 'none',
              width: '100%',
              minWidth: `${rem(250)}`,
              maxWidth: `${rem(400)}`,
            }}
            arrow={false}
          >
            <form className={classes.inviteForm}>
              <Typography variant="h6">
                Invite users to platform
              </Typography>
              <TextField
                className={classes.textField}
                label="Emails"
                id="email"
                variant="outlined"
                placeholder="abc@xcy.com, 123@zxc.com"
                error={Boolean(error)}
                helperText={error}
                {...email.bind}
              />
              <Grid
                justifyContent="flex-end"
                container
                spacing={0}
              >
                <Grid item>
                  <Button
                    onClick={inviteUser}
                    size="small"
                    variant="contained"
                    color="primary"
                    disabled={(loading && !loaded) || !email.value}
                    type="submit"
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Popup>
        </Grid>
      </Grid>
      <Grid mb={3} container justifyContent="center">
        <Grid item>
          <Tabs value={view} onChange={viewTabClicked}>
            {subNav.map((itemProps, index) => <Tab {...itemProps} key={`tab${index}:${itemProps.value}`} />)}
          </Tabs>
        </Grid>
      </Grid>
      <Route path={routes.CURRENT_USERS} component={Users} />
      <Route path={routes.USER_GROUPS} component={UserGroups} />
      <NotificationContainer />
    </Box>
  );
}

const mapStateToProps = (state, ownProps) => {
  const loaded = state.coreuserReducer.loaded && state.coregroupReducer.loaded;

  return {
    ...ownProps,
    ...state.authReducer,
    loaded,
  };
};

export default connect(mapStateToProps)(UserManagement);
