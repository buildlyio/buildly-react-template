//get Gateway action constants
export const GET_GATEWAYS = "SENSORS/GET_GATEWAYS";
export const GET_GATEWAYS_SUCCESS = "SENSORS/GET_GATEWAYS_SUCCESS";
export const GET_GATEWAYS_FAILURE = "SENSORS/GET_GATEWAYS_FAILURE";

//add Gateway action constants
export const ADD_GATEWAY = "SENSORS/ADD_GATEWAY";
export const ADD_GATEWAY_SUCCESS = "SENSORS/ADD_GATEWAY_SUCCESS";
export const ADD_GATEWAY_FAILURE = "SENSORS/ADD_GATEWAY_FAILURE";

//edit Gateway action constants
export const EDIT_GATEWAY = "SENSORS/EDIT_GATEWAY";
export const EDIT_GATEWAY_SUCCESS = "SENSORS/EDIT_GATEWAY_SUCCESS";
export const EDIT_GATEWAY_FAILURE = "SENSORS/EDIT_GATEWAY_FAILURE";

//delete Gateway action constants
export const DELETE_GATEWAY = "SENSORS/DELETE_GATEWAY";
export const DELETE_GATEWAY_SUCCESS = "SENSORS/DELETE_GATEWAY_SUCCESS";
export const DELETE_GATEWAY_FAILURE = "SENSORS/DELETE_GATEWAY_FAILURE";

//search Gateway action constants
export const GATEWAY_SEARCH = "SENSORS/GATEWAY_SEARCH";
export const GATEWAY_SEARCH_SUCCESS = "SENSORS/GATEWAY_SEARCH_SUCCESS";

//get Gateway types action constants
export const GET_GATEWAYS_TYPE = "SENSORS/GET_GATEWAYS_TYPE";
export const GET_GATEWAYS_TYPE_SUCCESS = "SENSORS/GET_GATEWAYS_TYPE_SUCCESS";
export const GET_GATEWAYS_TYPE_FAILURE = "SENSORS/GET_GATEWAYS_TYPE_FAILURE";

export const GET_GATEWAY_OPTIONS = "ITEMS/GET_GATEWAY_OPTIONS";
export const GET_GATEWAY_OPTIONS_SUCCESS = "ITEMS/GET_GATEWAY_OPTIONS_SUCCESS";
export const GET_GATEWAY_OPTIONS_FAILURE = "ITEMS/GET_GATEWAY_OPTIONS_FAILURE";

//add Gateway types action constants
export const ADD_GATEWAYS_TYPE = "SENSORS/ADD_GATEWAYS_TYPE";
export const ADD_GATEWAYS_TYPE_SUCCESS = "SENSORS/ADD_GATEWAYS_TYPE_SUCCESS";
export const ADD_GATEWAYS_TYPE_FAILURE = "SENSORS/ADD_GATEWAYS_TYPE_FAILURE";

//edit Gateway types action constants
export const EDIT_GATEWAYS_TYPE = "SENSORS/EDIT_GATEWAYS_TYPE";
export const EDIT_GATEWAYS_TYPE_SUCCESS = "SENSORS/EDIT_GATEWAYS_TYPE_SUCCESS";
export const EDIT_GATEWAYS_TYPE_FAILURE = "SENSORS/EDIT_GATEWAYS_TYPE_FAILURE";

//delete Gateway types action constants
export const DELETE_GATEWAYS_TYPE = "SENSORS/DELETE_GATEWAYS_TYPE";
export const DELETE_GATEWAYS_TYPE_SUCCESS = "SENSORS/DELETE_GATEWAYS_TYPE_SUCCESS";
export const DELETE_GATEWAYS_TYPE_FAILURE = "SENSORS/DELETE_GATEWAYS_TYPE_FAILURE";

export const getGateways = (organization_uuid) => ({ type: GET_GATEWAYS, organization_uuid, });

/**
 *Add Gateway
 * @param {Object} payload
 * @param {Object} history
 */
export const addGateway = (payload, history, redirectTo) => ({
  type: ADD_GATEWAY,
  payload,
  history,
  redirectTo,
});
/**
 *
 * @param {Object} payload
 * @param {Object} history
 */
export const editGateway = (payload, history, redirectTo) => ({
  type: EDIT_GATEWAY,
  payload,
  history,
  redirectTo,
});

/**
 *Delete Gateway entity
 * @param {{id}} payload
 */
export const deleteGateway = (gatewayId, organization_uuid) => ({
  type: DELETE_GATEWAY,
  gatewayId,
  organization_uuid,
});

/**
 *
 * @param {String} searchItem
 * @param {Array} searchList
 */
export const searchGatewayItem = (searchItem, searchList, searchFields) => ({
  type: GATEWAY_SEARCH,
  searchItem,
  searchList,
  searchFields,
});

export const getGatewayType = () => ({
  type: GET_GATEWAYS_TYPE,
});

export const addGatewayType = (payload) => ({
  type: ADD_GATEWAYS_TYPE,
  payload,
});

export const editGatewayType = (payload) => ({
  type: EDIT_GATEWAYS_TYPE,
  payload,
});

export const deleteGatewayType = (id) => ({
  type: DELETE_GATEWAYS_TYPE,
  id,
});

//Sensors Actions

//get Sensor action constants
export const GET_SENSORS = "SENSORS/GET_SENSORS";
export const GET_SENSORS_SUCCESS = "SENSORS/GET_SENSORS_SUCCESS";
export const GET_SENSORS_FAILURE = "SENSORS/GET_SENSORS_FAILURE";

