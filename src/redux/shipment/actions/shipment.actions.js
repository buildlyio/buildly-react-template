export const GET_SHIPMENTS = 'SHIPMENT/GET_SHIPMENTS';
export const GET_SHIPMENTS_SUCCESS = 'SHIPMENT/GET_SHIPMENTS_SUCCESS';
export const GET_SHIPMENTS_FAILURE = 'SHIPMENT/GET_SHIPMENTS_FAILURE';

export const ADD_SHIPMENT = 'SHIPMENT/ADD_SHIPMENT';
export const ADD_SHIPMENT_SUCCESS = 'SHIPMENT/ADD_SHIPMENT_SUCCESS';
export const ADD_SHIPMENT_FAILURE = 'SHIPMENT/ADD_SHIPMENT_FAILURE';

export const EDIT_SHIPMENT = 'SHIPMENT/EDIT_SHIPMENT';
export const EDIT_SHIPMENT_SUCCESS = 'SHIPMENT/EDIT_SHIPMENT_SUCCESS';
export const EDIT_SHIPMENT_FAILURE = 'SHIPMENT/EDIT_SHIPMENT_FAILURE';

export const DELETE_SHIPMENT = 'SHIPMENT/DELETE_SHIPMENT';
export const DELETE_SHIPMENT_SUCCESS = 'SHIPMENT/DELETE_SHIPMENT_SUCCESS';
export const DELETE_SHIPMENT_FAILURE = 'SHIPMENT/DELETE_SHIPMENT_FAILURE';

export const GET_COUNTRIES_STATES = 'SHIPMENT/GET_COUNTRIES_STATES';
export const GET_COUNTRIES_STATES_SUCCESS = 'SHIPMENT/GET_COUNTRIES_STATES_SUCCESS';
export const GET_COUNTRIES_STATES_FAILURE = 'SHIPMENT/GET_COUNTRIES_STATES_FAILURE';

export const GET_CURRENCIES = 'SHIPMENT/GET_CURRENCIES';
export const GET_CURRENCIES_SUCCESS = 'SHIPMENT/GET_CURRENCIES_SUCCESS';
export const GET_CURRENCIES_FAILURE = 'SHIPMENT/GET_CURRENCIES_FAILURE';

export const GET_SHIPMENT_TEMPLATES = 'SHIPMENT/GET_SHIPMENT_TEMPLATES';
export const GET_SHIPMENT_TEMPLATES_SUCCESS = 'SHIPMENT/GET_SHIPMENT_TEMPLATES_SUCCESS';
export const GET_SHIPMENT_TEMPLATES_FAILURE = 'SHIPMENT/GET_SHIPMENT_TEMPLATES_FAILURE';

export const ADD_SHIPMENT_TEMPLATE = 'SHIPMENT/ADD_SHIPMENT_TEMPLATE';
export const ADD_SHIPMENT_TEMPLATE_SUCCESS = 'SHIPMENT/ADD_SHIPMENT_TEMPLATE_SUCCESS';
export const ADD_SHIPMENT_TEMPLATE_FAILURE = 'SHIPMENT/ADD_SHIPMENT_TEMPLATE_FAILURE';

export const EDIT_SHIPMENT_TEMPLATE = 'SHIPMENT/EDIT_SHIPMENT_TEMPLATE';
export const EDIT_SHIPMENT_TEMPLATE_SUCCESS = 'SHIPMENT/EDIT_SHIPMENT_TEMPLATE_SUCCESS';
export const EDIT_SHIPMENT_TEMPLATE_FAILURE = 'SHIPMENT/EDIT_SHIPMENT_TEMPLATE_FAILURE';

export const DELETE_SHIPMENT_TEMPLATE = 'SHIPMENT/DELETE_SHIPMENT_TEMPLATE';
export const DELETE_SHIPMENT_TEMPLATE_SUCCESS = 'SHIPMENT/DELETE_SHIPMENT_TEMPLATE_SUCCESS';
export const DELETE_SHIPMENT_TEMPLATE_FAILURE = 'SHIPMENT/DELETE_SHIPMENT_TEMPLATE_FAILURE';

/**
 * Get Shipment Details
 * @param {String} organization_uuid
 */
export const getShipmentDetails = (
  organization_uuid = null,
  status = null,
  fetchRelatedData = false,
  fetchSensorReports = false,
) => ({
  type: GET_SHIPMENTS,
  organization_uuid,
  status,
  fetchRelatedData,
  fetchSensorReports,
});

/**
 * Add Shipment
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo
 */
export const addShipment = (payload, history, redirectTo) => ({
  type: ADD_SHIPMENT,
  payload,
  history,
  redirectTo,
});

/**
 * Edit Shipment
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo
 */
export const editShipment = (payload, history, redirectTo) => ({
  type: EDIT_SHIPMENT,
  payload,
  history,
  redirectTo,
});

/**
 * Delete Shipment entity
 * @param {string} id
 */
export const deleteShipment = (id) => ({ type: DELETE_SHIPMENT, id });

/**
 * Get countries and related states
 */
export const getCountries = () => ({ type: GET_COUNTRIES_STATES });

/**
 * Get currencies
 */
export const getCurrencies = () => ({ type: GET_CURRENCIES });

/**
 * Get Shipment templates
 * @param {String} organization_uuid
 */
export const getShipmentTemplates = (organization_uuid) => ({
  type: GET_SHIPMENT_TEMPLATES,
  organization_uuid,
});

/**
 * Add Shipment Template
 * @param {Object} payload
 */
export const addShipmentTemplate = (payload) => ({ type: ADD_SHIPMENT_TEMPLATE, payload });

/**
 * Edit Shipment Template
 * @param {Object} payload
 */
export const editShipmentTemplate = (payload) => ({ type: EDIT_SHIPMENT_TEMPLATE, payload });

/**
 * Delete Shipment Template
 * @param {Number} id
 */
export const deleteShipmentTemplate = (id, showMessage = true) => ({
  type: DELETE_SHIPMENT_TEMPLATE,
  id,
  showMessage,
});
