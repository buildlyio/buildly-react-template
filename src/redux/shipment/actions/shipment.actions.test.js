import * as actions from './shipment.actions';

// Test Get Shipment Details action
describe('Get Shipment Details action', () => {
  it('should create an action to get shipment details', () => {
    const organization_uuid = 'gweiug-3t2igf-3yfhf-329hgds73';
    const expectedAction = {
      type: actions.GET_SHIPMENTS,
      organization_uuid,
      status: null,
      fetchRelatedData: false,
      fetchSensorReports: false,
    };
    expect(actions.getShipmentDetails(organization_uuid)).toEqual(expectedAction);
  });
});

// Test Add Shipment action
describe('Add Shipment action', () => {
  it('should create an action to add shipment', () => {
    const payload = { name: 'Test Shipment New' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.ADD_SHIPMENT,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addShipment(payload, history, redirectTo)).toEqual(expectedAction);
  });
});

// Test Edit Shipment action
describe('Edit Shipment action', () => {
  it('should create an action to edit shipment', () => {
    const payload = { name: 'Test Shipment New Edited' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.EDIT_SHIPMENT,
      payload,
      history,
      redirectTo,
    };
    expect(actions.editShipment(payload, history, redirectTo)).toEqual(expectedAction);
  });
});

// Test Delete Shipment action
describe('Delete Shipment action', () => {
  it('should create an action to delete shipment', () => {
    const id = 1;
    const expectedAction = { type: actions.DELETE_SHIPMENT, id };
    expect(actions.deleteShipment(id)).toEqual(expectedAction);
  });
});

// Test Get countries and related states action
describe('Get countries and related states action', () => {
  it('should create an action to get countries and related states', () => {
    const expectedAction = { type: actions.GET_COUNTRIES_STATES };
    expect(actions.getCountries()).toEqual(expectedAction);
  });
});

// Test Get currencies action
describe('Get currencies action', () => {
  it('should create an action to get currencies', () => {
    const expectedAction = { type: actions.GET_CURRENCIES };
    expect(actions.getCurrencies()).toEqual(expectedAction);
  });
});

// Test Get Shipment Template action
describe('Get Shipment Template action', () => {
  it('should create an action to get shipment template', () => {
    const organization_uuid = 'gweiug-3t2igf-3yfhf-329hgds73';
    const expectedAction = { type: actions.GET_SHIPMENT_TEMPLATES, organization_uuid };
    expect(actions.getShipmentTemplates(organization_uuid)).toEqual(expectedAction);
  });
});

// Test Add Shipment Template action
describe('Add Shipment Template action', () => {
  it('should create an action to add shipment template', () => {
    const payload = { name: 'Test template' };
    const expectedAction = { type: actions.ADD_SHIPMENT_TEMPLATE, payload };
    expect(actions.addShipmentTemplate(payload)).toEqual(expectedAction);
  });
});

// Test Edit Shipment Template action
describe('Edit Shipment Template action', () => {
  it('should create an action to edit shipment template', () => {
    const payload = { id: 1, name: 'Test template-01' };
    const expectedAction = { type: actions.EDIT_SHIPMENT_TEMPLATE, payload };
    expect(actions.editShipmentTemplate(payload)).toEqual(expectedAction);
  });
});

// Test Delete Shipment Template action
describe('Delete Shipment Template action', () => {
  it('should create an action to delete shipment template', () => {
    const id = 1;
    const expectedAction = { type: actions.DELETE_SHIPMENT_TEMPLATE, id, showMessage: true };
    expect(actions.deleteShipmentTemplate(id)).toEqual(expectedAction);
  });
});
