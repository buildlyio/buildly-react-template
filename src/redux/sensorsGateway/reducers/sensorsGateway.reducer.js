import _ from 'lodash';
import {
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
  allSensorAlerts: [],
  sensorReports: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SENSOR_ALERTS:
    case GET_SENSOR_REPORTS:
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };

    case GET_ALL_SENSOR_ALERTS_FAILURE:
    case GET_SENSOR_REPORTS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error,
      };

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
