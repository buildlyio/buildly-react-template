import * as actions from '../actions/items.actions';
import * as reducer from './items.reducer';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
  itemData: [],
  itemTypeList: [],
  products: [],
  productType: [],
  unitOfMeasure: [],
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
      { type: actions.GET_ITEMS_SUCCESS, data: [] },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      itemData: [],
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
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      initialState,
      { type: actions.ADD_ITEMS_SUCCESS, item: data },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      itemData: [data],
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
    const data = { id: 1, name: 'Test data' };
    const editedData = { id: 1, name: 'Test data edited' };
    expect(reducer.default(
      { ...initialState, itemData: [data] },
      { type: actions.EDIT_ITEMS_SUCCESS, item: editedData },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      itemData: [editedData],
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
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      { ...initialState, itemData: [data] },
      { type: actions.DELETE_ITEMS_SUCCESS, id: data.id },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      itemData: [],
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
      { type: actions.GET_ITEMS_TYPE_SUCCESS, data: [] },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      itemTypeList: [],
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
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      initialState,
      { type: actions.ADD_ITEMS_TYPE_SUCCESS, itemType: data },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      itemTypeList: [data],
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
    const data = { id: 1, name: 'Test data' };
    const editedData = { id: 1, name: 'Test data edited' };
    expect(reducer.default(
      {
        ...initialState,
        itemTypeList: [data],
      },
      { type: actions.EDIT_ITEMS_TYPE_SUCCESS, itemType: editedData },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      itemTypeList: [editedData],
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
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      { ...initialState, itemTypeList: [data] },
      { type: actions.DELETE_ITEMS_TYPE_SUCCESS, id: data.id },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      itemTypeList: [],
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
      { type: actions.GET_PRODUCTS_SUCCESS, data: [] },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      products: [],
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
    const data = { id: 1, name: 'Test data' };
    const editedData = { id: 1, name: 'Test data edited' };
    expect(reducer.default(
      initialState,
      { type: actions.ADD_PRODUCTS_SUCCESS, product: data },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      products: [data],
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
    const data = { id: 1, name: 'Test data' };
    const editedData = { id: 1, name: 'Test data edited' };
    expect(reducer.default(
      {
        ...initialState,
        products: [data],
      },
      { type: actions.EDIT_PRODUCTS_SUCCESS, product: editedData },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      products: [editedData],
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
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      { ...initialState, products: [data] },
      { type: actions.DELETE_PRODUCTS_SUCCESS, id: data.id },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      products: [],
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
      { type: actions.GET_PRODUCTS_TYPE_SUCCESS, data: [] },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      productType: [],
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
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      initialState,
      { type: actions.ADD_PRODUCTS_TYPE_SUCCESS, productType: data },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      productType: [data],
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
    const data = { id: 1, name: 'Test data' };
    const editedData = { id: 1, name: 'Test data edited' };
    expect(reducer.default(
      {
        ...initialState,
        productType: [data],
      },
      { type: actions.EDIT_PRODUCTS_TYPE_SUCCESS, productType: editedData },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      productType: [editedData],
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
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      { ...initialState, productType: [data] },
      { type: actions.DELETE_PRODUCTS_TYPE_SUCCESS, id: data.id },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      productType: [],
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

describe('Get Unit of Measure reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_UNIT_OF_MEASURE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Get Unit of Measure success Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_UNIT_OF_MEASURE_SUCCESS, data: [] },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      unitOfMeasure: [],
    });
  });

  it('Get Unit of Measure fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.GET_UNIT_OF_MEASURE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Add Unit of Measure reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_UNIT_OF_MEASURE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Add Unit of Measure success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    const editedData = { id: 1, name: 'Test data edited' };
    expect(reducer.default(
      initialState,
      { type: actions.ADD_UNIT_OF_MEASURE_SUCCESS, unitOfMeasure: data },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      unitOfMeasure: [data],
    });
  });

  it('Add Unit of Measure fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.ADD_UNIT_OF_MEASURE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Edit Unit of Measure reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_UNIT_OF_MEASURE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Edit Unit of Measure success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    const editedData = { id: 1, name: 'Test data edited' };
    expect(reducer.default(
      {
        ...initialState,
        unitOfMeasure: [data],
      },
      { type: actions.EDIT_UNIT_OF_MEASURE_SUCCESS, unitOfMeasure: editedData },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      unitOfMeasure: [editedData],
    });
  });

  it('Edit Unit of Measure fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.EDIT_UNIT_OF_MEASURE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Delete Unit of Measure reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_UNIT_OF_MEASURE },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Delete Unit of Measure success Reducer', () => {
    const data = { id: 1, name: 'Test data' };
    expect(reducer.default(
      { ...initialState, unitOfMeasure: [data] },
      { type: actions.DELETE_UNIT_OF_MEASURE_SUCCESS, id: data.id },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      unitOfMeasure: [],
    });
  });

  it('Delete Unit of Measure fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.DELETE_UNIT_OF_MEASURE_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});

describe('Create Default Unit of Measure reducer', () => {
  it('Empty Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_DEFAULT_UNITS },
    )).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('Create Default Unit of Measure success Reducer', () => {
    const data = [{ id: 1, name: 'Test data' }];
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_DEFAULT_UNITS_SUCCESS, units: data },
    )).toEqual({
      ...initialState,
      loaded: true,
      loading: false,
      unitOfMeasure: data,
    });
  });

  it('Create Default Unit of Measure fail Reducer', () => {
    expect(reducer.default(
      initialState,
      { type: actions.CREATE_DEFAULT_UNITS_FAILURE },
    )).toEqual({
      ...initialState,
      error: undefined,
      loaded: true,
      loading: false,
    });
  });
});
