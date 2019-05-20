import React, { useState, useContext } from 'react'
import { FjMenu } from 'freyja-react'
import { connect } from 'react-redux'
import { logout } from 'redux/actions/Auth.actions'
import NavItem from 'midgard/components/NavItem/NavItem'
import { UserContext } from 'midgard/context/User.context'

/**
 * Component for user that appears in the sidebar navigation.
 */
function NavUser({location, history, dispatch}) {
  let user = useContext(UserContext);
  if (!user) {
       user = JSON.parse(localStorage.getItem('oauthUser')).data;
  }
  
  // Last login
  const lastLoginDate = Date.parse(localStorage.getItem('token_stored_at'));
  const time = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(lastLoginDate);
  const day = new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(lastLoginDate);
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(lastLoginDate);
  const lastLogin = `${time} ${day}, ${month}`;

  const [open, setOpen] = useState(false);
  const menuItems = [
    { value: 'profile', label: 'Profile settings' },
    { value: 'logout', label: 'Logout' }
  ];

  /**
   * Navigates to the profile screen.
   */
  const openProfile = () => {
    const { from } = location.state || { from: { pathname: '/app/profile/settings' } };
    history.push(from);
  }

  /**
   * Clears authentication and redirects to the login screen.
   */
  const userLogout = () => {
    dispatch(logout());
    const { from } = location.state || { from: { pathname: "/" } };
    history.push(from);
  }

  /**
   * Handles the action.
   * @param {string} action
   */
  const selectAction = (action) => {
    switch(action) {
      case 'profile':
        return openProfile();
      case 'logout':
        return userLogout();
      default:
        return;
    }
  }

  return (
    <FjMenu
      xPosition="right"
      yPosition="top"
      open={open}
      setOpen={() => setOpen(!open)}
      onActionClicked={(e) => {selectAction(e)}}
      menuItems={menuItems}>
      <div onClick={() => setOpen(!open)}>
        <NavItem
          toggle
          defaultImage
          title={user.first_name + ' ' + user.last_name}
          description={'Last login ' + lastLogin}
          active={location.pathname.includes('profile')}
          action={(e) => {selectAction(e)}}>
        </NavItem>
      </div>
    </FjMenu>
  )
}

export default connect()(NavUser);
