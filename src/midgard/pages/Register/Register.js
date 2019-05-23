import React, { useState } from 'react'
import { oauthService } from 'midgard/modules/oauth/oauth.service'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { register } from 'midgard/redux/authuser/actions/authuser.actions'
import { FjButton, FjInputField } from 'freyja-react'
import AuthForm from 'midgard/components/AuthForm/AuthForm'
import { useInput } from 'midgard/hooks/useInput';

/**
 * Outputs the login form page for the application.
 */
function Register({dispatch, loading, loaded, error}) {
  const email = useInput('', { required: true });
  const username = useInput('', { required: true });
  const password = useInput('', { required: true });
  const organization_name = useInput('', { required: true });
  const first_name = useInput('');
  const last_name = useInput('');
  const [buttonClicked, setButtonClicked] = useState(false);

  const loginLink = { label: 'Login', value: '/login' };
  const valid = email.valid && username.valid && password.valid && organization_name.valid && first_name.valid && last_name.valid;

  if (oauthService.hasValidAccessToken()) {
    return <Redirect push to="/" />;
  }
  
  if (loaded && buttonClicked) {
    setButtonClicked(false);
    return <Redirect push to={loginLink.value} />;
  }

  /**
   * Submit the form to the backend and attempts to create a user
   * @param {Event} event the default submit event
   */
  const submit = (event) => {
    event.preventDefault();
    setButtonClicked(true);
    const registerFormValue = {
      username: username.value,
      email: email.value,
      password: password.value,
      organization_name: organization_name.value,
      first_name: first_name.value,
      last_name: last_name.value,
    };
    dispatch(register(registerFormValue));
  }

  return (
    <AuthForm onSubmit={submit} link={loginLink}>
      <FjInputField
        label="Email"
        id="email"
        type="text"
        placeholder="Enter email"
        {...email.bind}  />
      <FjInputField
        label="Username"
        id="username"
        type="text"
        placeholder="Enter username"
        {...username.bind} />
      <FjInputField
        label="Password"
        id="password"
        type="password"
        placeholder="Enter password"
        {...password.bind} />
      <FjInputField
        label="Organization name"
        id="organization_name"
        type="text"
        placeholder="Enter organization name"
        {...organization_name.bind} />
      <FjInputField
        label="First name"
        id="first_name"
        type="text"
        placeholder="Enter first name"
        {...first_name.bind} />
      <FjInputField
        label="Last name"
        id="last_name"
        type="text"
        placeholder="Enter last name"
        error={error}
        {...last_name.bind} />
      <FjButton
        disabled={!valid || loading}
        type="submit">
        Register
      </FjButton>
    </AuthForm>
  )
}

const mapStateToProps = (state, ownProps) => ({...ownProps, ...state.authReducer});

export default connect(mapStateToProps)(Register);
