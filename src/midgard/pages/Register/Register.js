import React from 'react'
import { oauthService } from 'midgard/modules/oauth/oauth.service';
import logo from 'assets/midgard-logo.svg';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import './Register.scss'

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
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
    const registerFormValue = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    };
  }

  render() {
    const { username, email, password } = this.state;
    const { loading, error } = this.props;
    if (this.oauthService.hasValidAccessToken()) {
      return <Redirect push to="/" />;
    }
    return (
      <div className="register">
        <div className="register__card">
          <div className="register__card__content">
            <img className="register__card__logo" src={logo} />
            <form className="register__form" onSubmit={this.submit}>
              <div className="register__form__field">
                <label
                  className="register__form__label"
                  htmlFor="username">
                  Username
                </label>
                <input
                  className="register__form__input"
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={this.updateField} />
              </div>
              <div className="register__form__field">
                <label
                  className="register__form__label"
                  htmlFor="email">
                  Email
                </label>
                <input
                  className="register__form__input"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={this.updateField} />
              </div>
              <div className="register__form__field">
                <label
                  className="register__form__label"
                  htmlFor="password">
                  Password
                </label>
                <input
                  className="register__form__input"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={this.updateField} />
              </div>
              <small className="register__form__spacer">
                <span className="register__form__error">{error}</span>
              </small>
              <div className="register__form__field">
                <button
                  disabled={loading}
                  className="register__form__submit"
                  type="submit">
                  Register
                </button>
              </div>
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