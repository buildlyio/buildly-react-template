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

export const GET_SHIPMENT_FLAG = 'SHIPMENT/GET_SHIPMENT_FLAG';
export const GET_SHIPMENT_FLAG_SUCCESS = 'SHIPMENT/GET_SHIPMENT_FLAG_SUCCESS';
export const GET_SHIPMENT_FLAG_FAILURE = 'SHIPMENT/GET_SHIPMENT_FLAG_FAILURE';

export const GET_DASHBOARD_ITEMS = 'SHIPMENT/GET_DASHBOARD_ITEMS';
export const GET_DASHBOARD_ITEMS_SUCCESS = 'SHIPMENT/GET_DASHBOARD_ITEMS_SUCCESS';
export const GET_DASHBOARD_ITEMS_FAILURE = 'SHIPMENT/GET_DASHBOARD_ITEMS_FAILURE';

export const GET_ALERTS = 'SHIPMENT/GET_ALERTS';
export const SET_SHIPMENT_ALERTS = 'SHIPMENT/SET_ALERTS';
export const EMAIL_ALERTS = 'SHIPMENT/EMAIL_ALERTS';

export const GET_SHIPMENT_OPTIONS = 'ITEMS/GET_SHIPMENT_OPTIONS';
export const GET_SHIPMENT_OPTIONS_SUCCESS = 'ITEMS/GET_SHIPMENT_OPTIONS_SUCCESS';
export const GET_SHIPMENT_OPTIONS_FAILURE = 'ITEMS/GET_SHIPMENT_OPTIONS_FAILURE';

export const ADD_SHIPMENT_FLAG = 'SHIPMENT/ADD_SHIPMENT_FLAG';
export const ADD_SHIPMENT_FLAG_SUCCESS = 'SHIPMENT/ADD_SHIPMENT_FLAG_SUCCESS';
export const ADD_SHIPMENT_FLAG_FAILURE = 'SHIPMENT/ADD_SHIPMENT_FLAG_FAILURE';

export const EDIT_SHIPMENT_FLAG = 'SHIPMENT/EDIT_SHIPMENT_FLAG';
export const EDIT_SHIPMENT_FLAG_SUCCESS = 'SHIPMENT/EDIT_SHIPMENT_FLAG_SUCCESS';
export const EDIT_SHIPMENT_FLAG_FAILURE = 'SHIPMENT/EDIT_SHIPMENT_FLAG_FAILURE';

export const DELETE_SHIPMENT_FLAG = 'SHIPMENT/DELETE_SHIPMENT_FLAG';
export const DELETE_SHIPMENT_FLAG_SUCCESS = 'SHIPMENT/DELETE_SHIPMENT_FLAG_SUCCESS';
export const DELETE_SHIPMENT_FLAG_FAILURE = 'SHIPMENT/DELETE_SHIPMENT_FLAG_FAILURE';

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
 * @param {Boolean} getAggregateReport
 * @param {Boolean} getReportAlerts
 */
export const getShipmentDetails = (
  organization_uuid,
  id = null,
  getAggregateReport = false,
  getReportAlerts = false,
) => ({
  type: GET_SHIPMENTS,
  organization_uuid,
  id,
  getAggregateReport,
  getReportAlerts,
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
 * Get Shipment Flag
 * @param {String} organization_uuid
 */
export const getShipmentFlag = (organization_uuid) => ({
  type: GET_SHIPMENT_FLAG,
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
 * Set Shipment Alerts
 * @param {Object} alerts
 */
export const setShipmentAlerts = (alerts) => ({
  type: SET_SHIPMENT_ALERTS,
  alerts,
});

/**
 * Email Alerts
 * @param {Object} alerts
 */
export const emailAlerts = (alerts) => ({
  type: EMAIL_ALERTS,
  alerts,
});

/**
 * Add Shipment Flad
 * @param {Object} payload
 */
export const addShipmentFlag = (payload) => ({
  type: ADD_SHIPMENT_FLAG,
  payload,
});

/**
 * Edit Shipment Flad
 * @param {Object} payload
 */
export const editShipmentFlag = (payload) => ({
  type: EDIT_SHIPMENT_FLAG,
  payload,
});

/**
 * Delete Shipment Flad
 * @param {Number} id
 */
export const deleteShipmentFlag = (id) => ({
  type: DELETE_SHIPMENT_FLAG,
  id,
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
