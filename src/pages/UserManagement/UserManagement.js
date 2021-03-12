import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import Popup from 'reactjs-popup';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import { rem } from 'polished';
import {
  makeStyles,
  Tabs,
  Tab,
  Button,
  TextField,
  Typography,
  Grid,
  Box,
} from '@material-ui/core';
import { Email as EmailIcon } from '@material-ui/icons';
import { useInput } from '@hooks/useInput';
import { invite } from '@redux/authuser/actions/authuser.actions';
import { routes } from '@routes/routesConstants';
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
function UserManagement({ dispatch, loading, error, user, history, location }) {
  const classes = useStyles();
  const email = useInput('', { required: true });
  const [inviteCall, setInviteCall] = useState(false);
  const subNav = [
    { label: 'Current users', value: 'current-users' },
    { label: 'User groups', value: 'groups' },
  ];
  const viewPath = (
    subNav.find((item) => location.pathname.endsWith(item.value)) || subNav[0]
  ).value;
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

  const getEmailsFromInputValue = (value) => {
    return value.split(',').map((item) => item.trim());
  };

  const viewTabClicked = (event, view) => {
    setView(view);
  };

  return (
    <Box mt={1} mb={3}>
      <Grid container mb={3} justify='space-between' alignItems='center'>
        <Grid item>
          <Typography className={classes.userManagementHeading} variant={'h4'}>
            People using this system
          </Typography>
        </Grid>
        <Grid item>
          <Popup
            trigger={
              <Button
                type='button'
                variant='outlined'
                size='small'
                color='primary'
                startIcon={<EmailIcon />}
              >
                Invite users
              </Button>
            }
            position='bottom right'
            on='click'
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
              <Typography variant='h6'>Invite users to platform</Typography>
              <TextField
                className={classes.textField}
                label='Emails'
                id='email'
                variant='outlined'
                placeholder='abc@xcy.com, 123@zxc.com'
                error={error}
                helperText={error}
                {...email.bind}
              />
              <Grid justify='flex-end' container spacing={0}>
                <Grid item>
                  <Button
                    onClick={inviteUser}
                    size='small'
                    variant='contained'
                    color='primary'
                    disabled={loading}
                    type='submit'
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Popup>
        </Grid>
      </Grid>
      <Grid mb={3} container justify='center'>
        <Grid item>
          <Tabs value={view} onChange={viewTabClicked}>
            {subNav.map((itemProps, index) => (
              <Tab {...itemProps} key={`tab${index}:${itemProps.value}`} />
            ))}
          </Tabs>
        </Grid>
      </Grid>
      <Route path={routes.CURRENT_USERS} component={Users} />
      <Route path={routes.USER_GROUPS} component={UserGroups} />
      <NotificationContainer />
    </Box>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
});
export default connect(mapStateToProps)(UserManagement);
