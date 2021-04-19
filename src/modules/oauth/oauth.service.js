import { oauth } from 'midgard-core';
import { environment } from '@environments/environment';

/**
 * Returns the current access token.
 */
function getAccessToken() {
  const tokenObj = JSON.parse(localStorage.getItem('token'));
  if (tokenObj) {
    return tokenObj.access_token;
  }
  return null;
}

/**
 * Returns the current JWT token.
 */
 function getJwtToken() {
  const tokenObj = JSON.parse(localStorage.getItem("token"));
  if (tokenObj) {
    return tokenObj.access_token_jwt;
  }
  return null;
}

/**
 * gets the oauthuser from localstorage
 * @returns {object} oauthUser
 */
 function getOauthUser() {
  const oauthUser = JSON.parse(localStorage.getItem("oauthUser"));
  if (oauthUser) {
    return oauthUser;
  }
  return null;
}

/**
 * authenticates user using oauth password flow
 * @param {{username: string; password: string}} credentials
 */
function authenticateWithPasswordFlow(credentials) {
  const oauthOptions = {
    clientId: environment.OAUTH_CLIENT_ID,
    tokenUrl: environment.OAUTH_TOKEN_URL,
    returnPromise: true,
  };
  return oauth.authenticateWithCredentials(credentials, oauthOptions);
}

/**
 * sets the oauthuser in localstorage
 * @param {string} oauthUser - oauth user data
 * @returns {string}
 */
function setOauthUser(oauthUser) {
  localStorage.setItem("oauthUser", JSON.stringify(oauthUser));
  if (oauthUser) {
    return oauthUser;
  }
  return null;
}

function setCurrentCoreUser(user, coreuser) {
  const currentUser = user.data.filter((data) => data.id === coreuser.data.id);
  localStorage.setItem("currentUser", JSON.stringify(currentUser[0]));
}

/**
 * sets access token in the local storage and adds expires_at key
 * that indicates the token expiration unix timestamp
 * @param token - the token response
 */
 function setAccessToken(token) {
  if (token) {
    localStorage.setItem("token", JSON.stringify(token));
    if (token.expires_in) {
      const expiresInMilliSeconds =
        token.expires_in * environment.session_timeout;
      const now = new Date();
      const expiresAt = now.getTime() + expiresInMilliSeconds;
      localStorage.setItem("expires_at", expiresAt.toString());
      localStorage.setItem("token_stored_at", now.toString());
    }
  }
}

/**
 * Checks, whether there is a valid access_token.
 */
function hasValidAccessToken() {
  if (getAccessToken()) {
    const expiresAt = localStorage.getItem("expires_at");
    const now = new Date();
    if (expiresAt && parseInt(expiresAt, 10) < now.getTime()) {
      return false;
    }
    return true;
  }
  return false;
}

/**
 * logs out the user by deleteing his access token from the storage
 */
function logout() {
  if (getAccessToken()) {
    localStorage.removeItem("token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("token_stored_at");
    localStorage.removeItem("oauthUser");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("geofenceAlerts");
    localStorage.removeItem("shipmentAlerts");
  }
}

export const oauthService = {
  authenticateWithPasswordFlow,
  getOauthUser,
  setOauthUser,
  hasValidAccessToken,
  getAccessToken,
  setAccessToken,
  getJwtToken,
  logout,
  setCurrentCoreUser,
};