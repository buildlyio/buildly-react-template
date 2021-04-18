// Alert action types
export const SHOW_ALERT = 'ALERT/SHOW_ALERT';
export const HIDE_ALERT = 'ALERT/HIDE_ALERT';

/**
 * Alert action
 * @param {{type,open,message}} data
 */
export const showAlert = (data) => ({
  type: SHOW_ALERT,
  data,
});

/**
 * Logout action
 */
export const hideAlert = () => ({ type: HIDE_ALERT });
