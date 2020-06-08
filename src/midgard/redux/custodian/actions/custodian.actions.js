//get custodains action constants
export const GET_CUSTODIANS = "CUSTODAIN/GET_CUSTODAINS";
export const GET_CUSTODIANS_SUCCESS = "CUSTODAIN/GET_CUSTODAINS_SUCCESS";
export const GET_CUSTODIANS_FAILURE = "CUSTODAIN/GET_CUSTODAINS_FAILURE";

//add custodain action constants
export const ADD_CUSTODIANS = "CUSTODAIN/ADD_CUSTODIANS";
export const ADD_CUSTODIANS_SUCCESS = "CUSTODAIN/ADD_CUSTODIANS_SUCCESS";
export const ADD_CUSTODIANS_FAILURE = "CUSTODAIN/ADD_CUSTODIANS_FAILURE";

//edit custodain action constants
export const EDIT_CUSTODIANS = "CUSTODAIN/EDIT_CUSTODIANS";
export const EDIT_CUSTODIANS_SUCCESS = "CUSTODAIN/EDIT_CUSTODIANS_SUCCESS";
export const EDIT_CUSTODIANS_FAILURE = "CUSTODAIN/EDIT_CUSTODIANS_FAILURE";

//delete custodain action constants
export const DELETE_CUSTODIANS = "CUSTODAIN/DELETE_CUSTODIANS";
export const DELETE_CUSTODIANS_SUCCESS = "CUSTODAIN/DELETE_CUSTODIANS_SUCCESS";
export const DELETE_CUSTODIANS_FAILURE = "CUSTODAIN/DELETE_CUSTODIANS_FAILURE";

//search custodian action constants
export const SEARCH = "CUSTODIAN/SEARCH";
export const SEARCH_SUCCESS = "CUSTODIAN/SEARCH_SUCCESS";

/**
 *
 * @param {{id}} payload
 */
export const getCustodians = (payload) => ({ type: GET_CUSTODIANS, payload });

/**
 *Add Custodain entity
 * @param {Object} payload
 */
export const addCustodians = (payload) => ({ type: ADD_CUSTODIANS, payload });

/**
 *Edit Custodain entity
 * @param {{id}} payload
 */
export const editCustodian = (payload) => ({ type: EDIT_CUSTODIANS, payload });

/**
 *Selete Custodain entity
 * @param {{id}} payload
 */
export const deleteCustodian = (payload) => ({
  type: GET_CUSTODIANS,
  payload,
});

/**
 *
 * @param {String} searchItem
 * @param {Array} searchList
 */
export const searchCustodian = (searchItem, searchList) => ({
  type: SEARCH,
  searchItem,
  searchList,
});

/**
 *
 * @param {Array} data
 *
 */
export const searchCustodianSuccess = (data) => ({
  type: SEARCH_SUCCESS,
  data,
});
