// Consortium actions
export const GET_ALL_CONSORTIUMS = 'CONSORTIUM/GET_ALL_CONSORTIUMS';
export const GET_ALL_CONSORTIUMS_SUCCESS = 'CONSORTIUM/GET_ALL_CONSORTIUMS_SUCCESS';
export const GET_ALL_CONSORTIUMS_FAILURE = 'CONSORTIUM/GET_ALL_CONSORTIUMS_FAILURE';

export const GET_ORG_CONSORTIUMS = 'CONSORTIUM/GET_ORG_CONSORTIUMS';
export const GET_ORG_CONSORTIUMS_SUCCESS = 'CONSORTIUM/GET_ORG_CONSORTIUMS_SUCCESS';
export const GET_ORG_CONSORTIUMS_FAILURE = 'CONSORTIUM/GET_ORG_CONSORTIUMS_FAILURE';

export const CREATE_CONSORTIUM = 'CONSORTIUM/CREATE_CONSORTIUM';
export const CREATE_CONSORTIUM_SUCCESS = 'CONSORTIUM/CREATE_CONSORTIUM_SUCCESS';
export const CREATE_CONSORTIUM_FAILURE = 'CONSORTIUM/CREATE_CONSORTIUM_FAILURE';

export const EDIT_CONSORTIUM = 'CONSORTIUM/EDIT_CONSORTIUM';
export const EDIT_CONSORTIUM_SUCCESS = 'CONSORTIUM/EDIT_CONSORTIUM_SUCCESS';
export const EDIT_CONSORTIUM_FAILURE = 'CONSORTIUM/EDIT_CONSORTIUM_FAILURE';

export const DELETE_CONSORTIUM = 'CONSORTIUM/DELETE_CONSORTIUM';
export const DELETE_CONSORTIUM_SUCCESS = 'CONSORTIUM/DELETE_CONSORTIUM_SUCCESS';
export const DELETE_CONSORTIUM_FAILURE = 'CONSORTIUM/DELETE_CONSORTIUM_FAILURE';

/**
 * Get All Consortiums action
 */
export const getAllConsortiums = () => ({
  type: GET_ALL_CONSORTIUMS,
});

/**
 * Get Org Consortiums action
 */
export const getOrgConsortiums = (organization_uuid) => ({
  type: GET_ORG_CONSORTIUMS,
  organization_uuid,
});

/**
 * Create Consortium action
 * @param {Object} data
 */
export const createConsortium = (data) => ({
  type: CREATE_CONSORTIUM,
  data,
});

/**
 * Edit Consortium action
 * @param {Object} data
 */
export const editConsortium = (data) => ({
  type: EDIT_CONSORTIUM,
  data,
});

/**
 * Delete Consortium action
 * @param {Number} id
 */
export const deleteConsortium = (uuid) => ({
  type: DELETE_CONSORTIUM,
  uuid,
});
