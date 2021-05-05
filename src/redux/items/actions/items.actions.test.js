import * as actions from './items.actions';

// Test Get Items
describe('Get Items action', () => {
  it('should create an action to get items', () => {
    const organization_uuid = '224761f5-0010-4a46-d92a4fdc1d21';
    const expectedAction = {
      type: actions.GET_ITEMS,
      organization_uuid,
    };
    expect(actions.getItems(organization_uuid))
      .toEqual(expectedAction);
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
    expect(actions.addItem(payload, history))
      .toEqual(expectedAction);
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
    expect(actions.editItem(payload)).toEqual(expectedAction);
  });
});

// Test Delete Item
describe('Delete Item action', () => {
  it('should create an action to delete item', () => {
    const itemId = '123';
    const organization_uuid = '224761f5-0010-4a46-d92a4fdc1d21';
    const expectedAction = {
      type: actions.DELETE_ITEMS,
      itemId,
      organization_uuid,
    };
    expect(actions.deleteItem(itemId, organization_uuid))
      .toEqual(expectedAction);
  });
});

// Test Get Item Type
describe('Get Item Type action', () => {
  it('should create an action to get item type', () => {
    const organization_uuid = '224761f5-0010-4a46-d92a4fdc1d21';
    const expectedAction = {
      type: actions.GET_ITEMS_TYPE,
      organization_uuid,
    };
    expect(actions.getItemType(organization_uuid))
      .toEqual(expectedAction);
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
    const expectedAction = {
      type: actions.ADD_ITEMS_TYPE,
      payload,
    };
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
    const expectedAction = {
      type: actions.EDIT_ITEMS_TYPE,
      payload,
    };
    expect(actions.editItemType(payload)).toEqual(expectedAction);
  });
});

// Test Delete Item Type
describe('Delete Item Type action', () => {
  it('should create an action to delete item type', () => {
    const id = 1;
    const expectedAction = {
      type: actions.DELETE_ITEMS_TYPE,
      id,
    };
    expect(actions.deleteItemType(id)).toEqual(expectedAction);
  });
});

// Test Get Products
describe('Get Products action', () => {
  it('should create an action to get products', () => {
    const organization_uuid = '224761f5-0010-4a46-d92a4fdc1d21';
    const expectedAction = {
      type: actions.GET_PRODUCTS,
      organization_uuid,
    };
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
    const expectedAction = {
      type: actions.ADD_PRODUCTS,
      payload,
    };
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
    const expectedAction = {
      type: actions.EDIT_PRODUCTS,
      payload,
    };
    expect(actions.editProduct(payload)).toEqual(expectedAction);
  });
});

// Test Delete Product
describe('Delete Product action', () => {
  it('should create an action to delete product', () => {
    const id = 1;
    const expectedAction = {
      type: actions.DELETE_PRODUCTS,
      id,
    };
    expect(actions.deleteProduct(id)).toEqual(expectedAction);
  });
});

// Test Get Product Type
describe('Get Product Type action', () => {
  it('should create an action to get product type', () => {
    const organization_uuid = '224761f5-0010-4a46-d92a4fdc1d21';
    const expectedAction = {
      type: actions.GET_PRODUCTS_TYPE,
      organization_uuid,
    };
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
    const expectedAction = {
      type: actions.ADD_PRODUCTS_TYPE,
      payload,
    };
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
    const expectedAction = {
      type: actions.EDIT_PRODUCTS_TYPE,
      payload,
    };
    expect(actions.editProductType(payload)).toEqual(expectedAction);
  });
});

// Test Delete Product Type
describe('Delete Product Type action', () => {
  it('should create an action to delete product type', () => {
    const id = 1;
    const expectedAction = {
      type: actions.DELETE_PRODUCTS_TYPE,
      id,
    };
    expect(actions.deleteProductType(id)).toEqual(expectedAction);
  });
});

// Test Get Units of Measure
describe('Get Units of Measure action', () => {
  it('should create an action to get units of measure', () => {
    const expectedAction = {
      type: actions.GET_UNITS_OF_MEASURE,
    };
    expect(actions.getUnitsOfMeasure()).toEqual(expectedAction);
  });
});

// Test Add Units of Measure
describe('Add Units of Measure action', () => {
  it('should create an action to add units of measure', () => {
    const payload = {
      name: 'test unit',
      create_date: new Date(),
      edit_date: new Date(),
    };
    const expectedAction = {
      type: actions.ADD_UNITS_OF_MEASURE,
      payload,
    };
    expect(actions.addUnitsOfMeasure(payload)).toEqual(expectedAction);
  });
});

// Test Edit Units of Measure
describe('Edit Units of Measure action', () => {
  it('should create an action to edit units of measure', () => {
    const payload = {
      name: 'test unit - edited',
      edit_date: new Date(),
    };
    const expectedAction = {
      type: actions.EDIT_UNITS_OF_MEASURE,
      payload,
    };
    expect(actions.editUnitsOfMeasure(payload)).toEqual(expectedAction);
  });
});

// Test Delete Units of Measure
describe('Delete Units of Measure action', () => {
  it('should create an action to delete units of measure', () => {
    const id = 1;
    const expectedAction = {
      type: actions.DELETE_UNITS_OF_MEASURE,
      id,
    };
    expect(actions.deleteUnitsOfMeasure(id)).toEqual(expectedAction);
  });
});
