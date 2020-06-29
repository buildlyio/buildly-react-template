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

export const getGateways = () => ({ type: GET_GATEWAYS });

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
export const deleteGateway = (gatewayId) => ({
  type: DELETE_GATEWAY,
  gatewayId,
});

/**
 *
 * @param {String} searchItem
 * @param {Array} searchList
 */
export const searchGatewayItem = (searchItem, searchList) => ({
  type: GATEWAY_SEARCH,
  searchItem,
  searchList,
});

export const getGatewayType = () => ({
  type: GET_GATEWAYS_TYPE,
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

export const getSensors = () => ({ type: GET_SENSORS });

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
export const deleteSensor = (gatewayId) => ({
  type: DELETE_SENSOR,
  gatewayId,
});

/**
 *
 * @param {String} searchItem
 * @param {Array} searchList
 */
export const searchSensorItem = (searchItem, searchList) => ({
  type: SENSOR_SEARCH,
  searchItem,
  searchList,
});

export const getSensorType = () => ({
  type: GET_SENSORS_TYPE,
});
