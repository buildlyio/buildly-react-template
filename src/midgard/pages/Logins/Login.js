import React from 'react'
import { oauthService } from 'midgard/modules/oauth/oauth.service'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { Button } from 'ui/Button/Button'
import { login } from 'redux/actions/Auth.actions'
import InputField from 'ui/InputField/InputField'
import AuthForm from 'midgard/components/AuthForm/AuthForm'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.oauthService = oauthService;
    this.updateField = this.updateField.bind(this);
    this.submit = this.submit.bind(this);
  }

  /**
   * Updates the state for a field
   * @param {Event} event the change event
   */
  updateField(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  /**
   * Submit the form to the backend and attempts to authenticate
   * @param {Event} event the default submit event
   */
  submit(event) {
    event.preventDefault();
    this.setState({ loading: true });
    const loginFormValue = {
      username: this.state.username,
      password: this.state.password
    };
    this.props.dispatch(login(loginFormValue));
  }

  render() {
    const { username, password } = this.state;
    const { loading, error } = this.props;
    const registerLink = { label: 'Register', value: '/register' };
    if (this.oauthService.hasValidAccessToken()) {
      return <Redirect push to="/" />;
    }
    return (
      <AuthForm onSubmit={this.submit} link={registerLink}>
        <InputField
          label="Username"
          id="username"
          type="text"
          placeholder="Enter username"
          value={username}
          change={this.updateField} />
        <InputField
          label="Password"
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          error={error}
          change={this.updateField} />
        <Button
          disabled={loading}
          type="submit">
          Login
        </Button>
      </AuthForm>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({...ownProps, ...state.authReducer});

export default connect(mapStateToProps)(Login);