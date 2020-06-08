import * as actions from "../actions/custodian.actions";
import * as reducer from "./custodian.reducer";
const initialState = {
  loading: false,
  loaded: false,
  data: null,
  error: null,
};

describe("Get custodian reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_CUSTODIANS })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      data: null,
    });
  });
  it("get custodian success Reducer", () => {
    expect(
      reducer.default([], { type: actions.GET_CUSTODIANS_SUCCESS })
    ).toEqual({
      loaded: true,
      loading: false,
      data: undefined,
    });
  });
  it("get custodian fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_CUSTODIANS_FAILURE })
    ).toEqual({ error: undefined, loaded: true, loading: false, data: null });
  });
});

describe("Add Custodian reducer", () => {
  it("Empty reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_CUSTODIANS })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      data: null,
    });
  });

  it("Add Custodian success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_CUSTODIANS_SUCCESS })
    ).toEqual({ error: null, loaded: true, loading: false, data: undefined });
  });
  it("Add custodain fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_CUSTODIANS_FAILURE })
    ).toEqual({ error: undefined, loaded: true, loading: false, data: null });
  });
});

describe("Edit Custodian reducer", () => {
  it("Empty reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_CUSTODIANS })
    ).toEqual({ error: null, loaded: false, loading: true, data: null });
  });

  it("Edit Custodian success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_CUSTODIANS_SUCCESS })
    ).toEqual({ error: null, loaded: true, loading: false, data: undefined });
  });
  it("Edit Custodianr fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_CUSTODIANS_FAILURE })
    ).toEqual({ error: undefined, loaded: true, loading: false, data: null });
  });
});

describe("Delete Custodian reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_CUSTODIANS })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      data: null,
    });
  });

  it("Delete Custodian success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_CUSTODIANS_SUCCESS })
    ).toEqual({ error: null, loaded: true, loading: false, data: undefined });
  });
  it("Delete Custodian fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_CUSTODIANS_FAILURE })
    ).toEqual({ error: undefined, loaded: true, loading: false, data: null });
  });
});

describe("Search reducer", () => {
  it("Empty Reducer", () => {
    expect(reducer.default(initialState, { type: actions.SEARCH })).toEqual({
      error: null,
      loaded: false,
      loading: true,
      data: null,
    });
  });

  it("Search success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.SEARCH_SUCCESS })
    ).toEqual({ error: null, loaded: true, loading: false, data: undefined });
  });
});
