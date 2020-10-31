import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { colors } from "colors";
import styled from "styled-components";
import { rem } from "polished";
import { FjButton, FjInputField } from "freyja-react";
import InviteForm from "midgard/components/InviteForm/InviteForm";
import { invite } from "midgard/redux/authuser/actions/authuser.actions";
import { useInput } from "midgard/hooks/useInput";
import { FjContentSwitcher } from "freyja-react";
import Popup from "reactjs-popup";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Users from "./Users/Users";
import UserGroups from "./UserGroups/UserGroups";
import { Route } from "react-router-dom";
import { routes } from "../../routes/routesConstants";

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

const ProfileHeading = styled.h3`
  padding-right: ${rem(12)};
`;

const SwitcherContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  border-top: 1px solid #e1e1e1;
  margin-bottom: ${rem(30)};
`;

const SwitcherPosition = styled.div`
  margin-top: ${rem(-22)};
`;

const InviteHeader = styled.div`
  width: 100%;
  margin-bottom: ${rem(12)};
`;

const InviteInputContainer = styled.div`
  width: 100%;
`;

/**
 * The current oauth user.
 */
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

/**
 * Outputs the user management page.
 */
function UserManagement({ dispatch, loading, error, user, history, location }) {
  const email = useInput("", { required: true });
  const [inviteCall, setinviteCall] = useState(false);
  const subNav = [
    { label: "Current users", value: "current-users" },
    { label: "User groups", value: "groups" },
  ];
  let viewState = useState("current-users");
  const [view, setView] = viewState;

  // this will be triggered whenever the content switcher is clicked to change the view
  useEffect(() => {
    history.push(`/app/profile/users/${view || location.state}`);
  }, [view]);

  if (user && user.data && user.data.detail && inviteCall && !error) {
    NotificationManager.success(user.data.detail, "Success");
    setinviteCall(false);
  }

  const inviteUser = (event) => {
    event.preventDefault();
    const inviteFormValue = {
      emails: [email.value],
    };
    setinviteCall(true);
    dispatch(invite(inviteFormValue));
  };

  return (
    <UserManagementLayout>
      <ProfileContainer>
        <ProfileHeader>
          <ProfileHeading>People using this system</ProfileHeading>
          <Popup
            trigger={<FjButton size="small">Invite</FjButton>}
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
              <InviteHeader>
                {" "}
                Invite user to platform
              </InviteHeader>
              <InviteInputContainer>
                <FjInputField
                  label="Emails"
                  id="email"
                  type="text"
                  placeholder="abc@xcy.com, 123@zxc.com"
                  error={error}
                  {...email.bind}
                />
              </InviteInputContainer>
              <FjButton size="small" disabled={loading} type="submit">
                Send
              </FjButton>
            </InviteForm>
          </Popup>
        </ProfileHeader>
        <SwitcherContainer>
          <SwitcherPosition>
            <FjContentSwitcher
              size="small"
              active={viewState}
              options={subNav}
            />
          </SwitcherPosition>
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
