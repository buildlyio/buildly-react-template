import * as actions from '../actions/sensorsGateway.actions';
import * as reducer from './sensorsGateway.reducer';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  gatewayData: null,
  gatewayTypeList: null,
  sensorData: null,
  sensorTypeList: null,
  aggregateReportData: null,
  sensorAlerts: null,
  allAlerts: null,
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
      { type: actions.GET_GATEWAYS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      gatewayData: undefined,
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
    expect(reducer.default(
      initialState,
      { type: actions.ADD_GATEWAY_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      gatewayData: undefined,
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
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_GATEWAY_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      gatewayData: undefined,
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
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_GATEWAY_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      gatewayData: undefined,
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
      { type: actions.GET_GATEWAYS_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      gatewayTypeList: undefined,
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
    expect(reducer.default(
      {
        ...initialState,
        gatewayTypeList: [],
      },
      { type: actions.ADD_GATEWAYS_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      gatewayTypeList: [undefined],
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
    expect(reducer.default(
      {
        ...initialState,
        gatewayTypeList: [],
      },
      { type: actions.EDIT_GATEWAYS_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
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
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_GATEWAYS_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      gatewayTypeList: undefined,
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

describe('Get Sensor reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SENSORS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get Sensors success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SENSORS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      sensorData: undefined,
    });
  });

  it('get Sensor fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SENSORS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add Sensor reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_SENSOR },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Add Sensor success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_SENSOR_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      sensorData: undefined,
    });
  });

  it('Add Sensor fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_SENSOR_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Edit Sensor reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_SENSOR },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Edit Sensor success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_SENSOR_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      sensorData: undefined,
    });
  });

  it('Edit Sensor fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_SENSOR_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete Sensor reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_SENSOR },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Delete Sensor success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_SENSOR_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      sensorData: undefined,
    });
  });

  it('Delete Gateway fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_SENSOR_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get Sensor type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SENSORS_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get Sensor type success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SENSORS_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      sensorTypeList: undefined,
    });
  });

  it('Get Sensor type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SENSORS_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add Sensor type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_SENSORS_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Add Sensor type success Reducer', () => {
    expect(reducer.default(
      {
        ...initialState,
        sensorTypeList: [],
      },
      { type: actions.ADD_SENSORS_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      sensorTypeList: [undefined],
    });
  });

  it('Add Sensor type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_SENSORS_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Edit Sensor type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_SENSORS_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Edit Sensor type success Reducer', () => {
    expect(reducer.default(
      {
        ...initialState,
        sensorTypeList: [],
      },
      { type: actions.EDIT_SENSORS_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      sensorTypeList: [],
    });
  });

  it('Edit Sensor type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_SENSORS_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete Sensor type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_SENSORS_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Delete Sensor type success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_SENSORS_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      sensorTypeList: undefined,
    });
  });

  it('Delete Sensor type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_SENSORS_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get Aggregate Report reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_AGGREGATE_REPORT },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get Aggregate Report success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_AGGREGATE_REPORT_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      aggregateReportData: undefined,
    });
  });

  it('Get Aggregate Report fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_AGGREGATE_REPORT_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get Sensor Alerts reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SENSOR_ALERTS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get Sensor Alerts success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SENSOR_ALERTS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
    });
  });

  it('Get Sensor Alerts fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_SENSOR_ALERTS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});
