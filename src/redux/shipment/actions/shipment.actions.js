export const GET_SHIPMENTS = 'SHIPMENT/GET_SHIPMENTS';
export const GET_SHIPMENTS_SUCCESS = 'SHIPMENT/GET_SHIPMENTS_SUCCESS';
export const GET_SHIPMENTS_FAILURE = 'SHIPMENT/GET_SHIPMENTS_FAILURE';

/**
 * Get Shipment Details
 * @param {String} organization_uuid
 */
export const getShipmentDetails = (
  organization_uuid = null,
  status = null,
  fetchRelatedData = false,
  fetchSensorReports = false,
) => ({
  type: GET_SHIPMENTS,
  organization_uuid,
  status,
  fetchRelatedData,
  fetchSensorReports,
});
