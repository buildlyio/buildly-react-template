import * as actions from "../actions/sensorsGateway.actions";
import * as reducer from "./sensorsGateway.reducer";
const initialState = {
  loading: false,
  loaded: false,
  error: null,
  gatewayTypeList: null,
  gatewayData: null,
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
      gatewayTypeList: null,
      gatewayData: null,
    });
  });
  it("get Gateway success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_GATEWAYS_SUCCESS })
    ).toEqual({
      loaded: true,
      loading: false,
      gatewayTypeList: null,
      gatewayData: undefined,
      error: null,
    });
  });
  it("get Gateway fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_GATEWAYS_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: null,
      gatewayData: null,
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
      gatewayTypeList: null,
      gatewayData: null,
    });
  });

  it("Add Gateway success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_GATEWAY_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: null,
      gatewayData: undefined,
    });
  });
  it("Add Gateway fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_GATEWAY_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: null,
      gatewayData: null,
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
      gatewayTypeList: null,
      gatewayData: null,
    });
  });

  it("Edit Custodian success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_GATEWAY_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: null,
      gatewayData: undefined,
    });
  });
  it("Edit Gateway fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_GATEWAY_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: null,
      gatewayData: null,
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
      gatewayTypeList: null,
      gatewayData: null,
    });
  });

  it("Delete Gateway success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_GATEWAY_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: null,
      gatewayData: undefined,
    });
  });
  it("Delete Gateway fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_GATEWAY_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      gatewayTypeList: null,
      gatewayData: null,
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
      gatewayTypeList: null,
      gatewayData: null,
    });
  });

  it("Search success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GATEWAY_SEARCH_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      gatewayTypeList: null,
      gatewayData: null,
      gatewaySearchedData: undefined,
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
      gatewayTypeList: null,
      gatewayData: null,
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
      gatewayTypeList: null,
      gatewayData: null,
    });
  });
});
