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
