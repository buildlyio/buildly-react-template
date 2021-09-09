export const SAVE_SHIPMENT_FORM_DATA = 'SHIPMENT/SAVE_SHIPMENT_FORM_DATA';

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

export const GET_DASHBOARD_ITEMS = 'SHIPMENT/GET_DASHBOARD_ITEMS';
export const GET_DASHBOARD_ITEMS_SUCCESS = 'SHIPMENT/GET_DASHBOARD_ITEMS_SUCCESS';
export const GET_DASHBOARD_ITEMS_FAILURE = 'SHIPMENT/GET_DASHBOARD_ITEMS_FAILURE';

export const ADD_PDF_IDENTIFIER = 'SHIPMENT/ADD_PDF_IDENTIFIER';
export const ADD_PDF_IDENTIFIER_SUCCESS = 'SHIPMENT/ADD_PDF_IDENTIFIER_SUCCESS';
export const ADD_PDF_IDENTIFIER_FAILURE = 'SHIPMENT/ADD_PDF_IDENTIFIER_FAILURE';

/**
 * Save Shipment Form Data
 * @param {Object} formData
 */
export const saveShipmentFormData = (formData) => ({
  type: SAVE_SHIPMENT_FORM_DATA,
  formData,
});

/**
 * Get Shipment Details
 * @param {String} organization_uuid
 * @param {Number} id
 * @param {Boolean} getUpdatedSensorData
 */
export const getShipmentDetails = (
  organization_uuid,
  status = null,
  id = null,
  getUpdatedSensorData = false,
) => ({
  type: GET_SHIPMENTS,
  organization_uuid,
  status,
  id,
  getUpdatedSensorData,
});

/**
 * Add Shipment
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo
 * @param {String} organization_uuid
 */
export const addShipment = (
  payload,
  history,
  redirectTo,
  organization_uuid,
) => ({
  type: ADD_SHIPMENT,
  payload,
  history,
  redirectTo,
  organization_uuid,
});

/**
 * Edit Shipment
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo path to redirect
 * @param {String} organization_uuid
 */
export const editShipment = (
  payload,
  history,
  redirectTo,
  organization_uuid,
) => ({
  type: EDIT_SHIPMENT,
  payload,
  history,
  redirectTo,
  organization_uuid,
});

/**
 * Delete Shipment entity
 * @param {string} shipmentId
 * @param {string} organization_uuid
 */
export const deleteShipment = (shipmentId, organization_uuid) => ({
  type: DELETE_SHIPMENT,
  shipmentId,
  organization_uuid,
});

/**
 * Get Dashboard Items
 * @param {String} organization_uuid
 */
export const getDashboardItems = (organization_uuid) => ({
  type: GET_DASHBOARD_ITEMS,
  organization_uuid,
});

/**
 * PDF Identifier
 * @param {FormData} data
 * @param {String} filename
 * @param {String} identifier
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo
 * @param {String} organization_uuid
 */
export const pdfIdentifier = (
  data,
  filename,
  identifier,
  payload,
  history,
  redirectTo,
  organization_uuid,
) => ({
  type: ADD_PDF_IDENTIFIER,
  data,
  filename,
  identifier,
  payload,
  history,
  redirectTo,
  organization_uuid,
});
