// Auth actions
export const LOGIN = 'AUTH/LOGIN';
export const LOGIN_SUCCESS = 'AUTH/LOGIN_SUCCESS';
export const LOGIN_FAIL = 'AUTH/LOGIN_FAIL';

export const LOGOUT = 'AUTH/LOGOUT';
export const LOGOUT_SUCCESS = 'AUTH/LOGOUT_SUCCESS';
export const LOGOUT_FAIL = 'AUTH/LOGOUT_FAIL';

export const REGISTER = 'AUTH/REGISTER';
export const REGISTER_SUCCESS = 'AUTH/REGISTER_SUCCESS';
export const REGISTER_FAIL = 'AUTH/REGISTER_FAIL';

export const UPDATE_USER = 'AUTH/USER';
export const UPDATE_USER_SUCCESS = 'AUTH/UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAIL = 'AUTH/UPDATE_USER_FAIL';

export const GET_USER = 'AUTH/GET_USER';
export const GET_USER_SUCCESS = 'AUTH/GET_USER_SUCCESS';
export const GET_USER_FAIL = 'AUTH/GET_USER_FAIL';

export const INVITE = 'AUTH/INVITE';
export const INVITE_SUCCESS = 'AUTH/INVITE_SUCCESS';
export const INVITE_FAIL = 'AUTH/INVITE_FAIL';

export const GET_ORGANIZATION = 'AUTH/GET_ORGANIZATION';
export const GET_ORGANIZATION_SUCCESS = 'AUTH/GET_ORGANIZATION_SUCCESS';
export const GET_ORGANIZATION_FAILURE = 'AUTH/GET_ORGANIZATION_FAILURE';

export const UPDATE_ORGANIZATION = 'AUTH/UPDATE_ORGANIZATION';
export const UPDATE_ORGANIZATION_SUCCESS = 'AUTH/UPDATE_ORGANIZATION_SUCCESS';
export const UPDATE_ORGANIZATION_FAILURE = 'AUTH/UPDATE_ORGANIZATION_FAILURE';

export const RESET_PASSWORD = 'AUTH/RESET_PASSWORD';
export const RESET_PASSWORD_SUCCESS = 'AUTH/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILURE = 'AUTH/RESET_PASSWORD_FAILURE';

export const RESET_PASSWORD_CONFIRM = 'AUTH/RESET_PASSWORD_CONFIRM';
export const RESET_PASSWORD_CONFIRM_SUCCESS = 'AUTH/RESET_PASSWORD_CONFIRM_SUCCESS';
export const RESET_PASSWORD_CONFIRM_FAILURE = 'AUTH/RESET_PASSWORD_CONFIRM_FAILURE';

export const RESET_PASSWORD_CHECK = 'AUTH/RESET_PASSWORD_CHECK';
export const RESET_PASSWORD_CHECK_SUCCESS = 'AUTH/RESET_PASSWORD_CHECK_SUCCESS';
export const RESET_PASSWORD_CHECK_FAILURE = 'AUTH/RESET_PASSWORD_CHECK_FAILURE';

export const LOAD_ALL_ORGS = 'AUTH/LOAD_ALL_ORGS';
export const LOAD_ALL_ORGS_SUCCESS = 'AUTH/LOAD_ALL_ORGS_SUCCESS';
export const LOAD_ALL_ORGS_FAILURE = 'AUTH/LOAD_ALL_ORGS_FAILURE';

export const LOAD_ORG_NAMES = 'AUTH/LOAD_ORG_NAMES';
export const LOAD_ORG_NAMES_SUCCESS = 'AUTH/LOAD_ORG_NAMES_SUCCESS';
export const LOAD_ORG_NAMES_FAILURE = 'AUTH/LOAD_ORG_NAMES_FAILURE';

