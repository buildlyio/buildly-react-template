import {
  GET_GATEWAYS,
  GET_GATEWAYS_SUCCESS,
  GET_GATEWAYS_FAILURE,
  ADD_GATEWAY,
  ADD_GATEWAY_SUCCESS,
  ADD_GATEWAY_FAILURE,
  EDIT_GATEWAY,
  EDIT_GATEWAY_SUCCESS,
  EDIT_GATEWAY_FAILURE,
  DELETE_GATEWAY,
  DELETE_GATEWAY_SUCCESS,
  GET_GATEWAYS_TYPE,
  GET_GATEWAYS_TYPE_SUCCESS,
  GET_GATEWAYS_TYPE_FAILURE,
  GATEWAY_SEARCH_SUCCESS,
  GATEWAY_SEARCH,
  DELETE_GATEWAY_FAILURE,
  GET_SENSORS,
  GET_SENSORS_SUCCESS,
  GET_SENSORS_FAILURE,
  Add_SENSOR,
  Add_SENSOR_SUCCESS,
  Add_SENSOR_FAILURE,
  EDIT_SENSOR,
  EDIT_SENSOR_SUCCESS,
  EDIT_SENSOR_FAILURE,
  DELETE_SENSOR,
  DELETE_SENSOR_SUCCESS,
  DELETE_SENSOR_FAILURE,
  SENSOR_SEARCH,
  SENSOR_SEARCH_SUCCESS,
  GET_SENSORS_TYPE,
  GET_SENSORS_TYPE_SUCCESS,
  GET_SENSORS_TYPE_FAILURE,
} from "../actions/sensorsGateway.actions";

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  gatewayTypeList: null,
  gatewayData: null,
  sensorData: null,
  sensorTypeList: null,
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_GATEWAYS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case GET_GATEWAYS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayData: action.data,
      };
    case GET_GATEWAYS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case ADD_GATEWAY:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case ADD_GATEWAY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayData: action.data,
      };
    case ADD_GATEWAY_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_GATEWAY:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_GATEWAY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayData: action.data,
        error: null,
      };

    case EDIT_GATEWAY_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case DELETE_GATEWAY:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case DELETE_GATEWAY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayData: action.data,
      };
    case DELETE_GATEWAY_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case GATEWAY_SEARCH:
      return {
        ...state,
        error: null,
      };
    case GATEWAY_SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewaySearchedData: action.data,
      };
    case GET_GATEWAYS_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case GET_GATEWAYS_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayTypeList: action.data,
      };
    case GET_GATEWAYS_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_SENSORS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case GET_SENSORS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        sensorData: action.data,
      };
    case GET_SENSORS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case Add_SENSOR:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case Add_SENSOR_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        sensorData: action.data,
      };
    case Add_SENSOR_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_SENSOR:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_SENSOR_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        sensorData: action.data,
        error: null,
      };

    case EDIT_SENSOR_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case DELETE_SENSOR:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case DELETE_SENSOR_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        sensorData: action.data,
      };
    case DELETE_SENSOR_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    case SENSOR_SEARCH:
      return {
        ...state,
        error: null,
      };
    case SENSOR_SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        sensorSearchedData: action.data,
      };
    case GET_SENSORS_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    case GET_SENSORS_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        sensorTypeList: action.data,
      };
    case GET_SENSORS_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };
    default:
      return state;
  }
};
