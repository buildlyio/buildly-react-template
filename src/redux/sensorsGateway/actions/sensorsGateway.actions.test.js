import * as actions from './sensorsGateway.actions';

// Test Get Gateways
describe('Get Gateways action', () => {
  it('should create an action to get Gateways', () => {
    const organization_uuid = '224761f5-0010-4a46-d92a4fdc1d21';
    const expectedAction = {
      type: actions.GET_GATEWAYS,
      organization_uuid,
    };
    expect(actions.getGateways(organization_uuid))
      .toEqual(expectedAction);
  });
});

// Test Get New Gateways
describe('Get New Gateways action', () => {
  it('should create an action to get new Gateways', () => {
    const expectedAction = {
      type: actions.GET_NEW_GATEWAYS,
    };
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
    expect(actions.addGateway(payload, history, redirectTo))
      .toEqual(expectedAction);
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
    expect(actions.editGateway(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Delete Gateway
describe('Delete Gateway action', () => {
  it('should create an action to delete Gateway', () => {
    const gatewayId = '123';
    const organization_uuid = '224761f5-0010-4a46-d92a4fdc1d21';
    const expectedAction = {
      type: actions.DELETE_GATEWAY,
      gatewayId,
      organization_uuid,
    };
    expect(actions.deleteGateway(gatewayId, organization_uuid))
      .toEqual(expectedAction);
  });
});

// Test Get Gateway Type
describe('Get Gateway Type action', () => {
  it('should create an action to get Gateway type', () => {
    const expectedAction = {
      type: actions.GET_GATEWAYS_TYPE,
    };
    expect(actions.getGatewayType()).toEqual(expectedAction);
  });
});

// Test Add Gateway Type
describe('Add Gateway Type action', () => {
  it('should create an action to add Gateway type', () => {
    const payload = { name: 'test gateway type' };
    const expectedAction = {
      type: actions.ADD_GATEWAYS_TYPE,
      payload,
    };
    expect(actions.addGatewayType(payload)).toEqual(expectedAction);
  });
});

// Test Edit Gateway Type
describe('Edit Gateway Type action', () => {
  it('should create an action to edit Gateway type', () => {
    const payload = { name: 'test gateway type - edited' };
    const expectedAction = {
      type: actions.EDIT_GATEWAYS_TYPE,
      payload,
    };
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

// Test Get Sensors
describe('Get Sensors action', () => {
  it('should create an action to get Sensor', () => {
    const organization_uuid = '224761f5-0010-4a46-d92a4fdc1d21';
    const expectedAction = {
      type: actions.GET_SENSORS,
      organization_uuid,
    };
    expect(actions.getSensors(organization_uuid))
      .toEqual(expectedAction);
  });
});

// Test Add Sensor
describe('Add Sensor action', () => {
  it('should create an action to add Sensor', () => {
    const payload = { id: 123, name: 'Abc' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.ADD_SENSOR,
      payload,
      history,
      redirectTo,
    };
    expect(actions.addSensor(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Edit Sensor
describe('Edit Sensor action', () => {
  it('should create an action to update Sensor', () => {
    const payload = { id: 123, name: 'Abc Edited' };
    const history = {};
    const redirectTo = '/test';
    const expectedAction = {
      type: actions.EDIT_SENSOR,
      payload,
      history,
      redirectTo,
    };
    expect(actions.editSensor(payload, history, redirectTo))
      .toEqual(expectedAction);
  });
});

// Test Delete Sensor
describe('Delete Sensor action', () => {
  it('should create an action to delete Sensor', () => {
    const sensorId = '123';
    const organization_uuid = '224761f5-0010-4a46-d92a4fdc1d21';
    const expectedAction = {
      type: actions.DELETE_SENSOR,
      sensorId,
      organization_uuid,
    };
    expect(actions.deleteSensor(sensorId, organization_uuid))
      .toEqual(expectedAction);
  });
});

// Test Get Sensor Type
describe('Get Sensor Type action', () => {
  it('should create an action to get Sensor type', () => {
    const expectedAction = {
      type: actions.GET_SENSORS_TYPE,
    };
    expect(actions.getSensorType()).toEqual(expectedAction);
  });
});

// Test Add Sensor Type
describe('Add Sensor Type action', () => {
  it('should create an action to add Sensor type', () => {
    const payload = { name: 'test sensor' };
    const expectedAction = {
      type: actions.ADD_SENSORS_TYPE,
      payload,
    };
    expect(actions.addSensorType(payload)).toEqual(expectedAction);
  });
});

// Test Edit Sensor Type
describe('Edit Sensor Type action', () => {
  it('should create an action to edit Sensor type', () => {
    const payload = { name: 'test sensor - edited' };
    const expectedAction = {
      type: actions.EDIT_SENSORS_TYPE,
      payload,
    };
    expect(actions.editSensorType(payload)).toEqual(expectedAction);
  });
});

// Test Delete Sensor Type
describe('Delete Sensor Type action', () => {
  it('should create an action to delete Sensor type', () => {
    const id = 1;
    const expectedAction = {
      type: actions.DELETE_SENSORS_TYPE,
      id,
    };
    expect(actions.deleteSensorType(id)).toEqual(expectedAction);
  });
});

// Test Get Aggregate Report
describe('Get Aggregate Report action', () => {
  it('should create an action to get aggregate report', () => {
    const partnerShipmentIds = ['1', '2', '3'];
    const expectedAction = {
      type: actions.GET_AGGREGATE_REPORT,
      partnerShipmentIds,
    };
    expect(actions.getAggregateReport(partnerShipmentIds))
      .toEqual(expectedAction);
  });
});

// Test Get Sensor Alerts
describe('Get Sensor Alerts action', () => {
  it('should create an action to get sensor alerts', () => {
    const partnerShipmentIds = ['1', '2', '3'];
    const expectedAction = {
      type: actions.GET_SENSOR_ALERTS,
      partnerShipmentIds,
      hourRange: 24,
    };
    expect(actions.getSensorAlerts(partnerShipmentIds, 24))
      .toEqual(expectedAction);
  });
});