export const GET_ORG_TYPES = 'AUTH/GET_ORG_TYPES';
export const GET_ORG_TYPES_SUCCESS = 'AUTH/GET_ORG_TYPES_SUCCESS';
export const GET_ORG_TYPES_FAILURE = 'AUTH/GET_ORG_TYPES_FAILURE';

export const ADD_ORG_TYPE = 'AUTH/ADD_ORG_TYPE';
export const ADD_ORG_TYPE_SUCCESS = 'AUTH/ADD_ORG_TYPE_SUCCESS';
export const ADD_ORG_TYPE_FAILURE = 'AUTH/ADD_ORG_TYPE_FAILURE';

export const EDIT_ORG_TYPE = 'AUTH/EDIT_ORG_TYPE';
export const EDIT_ORG_TYPE_SUCCESS = 'AUTH/EDIT_ORG_TYPE_SUCCESS';
export const EDIT_ORG_TYPE_FAILURE = 'AUTH/EDIT_ORG_TYPE_FAILURE';

export const DELETE_ORG_TYPE = 'AUTH/DELETE_ORG_TYPE';
export const DELETE_ORG_TYPE_SUCCESS = 'AUTH/DELETE_ORG_TYPE_SUCCESS';
export const DELETE_ORG_TYPE_FAILURE = 'AUTH/DELETE_ORG_TYPE_FAILURE';

/**
 * Login action
 * @param {{ username, password }} credentials
 * @param {Object} history
 */
export const login = (credentials, history) => ({
  type: LOGIN,
  credentials,
  history,
});

/**
 * Logout action
 */
export const logout = () => ({ type: LOGOUT });

/**
 * Register action
 * @param {{ username, password, email, organization_name, first_name, last_name }} data
 * @param {Object} history
 */
export const register = (data, history) => ({
  type: REGISTER,
  data,
  history,
});

/**
 * Update user action
 * @param {{ first_name, last_name }} data
 */
export const updateUser = (data) => ({ type: UPDATE_USER, data });

/**
 * Get user action
 */
export const getUser = () => ({ type: GET_USER });

/**
 * Invite user action
 * @param {Array} data
 */
export const invite = (data) => ({ type: INVITE, data });

/**
 * Get Organization action
 * @param {String} uuid
 */
export const getOrganization = (uuid) => ({
  type: GET_ORGANIZATION,
  uuid,
});

/**
 * Update Organization action
 * @param {Object} data
 */
export const updateOrganization = (data) => ({
  type: UPDATE_ORGANIZATION,
  data,
});

/**
 * Send password reset link action
 * @param {{ email }} data
 */
export const resetPassword = (data) => ({
  type: RESET_PASSWORD,
  data,
});

/**
 * Reset password action
 * @param {{ new_password1, new_password2, uid, token }} data
 * @param {Object} history
 */
export const confirmResetPassword = (data, history) => ({
  type: RESET_PASSWORD_CONFIRM,
  data,
  history,
});

/**
 * Validate reset password token action
 * @param {{ uid, token }} data
 * @param {Object} history
 */
export const resetPasswordCheck = (data, history) => ({
  type: RESET_PASSWORD_CHECK,
  data,
  history,
});

/**
 * Load all Organizations
 */
export const loadAllOrgs = () => ({
  type: LOAD_ALL_ORGS,
});

/**
 * Load all Organizations Names
 */
export const loadOrgNames = () => ({
  type: LOAD_ORG_NAMES,
});

/**
 * Load all Organization Types
 */
export const getOrgTypes = () => ({
  type: GET_ORG_TYPES,
});

/**
 * Add Organization Type
 * @param data
 */
export const addOrgType = (data) => ({
  type: ADD_ORG_TYPE,
  data,
});

/**
 * Edit Organization Type
 * @param data
 */
export const editOrgType = (data) => ({
  type: EDIT_ORG_TYPE,
  data,
});

/**
 * Delete Organization Type
 * @param id
 */
export const deleteOrgType = (id) => ({
  type: DELETE_ORG_TYPE,
  id,
});
