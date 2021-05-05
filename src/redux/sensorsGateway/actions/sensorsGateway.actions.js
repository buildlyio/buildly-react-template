// Gateway actions
export const GET_GATEWAYS = 'SENSORS/GET_GATEWAYS';
export const GET_GATEWAYS_SUCCESS = 'SENSORS/GET_GATEWAYS_SUCCESS';
export const GET_GATEWAYS_FAILURE = 'SENSORS/GET_GATEWAYS_FAILURE';

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

// Sensors Actions
export const GET_SENSORS = 'SENSORS/GET_SENSORS';
export const GET_SENSORS_SUCCESS = 'SENSORS/GET_SENSORS_SUCCESS';
export const GET_SENSORS_FAILURE = 'SENSORS/GET_SENSORS_FAILURE';

export const ADD_SENSOR = 'SENSORS/ADD_SENSOR';
export const ADD_SENSOR_SUCCESS = 'SENSORS/ADD_SENSOR_SUCCESS';
export const ADD_SENSOR_FAILURE = 'SENSORS/ADD_SENSOR_FAILURE';

export const EDIT_SENSOR = 'SENSORS/EDIT_SENSOR';
export const EDIT_SENSOR_SUCCESS = 'SENSORS/EDIT_SENSOR_SUCCESS';
export const EDIT_SENSOR_FAILURE = 'SENSORS/EDIT_SENSOR_FAILURE';

export const DELETE_SENSOR = 'SENSORS/DELETE_SENSOR';
export const DELETE_SENSOR_SUCCESS = 'SENSORS/DELETE_SENSOR_SUCCESS';
export const DELETE_SENSOR_FAILURE = 'SENSORS/DELETE_SENSOR_FAILURE';

export const GET_SENSORS_TYPE = 'SENSORS/GET_SENSORS_TYPE';
export const GET_SENSORS_TYPE_SUCCESS = 'SENSORS/GET_SENSORS_TYPE_SUCCESS';
export const GET_SENSORS_TYPE_FAILURE = 'SENSORS/GET_SENSORS_TYPE_FAILURE';

export const ADD_SENSORS_TYPE = 'SENSORS/ADD_SENSORS_TYPE';
export const ADD_SENSORS_TYPE_SUCCESS = 'SENSORS/ADD_SENSORS_TYPE_SUCCESS';
export const ADD_SENSORS_TYPE_FAILURE = 'SENSORS/ADD_SENSORS_TYPE_FAILURE';

export const EDIT_SENSORS_TYPE = 'SENSORS/EDIT_SENSORS_TYPE';
export const EDIT_SENSORS_TYPE_SUCCESS = 'SENSORS/EDIT_SENSORS_TYPE_SUCCESS';
export const EDIT_SENSORS_TYPE_FAILURE = 'SENSORS/EDIT_SENSORS_TYPE_FAILURE';

export const DELETE_SENSORS_TYPE = 'SENSORS/DELETE_SENSORS_TYPE';
export const DELETE_SENSORS_TYPE_SUCCESS = 'SENSORS/DELETE_SENSORS_TYPE_SUCCESS';
export const DELETE_SENSORS_TYPE_FAILURE = 'SENSORS/DELETE_SENSORS_TYPE_FAILURE';

export const GET_SENSOR_REPORT = 'SENSORS/GET_SENSOR_REPORT';
export const GET_SENSOR_REPORT_SUCCESS = 'SENSORS/GET_SENSOR_REPORT_SUCCESS';
export const GET_SENSOR_REPORT_FAILURE = 'SENSORS/GET_SENSOR_REPORT_FAILURE';

export const GET_AGGREGATE_REPORT = 'SENSORS/GET_AGGREGATE_REPORT';
export const GET_AGGREGATE_REPORT_SUCCESS = 'SENSORS/GET_AGGREGATE_REPORT_SUCCESS';
export const GET_AGGREGATE_REPORT_FAILURE = 'SENSORS/GET_AGGREGATE_REPORT_FAILURE';

// Gateway action functions
/**
 *  Get Gateway List
 */
export const getGateways = (organization_uuid) => ({
  type: GET_GATEWAYS,
  organization_uuid,
});

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
 * @param {Number} gatewayId
 * @param {String} organization_uuid
 */
export const deleteGateway = (gatewayId, organization_uuid) => ({
  type: DELETE_GATEWAY,
  gatewayId,
  organization_uuid,
});

/**
 *  Get Gateway Type
 */
export const getGatewayType = () => ({
  type: GET_GATEWAYS_TYPE,
});

/**
 * Add Gateway Type
 * @param {Object} payload
 */
export const addGatewayType = (payload) => ({
  type: ADD_GATEWAYS_TYPE,
  payload,
});

/**
 * Edit Gateway Type
 * @param {Object} payload
 */
export const editGatewayType = (payload) => ({
  type: EDIT_GATEWAYS_TYPE,
  payload,
});

/**
 * Delete Gateway Type
 * @param {Number} id
 */
export const deleteGatewayType = (id) => ({
  type: DELETE_GATEWAYS_TYPE,
  id,
});

// Sensor Action functions
/**
 * Get Sensor List
 * @param {String} organization_uuid
 */
export const getSensors = (organization_uuid) => ({
  type: GET_SENSORS,
  organization_uuid,
});

/**
 * Add Sensor
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo
 */
export const addSensor = (payload, history, redirectTo) => ({
  type: ADD_SENSOR,
  payload,
  history,
  redirectTo,
});

/**
 * Edit Sensor
 * @param {Object} payload
 * @param {Object} history
 * @param {String} redirectTo
 */
export const editSensor = (payload, history, redirectTo) => ({
  type: EDIT_SENSOR,
  payload,
  history,
  redirectTo,
});

/**
 * Delete Sensor
 * @param {Number} sensorId
 * @param {String} organization_uuid
 */
export const deleteSensor = (sensorId, organization_uuid) => ({
  type: DELETE_SENSOR,
  sensorId,
  organization_uuid,
});

/**
 * Get Sensor Type
 */
export const getSensorType = () => ({
  type: GET_SENSORS_TYPE,
});

/**
 * Add Sensor Type
 * @param {Object} payload
 */
export const addSensorType = (payload) => ({
  type: ADD_SENSORS_TYPE,
  payload,
});

/**
 * Edit Sensor Type
 * @param {Object} payload
 */
export const editSensorType = (payload) => ({
  type: EDIT_SENSORS_TYPE,
  payload,
});

/**
 * Delete Sensor Type
 * @param {Number} id
 */
export const deleteSensorType = (id) => ({
  type: DELETE_SENSORS_TYPE,
  id,
});

/**
 * Get Sensor Report Alerts
 * @param {Array} partnerShipmentIds
 */
export const getSensorReportAlerts = (partnerShipmentIds) => ({
  type: GET_SENSOR_REPORT,
  partnerShipmentIds,
});

/**
 * Get Aggregate Report
 * @param {Array} partnerShipmentIds
 */
export const getAggregateReport = (partnerShipmentIds) => ({
  type: GET_AGGREGATE_REPORT,
  partnerShipmentIds,
});
