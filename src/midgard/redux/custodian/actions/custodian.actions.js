//get custodains action constants
export const GET_CUSTODIANS = "CUSTODAIN/GET_CUSTODIANS";
export const GET_CUSTODIANS_SUCCESS = "CUSTODAIN/GET_CUSTODIANS_SUCCESS";
export const GET_CUSTODIANS_FAILURE = "CUSTODAIN/GET_CUSTODIANS_FAILURE";

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

//get custodian tyoe action constants
export const GET_CUSTODIAN_TYPE = "CUSTODAIN/GET_CUSTODIAN_TYPE";
export const GET_CUSTODIAN_TYPE_SUCCESS =
  "CUSTODAIN/GET_CUSTODIAN_TYPE_SUCCESS";
export const GET_CUSTODIAN_TYPE_FAILURE =
  "CUSTODAIN/GET_CUSTODIAN_TYPE_FAILURE";

//get contact action constants
export const GET_CONTACT = "CUSTODAIN/GET_CONTACT";
export const GET_CONTACT_SUCCESS = "CUSTODAIN/GET_CONTACT_SUCCESS";
export const GET_CONTACT_FAILURE = "CUSTODAIN/GET_CONTACT_FAILURE";

export const getCustodians = () => ({ type: GET_CUSTODIANS });

/**
 *Add custodian
 * @param {Object} payload
 * @param {Object} history
 */
export const addCustodians = (payload, history) => ({
  type: ADD_CUSTODIANS,
  payload,
  history,
});
/**
 *
 * @param {Object} payload
 * @param {Object} history
 */
export const editCustodian = (payload, history) => ({
  type: EDIT_CUSTODIANS,
  payload,
  history,
});

/**
 *Selete Custodain entity
 * @param {{id}} payload
 */
export const deleteCustodian = (custodianId, contactObjId) => ({
  type: DELETE_CUSTODIANS,
  custodianId,
  contactObjId,
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

export const getCustodianType = () => ({
  type: GET_CUSTODIAN_TYPE,
});

export const getContact = () => ({
  type: GET_CONTACT,
});
