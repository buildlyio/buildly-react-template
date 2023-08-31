import * as actions from '../actions/sensorsGateway.actions';
import * as reducer from './sensorsGateway.reducer';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  gatewayData: [],
  gatewayTypeList: [],
  allSensorAlerts: [],
  sensorReports: [],
};

describe('Get Gateway reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_GATEWAYS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get Gateway success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_GATEWAYS_SUCCESS, data: [] },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      gatewayData: [],
    });
  });

  it('get Gateway fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_GATEWAYS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get New Gateways reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_NEW_GATEWAYS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get new Gateways success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_NEW_GATEWAYS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
    });
  });

  it('get new Gateways fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_NEW_GATEWAYS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add Gateway reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_GATEWAY },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Add Gateway success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      initialState,
      { type: actions.ADD_GATEWAY_SUCCESS, gateway: data },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      gatewayData: [data],
    });
  });

  it('Add Gateway fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_GATEWAY_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Edit Gateway reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_GATEWAY },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Edit Gateway success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    const editedData = { id: 1, name: 'Test data edited' };
    expect(reducer.default(
      { ...initialState, gatewayData: [data] },
      { type: actions.EDIT_GATEWAY_SUCCESS, gateway: editedData },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      gatewayData: [editedData],
    });
  });

  it('Edit Gateway fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_GATEWAY_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete Gateway reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_GATEWAY },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Delete Gateway success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      { ...initialState, gatewayData: [data] },
      { type: actions.DELETE_GATEWAY_SUCCESS, id: data.id },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      gatewayData: [],
    });
  });

  it('Delete Gateway fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_GATEWAY_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get Gateway type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_GATEWAYS_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get Gateway type success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_GATEWAYS_TYPE_SUCCESS, data: [] },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
    });
  });

  it('Get Gateway type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_GATEWAYS_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add Gateway type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_GATEWAYS_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Add Gateway type success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      initialState,
      { type: actions.ADD_GATEWAYS_TYPE_SUCCESS, gatewayType: data },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      gatewayTypeList: [data],
    });
  });

  it('Add Gateway type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_GATEWAYS_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Edit Gateway type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_GATEWAYS_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Edit Gateway type success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    const editedData = { id: 1, name: 'Test data edited' };
    expect(reducer.default(
      {
        ...initialState,
        gatewayTypeList: [data],
      },
      { type: actions.EDIT_GATEWAYS_TYPE_SUCCESS, gatewayType: editedData },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      gatewayTypeList: [editedData],
    });
  });

  it('Edit Gateway type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_GATEWAYS_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete Gateway type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_GATEWAYS_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Delete Gateway type success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      { ...initialState, gatewayTypeList: [data] },
      { type: actions.DELETE_GATEWAYS_TYPE_SUCCESS, id: data.id },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
    });
  });

  it('Delete Gateway type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_GATEWAYS_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

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
