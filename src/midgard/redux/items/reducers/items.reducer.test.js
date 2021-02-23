import * as actions from "../actions/items.actions";
import * as reducer from "./items.reducer";
const initialState = {
  loading: false,
  loaded: false,
  itemData: null,
  error: null,
  itemTypeList: [],
};

const mockData = {
  itemData: { id: "" },
};

describe("Get Item reducer", () => {
  it("Empty Reducer", () => {
    expect(reducer.default(initialState, { type: actions.GET_ITEMS })).toEqual({
      error: null,
      loaded: false,
      loading: true,
      itemData: null,
      itemTypeList: [],
    });
  });
  it("get Item success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.GET_ITEMS_SUCCESS })
    ).toEqual({
      loaded: true,
      loading: false,
      itemData: undefined,
      itemTypeList: [],
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
      itemData: null,
      itemTypeList: [],
    });
  });
});

describe("Add Item reducer", () => {
  it("Empty reducer", () => {
    expect(reducer.default(initialState, { type: actions.ADD_ITEMS })).toEqual({
      error: null,
      loaded: false,
      loading: true,
      itemData: null,
      itemTypeList: [],
    });
  });

  it("Add Item success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_ITEMS_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      itemData: undefined,
      itemTypeList: [],
    });
  });
  it("Add Item fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_ITEMS_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
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
        itemData: null,
        itemTypeList: [],
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
      itemData: undefined,
      itemTypeList: [],
    });
  });
  it("Edit Item fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_ITEMS_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
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
      itemData: null,
      itemTypeList: [],
    });
  });

  it("Delete Item success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_ITEMS_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      itemData: undefined,
      itemTypeList: [],
    });
  });
  it("Delete Item fail Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_ITEMS_FAILURE })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
    });
  });
});

describe("Search reducer", () => {
  it("Empty Reducer", () => {
    expect(reducer.default(initialState, { type: actions.SEARCH })).toEqual({
      error: null,
      loaded: false,
      loading: false,
      itemData: null,
      itemTypeList: [],
    });
  });

  it("Search success Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.SEARCH_SUCCESS })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
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
      itemData: null,
      itemTypeList: [],
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
      itemData: null,
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
      itemData: null,
      itemTypeList: [],
    });
  });
});

describe("Add Item type reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_ITEMS_TYPE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      itemData: null,
      itemTypeList: [],
    });
  });

  it("Add Item type success Reducer", () => {
    const itemType = { name: "test type" };
    expect(
      reducer.default(initialState, {
        type: actions.ADD_ITEMS_TYPE_SUCCESS,
        itemType,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [itemType],
    });
  });

  it("Add Item type fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.ADD_ITEMS_TYPE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
    });
  });
});

describe("Edit Item type reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_ITEMS_TYPE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      itemData: null,
      itemTypeList: [],
    });
  });

  it("Edit Item type success Reducer", () => {
    const state = { ...initialState, itemTypeList: [{ id: 1, name: "test type" }]};
    const itemType = { id: 1, name: "test type - edited" };
    expect(
      reducer.default(state, {
        type: actions.EDIT_ITEMS_TYPE_SUCCESS,
        itemType,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [itemType],
    });
  });

  it("Edit Item type fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.EDIT_ITEMS_TYPE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
    });
  });
});

describe("Delete Item type reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_ITEMS_TYPE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      itemData: null,
      itemTypeList: [],
    });
  });

  it("Delete Item type success Reducer", () => {
    const state = { ...initialState, itemTypeList: [{ id: 1, name: "test type" }]};
    const itemType = { id: 1 };
    expect(
      reducer.default(state, {
        type: actions.DELETE_ITEMS_TYPE_SUCCESS,
        itemType,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
    });
  });

  it("Delete Item type fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.DELETE_ITEMS_TYPE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
    });
  });
});