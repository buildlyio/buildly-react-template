import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { invite } from "midgard/redux/authuser/actions/authuser.actions";
import { useInput } from "midgard/hooks/useInput";
import Popup from "reactjs-popup";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Users from "./Users/Users";
import UserGroups from "./UserGroups/UserGroups";
import { Route } from "react-router-dom";
import { routes } from "../../routes/routesConstants";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  userManagementHeading: {
    fontWeight: "bold",
    margin: "0.5em 0",
  },
  textField: {
    minHeight: "5rem",
    margin: theme.spacing(1, 0),
    width: "100%",
  },
  inviteForm: {
    padding: "1rem",
    minWidth: "25rem",
    backgroundColor: "#424242"
  }
}));

/**
 * Outputs the user management page.
 */
function UserManagement({ dispatch, loading, error, user, history, location }) {
  const classes = useStyles();
  const email = useInput("", { required: true });
  const [inviteCall, setInviteCall] = useState(false);
  const subNav = [
    { label: "Current users", value: "current-users" },
    { label: "User groups", value: "groups" },
  ];
  const viewPath = (subNav.find(item => location.pathname.endsWith(item.value)) || subNav[0]).value;
  const [view, setView] = useState(viewPath);

  // this will be triggered whenever the content switcher is clicked to change the view
  useEffect(() => {
    history.push(`/app/profile/users/${view || location.state}`);
  }, [view]);

  if (user && user.data && user.data.detail && inviteCall && !error) {
    NotificationManager.success(user.data.detail, "Success");
    setInviteCall(false);
  }

  const inviteUser = (event) => {
    event.preventDefault();
    const inviteFormValue = {
      emails: [email.value],
    };
    setInviteCall(true);
    dispatch(invite(inviteFormValue));
    email.clear();
  };

  const viewTabClicked = (event, view) => {
    setView(view);
  };

  return (
    <Box mt={5} mb={3}>
      <Box mb={3}>
        <Popup
          trigger={
            <Button
              type="button"
              variant="contained"
              color="primary">
              <AddIcon /> Invite users
            </Button>
          }
          position="bottom left"
          on="click"
          closeOnDocumentClick
          mouseLeaveDelay={300}
          mouseEnterDelay={0}
          contentStyle={{
            padding: "0px",
            border: "none",
            width: `{rem(250)}`,
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
            justify="flex-end"
            container 
            spacing={0}>
            <Grid item>
              <Button
                onClick={inviteUser}
                size="small"
                variant="contained"
                color="primary"
                disabled={loading}
                type="submit">
                Send
              </Button>
            </Grid>
          </Grid>
        </form>
        </Popup>
        <Typography className={classes.userManagementHeading} variant={"h4"}>
          People using this system
        </Typography>
      </Box>
      <Box mb={3}>
        <Tabs value={view} onChange={viewTabClicked}>
          {subNav.map(itemProps => <Tab {...itemProps} key={'tab-view-' + itemProps.value} />)}
        </Tabs>
      </Box>
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
