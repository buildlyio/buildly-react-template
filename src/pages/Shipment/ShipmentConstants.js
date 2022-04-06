import React from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import { numberWithCommas } from '../../utils/utilMethods';
import { Typography } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import {
  saveShipmentFormData,
} from '../../redux/shipment/actions/shipment.actions';

export const MAP_TOOLTIP = 'Locations of the shipment from starting point till current time';

export const SHIPMENT_DATA_TABLE_TOOLTIP = 'Click on a shipment to view it on the map';

export const getShipmentDataTableColumns = (timezone) => ([
  {
    name: 'name',
    label: 'SHIPMENT NAME',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
    customBodyRender: (value) => (
      <Typography sx={{
        whiteSpace: 'nowrap',
      }}
      >
        {value}
      </Typography>
    ),
  },
  {
    name: 'estimated_time_of_departure',
    label: 'DEPART',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone)
            .format('MMM DD, YYYY')
          : value
      ),
    },
  },
  {
    name: 'estimated_time_of_arrival',
    label: 'ARRIVE',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone)
            .format('MMM DD, YYYY')
          : value
      ),
    },
  },
  {
    name: 'platform_name',
    label: 'SENSOR',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '' ? _.upperCase(value) : '-'
      ),
    },
  },
  {
    name: 'status',
    label: 'STATUS',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'custodian_name',
    label: 'CUSTODIAN',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'had_alert',
    label: 'Alerts?',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (value
        ? (
          <Typography sx={{
            color: '#EBC645',
          }}
          >
            YES
          </Typography>
        )
        : 'NO'),
      customHeadLabelRender: () => <WarningIcon />,
    },
  },
]);

export const getFormattedRow = (
  shipmentData,
  custodianData,
  custodyData,
  aggregateReportData,
  shipmentFormData,
  dispatch,
) => {
  let shipmentList = [];
  let custodyRows = [];

  if (
    custodyData
    && custodyData.length
    && custodianData
    && custodianData.length
  ) {
    custodyRows = getFormattedCustodyRows(custodyData, custodianData);
  }

  _.forEach(shipmentData, (shipment) => {
    const editedShipment = shipment;
    let custodyInfo = [];
    let custodianName = '';
    let aggregateReportInfo = [];
    let firstCustody = null;
    const custodyList = [];

    if (custodyRows.length > 0) {
      // From list of custodians attached to the shipment find the first custody for the shipment
      // First custody can be
      // 1. A custody whose first_custody is set to True
      // 2. The custody attached very first to the shipment
      const custodies = _.orderBy(_.filter(custodyRows,
        { shipment_id: editedShipment.shipment_uuid }), 'create_date', 'asc');
      [firstCustody] = _.filter(custodies, { first_custody: true });
      if (firstCustody === undefined) {
        firstCustody = custodies[0];
      }
      _.forEach(custodyRows, (custody) => {
        if (custody.shipment_id === shipment.shipment_uuid) {
          if (custody.custodian_data && custodyList.indexOf(custody.custodian_data.name) === -1) {
            custodyList.push(custody.custodian_data.name);
          }
          custodyInfo = [...custodyInfo, custody];
        }
      });

      custodianName = custodyList.join(',').toString();
    }
    editedShipment.custodian_name = custodianName;
    editedShipment.custody_info = custodyInfo;
    editedShipment.first_custody = firstCustody;

    if (shipmentFormData && shipmentFormData.id === editedShipment.id) {
      dispatch(saveShipmentFormData(editedShipment));
    }
    switch (_.lowerCase(shipment.status)) {
      case 'planned':
      case 'enroute':
        editedShipment.type = 'Active';
        break;

      case 'completed':
        editedShipment.type = 'Completed';
        break;

      case 'cancelled':
        editedShipment.type = 'Cancelled';
        break;

      default:
        break;
    }

    if (
      aggregateReportData
      && aggregateReportData.length > 0
    ) {
      _.forEach(aggregateReportData, (report) => {
        if (
          report.shipment_id === shipment.partner_shipment_id
          && report.report_entries.length > 0
        ) {
          aggregateReportInfo = [...aggregateReportInfo, report];
        }
      });
    }

    editedShipment.sensor_report = aggregateReportInfo;

    // if (
    //   itemData
    //   && shipment.items
    //   && shipment.items.length) {
    //   _.forEach(itemData, (item) => {
    //     let shipmentValue = 0;
    //     if (_.indexOf(shipment.items, item.url) !== -1) {
    //       shipmentValue += item.value;
    //       editedShipment.value = shipmentValue;
    //     }
    //   });
    // }

    shipmentList = [...shipmentList, editedShipment];
  });

  return _.orderBy(
    shipmentList,
    (shipment) => moment(shipment.estimated_time_of_departure)
      && moment(shipment.create_date),
    ['desc'],
  );
};

