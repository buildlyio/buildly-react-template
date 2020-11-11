import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { colors } from "colors";
import styled from "styled-components";
import { rem } from "polished";
import { FjInputField } from "freyja-react";
import InviteForm from "midgard/components/InviteForm/InviteForm";
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

/**
 * Styled component for the user management page.
 */
const UserManagementLayout = styled.div`
  height: 100%;
  display: flex;
  flex: 1;
  background-color: ${colors.baseLighter};
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: flex-start;
  margin: 0 ${rem(24)};
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${rem(30)};
`;

const SwitcherContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  margin-bottom: ${rem(30)};
`;

const InviteInputContainer = styled.div`
  width: 100%;
`;

const useStyles = makeStyles((theme) => ({
  btnTriggerPanel: {
    marginLeft: theme.spacing(2),
  },
  btnSendInvite: {
    marginLeft: "auto",
  },
  textField: {
    minHeight: "5rem",
    margin: "0.25rem 0",
    width: "100%",
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
  const [view, setView] = useState("current-users");

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
    <UserManagementLayout>
      <ProfileContainer>
        <ProfileHeader>
          <Typography variant="h6">People using this system</Typography>
          <Popup
            trigger={
              <Button
                className={classes.btnTriggerPanel}
                size="small"
                variant="contained"
                color="primary">
                Invite
              </Button>
            }
            position="bottom center"
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
            <InviteForm onSubmit={inviteUser}>
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
              <Button
                className={classes.btnSendInvite}
                size="small"
                variant="contained"
                color="primary"
                disabled={loading}
                type="submit">
                Send
              </Button>
            </InviteForm>
          </Popup>
        </ProfileHeader>
        <SwitcherContainer>
          <Tabs value={view} onChange={viewTabClicked}>
            {subNav.map(itemProps => <Tab {...itemProps} key={'tab-view-' + itemProps.value} />)}
          </Tabs>
        </SwitcherContainer>
        <Route path={routes.CURRENT_USERS} component={Users} />
        <Route path={routes.USER_GROUPS} component={UserGroups} />
      </ProfileContainer>
      <NotificationContainer />
    </UserManagementLayout>
  );
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  ...state.authReducer,
});
export default connect(mapStateToProps)(UserManagement);
