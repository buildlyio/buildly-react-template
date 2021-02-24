import * as actions from "../actions/items.actions";
import * as reducer from "./items.reducer";
const initialState = {
  loading: false,
  loaded: false,
  itemData: null,
  error: null,
  itemTypeList: [],
  productType: [],
  unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
        unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
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
      unitsOfMeasure: [],
    });
  });
});

describe("Add Units of Sensor reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.ADD_UNITS_OF_MEASURE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      itemData: null,
      itemTypeList: [],
      productType: [],
      unitsOfMeasure: [],
    });
  });

  it("Add Units of Sensor success Reducer", () => {
    const unitsOfMeasure = { name: "test type" };
    expect(
      reducer.default(initialState, {
        type: actions.ADD_UNITS_OF_MEASURE_SUCCESS,
        unitsOfMeasure,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
      productType: [],
      unitsOfMeasure: [unitsOfMeasure],
    });
  });

  it("Add Units of Sensor fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.ADD_UNITS_OF_MEASURE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
      productType: [],
      unitsOfMeasure: [],
    });
  });
});

describe("Edit Units of Sensor reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.EDIT_UNITS_OF_MEASURE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      itemData: null,
      itemTypeList: [],
      productType: [],
      unitsOfMeasure: [],
    });
  });

  it("Edit Units of Sensor success Reducer", () => {
    const state = { ...initialState, unitsOfMeasure: [{ id: 1, name: "test type" }]};
    const unitsOfMeasure = { id: 1, name: "test type - edited" };
    expect(
      reducer.default(state, {
        type: actions.EDIT_UNITS_OF_MEASURE_SUCCESS,
        unitsOfMeasure,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
      productType: [],
      unitsOfMeasure: [unitsOfMeasure],
    });
  });

  it("Edit Units of Sensor fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.EDIT_UNITS_OF_MEASURE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
      productType: [],
      unitsOfMeasure: [],
    });
  });
});

describe("Delete Units of Sensor reducer", () => {
  it("Empty Reducer", () => {
    expect(
      reducer.default(initialState, { type: actions.DELETE_UNITS_OF_MEASURE })
    ).toEqual({
      error: null,
      loaded: false,
      loading: true,
      itemData: null,
      itemTypeList: [],
      productType: [],
      unitsOfMeasure: [],
    });
  });

  it("Delete Units of Sensor success Reducer", () => {
    const state = { ...initialState, unitsOfMeasure: [{ id: 1, name: "test type" }]};
    const unitsOfMeasure = { id: 1 };
    expect(
      reducer.default(state, {
        type: actions.DELETE_UNITS_OF_MEASURE_SUCCESS,
        unitsOfMeasure,
      })
    ).toEqual({
      error: null,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
      productType: [],
      unitsOfMeasure: [],
    });
  });

  it("Delete Units of Sensor fail Reducer", () => {
    expect(
      reducer.default(initialState, {
        type: actions.DELETE_UNITS_OF_MEASURE_FAILURE,
      })
    ).toEqual({
      error: undefined,
      loaded: true,
      loading: false,
      itemData: null,
      itemTypeList: [],
      productType: [],
      unitsOfMeasure: [],
    });
  });
});