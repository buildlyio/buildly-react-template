import * as actions from './sensorsGateway.actions';

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
