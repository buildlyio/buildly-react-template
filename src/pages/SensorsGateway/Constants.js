import moment from 'moment-timezone';
import _ from 'lodash';

export const gatewayColumns = (timezone) => ([
  {
    name: 'name',
    label: 'Gateway Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'gateway_type_value',
    label: 'Type',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => _.upperCase(value),
    },
  },
  {
    name: 'last_known_battery_level',
    label: 'Battery',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'gateway_status',
    label: 'Status',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? _.capitalize(value)
          : value
      ),
    },
  },
  {
    name: 'shipment',
    label: 'Shipments',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-' ? _.join(value, ',') : value
      ),
    },
  },
  {
    name: 'custodian',
    label: 'Custodian',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-' ? _.join(value, ',') : value
      ),
    },
  },
  {
    name: 'activation_date',
    label: 'Activation',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone).format('MM/DD/yyyy')
          : value
      ),
    },
  },
]);

export const getFormattedRow = (data, gatewayTypeList, shipmentData, custodianData) => {
  if (
    data
    && gatewayTypeList
  ) {
    let formattedData = [];
    _.forEach(data, (element) => {
      if (!element) return;
      let edited = { ...element, shipment: [], custodian: [] };
      _.forEach(gatewayTypeList, (type) => {
        if (type.url === element.gateway_type) {
          edited = {
            ...edited,
            gateway_type_value: type.name,
          };
        }
      });
      if (shipmentData && shipmentData.length) {
        _.forEach(shipmentData, (shipment) => {
          if (shipment.partner_shipment_id !== null && element.shipment_ids.length > 0
            && element.shipment_ids.includes(shipment.partner_shipment_id)
          ) {
            edited = {
              ...edited,
              shipment: [
                ...edited.shipment,
                shipment.name,
              ],
            };
          }
        });
      }
      if (custodianData && custodianData.length) {
        _.forEach(custodianData, (custodian) => {
          if (element.custodian_uuid && element.custodian_uuid === custodian.custodian_uuid) {
            edited = {
              ...edited,
              custodian: [
                ...edited.custodian,
                custodian.name,
              ],
            };
          }
        });
      }
      if (edited.shipment.length === 0) {
        edited.shipment = '-';
      }
      if (edited.custodian.length === 0) {
        edited.custodian = '-';
      }
      formattedData = [...formattedData, edited];
    });

    return _.orderBy(
      formattedData,
      (rowData) => moment(rowData.create_date),
      ['asc'],
    );
  }
  return data;
};

export const sensorsColumns = (timezone) => ([
  {
    name: 'name',
    label: 'Sensor Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'sensor_type_value',
    label: 'Type',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => _.upperCase(value),
    },
  },
  {
    name: 'activation_date',
    label: 'Activated',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone).format('MM/DD/yyyy')
          : value
      ),
    },
  },
  {
    name: 'associated_gateway',
    label: 'Associated Gateway',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
]);

export const getFormattedSensorRow = (data, sensorTypeList, gatewayData) => {
  if (data && sensorTypeList) {
    let formattedData = [];
    _.forEach(data, (element) => {
      let edited = element;
      _.forEach(sensorTypeList, (type) => {
        if (type.url === element.sensor_type) {
          edited = {
            ...edited,
            sensor_type_value: type.name,
          };
        }
      });
      if (gatewayData && gatewayData.length) {
        _.forEach(gatewayData, (gateway) => {
          if (gateway.url === element.gateway) {
            edited = {
              ...edited,
              associated_gateway: gateway.name,
            };
          }
        });
      }
      formattedData = [...formattedData, edited];
    });

    return _.orderBy(
      formattedData,
      (dataRow) => moment(dataRow.create_date),
      ['asc'],
    );
  }
  return data;
};

export const GATEWAY_STATUS = [
  { value: 'available', name: 'Available' },
  { value: 'unavailable', name: 'Unavailable' },
  { value: 'assigned', name: 'Assigned' },
  { value: 'in-transit', name: 'In-transit' },
];

export const getAvailableGateways = (
  data,
  gateway_type,
  gatewayTypeList,
  shipmentData,
  shipmentFormData,
) => {
  const gatewayData = getFormattedRow(data, gatewayTypeList, shipmentData);
  let filteredGateways = (
    _.orderBy(gatewayData, ['name'], ['asc'])
    && _.filter(gatewayData, (gateway) => gateway.gateway_status === 'available'
      && gateway.gateway_type_value.toLowerCase().includes(gateway_type))
  );

  if (shipmentFormData.custody_info && shipmentFormData.custody_info.length > 0
    && shipmentFormData.first_custody !== null) {
    const firstCustodian = shipmentFormData.first_custody.custodian_data.custodian_uuid;
    filteredGateways = _.filter(
      filteredGateways, (gateway) => gateway.custodian_uuid === firstCustodian,
    );
  }
  return filteredGateways;
};
