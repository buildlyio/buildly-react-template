import {
  LOGIN,
  LOGOUT,
  REGISTER
} from './actionTypes';

/**
 * Login action
 * @param {{username: string; password: string}} credentials
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
