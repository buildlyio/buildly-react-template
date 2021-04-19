//get custodians action constants
export const GET_CUSTODIANS = "CUSTODIAN/GET_CUSTODIANS";
export const GET_CUSTODIANS_SUCCESS = "CUSTODIAN/GET_CUSTODIANS_SUCCESS";
export const GET_CUSTODIANS_FAILURE = "CUSTODIAN/GET_CUSTODIANS_FAILURE";

//add custodian action constants
export const ADD_CUSTODIANS = "CUSTODIAN/ADD_CUSTODIANS";
export const ADD_CUSTODIANS_SUCCESS = "CUSTODIAN/ADD_CUSTODIANS_SUCCESS";
export const ADD_CUSTODIANS_FAILURE = "CUSTODIAN/ADD_CUSTODIANS_FAILURE";

//edit custodian action constants
export const EDIT_CUSTODIANS = "CUSTODIAN/EDIT_CUSTODIANS";
export const EDIT_CUSTODIANS_SUCCESS = "CUSTODIAN/EDIT_CUSTODIANS_SUCCESS";
export const EDIT_CUSTODIANS_FAILURE = "CUSTODIAN/EDIT_CUSTODIANS_FAILURE";

//delete custodian action constants
export const DELETE_CUSTODIANS = "CUSTODIAN/DELETE_CUSTODIANS";
export const DELETE_CUSTODIANS_SUCCESS = "CUSTODIAN/DELETE_CUSTODIANS_SUCCESS";
export const DELETE_CUSTODIANS_FAILURE = "CUSTODIAN/DELETE_CUSTODIANS_FAILURE";

//search custodian action constants
export const SEARCH = "CUSTODIAN/SEARCH";
export const SEARCH_SUCCESS = "CUSTODIAN/SEARCH_SUCCESS";

//get custodian tyoe action constants
export const GET_CUSTODIAN_TYPE = "CUSTODIAN/GET_CUSTODIAN_TYPE";
export const GET_CUSTODIAN_TYPE_SUCCESS =
  "CUSTODIAN/GET_CUSTODIAN_TYPE_SUCCESS";
export const GET_CUSTODIAN_TYPE_FAILURE =
  "CUSTODIAN/GET_CUSTODIAN_TYPE_FAILURE";

//get contact action constants
export const GET_CONTACT = "CUSTODIAN/GET_CONTACT";
export const GET_CONTACT_SUCCESS = "CUSTODIAN/GET_CONTACT_SUCCESS";
export const GET_CONTACT_FAILURE = "CUSTODIAN/GET_CONTACT_FAILURE";

export const GET_CUSTODY = "CUSTODIAN/GET_CUSTODY";
export const GET_CUSTODY_SUCCESS = "CUSTODIAN/GET_CUSTODY_SUCCESS";
export const GET_CUSTODY_FAILURE = "CUSTODIAN/GET_CUSTODY_FAILURE";

export const ADD_CUSTODY = "CUSTODIAN/ADD_CUSTODY";
export const ADD_CUSTODY_SUCCESS = "CUSTODIAN/ADD_CUSTODY_SUCCESS";
export const ADD_CUSTODY_FAILURE = "CUSTODIAN/ADD_CUSTODY_FAILURE";

export const EDIT_CUSTODY = "CUSTODIAN/EDIT_CUSTODY";
export const EDIT_CUSTODY_SUCCESS = "CUSTODIAN/EDIT_CUSTODY_SUCCESS";
export const EDIT_CUSTODY_FAILURE = "CUSTODIAN/EDIT_CUSTODY_FAILURE";

export const UPDATE_CUSTODY = "CUSTODIAN/UPDATE_CUSTODY";
export const UPDATE_CUSTODY_SUCCESS = "CUSTODIAN/UPDATE_CUSTODY_SUCCESS";
export const UPDATE_CUSTODY_FAILURE = "CUSTODIAN/UPDATE_CUSTODY_FAILURE";

export const GET_CUSTODIAN_OPTIONS = "CUSTODIAN/GET_CUSTODIAN_OPTIONS";
export const GET_CUSTODIAN_OPTIONS_SUCCESS =
  "CUSTODIAN/GET_CUSTODIAN_OPTIONS_SUCCESS";
