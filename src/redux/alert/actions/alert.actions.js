// Alert action types
export const SHOW_ALERT = 'ALERT/SHOW_ALERT';
export const HIDE_ALERT = 'ALERT/HIDE_ALERT';

/**
 * Show Alert action
 * @param {{ type, open, message }} data
 */
export const showAlert = (data) => ({
  type: SHOW_ALERT,
  data,
});

/**
 * Hide Alert action
 */
export const hideAlert = () => ({ type: HIDE_ALERT });
