import * as actions from '../actions/items.actions';
import * as reducer from './items.reducer';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  itemData: null,
  itemTypeList: null,
  products: null,
  productType: null,
  unitsOfMeasure: null,
};

describe('Get Item reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ITEMS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('get Item success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ITEMS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      itemData: undefined,
    });
  });

  it('get Item fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ITEMS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add Item reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_ITEMS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Add Item success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_ITEMS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      itemData: undefined,
    });
  });

  it('Add Item fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_ITEMS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Edit Item reducer', () => {
  it('Empty reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_ITEMS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Edit Custodian success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_ITEMS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      itemData: undefined,
    });
  });

  it('Edit Item fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_ITEMS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete Item reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_ITEMS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Delete Item success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_ITEMS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      itemData: undefined,
    });
  });

  it('Delete Item fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_ITEMS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get Item type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ITEMS_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get Item type success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ITEMS_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      itemTypeList: undefined,
    });
  });

  it('Get Item type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_ITEMS_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add Item type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_ITEMS_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Add Item type success Reducer', () => {
    expect(reducer.default(
      {
        ...initialState,
        itemTypeList: [],
      },
      { type: actions.ADD_ITEMS_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      itemTypeList: [undefined],
    });
  });

  it('Add Item type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_ITEMS_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Edit Item type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_ITEMS_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Edit Item type success Reducer', () => {
    expect(reducer.default(
      {
        ...initialState,
        itemTypeList: [],
      },
      { type: actions.EDIT_ITEMS_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      itemTypeList: [],
    });
  });

  it('Edit Item type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_ITEMS_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete Item type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_ITEMS_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Delete Item type success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_ITEMS_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      itemTypeList: undefined,
    });
  });

  it('Delete Item type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_ITEMS_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get Products reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_PRODUCTS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get Products success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_PRODUCTS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      products: undefined,
    });
  });

  it('Get Products fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_PRODUCTS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add Products reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_PRODUCTS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Add Products success Reducer', () => {
    expect(reducer.default(
      {
        ...initialState,
        products: [],
      },
      { type: actions.ADD_PRODUCTS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      products: [undefined],
    });
  });

  it('Add Products fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_PRODUCTS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Edit Products reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_PRODUCTS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Edit Products success Reducer', () => {
    expect(reducer.default(
      {
        ...initialState,
        products: [],
      },
      { type: actions.EDIT_PRODUCTS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      products: [],
    });
  });

  it('Edit Products fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_PRODUCTS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete Products reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_PRODUCTS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Delete Products success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_PRODUCTS_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      products: undefined,
    });
  });

  it('Delete Products fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_PRODUCTS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get Product type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_PRODUCTS_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get Product type success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_PRODUCTS_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      productType: undefined,
    });
  });

  it('Get Product type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_PRODUCTS_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add Product type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_PRODUCTS_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Add Product type success Reducer', () => {
    expect(reducer.default(
      {
        ...initialState,
        productType: [],
      },
      { type: actions.ADD_PRODUCTS_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      productType: [undefined],
    });
  });

  it('Add Product type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_PRODUCTS_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Edit Product type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_PRODUCTS_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Edit Product type success Reducer', () => {
    expect(reducer.default(
      {
        ...initialState,
        productType: [],
      },
      { type: actions.EDIT_PRODUCTS_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      productType: [],
    });
  });

  it('Edit Product type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_PRODUCTS_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete Product type reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_PRODUCTS_TYPE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Delete Products type success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_PRODUCTS_TYPE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      productType: undefined,
    });
  });

  it('Delete Product type fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_PRODUCTS_TYPE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Get Units of Measure reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_UNITS_OF_MEASURE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get Units of Measure success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_UNITS_OF_MEASURE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      unitsOfMeasure: undefined,
    });
  });

  it('Get Units of Measure fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_UNITS_OF_MEASURE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add Units of Measure reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_UNITS_OF_MEASURE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Add Units of Measure success Reducer', () => {
    expect(reducer.default(
      {
        ...initialState,
        unitsOfMeasure: [],
      },
      { type: actions.ADD_UNITS_OF_MEASURE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      unitsOfMeasure: [undefined],
    });
  });

  it('Add Units of Measure fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_UNITS_OF_MEASURE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Edit Units of Measure reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_UNITS_OF_MEASURE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Edit Units of Measure success Reducer', () => {
    expect(reducer.default(
      {
        ...initialState,
        unitsOfMeasure: [],
      },
      { type: actions.EDIT_UNITS_OF_MEASURE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      unitsOfMeasure: [],
    });
  });

  it('Edit Units of Measure fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_UNITS_OF_MEASURE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete Units of Measure reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_UNITS_OF_MEASURE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Delete Units of Measure success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_UNITS_OF_MEASURE_SUCCESS },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      unitsOfMeasure: undefined,
    });
  });

  it('Delete Units of Measure fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_UNITS_OF_MEASURE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});
