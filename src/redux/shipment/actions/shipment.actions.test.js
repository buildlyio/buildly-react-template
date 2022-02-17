import * as actions from './shipment.actions';

// Test Save Shipment Form Data action
describe('Save Shipment Form Data action', () => {
  it('should create an action to save shipment form data', () => {
    const formData = { name: 'Test Shipment' };
    const expectedAction = {
      type: actions.SAVE_SHIPMENT_FORM_DATA,
      formData,
    };
    expect(actions.saveShipmentFormData(formData))
      .toEqual(expectedAction);
  });
});

// Test Get Shipment Details action
describe('Get Shipment Details action', () => {
  it('should create an action to get shipment details', () => {
    const organization_uuid = 'gweiug-3t2igf-3yfhf-329hgds73';
    const id = 1;
    const expectedAction = {
      type: actions.GET_SHIPMENTS,
      organization_uuid,
      id,
      getUpdatedSensorData: false,
    };
    expect(actions.getShipmentDetails(
      organization_uuid,
      id,
    )).toEqual(expectedAction);
  });
});

// Test Add Shipment action
describe('Add Shipment action', () => {
  it('should create an action to add shipment', () => {
    const payload = { name: 'Test Shipment New' };
    const history = {};
    const redirectTo = '/test';
    const organization_uuid = 'gweiug-3t2igf-3yfhf-329hgds73';
    const expectedAction = {
      type: actions.ADD_SHIPMENT,
      payload,
      history,
      redirectTo,
      organization_uuid,
    };
    expect(actions.addShipment(
      payload,
      history,
      redirectTo,
      organization_uuid,
    )).toEqual(expectedAction);
  });
});

// Test Edit Shipment action
describe('Edit Shipment action', () => {
  it('should create an action to edit shipment', () => {
    const payload = { name: 'Test Shipment New Edited' };
    const history = {};
    const redirectTo = '/test';
    const organization_uuid = 'gweiug-3t2igf-3yfhf-329hgds73';
    const gateway = { id: 11 };
    const expectedAction = {
      type: actions.EDIT_SHIPMENT,
      payload,
      history,
      redirectTo,
      organization_uuid,
      gateway,
    };
    expect(actions.editShipment(
      payload,
      history,
      redirectTo,
      organization_uuid,
      gateway,
    )).toEqual(expectedAction);
  });
});

// Test Delete Shipment action
describe('Delete Shipment action', () => {
  it('should create an action to delete shipment', () => {
    const shipmentId = 1;
    const organization_uuid = 'gweiug-3t2igf-3yfhf-329hgds73';
    const expectedAction = {
      type: actions.DELETE_SHIPMENT,
      shipmentId,
      organization_uuid,
    };
    expect(actions.deleteShipment(shipmentId, organization_uuid))
      .toEqual(expectedAction);
  });
});

// Test Get DashBoard Items action
describe('Get DashBoard Items action', () => {
  it('should create an action to get dashboard items', () => {
    const organization_uuid = 'gweiug-3t2igf-3yfhf-329hgds73';
    const expectedAction = {
      type: actions.GET_DASHBOARD_ITEMS,
      organization_uuid,
    };
    expect(actions.getDashboardItems(organization_uuid))
      .toEqual(expectedAction);
  });
});

// Test Add PDF Identifier action
describe('Add PDF Identifier action', () => {
  it('should create an action to add PDF identifier', () => {
    const data = { file: 'test.pdf' };
    const filename = 'test';
    const identifier = 'Reciept Number';
    const payload = { identifier: { 'Reciept Number': 'test' } };
    const history = {};
    const redirectTo = '/test';
    const organization_uuid = 'gweiug-3t2igf-3yfhf-329hgds73';
    const expectedAction = {
      type: actions.ADD_PDF_IDENTIFIER,
      payload: data,
    };
    expect(actions.pdfIdentifier(
      data,
      filename,
      identifier,
      payload,
      history,
      redirectTo,
      organization_uuid,
    )).toEqual(expectedAction);
  });
});
