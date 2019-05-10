import React from 'react'
import { oauthService } from 'midgard/modules/oauth/oauth.service'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { Button } from 'ui/Button/Button'
import { login } from 'redux/actions/Auth.actions'
import InputField from 'ui/InputField/InputField'
import AuthForm from 'midgard/components/AuthForm/AuthForm'
import { useInput } from 'midgard/hooks/useInput'

/**
 * Outputs the login form page for the application.
 */
function Login({dispatch, loading}) {
  const username = useInput('', { required: true });
  const password = useInput('', { required: true });

  const registerLink = { label: 'Register', value: '/register' };
  if (oauthService.hasValidAccessToken()) {
    return <Redirect push to="/" />;
  }

  /**
   * Submit the form to the backend and attempts to authenticate
   * @param {Event} event the default submit event
   */
  const submit = (event) => {
    event.preventDefault();
    const loginFormValue = {
      username: username.value,
      password: password.value
    };
    dispatch(login(loginFormValue));
  }

  return (
    <AuthForm onSubmit={submit} link={registerLink}>
      <InputField
        label="Username"
        id="username"
        type="text"
        placeholder="Enter username"
        {...username.bind} />
      <InputField
        label="Password"
        id="password"
        type="password"
        placeholder="Enter password"
        {...password.bind} />
      <Button
        disabled={loading}
        type="submit">
        Login
      </Button>
    </AuthForm>
  )
}

const mapStateToProps = (state, ownProps) => ({...ownProps, ...state.authReducer});

export default connect(mapStateToProps)(Login);