// Gateway actions
export const GET_ALL_GATEWAYS = 'SENSORS/GET_ALL_GATEWAYS';
export const GET_ALL_GATEWAYS_SUCCESS = 'SENSORS/GET_ALL_GATEWAYS_SUCCESS';
export const GET_ALL_GATEWAYS_FAILURE = 'SENSORS/GET_ALL_GATEWAYS_FAILURE';

export const GET_GATEWAYS = 'SENSORS/GET_GATEWAYS';
export const GET_GATEWAYS_SUCCESS = 'SENSORS/GET_GATEWAYS_SUCCESS';
export const GET_GATEWAYS_FAILURE = 'SENSORS/GET_GATEWAYS_FAILURE';

export const GET_NEW_GATEWAYS = 'SENSORS/GET_NEW_GATEWAYS';
export const GET_NEW_GATEWAYS_SUCCESS = 'SENSORS/GET_NEW_GATEWAYS_SUCCESS';
export const GET_NEW_GATEWAYS_FAILURE = 'SENSORS/GET_NEW_GATEWAYS_FAILURE';

export const ADD_GATEWAY = 'SENSORS/ADD_GATEWAY';
export const ADD_GATEWAY_SUCCESS = 'SENSORS/ADD_GATEWAY_SUCCESS';
export const ADD_GATEWAY_FAILURE = 'SENSORS/ADD_GATEWAY_FAILURE';

export const EDIT_GATEWAY = 'SENSORS/EDIT_GATEWAY';
export const EDIT_GATEWAY_SUCCESS = 'SENSORS/EDIT_GATEWAY_SUCCESS';
export const EDIT_GATEWAY_FAILURE = 'SENSORS/EDIT_GATEWAY_FAILURE';

export const DELETE_GATEWAY = 'SENSORS/DELETE_GATEWAY';
export const DELETE_GATEWAY_SUCCESS = 'SENSORS/DELETE_GATEWAY_SUCCESS';
export const DELETE_GATEWAY_FAILURE = 'SENSORS/DELETE_GATEWAY_FAILURE';

export const GET_GATEWAYS_TYPE = 'SENSORS/GET_GATEWAYS_TYPE';
export const GET_GATEWAYS_TYPE_SUCCESS = 'SENSORS/GET_GATEWAYS_TYPE_SUCCESS';
export const GET_GATEWAYS_TYPE_FAILURE = 'SENSORS/GET_GATEWAYS_TYPE_FAILURE';

export const ADD_GATEWAYS_TYPE = 'SENSORS/ADD_GATEWAYS_TYPE';
export const ADD_GATEWAYS_TYPE_SUCCESS = 'SENSORS/ADD_GATEWAYS_TYPE_SUCCESS';
export const ADD_GATEWAYS_TYPE_FAILURE = 'SENSORS/ADD_GATEWAYS_TYPE_FAILURE';

export const EDIT_GATEWAYS_TYPE = 'SENSORS/EDIT_GATEWAYS_TYPE';
export const EDIT_GATEWAYS_TYPE_SUCCESS = 'SENSORS/EDIT_GATEWAYS_TYPE_SUCCESS';
export const EDIT_GATEWAYS_TYPE_FAILURE = 'SENSORS/EDIT_GATEWAYS_TYPE_FAILURE';

export const DELETE_GATEWAYS_TYPE = 'SENSORS/DELETE_GATEWAYS_TYPE';
export const DELETE_GATEWAYS_TYPE_SUCCESS = 'SENSORS/DELETE_GATEWAYS_TYPE_SUCCESS';
export const DELETE_GATEWAYS_TYPE_FAILURE = 'SENSORS/DELETE_GATEWAYS_TYPE_FAILURE';

export const GET_ALL_SENSOR_ALERTS = 'SENSORS/GET_ALL_SENSOR_ALERTS';
export const GET_ALL_SENSOR_ALERTS_SUCCESS = 'SENSORS/GET_ALL_SENSOR_ALERTS_SUCCESS';
export const GET_ALL_SENSOR_ALERTS_FAILURE = 'SENSORS/GET_ALL_SENSOR_ALERTS_FAILURE';

export const GET_SENSOR_REPORTS = 'SENSORS/GET_SENSOR_REPORTS';
export const GET_SENSOR_REPORTS_SUCCESS = 'SENSORS/GET_SENSOR_REPORTS_SUCCESS';
export const GET_SENSOR_REPORTS_FAILURE = 'SENSORS/GET_SENSOR_REPORTS_FAILURE';

export const CONFIGURE_GATEWAY = 'SENSORS/CONFIGURE_GATEWAY';

// Gateway action functions
/**
 *  Get All Gateway List
 */
export const getAllGateways = () => ({ type: GET_ALL_GATEWAYS });

/**
 *  Get Gateway List
 * @param {String}organization_uuid
 */
export const getGateways = (organization_uuid) => ({ type: GET_GATEWAYS, organization_uuid });

/**
 *  Get New Gateways
 */
export const getNewGateways = () => ({ type: GET_NEW_GATEWAYS });

/**
 *  Add Gateway
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo
 */
export const addGateway = (payload, history, redirectTo) => ({
  type: ADD_GATEWAY,
  payload,
  history,
  redirectTo,
});

/**
 * Edit Gateway
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo
 */
export const editGateway = (payload, history, redirectTo) => ({
  type: EDIT_GATEWAY,
  payload,
  history,
  redirectTo,
});

/**
 * Delete Gateway
 * @param {Number} id
 */
export const deleteGateway = (id) => ({ type: DELETE_GATEWAY, id });

/**
 *  Get Gateway Type
 */
export const getGatewayType = () => ({ type: GET_GATEWAYS_TYPE });

/**
 * Add Gateway Type
 * @param {Object} payload
 */
export const addGatewayType = (payload) => ({ type: ADD_GATEWAYS_TYPE, payload });

/**
 * Edit Gateway Type
 * @param {Object} payload
 */
export const editGatewayType = (payload) => ({ type: EDIT_GATEWAYS_TYPE, payload });

/**
 * Delete Gateway Type
 * @param {Number} id
 */
export const deleteGatewayType = (id) => ({ type: DELETE_GATEWAYS_TYPE, id });

/**
 * Get All Sensor Alerts
 * @param {Array} partnerShipmentIds
 */
export const getAllSensorAlerts = (partnerShipmentIds) => ({
  type: GET_ALL_SENSOR_ALERTS,
  partnerShipmentIds,
});

/**
 * Get Sensor Reports
 * @param {Array} partnerShipmentIds
 */
export const getSensorReports = (partnerShipmentIds) => ({
  type: GET_SENSOR_REPORTS,
  partnerShipmentIds,
});

/**
 * Configure Gateway
 * @param {Object} payload
 */
export const configureGateway = (payload) => ({ type: CONFIGURE_GATEWAY, payload });
