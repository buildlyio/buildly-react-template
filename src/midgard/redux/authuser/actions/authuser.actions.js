// Auth action types
export const LOGIN = "AUTH/LOGIN";
export const LOGIN_SUCCESS = "AUTH/LOGIN_SUCCESS";
export const LOGIN_FAIL = "AUTH/LOGIN_FAIL";

export const LOGOUT = "AUTH/LOGOUT";
export const LOGOUT_SUCCESS = "AUTH/LOGOUT_SUCCESS";
export const LOGOUT_FAIL = "AUTH/LOGOUT_FAIL";

export const REGISTER = "AUTH/REGISTER";
export const REGISTER_SUCCESS = "AUTH/REGISTER_SUCCESS";
export const REGISTER_FAIL = "AUTH/REGISTER_FAIL";

export const UPDATE_USER = "AUTH/USER";
export const UPDATE_USER_SUCCESS = "AUTH/UPDATE_USER_SUCCESS";
export const UPDATE_USER_FAIL = "AUTH/UPDATE_USER_FAIL";

export const GET_USER = "AUTH/GET_USER";
export const GET_USER_SUCCESS = "AUTH/GET_USER_SUCCESS";
export const GET_USER_FAIL = "AUTH/GET_USER_FAIL";

export const INVITE = "AUTH/INVITE";
export const INVITE_SUCCESS = "AUTH/INVITE_SUCCESS";
export const INVITE_FAIL = "AUTH/INVITE_FAIL";

export const GET_ORGANIZATION = "AUTH/GET_ORGANIZATION";
export const GET_ORGANIZATION_SUCCESS = "AUTH/GET_ORGANIZATION_SUCCESS";
export const GET_ORGANIZATION_FAILURE = "AUTH/GET_ORGANIZATION_FAILURE";

export const UPDATE_ORGANIZATION = "AUTH/UPDATE_ORGANIZATION";
export const UPDATE_ORGANIZATION_SUCCESS = "AUTH/UPDATE_ORGANIZATION_SUCCESS";
export const UPDATE_ORGANIZATION_FAILURE = "AUTH/UPDATE_ORGANIZATION_FAILURE";

export const GET_USER_OPTIONS = "AUTH/GET_USER_OPTIONS";
export const GET_USER_OPTIONS_SUCCESS = "AUTH/GET_USER_OPTIONS_SUCCESS";
export const GET_USER_OPTIONS_FAILURE = "AUTH/GET_USER_OPTIONS_FAILURE";

export const RESET_PASSWORD = "AUTH/RESET_PASSWORD";
export const RESET_PASSWORD_SUCCESS = "AUTH/RESET_PASSWORD_SUCCESS";
export const RESET_PASSWORD_FAILURE = "AUTH/RESET_PASSWORD_FAILURE";

export const RESET_PASSWORD_CONFIRM = "AUTH/RESET_PASSWORD_CONFIRM";
export const RESET_PASSWORD_CONFIRM_SUCCESS =
  "AUTH/RESET_PASSWORD_CONFIRM_SUCCESS";
export const RESET_PASSWORD_CONFIRM_FAILURE =
  "AUTH/RESET_PASSWORD_CONFIRM_FAILURE";

export const GET_ORGANIZATION_OPTIONS_SUCCESS =
  "AUTH/GET_ORGANIZATION_OPTIONS_SUCCESS";
export const GET_ORGANIZATION_OPTIONS_FAILURE =
  "AUTH/GET_ORGANIZATION_OPTIONS_FAILURE";

export const RESET_PASSWORD_CHECK = "AUTH/RESET_PASSWORD_CHECK";
export const RESET_PASSWORD_CHECK_SUCCESS = "AUTH/RESET_PASSWORD_CHECK_SUCCESS";
export const RESET_PASSWORD_CHECK_FAILURE = "AUTH/RESET_PASSWORD_CHECK_FAILURE";

/**
 * Login action
 * @param {{username, password}} credentials
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
 * @param {{username, password, email, organization_name, first_name, last_name}} data
 */
export const register = (data, history) => ({ type: REGISTER, data, history });

/**
 * Update user action
 * @param {{ first_name, last_name}} data
 */
export const updateUser = (data) => ({ type: UPDATE_USER, data });

/**
 * Update user action
 * @param {{ first_name, last_name}} data
 */
export const getUser = () => ({ type: GET_USER });

/**
 * invite user action
 * @param {{ first_name, last_name}} data
 */
export const invite = (data) => ({ type: INVITE, data });

export const getOrganization = (uuid) => ({
  type: GET_ORGANIZATION,
  uuid,
});

export const updateOrganization = (uuid) => ({
  type: UPDATE_ORGANIZATION,
  uuid,
});

export const getUserOptions = () => ({
  type: GET_USER_OPTIONS,
});

export const resetPassword = (data) => ({
  type: RESET_PASSWORD,
  data,
});

export const confirmResetPassword = (data, history) => ({
  type: RESET_PASSWORD_CONFIRM,
  data,
  history,
});

export const resetPasswordCheck = (data, history) => ({
  type: RESET_PASSWORD_CHECK,
  data,
  history,
});
