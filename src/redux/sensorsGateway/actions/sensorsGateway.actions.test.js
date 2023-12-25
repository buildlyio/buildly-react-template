import * as actions from './sensorsGateway.actions';

// Test Get All Gateways
describe('Get All Gateways action', () => {
  it('should create an action to get all Gateways', () => {
    const expectedAction = { type: actions.GET_ALL_GATEWAYS };
    expect(actions.getAllGateways()).toEqual(expectedAction);
  });
});

// Test Get Gateways
describe('Get Gateways action', () => {
  it('should create an action to get Gateways', () => {
    const organization_uuid = '224761f5-0010-4a46-d92a4fdc1d21';
    const expectedAction = { type: actions.GET_GATEWAYS, organization_uuid };
    expect(actions.getGateways(organization_uuid)).toEqual(expectedAction);
  });
});

// Test Get New Gateways
describe('Get New Gateways action', () => {
  it('should create an action to get new Gateways', () => {
    const expectedAction = { type: actions.GET_NEW_GATEWAYS };
    expect(actions.getNewGateways()).toEqual(expectedAction);
  });
});

// Test Add Gateway
describe('Add Gateway action', () => {
  it('should create an action to add Gateway', () => {
    const payload = { id: 123, name: 'Abc' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.ADD_GATEWAY,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addGateway(payload, history, redirectTo)).toEqual(expectedAction);
  });
});

// Test Edit Gateway
describe('Edit Gateway action', () => {
  it('should create an action to update Gateway', () => {
    const payload = { id: 123, name: 'Abc Edited' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.EDIT_GATEWAY,
      payload,
      history,
      redirectTo,
    };
    expect(actions.editGateway(payload, history, redirectTo)).toEqual(expectedAction);
  });
});

// Test Delete Gateway
describe('Delete Gateway action', () => {
  it('should create an action to delete Gateway', () => {
    const id = '123';
    const expectedAction = { type: actions.DELETE_GATEWAY, id };
    expect(actions.deleteGateway(id)).toEqual(expectedAction);
  });
});

// Test Get Gateway Type
describe('Get Gateway Type action', () => {
  it('should create an action to get Gateway type', () => {
    const expectedAction = { type: actions.GET_GATEWAYS_TYPE };
    expect(actions.getGatewayType()).toEqual(expectedAction);
  });
});

// Test Add Gateway Type
describe('Add Gateway Type action', () => {
  it('should create an action to add Gateway type', () => {
    const payload = { name: 'test gateway type' };
    const expectedAction = { type: actions.ADD_GATEWAYS_TYPE, payload };
    expect(actions.addGatewayType(payload)).toEqual(expectedAction);
  });
});

// Test Edit Gateway Type
describe('Edit Gateway Type action', () => {
  it('should create an action to edit Gateway type', () => {
    const payload = { name: 'test gateway type - edited' };
    const expectedAction = { type: actions.EDIT_GATEWAYS_TYPE, payload };
    expect(actions.editGatewayType(payload)).toEqual(expectedAction);
  });
});

// Test Delete Gateway Type
describe('Delete Gateway Type action', () => {
  it('should create an action to delete Gateway type', () => {
    const id = 123;
    const expectedAction = {
      type: actions.DELETE_GATEWAYS_TYPE,
      id,
    };
    expect(actions.deleteGatewayType(id)).toEqual(expectedAction);
  });
});

// Test Get All Sensor Alerts
describe('Get All Sensor Alerts action', () => {
  it('should create an action to get all sensor alerts', () => {
    const partnerShipmentIds = ['1', '2', '3'];
    const expectedAction = { type: actions.GET_ALL_SENSOR_ALERTS, partnerShipmentIds };
    expect(actions.getAllSensorAlerts(partnerShipmentIds)).toEqual(expectedAction);
  });
});

// Test Get Sensor Reports
describe('Get Sensor Reports action', () => {
  it('should create an action to get sensor reports', () => {
    const partnerShipmentIds = ['1', '2', '3'];
    const expectedAction = { type: actions.GET_SENSOR_REPORTS, partnerShipmentIds };
    expect(actions.getSensorReports(partnerShipmentIds)).toEqual(expectedAction);
  });
});

// Test Configure Gateway
describe('Configure Gateway action', () => {
  it('should create an action to configure Gateway type', () => {
    const payload = { gateway: 'TIVE-J318667' };
    const expectedAction = { type: actions.CONFIGURE_GATEWAY, payload };
    expect(actions.configureGateway(payload)).toEqual(expectedAction);
  });
});