export const custodyColumns = (timezone) => ([
  {
    name: 'custodian_name',
    label: 'Custodian Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'start_of_custody',
    label: 'Start of Custody',
    options: {
      sort: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone).format('MM/DD/yyyy')
          : value
      ),
    },
  },
  {
    name: 'end_of_custody',
    label: 'End of Custody',
    options: {
      sort: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone).format('MM/DD/yyyy')
          : value
      ),
    },
  },
  {
    name: 'start_of_custody_location',
    label: 'Start Location',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'end_of_custody_location',
    label: 'End Location',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'first_custody',
    label: 'First Custody',
    options: {
      sort: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (
        value === true ? 'YES' : 'NO'
      ),
    },
  },
  {
    name: 'has_current_custody',
    label: 'Current Custody',
    options: {
      sort: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (
        value === true ? 'YES' : 'NO'
      ),
    },
  },
  {
    name: 'last_custody',
    label: 'Last Custody',
    options: {
      sort: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (
        value === true ? 'YES' : 'NO'
      ),
    },
  },
]);

export const getUniqueContactInfo = (rowItem, contactInfo) => {
  let obj = '';
  _.forEach(contactInfo, (info) => {
    if (rowItem.contact_data[0] === info.url) {
      obj = info;
    }
  });
  return obj;
};

export const getFormattedCustodyRows = (custodyData, custodianData) => {
  let customizedRows = [];
  let counter = 2;
  if (custodyData && custodianData) {
    const custodyLength = custodyData.length;
    _.forEach(custodyData, (custody) => {
      const editedCustody = custody;
      if (!custody.load_id) {
        if (custody.first_custody) {
          editedCustody.load_id = 1;
        } else if (custody.last_custody) {
          editedCustody.load_id = custodyLength;
        } else {
          editedCustody.load_id = counter;
          counter += 1;
        }
      }

      _.forEach(custodianData, (custodian) => {
        if (custody.custodian[0] === custodian.url) {
          editedCustody.custodian_name = custodian.name;
          editedCustody.custodian_data = custodian;
        }
      });

      customizedRows = [...customizedRows, editedCustody];
    });
  }

  return _.orderBy(
    customizedRows,
    ['custodian_name'],
    ['asc'],
  );
};

export const itemColumns = [
  {
    name: 'name',
    label: 'Item Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'number_of_units',
    label: '# of Units',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'item_type_value',
    label: 'Item Type',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'value',
    label: 'Value',
    options: {
      sort: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? `$${numberWithCommas(value)}`
          : value
      ),
    },
  },
  {
    name: 'gross_weight',
    label: 'Gross Weight',
    options: {
      sort: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? `${numberWithCommas(value)}`
          : value
      ),
    },
  },
  {
    name: 'unitsMeasure',
    label: 'Units of Measure',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
];

export const gatewayColumns = (timezone) => ([
  {
    name: 'name',
    label: 'Gateway Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'gateway_type_value',
    label: 'Type',
    options: {
      sort: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => _.upperCase(value),
    },
  },
  {
    name: 'last_known_battery_level',
    label: 'Battery',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'gateway_status',
    label: 'Status',
    options: {
      sort: true,
      sortThirdClickReset: true,
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
    },
  },
  {
    name: 'activation_date',
    label: 'Activation',
    options: {
      sort: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone).format('MM/DD/yyyy')
          : value
      ),
    },
  },
]);

export const sensorsColumns = (timezone) => ([
  {
    name: 'name',
    label: 'Sensor Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'sensor_type_value',
    label: 'Type',
    options: {
      sort: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => _.upperCase(value),
    },
  },
  {
    name: 'activation_date',
    label: 'Activated',
    options: {
      sort: true,
      sortThirdClickReset: true,
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
    },
  },
]);
