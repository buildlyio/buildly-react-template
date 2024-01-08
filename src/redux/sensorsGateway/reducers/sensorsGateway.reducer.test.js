import * as actions from '../actions/sensorsGateway.actions';
import * as reducer from './sensorsGateway.reducer';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  allSensorAlerts: [],
  sensorReports: [],
};

describe('Get All Sensor Alerts reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ALL_SENSOR_ALERTS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get All Sensor Alerts success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ALL_SENSOR_ALERTS_SUCCESS, alerts: [] },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      allSensorAlerts: [],
    });
  });

  it('Get All Sensor Alerts fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ALL_SENSOR_ALERTS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get Sensor Reports reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SENSOR_REPORTS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get Sensor Reports success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SENSOR_REPORTS_SUCCESS, reports: [] },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      sensorReports: [],
    });
  });

  it('Get Sensor Reports fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SENSOR_REPORTS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});
