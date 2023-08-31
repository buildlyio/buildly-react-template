import * as actions from './items.actions';

// Test Get Items
describe('Get Items action', () => {
  it('should create an action to get items', () => {
    const organization_uuid = '224761f5-0010-4a46-d92a4fdc1d21';
    const expectedAction = { type: actions.GET_ITEMS, organization_uuid };
    expect(actions.getItems(organization_uuid)).toEqual(expectedAction);
  });
});

// Test Add Item
describe('Add Item action', () => {
  it('should create an action to add item', () => {
    const payload = { id: 123, name: 'Abc' };
    const history = undefined;
    const redirectTo = undefined;
    const expectedAction = {
      type: actions.ADD_ITEMS,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addItem(payload, history, redirectTo)).toEqual(expectedAction);
  });
});

// Test Edit Item
describe('Edit Item action', () => {
  it('should create an action to edit item', () => {
    const payload = { id: 123, name: 'Abc Edited' };
    const history = undefined;
    const redirectTo = undefined;
    const expectedAction = {
      type: actions.EDIT_ITEMS,
      payload,
      history,
      redirectTo,
    };
    expect(actions.editItem(payload, history, redirectTo)).toEqual(expectedAction);
  });
});

// Test Delete Item
describe('Delete Item action', () => {
  it('should create an action to delete item', () => {
    const itemId = '123';
    const expectedAction = { type: actions.DELETE_ITEMS, itemId };
    expect(actions.deleteItem(itemId)).toEqual(expectedAction);
  });
});

// Test Get Item Type
describe('Get Item Type action', () => {
  it('should create an action to get item type', () => {
    const organization_uuid = '224761f5-0010-4a46-d92a4fdc1d21';
    const expectedAction = { type: actions.GET_ITEMS_TYPE, organization_uuid };
    expect(actions.getItemType(organization_uuid)).toEqual(expectedAction);
  });
});

// Test Add Item Type
describe('Add Item Type action', () => {
  it('should create an action to add item type', () => {
    const payload = {
      name: 'test type',
      create_date: new Date(),
      edit_date: new Date(),
    };
    const expectedAction = { type: actions.ADD_ITEMS_TYPE, payload };
    expect(actions.addItemType(payload)).toEqual(expectedAction);
  });
});

// Test Edit Item Type
describe('Edit Item Type action', () => {
  it('should create an action to edit item type', () => {
    const payload = {
      name: 'test type - edited',
      edit_date: new Date(),
    };
    const expectedAction = { type: actions.EDIT_ITEMS_TYPE, payload };
    expect(actions.editItemType(payload)).toEqual(expectedAction);
  });
});

// Test Delete Item Type
describe('Delete Item Type action', () => {
  it('should create an action to delete item type', () => {
    const id = 1;
    const expectedAction = { type: actions.DELETE_ITEMS_TYPE, id };
    expect(actions.deleteItemType(id)).toEqual(expectedAction);
  });
});

// Test Get Products
describe('Get Products action', () => {
  it('should create an action to get products', () => {
    const organization_uuid = '224761f5-0010-4a46-d92a4fdc1d21';
    const expectedAction = { type: actions.GET_PRODUCTS, organization_uuid };
    expect(actions.getProducts(organization_uuid))
      .toEqual(expectedAction);
  });
});

// Test Add Product
describe('Add Product action', () => {
  it('should create an action to add product', () => {
    const payload = {
      name: 'test product',
      create_date: new Date(),
      edit_date: new Date(),
    };
    const expectedAction = { type: actions.ADD_PRODUCTS, payload };
    expect(actions.addProduct(payload)).toEqual(expectedAction);
  });
});

// Test Edit Product
describe('Edit Product action', () => {
  it('should create an action to edit product', () => {
    const payload = {
      name: 'test product - edited',
      edit_date: new Date(),
    };
    const expectedAction = { type: actions.EDIT_PRODUCTS, payload };
    expect(actions.editProduct(payload)).toEqual(expectedAction);
  });
});

