export const LOGOUT_SUCCESS = 'AUTH/LOGOUT_SUCCESS';

export const UPDATE_USER = 'AUTH/USER';
export const UPDATE_USER_SUCCESS = 'AUTH/UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAIL = 'AUTH/UPDATE_USER_FAIL';

export const INVITE = 'AUTH/INVITE';
export const INVITE_SUCCESS = 'AUTH/INVITE_SUCCESS';
export const INVITE_FAIL = 'AUTH/INVITE_FAIL';

export const GET_ORGANIZATION_SUCCESS = 'AUTH/GET_ORGANIZATION_SUCCESS';

/**
 * Update user action
 * @param {{ first_name, last_name }} data
 */
export const updateUser = (data, history) => ({
  type: UPDATE_USER,
  data,
  history,
});

/**
 * Invite user action
 * @param {Array} data
 */
export const invite = (data) => ({ type: INVITE, data });