//add Sensor action constants
export const Add_SENSOR = "SENSORS/Add_SENSOR";
export const Add_SENSOR_SUCCESS = "SENSORS/Add_SENSOR_SUCCESS";
export const Add_SENSOR_FAILURE = "SENSORS/Add_SENSOR_FAILURE";

//edit Sensor action constants
export const EDIT_SENSOR = "SENSORS/EDIT_SENSOR";
export const EDIT_SENSOR_SUCCESS = "SENSORS/EDIT_SENSOR_SUCCESS";
export const EDIT_SENSOR_FAILURE = "SENSORS/EDIT_SENSOR_FAILURE";

//delete Sensor action constants
export const DELETE_SENSOR = "SENSORS/DELETE_SENSOR";
export const DELETE_SENSOR_SUCCESS = "SENSORS/DELETE_SENSOR_SUCCESS";
export const DELETE_SENSOR_FAILURE = "SENSORS/DELETE_SENSOR_FAILURE";

//search Sensor action constants
export const SENSOR_SEARCH = "SENSORS/SENSOR_SEARCH";
export const SENSOR_SEARCH_SUCCESS = "SENSORS/SENSOR_SEARCH_SUCCESS";

//get Sensor types action constants
export const GET_SENSORS_TYPE = "SENSORS/GET_SENSORS_TYPE";
export const GET_SENSORS_TYPE_SUCCESS = "SENSORS/GET_SENSORS_TYPE_SUCCESS";
export const GET_SENSORS_TYPE_FAILURE = "SENSORS/GET_SENSORS_TYPE_FAILURE";

//get Sensor report action constants
export const GET_AGGREGATE_REPORT = "SENSORS/GET_AGGREGATE_REPORT";
export const GET_AGGREGATE_REPORT_SUCCESS = "SENSORS/GET_AGGREGATE_REPORT_SUCCESS";
export const GET_AGGREGATE_REPORT_FAILURE = "SENSORS/GET_AGGREGATE_REPORT_FAILURE";

export const GET_SENSOR_REPORT = "SENSORS/GET_SENSOR_REPORT";
export const GET_SENSOR_REPORT_SUCCESS = "SENSORS/GET_SENSOR_REPORT_SUCCESS";
export const GET_SENSOR_REPORT_FAILURE = "SENSORS/GET_SENSOR_REPORT_FAILURE";

export const GET_SENSOR_OPTIONS = "ITEMS/GET_SENSOR_OPTIONS";
export const GET_SENSOR_OPTIONS_SUCCESS = "ITEMS/GET_SENSOR_OPTIONS_SUCCESS";
export const GET_SENSOR_OPTIONS_FAILURE = "ITEMS/GET_SENSOR_OPTIONS_FAILURE";

//add Sensor types action constants
export const ADD_SENSORS_TYPE = "SENSORS/ADD_SENSORS_TYPE";
export const ADD_SENSORS_TYPE_SUCCESS = "SENSORS/ADD_SENSORS_TYPE_SUCCESS";
export const ADD_SENSORS_TYPE_FAILURE = "SENSORS/ADD_SENSORS_TYPE_FAILURE";

//edit Sensor types action constants
export const EDIT_SENSORS_TYPE = "SENSORS/EDIT_SENSORS_TYPE";
export const EDIT_SENSORS_TYPE_SUCCESS = "SENSORS/EDIT_SENSORS_TYPE_SUCCESS";
export const EDIT_SENSORS_TYPE_FAILURE = "SENSORS/EDIT_SENSORS_TYPE_FAILURE";

//delete Sensor types action constants
export const DELETE_SENSORS_TYPE = "SENSORS/DELETE_SENSORS_TYPE";
export const DELETE_SENSORS_TYPE_SUCCESS = "SENSORS/DELETE_SENSORS_TYPE_SUCCESS";
export const DELETE_SENSORS_TYPE_FAILURE = "SENSORS/DELETE_SENSORS_TYPE_FAILURE";

export const getSensors = (organization_uuid) => ({ type: GET_SENSORS, organization_uuid, });

/**
 *
 * @param {Object} payload
 * @param {Object} history
 */
export const addSensor = (payload, history, redirectTo) => ({
  type: Add_SENSOR,
  payload,
  history,
  redirectTo,
});
/**
 *
 * @param {Object} payload
 * @param {Object} history
 */
export const editSensor = (payload, history, redirectTo) => ({
  type: EDIT_SENSOR,
  payload,
  history,
  redirectTo,
});

/**
 *Delete Gateway entity
 * @param {{id}} payload
 */
export const deleteSensor = (sensorId, organization_uuid) => ({
  type: DELETE_SENSOR,
  sensorId,
  organization_uuid,
});

/**
 *
 * @param {String} searchItem
 * @param {Array} searchList
 */
export const searchSensorItem = (searchItem, searchList, searchFields) => ({
  type: SENSOR_SEARCH,
  searchItem,
  searchList,
  searchFields,
});

export const getSensorType = () => ({
  type: GET_SENSORS_TYPE,
});

export const getAggregateReport = (organization_uuid) => ({
  type: GET_AGGREGATE_REPORT,
  organization_uuid,
});

export const getSensorReportAlerts = (organization_uuid) => ({
  type: GET_SENSOR_REPORT,
  organization_uuid,
});

export const addSensorType = (payload) => ({
  type: ADD_SENSORS_TYPE,
  payload,
});

export const editSensorType = (payload) => ({
  type: EDIT_SENSORS_TYPE,
  payload,
});

export const deleteSensorType = (id) => ({
  type: DELETE_SENSORS_TYPE,
  id,
});