export const SAVE_SHIPMENT_FORM_DATA = "SHIPMENT/SAVE_SHIPMENT_FORM_DATA";

export const GET_SHIPMENTS = "SHIPMENT/GET_SHIPMENTS";
export const GET_SHIPMENTS_SUCCESS = "SHIPMENT/GET_SHIPMENTS_SUCCESS";
export const GET_SHIPMENTS_FAILURE = "SHIPMENT/GET_SHIPMENTS_FAILURE";

export const ADD_SHIPMENT = "SHIPMENT/ADD_SHIPMENT";
export const ADD_SHIPMENT_SUCCESS = "SHIPMENT/ADD_SHIPMENT_SUCCESS";
export const ADD_SHIPMENT_FAILURE = "SHIPMENT/ADD_SHIPMENT_FAILURE";

export const EDIT_SHIPMENT = "SHIPMENT/EDIT_SHIPMENT";
export const EDIT_SHIPMENT_SUCCESS = "SHIPMENT/EDIT_SHIPMENT_SUCCESS";
export const EDIT_SHIPMENT_FAILURE = "SHIPMENT/EDIT_SHIPMENT_FAILURE";

export const DELETE_SHIPMENT = "SHIPMENT/DELETE_SHIPMENT";
export const DELETE_SHIPMENT_SUCCESS = "SHIPMENT/DELETE_SHIPMENT_SUCCESS";
export const DELETE_SHIPMENT_FAILURE = "SHIPMENT/DELETE_SHIPMENT_FAILURE";

export const FILTER_SHIPMENT = "SHIPMENT/FILTER_SHIPMENT";
export const FILTER_SHIPMENT_SUCCESS = "SHIPMENT/FILTER_SHIPMENT_SUCCESS";
export const FILTER_SHIPMENT_FAILURE = "SHIPMENT/FILTER_SHIPMENT_FAILURE";

export const GET_SHIPMENT_FLAG = "SHIPMENT/GET_SHIPMENT_FLAG";
export const GET_SHIPMENT_FLAG_SUCCESS = "SHIPMENT/GET_SHIPMENT_FLAG_SUCCESS";
export const GET_SHIPMENT_FLAG_FAILURE = "SHIPMENT/GET_SHIPMENT_FLAG_FAILURE";

export const GET_DASHBOARD_ITEMS = "SHIPMENT/GET_DASHBOARD_ITEMS";
export const GET_DASHBOARD_ITEMS_SUCCESS =
  "SHIPMENT/GET_DASHBOARD_ITEMS_SUCCESS";
export const GET_DASHBOARD_ITEMS_FAILURE =
  "SHIPMENT/GET_DASHBOARD_ITEMS_FAILURE";

export const GET_ALERTS = "SHIPMENT/GET_ALERTS";
export const SET_ALERTS = "SHIPMENT/SET_ALERTS";

export const GET_SHIPMENT_OPTIONS = "ITEMS/GET_SHIPMENT_OPTIONS";
export const GET_SHIPMENT_OPTIONS_SUCCESS =
  "ITEMS/GET_SHIPMENT_OPTIONS_SUCCESS";
export const GET_SHIPMENT_OPTIONS_FAILURE =
  "ITEMS/GET_SHIPMENT_OPTIONS_FAILURE";

/**
 *
 * @param {Object} formData
 */
export const saveShipmentFormData = (formData) => ({
  type: SAVE_SHIPMENT_FORM_DATA,
  formData,
});

/**
 * Get Shipment Details
 */
export const getShipmentDetails = () => ({
  type: GET_SHIPMENTS,
});

/**
 *
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
 *Edit Shipment
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo path to redirect
 */
export const editShipment = (payload, history, redirectTo) => ({
  type: EDIT_SHIPMENT,
  payload,
  history,
  redirectTo,
});

/**
 *Delete Shipment entity
 * @param {{id}} payload
 */
export const deleteShipment = (shipmentId) => ({
  type: DELETE_SHIPMENT,
  shipmentId,
});

/**
 *
 * @param {Array} list
 * @param {Object} filterObject {type,params}
 */
export const filterShipmentData = (list, filterObject) => ({
  type: FILTER_SHIPMENT,
  list,
  filterObject,
});

export const getShipmentFlag = () => ({
  type: GET_SHIPMENT_FLAG,
});

export const getDashboardItems = () => ({
  type: GET_DASHBOARD_ITEMS,
});

export const setAlerts = (alerts) => ({
  type: SET_ALERTS,
  alerts,
});
