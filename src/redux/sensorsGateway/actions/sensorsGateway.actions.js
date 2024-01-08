export const GET_ALL_SENSOR_ALERTS = 'SENSORS/GET_ALL_SENSOR_ALERTS';
export const GET_ALL_SENSOR_ALERTS_SUCCESS = 'SENSORS/GET_ALL_SENSOR_ALERTS_SUCCESS';
export const GET_ALL_SENSOR_ALERTS_FAILURE = 'SENSORS/GET_ALL_SENSOR_ALERTS_FAILURE';

export const GET_SENSOR_REPORTS = 'SENSORS/GET_SENSOR_REPORTS';
export const GET_SENSOR_REPORTS_SUCCESS = 'SENSORS/GET_SENSOR_REPORTS_SUCCESS';
export const GET_SENSOR_REPORTS_FAILURE = 'SENSORS/GET_SENSOR_REPORTS_FAILURE';

/**
 * Get All Sensor Alerts
 * @param {Array} partnerShipmentIds
 */
export const getAllSensorAlerts = (partnerShipmentIds) => ({
  type: GET_ALL_SENSOR_ALERTS,
  partnerShipmentIds,
});

/**
 * Get Sensor Reports
 * @param {Array} partnerShipmentIds
 */
export const getSensorReports = (partnerShipmentIds) => ({
  type: GET_SENSOR_REPORTS,
  partnerShipmentIds,
});
