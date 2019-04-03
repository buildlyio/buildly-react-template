import React from 'react'
import { oauthService } from 'midgard/modules/oauth/oauth.service';
import logo from 'assets/midgard-logo.svg';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import './Register.scss'
import { register } from 'store/actions/authActions';
import { Button } from 'ui/Button/Button';
import InputField from 'ui/InputField/InputField';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      organization_name: '',
      first_name: '',
      last_name: '',
      button_clicked: false
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
   * Submit the form to the backend and attempts to create a user
   * @param {Event} event the default submit event
   */
  submit(event) {
    event.preventDefault();
    this.setState({ button_clicked: true });
    const registerFormValue = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      organization_name: this.state.organization_name,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
    };
    this.props.dispatch(register(registerFormValue));
  }

  render() {
    const { email, username, password, organization_name, first_name, last_name, button_clicked } = this.state;
    const { loading, loaded, error } = this.props;
    if (this.oauthService.hasValidAccessToken()) {
      return <Redirect push to="/" />;
    }
    if (loaded && button_clicked) {
      this.setState({button_clicked: false});
      return <Redirect push to="/login" />;
    }
    return (
      <div className="register">
        <div className="register__card">
          <div className="register__card__content">
            <img className="register__card__logo" src={logo} />
            <form className="register__form" onSubmit={this.submit}>
              <InputField
                label="Email"
                id="email"
                type="text"
                placeholder="Enter email"
                value={email}
                required="true"
                change={this.updateField} />
              <InputField
                label="Username"
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                required="true"
                change={this.updateField} />
              <InputField
                label="Password"
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                required="true"
                change={this.updateField} />
              <InputField
                label="Organization name"
                id="organization_name"
                type="text"
                placeholder="Enter organization name"
                value={organization_name}
                required="true"
                change={this.updateField} />
              <InputField
                label="First name"
                id="first_name"
                type="text"
                placeholder="Enter first name"
                value={first_name}
                change={this.updateField} />
              <InputField
                label="Last name"
                id="last_name"
                type="text"
                placeholder="Enter last name"
                value={last_name}
                change={this.updateField}
                error={error} />
              <Button
                disabled={loading}
                type="submit">
                Register
              </Button>
              <Link className="register__form__link" to="/login">Login</Link>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({...ownProps, ...state.authReducer});

export default connect(mapStateToProps)(Register);