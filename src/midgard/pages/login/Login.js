import React from 'react'
import { oauthService } from 'midgard/modules/oauth/oauth.service';
import { httpService } from 'midgard/modules/http/http.service';
import logo from 'assets/midgard-logo.svg';
import { environment } from 'environment';
import { connect } from 'react-redux';

import './Login.scss'
import { login } from 'store/actions/authActions';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
      loading: false
    };
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
    const loginFormValue = {
      username: this.state.username,
      password: this.state.password
    };
    // this.props.dispatch(login(loginFormValue));
    oauthService.authenticateWithPasswordFlow(loginFormValue).subscribe(
      token => {
        this.setState({ loading: false })
        oauthService.setAccessToken(token.data);
        httpService.makeRequest(
          'get', environment.API_URL + `oauthuser/`,
        ).then(success => {
          oauthService.setOauthUser(success);
          localStorage.setItem('last_login', Date.now());
          const { from } = this.props.location.state || { from: { pathname: "/" } };
          this.props.history.push(from);
        });
      },
      error => this.setState({ error: 'Invalid credentials given', loading: false })
    );
  }

  render() {
    const { username, password, loading, error } = this.state;

    return (
      <div className="login">
        <div className="login__card">
          <div className="login__card__content">
            <img className="login__card__logo" src={logo} />
            <form className="login__form" onSubmit={this.submit}>
              <div className="login__form__field">
                <label
                  className="login__form__label"
                  htmlFor="username">
                  Username
                </label>
                <input
                  className="login__form__input"
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={this.updateField} />
              </div>
              <div className="login__form__field">
                <label
                  className="login__form__label"
                  htmlFor="password">
                  Password
                </label>
                <input
                  className="login__form__input"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={this.updateField} />
              </div>
              <small className="login__form__spacer">
                <span className="login__form__error">{error}</span>
              </small>
              <div className="login__form__field">
                <button
                  disabled={loading}
                  className="login__form__submit"
                  type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({...ownProps, ...state.authReducer});
export default connect(mapStateToProps)(Login);