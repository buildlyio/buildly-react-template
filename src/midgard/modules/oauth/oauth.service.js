import { oauth } from 'midgard-core';
export const environment = {
  API_URL: 'http://34.76.130.48/',
  OAUTH_CLIENT_ID: 'DPiAcT8IUOYkTNa_9ITAZCy3-y1m3p7eDJP16bQrUr01cIAe77UXyJvrTTgEyJ1uPNsHiIAUXYtWHM5dbT1prA',
  OAUTH_TOKEN_URL:  'http://34.76.130.48//oauth/token/',
  production: false
};

export const oauthService = {
  authenticateWithPasswordFlow,
  getOauthUser,
  setOauthUser,
  hasValidAccessToken,
  getAccessToken,
  setAccessToken,
  getJwtToken,
  logout
};

/**
 * authenticates user using oauth password flow
 * @param {{username: string; password: string}} credentials
 * @returns {Observable<any>}
 */
function authenticateWithPasswordFlow(credentials) {
  const oauthOptions = {
    clientId: environment.OAUTH_CLIENT_ID,
    tokenUrl: environment.OAUTH_TOKEN_URL
  };
  return oauth.authenticateWithCredentials(credentials, oauthOptions);
}

/**
 * gets the oauthuser from localstorage
 * @returns {} oauthUser
 */
function getOauthUser() {
  const oauthUser = JSON.parse(localStorage.getItem('oauthUser'));
  if (oauthUser) {
    return oauthUser;
  }
}

/**
 * sets the oauthuser in localstorage
 * @param {string} oauthUser - oauth user data
 * @returns {string}
 */
function setOauthUser(oauthUser) {
  localStorage.setItem('oauthUser', JSON.stringify(oauthUser));
  if (oauthUser) {
    return oauthUser;
  }
}

/**
 * Checks, whether there is a valid access_token.
 */
function hasValidAccessToken() {
  if (this.getAccessToken()) {
    const expiresAt = localStorage.getItem('expires_at');
    const now = new Date();
    if (expiresAt && parseInt(expiresAt, 10) < now.getTime()) {
      return false;
    }
    return true;
  }
  return false;
}

/**
 * sets access token in the local storage and adds expires_at key that indicates the token expiration unix timestamp
 * @param token - the token response
 */
function setAccessToken(token) {
  if (token) {
    localStorage.setItem('token', JSON.stringify(token));
    if (token.expires_in) {
      const expiresInMilliSeconds = token.expires_in * 1000;
      const now = new Date();
      const expiresAt = now.getTime() + expiresInMilliSeconds;
      localStorage.setItem('expires_at', expiresAt.toString());
      localStorage.setItem('token_stored_at', now.toString());
    }
  }
}

/**
 * logs out the user by deleteing his access token from the storage
 */
function logout() {
  if (this.getAccessToken()) {
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('token_stored_at');
  }
}

/**
 * Returns the current access_token.
 */
function getAccessToken() {
  const tokenObj = JSON.parse(localStorage.getItem('token'));
  if (tokenObj) {
    return tokenObj.access_token;
  }
}

/**
 * Returns the current JWT token.
 */
function getJwtToken() {
  const tokenObj = JSON.parse(localStorage.getItem('token'));
  if (tokenObj) {
    return tokenObj.access_token_jwt;
  }
}
