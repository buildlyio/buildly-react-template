import { oauth } from 'midgard-core';
import _ from 'lodash';
import { environment } from '@environments/environment';

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
    clientId: environment.OAUTH_CLIENT_ID,
    tokenUrl: environment.OAUTH_TOKEN_URL,
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
  setPushSettings(
    currentUser[0].organization.organization_uuid,
    currentUser[0].push_preferences,
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
      const expiresMilliSec = token.expires_in * environment.session_timeout;
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
  }
};

/**
 * Set the alert group as well as notification preference that
 * user has opted for
 * @param alertGrp
 * @param pushPreference
 */
const setPushSettings = (alertGrp = null, pushPreference = null) => {
  if (alertGrp) {
    localStorage.setItem('alertGrp', alertGrp);
  }
  if (pushPreference) {
    localStorage.setItem(
      'pushPreference',
      JSON.stringify(pushPreference),
    );
  }
};

/**
 * Returns the current Push Settings.
 */
const getPushSettings = () => {
  const alertGrp = localStorage.getItem('alertGrp') || null;
  const pushPreference = localStorage.getItem('pushPreference')
    ? JSON.parse(localStorage.getItem('pushPreference'))
    : null;
  const geoPref = pushPreference
    ? (pushPreference.geofence || false)
    : false;
  const envPref = pushPreference
    ? (pushPreference.environmental || false)
    : false;
  return { alertGrp, geoPref, envPref };
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
  setPushSettings,
  getPushSettings,
};
