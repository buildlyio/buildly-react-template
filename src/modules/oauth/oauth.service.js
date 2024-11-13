import { oauth } from 'midgard-core';
import _ from 'lodash';

/**
 * Returns the current access token.
 */
const getAccessToken = () => {
  let accessToken = null;
  const tokenObj = JSON.parse(localStorage.getItem('token'));
  if (tokenObj) {
    accessToken = tokenObj.access_token;
  }
  return accessToken;
};

/**
 * Returns the current JWT token.
 */
const getJwtToken = () => {
  let jwtToken = null;
  const tokenObj = JSON.parse(localStorage.getItem('token'));
  if (tokenObj) {
    jwtToken = tokenObj.access_token_jwt;
  }
  return jwtToken;
};

/**
 * gets the oauthuser from localstorage
 * @returns {object} oauthUser
 */
const getOauthUser = () => {
  const oauthUser = (
    JSON.parse(localStorage.getItem('oauthUser'))
    || null
  );
  return oauthUser;
};

/**
 * authenticates user using oauth password flow
 * @param {{username: string; password: string}} credentials
 */
const authenticateWithPasswordFlow = (credentials) => {
  const oauthOptions = {
    clientId: window.env.OAUTH_CLIENT_ID,
    tokenUrl: window.env.OAUTH_TOKEN_URL,
    returnPromise: true,
  };
  return oauth.authenticateWithCredentials(
    credentials,
    oauthOptions,
  );
};

/**
 * sets the oauthuser in localstorage
 * @param {string} oauthUser - oauth user data
 * @returns {string}
 */
const setOauthUser = (oauthUser) => {
  localStorage.setItem(
    'oauthUser',
    JSON.stringify(oauthUser),
  );
  return (oauthUser || null);
};

const setCurrentCoreUser = (user, coreuser) => {
  const currentUser = _.filter(
    user.data,
    (data) => data.id === coreuser.data.id,
  );
  localStorage.setItem(
    'currentUser',
    JSON.stringify(currentUser[0]),
  );
};

/**
 * sets access token in the local storage and adds expires_at key
 * that indicates the token expiration unix timestamp
 * @param token - the token response
 */
const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem('token', JSON.stringify(token));
    if (token.expires_in) {
      const expiresMilliSec = token.expires_in * window.env.session_timeout;
      const now = new Date();
      const expiresAt = now.getTime() + expiresMilliSec;
      localStorage.setItem(
        'expires_at',
        _.toString(expiresAt),
      );
      localStorage.setItem(
        'token_stored_at',
        _.toString(now),
      );
    }
  }
};

/**
 * Checks, whether there is a valid access_token.
 */
const hasValidAccessToken = () => {
  if (getAccessToken()) {
    const expiresAt = localStorage.getItem('expires_at');
    const now = new Date();
    if (
      expiresAt
      && parseInt(expiresAt, 10) < now.getTime()
    ) {
      return false;
    }
    return true;
  }
  return false;
};

/**
 * logs out the user by deleteing his access token from the storage
 */
const logout = () => {
  if (getAccessToken()) {
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('token_stored_at');
    localStorage.removeItem('oauthUser');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('alertGrp');
    localStorage.removeItem('pushPreference');
    localStorage.removeItem('halfwayOrder');
  }
};

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
