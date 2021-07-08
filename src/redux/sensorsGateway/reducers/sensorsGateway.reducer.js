import _ from 'lodash';
import {
  GET_GATEWAYS,
  GET_GATEWAYS_SUCCESS,
  GET_GATEWAYS_FAILURE,
  GET_NEW_GATEWAYS,
  GET_NEW_GATEWAYS_SUCCESS,
  GET_NEW_GATEWAYS_FAILURE,
  ADD_GATEWAY,
  ADD_GATEWAY_SUCCESS,
  ADD_GATEWAY_FAILURE,
  EDIT_GATEWAY,
  EDIT_GATEWAY_SUCCESS,
  EDIT_GATEWAY_FAILURE,
  DELETE_GATEWAY,
  DELETE_GATEWAY_SUCCESS,
  DELETE_GATEWAY_FAILURE,
  GET_GATEWAYS_TYPE,
  GET_GATEWAYS_TYPE_SUCCESS,
  GET_GATEWAYS_TYPE_FAILURE,
  ADD_GATEWAYS_TYPE,
  ADD_GATEWAYS_TYPE_SUCCESS,
  ADD_GATEWAYS_TYPE_FAILURE,
  EDIT_GATEWAYS_TYPE,
  EDIT_GATEWAYS_TYPE_SUCCESS,
  EDIT_GATEWAYS_TYPE_FAILURE,
  DELETE_GATEWAYS_TYPE,
  DELETE_GATEWAYS_TYPE_SUCCESS,
  DELETE_GATEWAYS_TYPE_FAILURE,
  GET_SENSORS,
  GET_SENSORS_SUCCESS,
  GET_SENSORS_FAILURE,
  ADD_SENSOR,
  ADD_SENSOR_SUCCESS,
  ADD_SENSOR_FAILURE,
  EDIT_SENSOR,
  EDIT_SENSOR_SUCCESS,
  EDIT_SENSOR_FAILURE,
  DELETE_SENSOR,
  DELETE_SENSOR_SUCCESS,
  DELETE_SENSOR_FAILURE,
  GET_SENSORS_TYPE,
  GET_SENSORS_TYPE_SUCCESS,
  GET_SENSORS_TYPE_FAILURE,
  ADD_SENSORS_TYPE,
  ADD_SENSORS_TYPE_SUCCESS,
  ADD_SENSORS_TYPE_FAILURE,
  EDIT_SENSORS_TYPE,
  EDIT_SENSORS_TYPE_SUCCESS,
  EDIT_SENSORS_TYPE_FAILURE,
  DELETE_SENSORS_TYPE,
  DELETE_SENSORS_TYPE_SUCCESS,
  DELETE_SENSORS_TYPE_FAILURE,
  GET_AGGREGATE_REPORT,
  GET_AGGREGATE_REPORT_SUCCESS,
  GET_AGGREGATE_REPORT_FAILURE,
  GET_ALL_SENSOR_ALERTS,
  GET_ALL_SENSOR_ALERTS_SUCCESS,
  GET_ALL_SENSOR_ALERTS_FAILURE,
} from '../actions/sensorsGateway.actions';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  gatewayData: null,
  gatewayTypeList: null,
  sensorData: null,
  sensorTypeList: null,
  aggregateReportData: null,
  allAlerts: null,
};

// Reducer
export default (state = initialState, action) => {
  let deletedGatewayType;
  let editedGatewayType = state.gatewayTypeList;
  const gatewayTypePresent = _.remove(
    editedGatewayType,
    { id: action.gatewayType?.id },
  )[0];
  if (gatewayTypePresent) {
    deletedGatewayType = editedGatewayType;
    editedGatewayType = [...editedGatewayType, action.gatewayType];
  }

  let deletedSensorType;
  let editedSensorType = state.sensorTypeList;
  const sensorTypePresent = _.remove(
    editedSensorType,
    { id: action.sensorType?.id },
  )[0];
  if (sensorTypePresent) {
    deletedSensorType = editedSensorType;
    editedSensorType = [...editedSensorType, action.sensorType];
  }

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

    case GET_NEW_GATEWAYS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_NEW_GATEWAYS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
      };

    case GET_NEW_GATEWAYS_FAILURE:
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

    case ADD_GATEWAYS_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_GATEWAYS_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayTypeList: [
          ...state.gatewayTypeList, action.gatewayType,
        ],
      };

    case ADD_GATEWAYS_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_GATEWAYS_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_GATEWAYS_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayTypeList: editedGatewayType,
      };

    case EDIT_GATEWAYS_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_GATEWAYS_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_GATEWAYS_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayTypeList: deletedGatewayType,
      };

    case DELETE_GATEWAYS_TYPE_FAILURE:
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

    case ADD_SENSOR:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_SENSOR_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        sensorData: action.data,
      };

    case ADD_SENSOR_FAILURE:
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

    case ADD_SENSORS_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case ADD_SENSORS_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        sensorTypeList: [
          ...state.sensorTypeList, action.sensorType,
        ],
      };

    case ADD_SENSORS_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case EDIT_SENSORS_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case EDIT_SENSORS_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        sensorTypeList: editedSensorType,
      };

    case EDIT_SENSORS_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case DELETE_SENSORS_TYPE:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case DELETE_SENSORS_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        sensorTypeList: deletedSensorType,
      };

    case DELETE_SENSORS_TYPE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_AGGREGATE_REPORT:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_AGGREGATE_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        aggregateReportData: action.data,
      };

    case GET_AGGREGATE_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_ALL_SENSOR_ALERTS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_ALL_SENSOR_ALERTS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        allAlerts: action.data,
      };

    case GET_ALL_SENSOR_ALERTS_FAILURE:
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
