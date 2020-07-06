import * as actions from "../actions/custodian.actions";
import * as reducer from "./custodian.reducer";
const initialState = {
  loading: false,
  loaded: false,
  custodianData: null,
  error: null,
  custodianTypeList: null,
  contactInfo: null,
};

const mockData = {
  custodianData: { id: "" },
};

describe("Get custodian reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_CUSTODIANS })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      custodianData: null,
      custodianTypeList: null,
      contactInfo: null,
    });
  });
  it("get custodian success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_CUSTODIANS_SUCCESS })
    ).toEqual({
      loaded: true,
      loading: false,
      custodianData: undefined,
      custodianTypeList: null,
      contactInfo: null,
      error: null,
    });
  });
  it("get custodian fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_CUSTODIANS_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      custodianData: null,
      custodianTypeList: null,
      contactInfo: null,
    });
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
      custodianData: null,
      custodianTypeList: null,
      contactInfo: null,
    });
  });

  it("Add Custodian success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_CUSTODIANS_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      custodianData: undefined,
      custodianTypeList: null,
      contactInfo: null,
    });
  });
  it("Add custodain fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_CUSTODIANS_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      custodianData: null,
      custodianTypeList: null,
      contactInfo: null,
    });
  });
});

describe("Edit Custodian reducer", () => {
  it("Empty reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_CUSTODIANS })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      custodianData: null,
      custodianTypeList: null,
      contactInfo: null,
    });
  });

  it("Edit Custodian success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_CUSTODIANS_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      custodianData: undefined,
      custodianTypeList: null,
      contactInfo: null,
    });
  });
  it("Edit Custodianr fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_CUSTODIANS_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      custodianData: null,
      custodianTypeList: null,
      contactInfo: null,
    });
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
      custodianData: null,
      custodianTypeList: null,
      contactInfo: null,
    });
  });

  it("Delete Custodian success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_CUSTODIANS_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      custodianData: undefined,
      custodianTypeList: null,
      contactInfo: null,
    });
  });
  it("Delete Custodian fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_CUSTODIANS_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      custodianData: null,
      custodianTypeList: null,
      contactInfo: null,
    });
  });
});

describe("Search reducer", () => {
  it("Empty Reducer", () => {
    expect(reducer.default(initialState, { type: actions.SEARCH })).toEqual({
      error: null,
      loaded: false,
      loading: false,
      custodianData: null,
      custodianTypeList: null,
      contactInfo: null,
    });
  });

  it("Search success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.SEARCH_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      custodianData: null,
      custodianTypeList: null,
      contactInfo: null,
      searchedData: undefined,
    });
  });
});

describe("Get Custodian type reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_CUSTODIAN_TYPE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      custodianData: null,
      custodianTypeList: null,
      contactInfo: null,
    });
  });

  it("Get Custodian typen success Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.GET_CUSTODIAN_TYPE_SUCCESS,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      custodianData: null,
      custodianTypeList: undefined,
      contactInfo: null,
    });
  });
  it("Get Custodian type fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.GET_CUSTODIAN_TYPE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      custodianData: null,
      custodianTypeList: null,
      contactInfo: null,
    });
  });
});

describe("Get contact info reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_CONTACT })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      custodianData: null,
      custodianTypeList: null,
      contactInfo: null,
    });
  });

  it("Get contact info success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_CONTACT_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      custodianData: null,
      custodianTypeList: null,
      contactInfo: undefined,
    });
  });
  it("Get contact info fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_CONTACT_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      custodianData: null,
      custodianTypeList: null,
      contactInfo: null,
    });
  });
});
