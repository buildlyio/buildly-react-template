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
  GET_ALL_SENSOR_ALERTS,
  GET_ALL_SENSOR_ALERTS_SUCCESS,
  GET_ALL_SENSOR_ALERTS_FAILURE,
  GET_SENSOR_REPORTS,
  GET_SENSOR_REPORTS_SUCCESS,
  GET_SENSOR_REPORTS_FAILURE,
} from '../actions/sensorsGateway.actions';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  gatewayData: [],
  gatewayTypeList: [],
  allSensorAlerts: [],
  sensorReports: [],
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_GATEWAYS:
    case ADD_GATEWAY:
    case EDIT_GATEWAY:
    case DELETE_GATEWAY:
    case GET_GATEWAYS_TYPE:
    case ADD_GATEWAYS_TYPE:
    case EDIT_GATEWAYS_TYPE:
    case DELETE_GATEWAYS_TYPE:
    case GET_NEW_GATEWAYS:
    case GET_ALL_SENSOR_ALERTS:
    case GET_SENSOR_REPORTS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_GATEWAYS_FAILURE:
    case ADD_GATEWAY_FAILURE:
    case EDIT_GATEWAY_FAILURE:
    case DELETE_GATEWAY_FAILURE:
    case GET_GATEWAYS_TYPE_FAILURE:
    case ADD_GATEWAYS_TYPE_FAILURE:
    case EDIT_GATEWAYS_TYPE_FAILURE:
    case DELETE_GATEWAYS_TYPE_FAILURE:
    case GET_NEW_GATEWAYS_FAILURE:
    case GET_ALL_SENSOR_ALERTS_FAILURE:
    case GET_SENSOR_REPORTS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

    case GET_GATEWAYS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayData: action.data,
      };

    case ADD_GATEWAY_SUCCESS:
    case EDIT_GATEWAY_SUCCESS: {
      const found = _.find(
        state.gatewayData,
        { id: action.gateway.id },
      );
      const gatewayData = found
        ? _.map(state.gatewayData, (gateway) => (
          gateway.id === action.gateway.id
            ? action.gateway
            : gateway
        ))
        : [...state.gatewayData, action.gateway];
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayData,
      };
    }

    case DELETE_GATEWAY_SUCCESS: {
      const gatewayData = _.filter(state.gatewayData, (gateway) => gateway.id !== action.id);

      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayData,
      };
    }

    case GET_NEW_GATEWAYS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
      };

    case GET_GATEWAYS_TYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayTypeList: action.data,
      };

    case ADD_GATEWAYS_TYPE_SUCCESS:
    case EDIT_GATEWAYS_TYPE_SUCCESS: {
      const found = _.find(
        state.gatewayTypeList,
        { id: action.gatewayType.id },
      );
      const gatewayTypeList = found
        ? _.map(state.gatewayTypeList, (gatewyType) => (
          gatewyType.id === action.gatewayType.id
            ? action.gatewayType
            : gatewyType
        ))
        : [...state.gatewayTypeList, action.gatewayType];
      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayTypeList,
      };
    }

    case DELETE_GATEWAYS_TYPE_SUCCESS: {
      const gatewayTypeList = _.filter(state.gatewayTypeList, (gatewayType) => (
        gatewayType.id !== action.id
      ));

      return {
        ...state,
        loading: false,
        loaded: true,
        gatewayTypeList,
      };
    }

    case GET_ALL_SENSOR_ALERTS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        allSensorAlerts: action.alerts,
      };

    case GET_SENSOR_REPORTS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        sensorReports: action.reports,
      };

    default:
      return state;
  }
};
