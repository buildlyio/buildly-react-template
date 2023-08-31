// Custodians actions
export const GET_CUSTODIANS = 'CUSTODIAN/GET_CUSTODIANS';
export const GET_CUSTODIANS_SUCCESS = 'CUSTODIAN/GET_CUSTODIANS_SUCCESS';
export const GET_CUSTODIANS_FAILURE = 'CUSTODIAN/GET_CUSTODIANS_FAILURE';

export const ADD_CUSTODIANS = 'CUSTODIAN/ADD_CUSTODIANS';
export const ADD_CUSTODIANS_SUCCESS = 'CUSTODIAN/ADD_CUSTODIANS_SUCCESS';
export const ADD_CUSTODIANS_FAILURE = 'CUSTODIAN/ADD_CUSTODIANS_FAILURE';

export const EDIT_CUSTODIANS = 'CUSTODIAN/EDIT_CUSTODIANS';
export const EDIT_CUSTODIANS_SUCCESS = 'CUSTODIAN/EDIT_CUSTODIANS_SUCCESS';
export const EDIT_CUSTODIANS_FAILURE = 'CUSTODIAN/EDIT_CUSTODIANS_FAILURE';

export const DELETE_CUSTODIANS = 'CUSTODIAN/DELETE_CUSTODIANS';
export const DELETE_CUSTODIANS_SUCCESS = 'CUSTODIAN/DELETE_CUSTODIANS_SUCCESS';
export const DELETE_CUSTODIANS_FAILURE = 'CUSTODIAN/DELETE_CUSTODIANS_FAILURE';

export const GET_CUSTODY = 'CUSTODIAN/GET_CUSTODY';
export const GET_CUSTODY_SUCCESS = 'CUSTODIAN/GET_CUSTODY_SUCCESS';
export const GET_CUSTODY_FAILURE = 'CUSTODIAN/GET_CUSTODY_FAILURE';

export const ADD_CUSTODY = 'CUSTODIAN/ADD_CUSTODY';
export const ADD_CUSTODY_SUCCESS = 'CUSTODIAN/ADD_CUSTODY_SUCCESS';
export const ADD_CUSTODY_FAILURE = 'CUSTODIAN/ADD_CUSTODY_FAILURE';

export const EDIT_CUSTODY = 'CUSTODIAN/EDIT_CUSTODY';
export const EDIT_CUSTODY_SUCCESS = 'CUSTODIAN/EDIT_CUSTODY_SUCCESS';
export const EDIT_CUSTODY_FAILURE = 'CUSTODIAN/EDIT_CUSTODY_FAILURE';

export const DELETE_CUSTODY = 'CUSTODIAN/DELETE_CUSTODY';
export const DELETE_CUSTODY_SUCCESS = 'CUSTODIAN/DELETE_CUSTODY_SUCCESS';
export const DELETE_CUSTODY_FAILURE = 'CUSTODIAN/DELETE_CUSTODY_FAILURE';

export const GET_CUSTODIAN_TYPE = 'CUSTODIAN/GET_CUSTODIAN_TYPE';
export const GET_CUSTODIAN_TYPE_SUCCESS = 'CUSTODIAN/GET_CUSTODIAN_TYPE_SUCCESS';
export const GET_CUSTODIAN_TYPE_FAILURE = 'CUSTODIAN/GET_CUSTODIAN_TYPE_FAILURE';

export const ADD_CUSTODIAN_TYPE = 'CUSTODIAN/ADD_CUSTODIAN_TYPE';
export const ADD_CUSTODIAN_TYPE_SUCCESS = 'CUSTODIAN/ADD_CUSTODIAN_TYPE_SUCCESS';
export const ADD_CUSTODIAN_TYPE_FAILURE = 'CUSTODIAN/ADD_CUSTODIAN_TYPE_FAILURE';

export const EDIT_CUSTODIAN_TYPE = 'CUSTODIAN/EDIT_CUSTODIAN_TYPE';
export const EDIT_CUSTODIAN_TYPE_SUCCESS = 'CUSTODIAN/EDIT_CUSTODIAN_TYPE_SUCCESS';
export const EDIT_CUSTODIAN_TYPE_FAILURE = 'CUSTODIAN/EDIT_CUSTODIAN_TYPE_FAILURE';

export const DELETE_CUSTODIAN_TYPE = 'CUSTODIAN/DELETE_CUSTODIAN_TYPE';
export const DELETE_CUSTODIAN_TYPE_SUCCESS = 'CUSTODIAN/DELETE_CUSTODIAN_TYPE_SUCCESS';
export const DELETE_CUSTODIAN_TYPE_FAILURE = 'CUSTODIAN/DELETE_CUSTODIAN_TYPE_FAILURE';

export const GET_CONTACT = 'CUSTODIAN/GET_CONTACT';
export const GET_CONTACT_SUCCESS = 'CUSTODIAN/GET_CONTACT_SUCCESS';
export const GET_CONTACT_FAILURE = 'CUSTODIAN/GET_CONTACT_FAILURE';

/**
 * Get Custodian List
 * @param {String} organization_uuid
 */
export const getCustodians = (organization_uuid) => ({ type: GET_CUSTODIANS, organization_uuid });

/**
 * Add Custodian
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo
 */
export const addCustodians = (custodian, contact, history, redirectTo) => ({
  type: ADD_CUSTODIANS,
  custodian,
  contact,
  history,
  redirectTo,
});

/**
 * Edit Custodian
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo
 */
export const editCustodian = (custodian, contact, history, redirectTo) => ({
  type: EDIT_CUSTODIANS,
  custodian,
  contact,
  history,
  redirectTo,
});

/**
 * Delete Custodain
 * @param {Number} custodianId
 * @param {Number} contactObjId
 * @param {String} organization_uuid
 */
export const deleteCustodian = (custodianId, contactId) => ({
  type: DELETE_CUSTODIANS,
  custodianId,
  contactId,
});

/**
 * Get Custody
 */
export const getCustody = (shipmentIds) => ({
  type: GET_CUSTODY,
  shipmentIds,
});

/**
 * Add Custody
 * @param {Object} payload
 */
export const addCustody = (payload) => ({
  type: ADD_CUSTODY,
  payload,
});

/**
 * Edit Custody
 * @param {Object} payload
 */
export const editCustody = (payload) => ({
  type: EDIT_CUSTODY,
  payload,
});

/**
 * Delete Custody
 * @param {Number} custodyId
 * @param {String} shipmentId
 * @param {String} organization_uuid
 */
export const deleteCustody = (custodyId) => ({ type: DELETE_CUSTODY, custodyId });

/**
 * Get Custodian Type
 */
export const getCustodianType = () => ({
  type: GET_CUSTODIAN_TYPE,
});

/**
 * Add Custodian Type
 * @param {Object} payload
 */
export const addCustodianType = (payload) => ({
  type: ADD_CUSTODIAN_TYPE,
  payload,
});

/**
 * Edit Custody Type
 * @param {Object} payload
 */
export const editCustodianType = (payload) => ({
  type: EDIT_CUSTODIAN_TYPE,
  payload,
});

/**
 * Delete Custody Type
 * @param {Number} id
 */
export const deleteCustodianType = (id) => ({
  type: DELETE_CUSTODIAN_TYPE,
  id,
});

/**
 * Get Contact
 * @param {String} organization_uuid
 */
export const getContact = (organization_uuid) => ({
  type: GET_CONTACT,
  organization_uuid,
});
