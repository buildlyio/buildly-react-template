// Google Sheet Actions
export const ADD_DATA = 'GOOGLE_SHEET/ADD_DATA';
export const ADD_DATA_SUCCESS = 'GOOGLE_SHEET/ADD_DATA_SUCCESS';
export const ADD_DATA_FAIL = 'GOOGLE_SHEET/ADD_DATA_FAIL';

/**
 * Add data to google sheet
 * @param {Object} data
 */
export const addData = (data) => ({
  type: ADD_DATA,
  data,
});
