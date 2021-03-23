// Google Sheet Actions
export const ADD_DATA = 'GOOGLE_SHEET/ADD_DATA';
export const ADD_DATA_SUCCESS = 'GOOGLE_SHEET/ADD_DATA_SUCCESS';
export const ADD_DATA_FAIL = 'GOOGLE_SHEET/ADD_DATA_FAIL';

export const CHECK_FILLED = 'GOOGLE_SHEET/CHECK_FILLED';
export const CHECK_FILLED_SUCCESS = 'GOOGLE_SHEET/CHECK_FILLED_SUCCESS';
export const CHECK_FILLED_FAIL = 'GOOGLE_SHEET/CHECK_FILLED_FAIL';

/**
 * Add data to google sheet
 * @param {Object} data
 */
export const addData = (data) => ({
  type: ADD_DATA,
  data,
});

/**
 * Get data from google sheet
 */
export const checkFilled = (name) => ({
  type: CHECK_FILLED,
  name,
});
