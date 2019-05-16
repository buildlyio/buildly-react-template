// Auth action types
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
/**
 * Login action
 * @param {{username, password}} credentials
 */
export const login = (credentials) => ({ type: LOGIN, credentials });

/**
 * Logout action
 */
export const logout = () => ({ type: LOGOUT });

/**
 * Register action
 * @param {{username, password, email, organization_name, first_name, last_name}} data
 */
export const register = (data) => ({ type: REGISTER, data });


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
