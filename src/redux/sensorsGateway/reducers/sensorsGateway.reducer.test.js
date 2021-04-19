import * as actions from "../actions/sensorsGateway.actions";
import * as reducer from "./sensorsGateway.reducer";
const initialState = {
  loading: false,
  loaded: false,
  error: null,
  gatewayTypeList: [],
  gatewayData: null,
  sensorData: null,
  sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
        sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
    });
  });

  it("Edit Gateway type success Reducer", () => {
    const data = { ...initialState, gatewayTypeList: [{ id: 1, name: "test type" }]};
    const gatewayType = { id: 1, name: "test type - edited" };
    expect(
      reducer.default(data, {
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
      sensorTypeList: [],
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
      sensorTypeList: [],
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
      sensorTypeList: [],
    });
  });

  it("Delete Gateway type success Reducer", () => {
    const data = { ...initialState, gatewayTypeList: [{ id: 1, name: "test type - edited" }]};
    const gatewayType = { id: 1 };
    expect(
      reducer.default(data, {
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
      sensorTypeList: [],
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
      sensorTypeList: [],
    });
  });
});

describe("Add Sensor type reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_SENSORS_TYPE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: [],
    });
  });

  it("Add Sensor type success Reducer", () => {
    const sensorType = { name: "test type" };
    expect(
      reducer.default(initialState, {
        type: actions.ADD_SENSORS_TYPE_SUCCESS,
        sensorType,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: [sensorType],
    });
  });

  it("Add Sensor type fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.ADD_SENSORS_TYPE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: [],
    });
  });
});

describe("Edit Sensor type reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_SENSORS_TYPE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: [],
    });
  });

  it("Edit Sensor type success Reducer", () => {
    const data = { ...initialState, sensorTypeList: [{ id: 1, name: "test type" }]};
    const sensorType = { id: 1, name: "test type - edited" };
    expect(
      reducer.default(data, {
        type: actions.EDIT_SENSORS_TYPE_SUCCESS,
        sensorType,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: [sensorType],
    });
  });

  it("Edit Sensor type fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.EDIT_SENSORS_TYPE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: [],
    });
  });
});

describe("Delete Sensor type reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_SENSORS_TYPE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: [],
    });
  });

  it("Delete Sensor type success Reducer", () => {
    const data = { ...initialState, sensorTypeList: [{ id: 1, name: "test type - edited" }]};
    const sensorType = { id: 1 };
    expect(
      reducer.default(data, {
        type: actions.DELETE_SENSORS_TYPE_SUCCESS,
        sensorType,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: [],
    });
  });

  it("Delete Sensor type fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.DELETE_SENSORS_TYPE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: [],
      gatewayData: null,
      sensorData: null,
      sensorTypeList: [],
    });
  });
});