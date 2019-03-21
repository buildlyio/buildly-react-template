import {
  LOGIN,
  LOGOUT
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