export const GET_CUSTODIAN_OPTIONS_FAILURE =
  "CUSTODIAN/GET_CUSTODIAN_OPTIONS_FAILURE";

export const GET_CONTACT_OPTIONS = "CUSTODIAN/GET_CONTACT_OPTIONS";
export const GET_CONTACT_OPTIONS_SUCCESS =
  "CUSTODIAN/GET_CONTACT_OPTIONS_SUCCESS";
export const GET_CONTACT_OPTIONS_FAILURE =
  "CUSTODIAN/GET_CONTACT_OPTIONS_FAILURE";

export const GET_CUSTODY_OPTIONS = "CUSTODIAN/GET_CUSTODY_OPTIONS";
export const GET_CUSTODY_OPTIONS_SUCCESS =
  "CUSTODIAN/GET_CUSTODY_OPTIONS_SUCCESS";
export const GET_CUSTODY_OPTIONS_FAILURE =
  "CUSTODIAN/GET_CUSTODY_OPTIONS_FAILURE";

//add custodian type action constants
export const ADD_CUSTODIAN_TYPE = "CUSTODIAN/ADD_CUSTODIAN_TYPE";
export const ADD_CUSTODIAN_TYPE_SUCCESS =
  "CUSTODIAN/ADD_CUSTODIAN_TYPE_SUCCESS";
export const ADD_CUSTODIAN_TYPE_FAILURE =
  "CUSTODIAN/ADD_CUSTODIAN_TYPE_FAILURE";

//edit custodian type action constants
export const EDIT_CUSTODIAN_TYPE = "CUSTODIAN/EDIT_CUSTODIAN_TYPE";
export const EDIT_CUSTODIAN_TYPE_SUCCESS =
  "CUSTODIAN/EDIT_CUSTODIAN_TYPE_SUCCESS";
export const EDIT_CUSTODIAN_TYPE_FAILURE =
  "CUSTODIAN/EDIT_CUSTODIAN_TYPE_FAILURE";

//delete custodian type action constants
export const DELETE_CUSTODIAN_TYPE = "CUSTODIAN/DELETE_CUSTODIAN_TYPE";
export const DELETE_CUSTODIAN_TYPE_SUCCESS =
  "CUSTODIAN/DELETE_CUSTODIAN_TYPE_SUCCESS";
export const DELETE_CUSTODIAN_TYPE_FAILURE =
  "CUSTODIAN/DELETE_CUSTODIAN_TYPE_FAILURE";

export const getCustodians = (organization_uuid) => ({ type: GET_CUSTODIANS, organization_uuid, });

/**
 *Add custodian
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo path to redirect
 */
export const addCustodians = (payload, history, redirectTo) => ({
  type: ADD_CUSTODIANS,
  payload,
  history,
  redirectTo,
});
/**
 *
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo path to redirect
 */
export const editCustodian = (payload, history, redirectTo) => ({
  type: EDIT_CUSTODIANS,
  payload,
  history,
  redirectTo,
});

/**
 *Delete Custodain entity
 * @param {{id}} payload
 */
export const deleteCustodian = (custodianId, contactObjId, organization_uuid) => ({
  type: DELETE_CUSTODIANS,
  custodianId,
  contactObjId,
  organization_uuid,
});

/**
 *
 * @param {String} searchItem
 * @param {Array} searchList
 */
export const searchCustodian = (searchItem, searchList, searchFields) => ({
  type: SEARCH,
  searchItem,
  searchList,
  searchFields,
});

export const getCustodianType = () => ({
  type: GET_CUSTODIAN_TYPE,
});

export const getContact = (organization_uuid) => ({
  type: GET_CONTACT,
  organization_uuid,
});

export const getCustody = () => ({
  type: GET_CUSTODY,
});

export const addCustody = (payload) => ({
  type: ADD_CUSTODY,
  payload,
});

export const editCustody = (payload) => ({
  type: EDIT_CUSTODY,
  payload,
});

export const updateCustody = (payload) => ({
  type: UPDATE_CUSTODY,
  payload,
});

export const addCustodianType = (payload) => ({
  type: ADD_CUSTODIAN_TYPE,
  payload,
});

export const editCustodianType = (payload) => ({
  type: EDIT_CUSTODIAN_TYPE,
  payload,
});

export const deleteCustodianType = (id) => ({
  type: DELETE_CUSTODIAN_TYPE,
  id,
});