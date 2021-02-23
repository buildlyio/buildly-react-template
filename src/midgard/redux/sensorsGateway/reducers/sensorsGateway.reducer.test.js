import * as actions from "../actions/sensorsGateway.actions";
import * as reducer from "./sensorsGateway.reducer";
const initialState = {
  loading: false,
  loaded: false,
  error: null,
  gatewayTypeList: [],
  gatewayData: null,
  sensorData: null,
  sensorTypeList: null,
};

const mockData = {
  data: { id: "" },
};

describe("Get Gateway reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_GATEWAYS })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });
  it("get Gateway success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_GATEWAYS_SUCCESS })
    ).toEqual({
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: undefined,
      error: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });
  it("get Gateway fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_GATEWAYS_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });
});

describe("Add Gateway reducer", () => {
  it("Empty reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_GATEWAY })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });

  it("Add Gateway success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_GATEWAY_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: undefined,
      sensorData: null,
      sensorTypeList: null,
    });
  });
  it("Add Gateway fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_GATEWAY_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });
});

describe("Edit Gateway reducer", () => {
  it("Empty reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_GATEWAY })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });

  it("Edit Gateway success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_GATEWAY_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: undefined,
      sensorData: null,
      sensorTypeList: null,
    });
  });
  it("Edit Gateway fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_GATEWAY_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });
});

describe("Delete Gateway reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_GATEWAY })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });

  it("Delete Gateway success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_GATEWAY_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: undefined,
      sensorData: null,
      sensorTypeList: null,
    });
  });
  it("Delete Gateway fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_GATEWAY_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });
});

describe("Search Gateway reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GATEWAY_SEARCH })
    ).toEqual({
      error: null,
      loaded: false,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });

  it("Search success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GATEWAY_SEARCH_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      gatewaySearchedData: undefined,
      sensorData: null,
      sensorTypeList: null,
    });
  });
});

describe("Get Gateway type reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_GATEWAYS_TYPE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });

  it("Get Gateway typen success Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.GET_GATEWAYS_TYPE_SUCCESS,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: undefined,
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });
  it("Get Gateway type fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.GET_GATEWAYS_TYPE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });
});

describe("Get Sensor reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_SENSORS })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });
  it("get Sensors success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_SENSORS_SUCCESS })
    ).toEqual({
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      error: null,
      sensorData: undefined,
      sensorTypeList: null,
    });
  });
  it("get Sensor fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_SENSORS_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });
});

describe("Add Sensor reducer", () => {
  it("Empty reducer", () => {
    expect(reducer.default(initialState, { type: actions.Add_SENSOR })).toEqual(
      {
        error: null,
        loaded: false,
        loading: true,
        gatewayTypeList: [],
        gatewayData: null,
        sensorData: null,
        sensorTypeList: null,
      }
    );
  });

  it("Add Sensor success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.Add_SENSOR_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: undefined,
      sensorTypeList: null,
    });
  });
  it("Add Sensor fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.Add_SENSOR_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });
});

describe("Edit Sensor reducer", () => {
  it("Empty reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_SENSOR })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });

  it("Edit Sensor success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_SENSOR_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: undefined,
      sensorTypeList: null,
    });
  });
  it("Edit Sensor fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_SENSOR_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });
});

describe("Delete Sensor reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_SENSOR })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });

  it("Delete Sensor success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_SENSOR_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: undefined,
      sensorTypeList: null,
    });
  });
  it("Delete Gateway fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_SENSOR_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });
});

describe("Search Sensor reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.SENSOR_SEARCH })
    ).toEqual({
      error: null,
      loaded: false,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });

  it("Search sensor success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.SENSOR_SEARCH_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorSearchedData: undefined,
      sensorData: null,
      sensorTypeList: null,
    });
  });
});

describe("Get Sensor type reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_SENSORS_TYPE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });

  it("Get Sensor typen success Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.GET_SENSORS_TYPE_SUCCESS,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: undefined,
    });
  });
  it("Get Sensor type fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.GET_SENSORS_TYPE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });
});

describe("Add Gateway type reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_GATEWAYS_TYPE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });

  it("Add Gateway type success Reducer", () => {
    const gatewayType = { name: "test type" };
    expect(
      reducer.default(initialState, {
        type: actions.ADD_GATEWAYS_TYPE_SUCCESS,
        gatewayType,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: [gatewayType],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });

  it("Add Gateway type fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.ADD_GATEWAYS_TYPE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });
});

describe("Edit Gateway type reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_GATEWAYS_TYPE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });

  it("Edit Gateway type success Reducer", () => {
    const state = { ...initialState, gatewayTypeList: [{ id: 1, name: "test type" }]};
    const gatewayType = { id: 1, name: "test type - edited" };
    expect(
      reducer.default(state, {
        type: actions.EDIT_GATEWAYS_TYPE_SUCCESS,
        gatewayType,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: [gatewayType],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });

  it("Edit Gateway type fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.EDIT_GATEWAYS_TYPE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });
});

describe("Delete Gateway type reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_GATEWAYS_TYPE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });

  it("Delete Gateway type success Reducer", () => {
    const state = { ...initialState, gatewayTypeList: [{ id: 1, name: "test type" }]};
    const gatewayType = { id: 1 };
    expect(
      reducer.default(state, {
        type: actions.DELETE_GATEWAYS_TYPE_SUCCESS,
        gatewayType,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });

  it("Delete Gateway type fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.DELETE_GATEWAYS_TYPE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: null,
    });
  });
});