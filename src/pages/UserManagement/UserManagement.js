import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import Popup from 'reactjs-popup';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
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
import { Add as AddIcon } from '@material-ui/icons';
import { useInput } from '@hooks/useInput';
import { invite } from '@redux/authuser/actions/authuser.actions';
import { routes } from '@routes/routesConstants';
import UserGroups from './UserGroups/UserGroups';
import Users from './Users/Users';

const useStyles = makeStyles((theme) => ({
  userManagementHeading: {
    fontWeight: 'bold',
    margin: '0.5em 0',
  },
  textField: {
    minHeight: '5rem',
    margin: theme.spacing(1, 0),
    width: '100%',
  },
  inviteForm: {
    padding: '1rem',
    minWidth: '25rem',
    backgroundColor: '#424242',
  },
}));

/**
 * Outputs the user management page.
 */
const UserManagement = ({
  dispatch,
  loading,
  error,
  user,
  history,
  location,
}) => {
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

  if (
    user
    && user.data
    && user.data.detail
    && inviteCall
    && !error
  ) {
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

  const getEmailsFromInputValue = (value) => (
    value.split(',').map((item) => item.trim())
  );

  const viewTabClicked = (event, newView) => {
    setView(newView);
  };

  return (
    <Box mt={5} mb={3}>
      <Box mb={3}>
        <Popup
          trigger={(
            <Button
              type="button"
              variant="contained"
              color="primary"
            >
              <AddIcon />
              {' '}
              Invite Users
            </Button>
          )}
          position="bottom left"
          on="click"
          closeOnDocumentClick
          mouseLeaveDelay={300}
          mouseEnterDelay={0}
          contentStyle={{
            padding: '0px',
            border: 'none',
            width: '{rem(250)}',
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
              error={error}
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
                  disabled={loading}
                  type="submit"
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </form>
        </Popup>
        <Typography
          className={classes.userManagementHeading}
          variant="h4"
        >
          People using this system
        </Typography>
      </Box>
      <Box mb={3}>
        <Tabs value={view} onChange={viewTabClicked}>
          {subNav.map((itemProps, index) => (
            <Tab
              {...itemProps}
              key={`tab${index}:${itemProps.value}`}
            />
          ))}
        </Tabs>
      </Box>
      <Route path={routes.CURRENT_USERS} component={Users} />
      <Route path={routes.USER_GROUPS} component={UserGroups} />
      <NotificationContainer />
    </Box>
  );
};

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
});
export default connect(mapStateToProps)(UserManagement);
