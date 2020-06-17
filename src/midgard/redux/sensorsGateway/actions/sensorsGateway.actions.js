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
export const addGateway = (payload, history) => ({
  type: ADD_GATEWAY,
  payload,
  history,
});
/**
 *
 * @param {Object} payload
 * @param {Object} history
 */
export const editGateway = (payload, history) => ({
  type: EDIT_GATEWAY,
  payload,
  history,
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
