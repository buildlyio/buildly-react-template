import * as actions from "../actions/items.actions";
import * as reducer from "./items.reducer";
const initialState = {
  loading: false,
  loaded: false,
  itemData: null,
  error: null,
  itemTypeList: [],
  productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
        productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
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
      productType: [],
    });
  });
});

describe("Add Product type reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_PRODUCTS_TYPE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      itemData: null,
      itemTypeList: [],
      productType: [],
    });
  });

  it("Add Product type success Reducer", () => {
    const productType = { name: "test type" };
    expect(
      reducer.default(initialState, {
        type: actions.ADD_PRODUCTS_TYPE_SUCCESS,
        productType,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
      productType: [productType],
    });
  });

  it("Add Product type fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.ADD_PRODUCTS_TYPE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
      productType: [],
    });
  });
});

describe("Edit Product type reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_PRODUCTS_TYPE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      itemData: null,
      itemTypeList: [],
      productType: [],
    });
  });

  it("Edit Product type success Reducer", () => {
    const state = { ...initialState, productType: [{ id: 1, name: "test type" }]};
    const productType = { id: 1, name: "test type - edited" };
    expect(
      reducer.default(state, {
        type: actions.EDIT_PRODUCTS_TYPE_SUCCESS,
        productType,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
      productType: [productType],
    });
  });

  it("Edit Product type fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.EDIT_PRODUCTS_TYPE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
      productType: [],
    });
  });
});

describe("Delete Product type reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_PRODUCTS_TYPE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      itemData: null,
      itemTypeList: [],
      productType: [],
    });
  });

  it("Delete Products type success Reducer", () => {
    const state = { ...initialState, productType: [{ id: 1, name: "test type" }]};
    const productType = { id: 1 };
    expect(
      reducer.default(state, {
        type: actions.DELETE_PRODUCTS_TYPE_SUCCESS,
        productType,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
      productType: [],
    });
  });

  it("Delete Product type fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.DELETE_PRODUCTS_TYPE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
      productType: [],
    });
  });
});