import * as actions from "../actions/items.actions";
import * as reducer from "./items.reducer";
const initialState = {
  loading: false,
  loaded: false,
  data: null,
  error: null,
  itemTypeList: null,
};

const mockData = {
  data: { id: "" },
};

describe("Get Item reducer", () => {
  it("Empty Reducer", () => {
    expect(reducer.default(initialState, { type: actions.GET_ITEMS })).toEqual({
      error: null,
      loaded: false,
      loading: true,
      data: null,
      itemTypeList: null,
    });
  });
  it("get Item success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_ITEMS_SUCCESS })
    ).toEqual({
      loaded: true,
      loading: false,
      data: undefined,
      itemTypeList: null,
      error: null,
    });
  });
  it("get Item fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_ITEMS_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      data: null,
      itemTypeList: null,
    });
  });
});

describe("Add Item reducer", () => {
  it("Empty reducer", () => {
    expect(reducer.default(initialState, { type: actions.ADD_ITEMS })).toEqual({
      error: null,
      loaded: false,
      loading: true,
      data: null,
      itemTypeList: null,
    });
  });

  it("Add Item success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_ITEMS_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      data: undefined,
      itemTypeList: null,
    });
  });
  it("Add Item fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_ITEMS_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      data: null,
      itemTypeList: null,
    });
  });
});

describe("Edit Item reducer", () => {
  it("Empty reducer", () => {
    expect(reducer.default(initialState, { type: actions.EDIT_ITEMS })).toEqual(
      {
        error: null,
        loaded: false,
        loading: true,
        data: null,
        itemTypeList: null,
      }
    );
  });

  it("Edit Custodian success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_ITEMS_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      data: undefined,
      itemTypeList: null,
    });
  });
  it("Edit Item fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_ITEMS_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      data: null,
      itemTypeList: null,
    });
  });
});

describe("Delete Item reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_ITEMS })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      data: null,
      itemTypeList: null,
    });
  });

  it("Delete Item success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_ITEMS_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      data: undefined,
      itemTypeList: null,
    });
  });
  it("Delete Item fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_ITEMS_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      data: null,
      itemTypeList: null,
    });
  });
});

describe("Search reducer", () => {
  it("Empty Reducer", () => {
    expect(reducer.default(initialState, { type: actions.SEARCH })).toEqual({
      error: null,
      loaded: false,
      loading: false,
      data: null,
      itemTypeList: null,
    });
  });

  it("Search success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.SEARCH_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      data: null,
      itemTypeList: null,
      searchedData: undefined,
    });
  });
});

describe("Get Item type reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_ITEMS_TYPE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      data: null,
      itemTypeList: null,
    });
  });

  it("Get Item typen success Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.GET_ITEMS_TYPE_SUCCESS,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      data: null,
      itemTypeList: undefined,
    });
  });
  it("Get Item type fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.GET_ITEMS_TYPE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      data: null,
      itemTypeList: null,
    });
  });
});