// Test Delete Product
describe('Delete Product action', () => {
  it('should create an action to delete product', () => {
    const id = 1;
    const expectedAction = { type: actions.DELETE_PRODUCTS, id };
    expect(actions.deleteProduct(id)).toEqual(expectedAction);
  });
});

// Test Get Product Type
describe('Get Product Type action', () => {
  it('should create an action to get product type', () => {
    const organization_uuid = '224761f5-0010-4a46-d92a4fdc1d21';
    const expectedAction = { type: actions.GET_PRODUCTS_TYPE, organization_uuid };
    expect(actions.getProductType(organization_uuid))
      .toEqual(expectedAction);
  });
});

// Test Add Product Type
describe('Add Product Type action', () => {
  it('should create an action to add product type', () => {
    const payload = {
      name: 'test product type',
      create_date: new Date(),
      edit_date: new Date(),
    };
    const expectedAction = { type: actions.ADD_PRODUCTS_TYPE, payload };
    expect(actions.addProductType(payload)).toEqual(expectedAction);
  });
});

// Test Edit Product Type
describe('Edit Product Type action', () => {
  it('should create an action to edit product type', () => {
    const payload = {
      name: 'test product type - edited',
      edit_date: new Date(),
    };
    const expectedAction = { type: actions.EDIT_PRODUCTS_TYPE, payload };
    expect(actions.editProductType(payload)).toEqual(expectedAction);
  });
});

// Test Delete Product Type
describe('Delete Product Type action', () => {
  it('should create an action to delete product type', () => {
    const id = 1;
    const expectedAction = { type: actions.DELETE_PRODUCTS_TYPE, id };
    expect(actions.deleteProductType(id)).toEqual(expectedAction);
  });
});

// Test Get Unit of Measure
describe('Get Unit of Measure action', () => {
  it('should create an action to get unit of measure for an organization', () => {
    const organization_uuid = '58374g-ekjshfiw43-tw3iuge-3t8wyefj';
    const expectedAction = { type: actions.GET_UNIT_OF_MEASURE, organization_uuid };
    expect(actions.getUnitOfMeasure(organization_uuid)).toEqual(expectedAction);
  });
});

// Test Add Unit of Measure
describe('Add Unit of Measure action', () => {
  it('should create an action to add unit of measure', () => {
    const payload = {
      unit_of_measure: 'Pounds',
      unit_of_measure_for: 'Weight',
      organization_uuid: '35t8egn-38tyw3htj-wwesh83-dsnfiu3w',
      create_date: new Date(),
      edit_date: new Date(),
    };
    const expectedAction = { type: actions.ADD_UNIT_OF_MEASURE, payload };
    expect(actions.addUnitOfMeasure(payload)).toEqual(expectedAction);
  });
});

// Test Edit Unit of Measure
describe('Edit Unit of Measure action', () => {
  it('should create an action to edit unit of measure', () => {
    const payload = {
      id: 1,
      unit_of_measure: 'Kilograms',
    };
    const expectedAction = { type: actions.EDIT_UNIT_OF_MEASURE, payload };
    expect(actions.editUnitOfMeasure(payload)).toEqual(expectedAction);
  });
});

// Test Delete Unit of Measure
describe('Delete Unit of Measure action', () => {
  it('should create an action to delete unit of measure', () => {
    const id = 1;
    const expectedAction = { type: actions.DELETE_UNIT_OF_MEASURE, id };
    expect(actions.deleteUnitOfMeasure(id)).toEqual(expectedAction);
  });
});

// Test Create Default Unit of Measure
describe('Create Default Unit of Measure action', () => {
  it('should create an action to create default unit of measure', () => {
    const organization = '37r82-dsbfew8-37yrtwejf-eshf38';
    const expectedAction = { type: actions.CREATE_DEFAULT_UNITS, organization };
    expect(actions.createDefaultUnits(organization)).toEqual(expectedAction);
  });
});
