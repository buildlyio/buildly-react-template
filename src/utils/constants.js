/* eslint-disable no-nested-ternary */
import React from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';
import { SvgIcon, Tooltip, Typography } from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  BatteryStdOutlined as BatteryIcon,
  BoltOutlined as ShockIcon,
  DeviceThermostatOutlined as TempIcon,
  LightModeOutlined as LightIcon,
  OpacityOutlined as HumidIcon,
} from '@mui/icons-material';
import { numberWithCommas } from './utilMethods';

const showValue = (value, timezone, dateFormat, timeFormat) => (
  value && value !== '-'
    ? moment(value).tz(timezone).format(`${dateFormat} ${timeFormat}`)
    : value
);

export const TiltIcon = (color) => (
  <SvgIcon
    style={{ color }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      d="M 23.726562 22.398438 L 1.601562 0.273438 C 1.234375 -0.0898438 0.640625 -0.0898438 0.273438 0.273438 C -0.0898438 0.640625 -0.0898438 1.234375 0.273438 1.601562 L 4.078125 5.402344 L 0.269531 13.394531 L 0.265625 13.402344 C -0.230469 14.457031 -0.0117188 15.730469 0.804688 16.5625 L 7.257812 23.15625 C 7.796875 23.707031 8.53125 24 9.273438 24 C 9.660156 24 10.050781 23.917969 10.421875 23.753906 L 18.75 20.078125 L 22.398438 23.726562 C 22.582031 23.910156 22.824219 24 23.0625 24 C 23.300781 24 23.542969 23.910156 23.726562 23.726562 C 24.089844 23.359375 24.089844 22.765625 23.726562 22.398438 Z M 9.007812 10.332031 L 2.371094 13.335938 L 5.484375 6.808594 Z M 9.660156 22.039062 L 9.652344 22.042969 C 9.296875 22.203125 8.871094 22.125 8.597656 21.84375 L 2.3125 15.421875 L 10.421875 11.75 L 17.328125 18.65625 Z M 7.585938 4.003906 C 7.367188 3.535156 7.574219 2.976562 8.042969 2.757812 L 13.402344 0.265625 C 14.457031 -0.230469 15.730469 -0.0117188 16.5625 0.804688 L 23.15625 7.257812 C 23.996094 8.082031 24.234375 9.351562 23.75 10.421875 L 21.292969 15.945312 C 21.136719 16.292969 20.796875 16.5 20.4375 16.5 C 20.308594 16.5 20.179688 16.472656 20.054688 16.417969 C 19.582031 16.207031 19.371094 15.652344 19.582031 15.179688 L 22.042969 9.652344 C 22.203125 9.296875 22.125 8.871094 21.84375 8.597656 L 15.421875 2.3125 L 13.089844 7.464844 C 12.929688 7.8125 12.589844 8.015625 12.234375 8.015625 C 12.105469 8.015625 11.972656 7.988281 11.847656 7.933594 C 11.375 7.71875 11.167969 7.164062 11.378906 6.691406 L 13.34375 2.359375 L 8.832031 4.460938 C 8.363281 4.679688 7.804688 4.472656 7.585938 4.003906 Z M 7.585938 4.003906 "
    />
  </SvgIcon>
);

export const PressureIcon = (color) => (
  <SvgIcon
    style={{ color }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      d="M 12.007812 2.546875 C 5.386719 2.546875 0 7.621094 0 13.855469 C 0 16.527344 1.007812 19.117188 2.835938 21.15625 C 3.015625 21.355469 3.273438 21.472656 3.542969 21.472656 L 20.472656 21.472656 C 20.746094 21.472656 21.003906 21.355469 21.183594 21.15625 C 23.011719 19.117188 24.019531 16.527344 24.019531 13.855469 C 24.019531 7.621094 18.632812 2.546875 12.007812 2.546875 Z M 18.910156 16.0625 C 18.816406 16.015625 18.710938 15.988281 18.601562 15.988281 C 18.339844 15.988281 18.101562 16.136719 17.980469 16.375 C 17.898438 16.539062 17.886719 16.730469 17.945312 16.90625 C 18.003906 17.082031 18.128906 17.222656 18.292969 17.304688 L 20.769531 18.539062 C 20.574219 18.851562 20.363281 19.15625 20.132812 19.445312 L 20.039062 19.566406 L 3.980469 19.566406 L 3.886719 19.445312 C 3.632812 19.125 3.445312 18.855469 3.25 18.539062 L 5.726562 17.304688 C 5.890625 17.222656 6.015625 17.082031 6.074219 16.90625 C 6.132812 16.730469 6.121094 16.539062 6.039062 16.375 C 5.917969 16.136719 5.679688 15.988281 5.414062 15.988281 C 5.308594 15.988281 5.203125 16.015625 5.105469 16.0625 L 2.613281 17.304688 C 2.152344 16.210938 1.90625 15.035156 1.90625 13.855469 C 1.90625 13.421875 1.9375 12.996094 2 12.578125 L 4.40625 12.945312 C 4.441406 12.949219 4.476562 12.953125 4.511719 12.953125 C 4.851562 12.953125 5.148438 12.699219 5.199219 12.363281 C 5.253906 11.984375 4.996094 11.628906 4.617188 11.574219 L 2.3125 11.222656 C 2.804688 9.652344 3.726562 8.25 4.949219 7.136719 L 6.617188 8.851562 C 6.75 8.984375 6.925781 9.0625 7.117188 9.0625 C 7.296875 9.0625 7.46875 8.992188 7.597656 8.863281 C 7.734375 8.734375 7.808594 8.5625 7.808594 8.375 C 7.8125 8.191406 7.742188 8.015625 7.613281 7.882812 L 6.046875 6.273438 C 7.542969 5.25 9.351562 4.601562 11.316406 4.476562 L 11.316406 6.828125 C 11.316406 7.210938 11.625 7.523438 12.007812 7.523438 C 12.390625 7.523438 12.703125 7.210938 12.703125 6.828125 L 12.703125 4.476562 C 14.664062 4.601562 16.476562 5.25 17.972656 6.273438 L 16.40625 7.882812 C 16.277344 8.015625 16.207031 8.191406 16.210938 8.375 C 16.210938 8.5625 16.285156 8.734375 16.417969 8.863281 C 16.550781 8.992188 16.722656 9.0625 16.902344 9.0625 C 17.09375 9.0625 17.269531 8.988281 17.402344 8.851562 L 19.066406 7.136719 C 20.292969 8.25 21.214844 9.652344 21.707031 11.222656 L 19.402344 11.574219 C 19.023438 11.628906 18.761719 11.984375 18.820312 12.363281 C 18.871094 12.699219 19.167969 12.953125 19.503906 12.953125 C 19.539062 12.953125 19.578125 12.949219 19.609375 12.945312 L 22.019531 12.578125 C 22.078125 12.996094 22.113281 13.421875 22.113281 13.855469 C 22.113281 15.035156 21.867188 16.210938 21.402344 17.304688 Z M 18.910156 16.0625 "
    />
    <path
      d="M 12.40625 13.554688 L 10.226562 8.71875 C 10.179688 8.613281 10.0625 8.554688 9.945312 8.582031 C 9.8125 8.613281 9.734375 8.746094 9.765625 8.878906 L 11.007812 14.03125 C 10.699219 14.398438 10.589844 14.914062 10.753906 15.398438 C 11.007812 16.140625 11.816406 16.535156 12.558594 16.28125 C 13.300781 16.027344 13.695312 15.222656 13.441406 14.480469 C 13.277344 13.992188 12.871094 13.65625 12.40625 13.554688 Z M 12.40625 13.554688 "
    />
  </SvgIcon>
);

export const getColumns = (timezone, dateFormat, timeFormat) => ([
  {
    name: 'name',
    label: 'Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'create_date',
    label: 'Created At',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => showValue(value, timezone, dateFormat, timeFormat),
    },
  },
  {
    name: 'edit_date',
    label: 'Last Edited At',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => showValue(value, timezone, dateFormat, timeFormat),
    },
  },
]);

export const getProductColumns = (timezone, uomw, dateFormat, timeFormat) => ([
  {
    name: 'name',
    label: 'Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'description',
    label: 'Description',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'value',
    label: 'Value',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => _.round(_.toNumber(value), 1),
    },
  },
  {
    name: 'gross_weight',
    label: 'Gross Weight',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => _.round(_.toNumber(value), 0),
    },
  },
  {
    name: 'name',
    label: 'Unit of Measure',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: () => uomw,
    },
  },
  {
    name: 'create_date',
    label: 'Created At',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => showValue(value, timezone, dateFormat, timeFormat),
    },
  },
  {
    name: 'edit_date',
    label: 'Last Edited At',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => showValue(value, timezone, dateFormat, timeFormat),
    },
  },
]);

export const getMappingOrg = (allOrgs) => ([
  {
    name: 'name',
    label: 'Custodian Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'custody_org_uuid',
    label: 'Mapped Organization',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => {
        let returnValue = '-';
        if (value) {
          const org = _.find(allOrgs, { organization_uuid: value });
          if (org) {
            returnValue = org.name;
          }
        }
        return returnValue;
      },
    },
  },
]);

export const getConsortiumColumns = (timezone, dateFormat, timeFormat) => ([
  {
    name: 'name',
    label: 'Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'create_date',
    label: 'Created At',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone).format(`${dateFormat} ${timeFormat}`)
          : value
      ),
    },
  },
  {
    name: 'edit_date',
    label: 'Last Edited At',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone).format(`${dateFormat} ${timeFormat}`)
          : value
      ),
    },
  },
]);

export const custodianColumns = [
  {
    name: 'name',
    label: 'Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'abbrevation',
    label: 'Abbrevation',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'type',
    label: 'Custodian Type',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'location',
    label: 'Location',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'custodian_glns',
    label: 'GLN',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => value || '-',
    },
  },
];

export const getUniqueContactInfo = (rowItem, contactInfo) => {
  let obj = '';
  _.forEach(contactInfo, (info) => {
    if (_.isEqual(rowItem.contact_data[0], info.url)) {
      obj = info;
    }
  });
  return obj;
};

export const getCustodianFormattedRow = (data, contactInfo, type = []) => {
  if (data && data.length && contactInfo && contactInfo.length) {
    let customizedRow = [];
    _.forEach(data, (rowItem) => {
      const contactInfoItem = getUniqueContactInfo(rowItem, contactInfo);
      const location = `${contactInfoItem.address1
        && `${contactInfoItem.address1},`} ${contactInfoItem.address2
        && `${contactInfoItem.address2},`} ${contactInfoItem.city
        && `${contactInfoItem.city},`} ${contactInfoItem.state
        && `${contactInfoItem.state},`} ${contactInfoItem.country
        && `${contactInfoItem.country},`} ${contactInfoItem.postal_code
        && `${contactInfoItem.postal_code}`}`;
      let editedData = { ...rowItem, location };
      const custType = _.find(type, { url: rowItem.custodian_type });
      if (custType) {
        editedData = { ...editedData, type: custType.name };
      }
      customizedRow = [...customizedRow, editedData];
    });

    return _.orderBy(
      customizedRow,
      ['name'],
      ['asc'],
    );
  }
  return data;
};

export const recallColumns = [
  {
    name: 'name',
    label: 'Shipment Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'itemNo',
    label: 'Affected Items',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'custodian_name',
    label: 'Current Custodians',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
];

export const delayColumns = [
  {
    name: 'name',
    label: 'Shipment Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'delay',
    label: 'Delay(hrs)',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'itemNo',
    label: 'Items',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'risk',
    label: 'Revenue Risk',
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
    name: 'custodian',
    label: 'Current Custodians',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
];

export const getFormattedCustodyRows = (custodyData, custodianData) => {
  let customizedRows = [];
  let counter = 2;
  if (custodyData && custodianData) {
    const custodyLength = custodyData.length;
    _.forEach(custodyData, (custody) => {
      const editedCustody = { ...custody };
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
        if (_.isEqual(custody.custodian[0], custodian.url)) {
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

export const itemColumns = (currUnit) => ([
  {
    name: 'name',
    label: 'Item Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'number_of_units',
    label: '# of Units',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'item_type_value',
    label: 'Item Type',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'value',
    label: 'Value',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? `${numberWithCommas(value)} ${currUnit}`
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
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? `${numberWithCommas(value)}`
          : value
      ),
    },
  },
  {
    name: 'unitMeasure',
    label: 'Unit of Measure',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
]);

export const getItemFormattedRow = (data, itemTypeList, unitOfMeasure) => {
  if (data && itemTypeList) {
    let formattedData = [];
    const uomw = _.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'weight'))) || '';
    const uom = uomw ? uomw.unit_of_measure : '';

    _.forEach(data, (element) => {
      let editedData = element;
      _.forEach(itemTypeList, (type) => {
        if (_.isEqual(type.url, element.item_type)) {
          editedData = {
            ...editedData,
            item_type_value: type.name,
            unitMeasure: uom,
          };
        }
      });
      formattedData = [...formattedData, editedData];
    });

    return _.orderBy(
      formattedData,
      (dataRow) => moment(dataRow.create_date),
      ['asc'],
    );
  }
  return data;
};

export const SHIPMENT_OVERVIEW_COLUMNS = [
  {
    name: 'name',
    label: 'Shipment Name',
  },
  {
    name: 'status',
    label: 'Shipment Status',
  },
  {
    name: 'estimated_time_of_departure',
    label: 'Estimated Pickup Time',
  },
  {
    name: 'actual_time_of_departure',
    label: 'Actual Pickup Time',
  },
  {
    name: 'estimated_time_of_arrival',
    label: 'Estimated Arrival Time',
  },
  {
    name: 'actual_time_of_arrival',
    label: 'Actual Arrival Time',
  },
  {
    name: 'had_alert',
    label: 'Had Alerts(s)',
  },
  {
    name: 'tracker',
    label: 'Tracker',
  },
  {
    name: 'custodian_name',
    label: 'Custodian Name',
  },
  {
    name: 'custody_info',
    label: 'Custody Details (Current)',
  },
];

export const getIcon = (item) => {
  const { id, color, title } = item;
  switch (id) {
    case 'temperature':
    case 'probe':
      return (
        <Tooltip title={title || _.capitalize(id)} placement="right">
          <TempIcon style={{ fill: color }} />
        </Tooltip>
      );

    case 'light':
      return (
        <Tooltip title={title || _.capitalize(id)} placement="right">
          <LightIcon style={{ fill: color }} />
        </Tooltip>
      );

    case 'shock':
      return (
        <Tooltip title={title || _.capitalize(id)} placement="right">
          <ShockIcon style={{ fill: color }} />
        </Tooltip>
      );

    case 'tilt':
      return (
        <Tooltip title={title || _.capitalize(id)} placement="right">
          <TiltIcon fill={color} />
        </Tooltip>
      );

    case 'humidity':
      return (
        <Tooltip title={title || _.capitalize(id)} placement="right">
          <HumidIcon style={{ fill: color }} />
        </Tooltip>
      );

    case 'battery':
      return (
        <Tooltip title={title || _.capitalize(id)} placement="right">
          <BatteryIcon style={{ fill: color }} />
        </Tooltip>
      );

    case 'pressure':
      return (
        <Tooltip title={title || _.capitalize(id)} placement="right">
          <PressureIcon fill={color} />
        </Tooltip>
      );

    case 'time':
      return (
        <Tooltip title={title || _.capitalize(id)} placement="right">
          <AccessTimeIcon style={{ fill: color }} />
        </Tooltip>
      );

    default:
      return null;
  }
};

export const getShipmentOverview = (
  shipmentData,
  custodianData,
  custodyData,
  contactData,
  gatewayData,
) => {
  let shipmentList = [];
  let custodyRows = [];
  if (
    custodyData
    && custodianData
    && custodyData.length
    && custodianData.length
  ) {
    custodyRows = getFormattedCustodyRows(custodyData, custodianData);
  }

  _.forEach(shipmentData, (shipment) => {
    const editedShipment = { ...shipment };
    let custodyInfo = [];
    let custodianName = '';
    let contactInfo = [];

    if (custodyRows.length > 0) {
      _.forEach(custodyRows, (custody) => {
        const editedCustody = { ...custody };
        if (_.isEqual(custody.shipment_id, shipment.shipment_uuid) && custody.custodian_data) {
          custodianName = custodianName
            ? `${custodianName}, ${custody.custodian_data.name}`
            : custody.custodian_data.name;
          _.forEach(contactData, (contact) => {
            const editedContact = { ...contact };
            if (_.isEqual(custody.custodian_data.contact_data[0], contact.url)) {
              editedContact.name = [
                contact.first_name,
                contact.middle_name,
                contact.last_name,
              ].join(' ');
              editedContact.address = [
                contact.address1,
                contact.address2,
                contact.city,
                contact.postal_code,
                contact.state,
                contact.country,
              ].join('\n');
              contactInfo = [...contactInfo, editedContact];
            }
          });
          if (custody.has_current_custody) {
            editedCustody.custody_type = 'Current';
          } else if (custody.first_custody) {
            editedCustody.custody_type = 'First';
          } else if (custody.last_custody) {
            editedCustody.custody_type = 'Last';
          } else {
            editedCustody.custody_type = 'NA';
          }
          custodyInfo = [...custodyInfo, editedCustody];
        }
      });
    }
    editedShipment.custodian_name = custodianName;
    editedShipment.custody_info = custodyInfo;
    editedShipment.contact_info = contactInfo;

    switch (_.lowerCase(shipment.status)) {
      case 'planned':
      case 'en route':
      case 'arrived':
        editedShipment.type = 'Active';
        break;

      case 'completed':
        editedShipment.type = 'Completed';
        break;

      case 'cancelled':
        editedShipment.type = 'Cancelled';
        break;

      case 'damaged':
        editedShipment.type = 'Damaged';
        break;

      case 'battery depleted':
        editedShipment.type = 'Battery Depleted';
        break;

      default:
        break;
    }

    if (!_.isEmpty(gatewayData)) {
      const gateways = _.filter(gatewayData, (gateway) => (
        _.includes(editedShipment.gateway_imei, _.toString(gateway.imei_number))
      ));
      editedShipment.tracker = (!_.isEmpty(gateways) && _.toString(_.join(_.map(gateways, 'name'), ', '))) || 'N/A';
    }

    shipmentList = [...shipmentList, editedShipment];
  });

  return _.orderBy(
    shipmentList,
    (shipment) => moment(shipment.estimated_time_of_departure)
      && moment(shipment.create_date),
    ['desc'],
  );
};

export const processReportsAndMarkers = (
  sensorReports, alerts, timezone, unitOfMeasure, maxColor, minColor, selectedShipment,
) => {
  let sensorReportInfo = [];
  let temperatureData = [];
  let lightData = [];
  let shockData = [];
  let tiltData = [];
  let humidityData = [];
  let batteryData = [];
  let pressureData = [];
  let probeData = [];
  let minTempData = [];
  let maxTempData = [];
  let minHumidityData = [];
  let maxHumidityData = [];
  let shockThresholdData = [];
  let lightThresholdData = [];
  let markersToSet = [];
  const dateFormat = _.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'date'))).unit_of_measure;
  const timeFormat = _.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'time'))).unit_of_measure;
  const tempMeasure = _.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature'))).unit_of_measure;
  const minExcursionTempArray = _.orderBy(selectedShipment.min_excursion_temp, 'set_at');
  const maxExcursionTempArray = _.orderBy(selectedShipment.max_excursion_temp, 'set_at');
  const minExcursionHumArray = _.orderBy(selectedShipment.min_excursion_humidity, 'set_at');
  const maxExcursionHumArray = _.orderBy(selectedShipment.max_excursion_humidity, 'set_at');
  const maxShockArray = _.orderBy(selectedShipment.shock_threshold, 'set_at');
  const maxLightArray = _.orderBy(selectedShipment.light_threshold, 'set_at');

  if (!_.isEmpty(sensorReports)) {
    _.forEach(sensorReports, (report) => {
      try {
        const { report_entry } = report;
        let marker = {};
        let color = 'green';
        let allAlerts = [];
        const date = moment(report.activation_date).tz(timezone).format(dateFormat);
        const time = moment(report.activation_date).tz(timezone).format(timeFormat);
        const dateTime = moment(report.activation_date).tz(timezone).format(`${dateFormat} ${timeFormat}`);

        const temperature = _.isEqual(_.toLower(tempMeasure), 'fahrenheit')
          ? report_entry.report_temp_fah
          : report_entry.report_temp_cel
            ? _.round(report_entry.report_temp_cel, 2)
            : report_entry.report_temp_cel;
        const probe = _.isEqual(_.toLower(tempMeasure), 'fahrenheit')
          ? report_entry.report_probe_fah
          : report_entry.report_probe_cel
            ? _.round(report_entry.report_probe_cel, 2)
            : report_entry.report_probe_cel;

        // setup date for graph for boundaries
        let finalMinTempValue = minExcursionTempArray[0].value;
        let finalMaxTempValue = maxExcursionTempArray[0].value;
        let finalMinHumValue = minExcursionHumArray[0].value;
        let finalMaxHumValue = maxExcursionHumArray[0].value;
        let finalShockValue = maxShockArray[0].value;
        let finalLightValue = maxLightArray[0].value;

        if (_.size(minExcursionTempArray) > 1) {
          _.forEach(minExcursionTempArray, (data, index) => {
            if (index >= 1) {
              if (
                (_.nth(minExcursionTempArray, index - 1).set_at < moment(report.activation_date).valueOf())
                && (moment(report.activation_date).valueOf() < data.set_at)
              ) {
                finalMinTempValue = _.nth(minExcursionTempArray, index - 1).value;
              }

              if (moment(report.activation_date).valueOf() === data.set_at) {
                finalMinTempValue = data.value;
              }

              if (
                (moment(report.activation_date).valueOf() > data.set_at)
                && _.isEqual((index + 1), _.size(minExcursionTempArray))
              ) {
                finalMinTempValue = data.value;
              }
            }
          });
        }

        if (_.size(maxExcursionTempArray) > 1) {
          _.forEach(maxExcursionTempArray, (data, index) => {
            if (index >= 1) {
              if (
                (_.nth(maxExcursionTempArray, index - 1).set_at < moment(report.activation_date).valueOf())
                && (moment(report.activation_date).valueOf() < data.set_at)
              ) {
                finalMaxTempValue = _.nth(maxExcursionTempArray, index - 1).value;
              }

              if (moment(report.activation_date).valueOf() === data.set_at) {
                finalMaxTempValue = data.value;
              }

              if (
                (moment(report.activation_date).valueOf() > data.set_at)
                && _.isEqual((index + 1), _.size(maxExcursionTempArray))
              ) {
                finalMaxTempValue = data.value;
              }
            }
          });
        }

        if (_.size(minExcursionHumArray) > 1) {
          _.forEach(minExcursionHumArray, (data, index) => {
            if (index >= 1) {
              if (
                (_.nth(minExcursionHumArray, index - 1).set_at < moment(report.activation_date).valueOf())
                && (moment(report.activation_date).valueOf() < data.set_at)
              ) {
                finalMinHumValue = _.nth(minExcursionHumArray, index - 1).value;
              }

              if (moment(report.activation_date).valueOf() === data.set_at) {
                finalMinHumValue = data.value;
              }

              if (
                (moment(report.activation_date).valueOf() > data.set_at)
                && _.isEqual((index + 1), _.size(minExcursionHumArray))
              ) {
                finalMinHumValue = data.value;
              }
            }
          });
        }

        if (_.size(maxExcursionHumArray) > 1) {
          _.forEach(maxExcursionHumArray, (data, index) => {
            if (index >= 1) {
              if (
                (_.nth(maxExcursionHumArray, index - 1).set_at < moment(report.activation_date).valueOf())
                && (moment(report.activation_date).valueOf() < data.set_at)
              ) {
                finalMaxHumValue = _.nth(maxExcursionHumArray, index - 1).value;
              }

              if (moment(report.activation_date).valueOf() === data.set_at) {
                finalMaxHumValue = data.value;
              }

              if (
                (moment(report.activation_date).valueOf() > data.set_at)
                && _.isEqual((index + 1), _.size(maxExcursionHumArray))
              ) {
                finalMaxHumValue = data.value;
              }
            }
          });
        }

        if (_.size(maxShockArray) > 1) {
          _.forEach(maxShockArray, (data, index) => {
            if (index >= 1) {
              if (
                (_.nth(maxShockArray, index - 1).set_at < moment(report.activation_date).valueOf())
                && (moment(report.activation_date).valueOf() < data.set_at)
              ) {
                finalShockValue = _.nth(maxShockArray, index - 1).value;
              }

              if (moment(report.activation_date).valueOf() === data.set_at) {
                finalShockValue = data.value;
              }

              if (
                (moment(report.activation_date).valueOf() > data.set_at)
                && _.isEqual((index + 1), _.size(maxShockArray))
              ) {
                finalShockValue = data.value;
              }
            }
          });
        }

        if (_.size(maxLightArray) > 1) {
          _.forEach(maxLightArray, (data, index) => {
            if (index >= 1) {
              if (
                (_.nth(maxLightArray, index - 1).set_at < moment(report.activation_date).valueOf())
                && (moment(report.activation_date).valueOf() < data.set_at)
              ) {
                finalLightValue = _.nth(maxLightArray, index - 1).value;
              }

              if (moment(report.activation_date).valueOf() === data.set_at) {
                finalLightValue = data.value;
              }

              if (
                (moment(report.activation_date).valueOf() > data.set_at)
                && _.isEqual((index + 1), _.size(maxLightArray))
              ) {
                finalLightValue = data.value;
              }
            }
          });
        }

        const preAlerts = _.orderBy(
          _.filter(alerts, (alert) => _.lte(_.toNumber(alert.report_id), report.id)),
          'create_date',
        );
        const recoveryAlerts = _.filter(preAlerts, (pa) => !!pa.recovered_alert_id);
        const recoveredIDs = _.uniq(_.map(recoveryAlerts, 'recovered_alert_id'));
        const recoveredTypeDateTime = _.map(recoveryAlerts, (ra) => (
          { parameter_type: ra.parameter_type, create_date: ra.create_date }
        ));
        const alertsTillNow = _.filter(preAlerts, (alert) => {
          const found = _.find(recoveredTypeDateTime, (radt) => (
            _.isEqual(radt.parameter_type, alert.parameter_type)
            && !!_.gt(radt.create_date, alert.create_date)
          ));

          return !found && !alert.recovered_alert_id
            && !_.includes(recoveredIDs, _.toString(alert.id));
        });

        let uniqueAlerts = [];
        if (_.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'temperature' })) {
          uniqueAlerts = [...uniqueAlerts, _.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'temperature' })];
        }
        if (_.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'humidity' })) {
          uniqueAlerts = [...uniqueAlerts, _.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'humidity' })];
        }
        if (_.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'shock' })) {
          uniqueAlerts = [...uniqueAlerts, _.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'shock' })];
        }
        if (_.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'light' })) {
          uniqueAlerts = [...uniqueAlerts, _.find(_.orderBy(alertsTillNow, 'create_date', 'desc'), { parameter_type: 'light' })];
        }
        uniqueAlerts = _.orderBy(uniqueAlerts, 'create_date');

        const exactAlertID = _.filter(preAlerts, { report_id: _.toString(report.id) });
        _.forEach(exactAlertID, (alert) => {
          if (alert.recovered_alert_id) {
            _.remove(uniqueAlerts, { parameter_type: alert.parameter_type });
            allAlerts = [...allAlerts, { id: alert.parameter_type, color, title: `${_.capitalize(alert.parameter_type)} Excursion Recovered` }];
          }
        });

        _.forEach(uniqueAlerts, (alert) => {
          if (alert) {
            let alertColor = '';
            let title = '';
            const found = _.find(allAlerts, { id: alert.parameter_type });
            if (found) {
              _.remove(allAlerts, { id: alert.parameter_type });
            }

            switch (true) {
              case _.includes(_.toLower(alert.alert_type), 'max'):
              case _.includes(_.toLower(alert.alert_type), 'shock'):
              case _.includes(_.toLower(alert.alert_type), 'light'):
                color = maxColor;
                alertColor = maxColor;
                title = `Maximum ${_.capitalize(alert.parameter_type)} Excursion`;
                break;

              case _.includes(_.toLower(alert.alert_type), 'min'):
                if (color !== maxColor) {
                  color = minColor;
                }
                alertColor = minColor;
                title = `Minimum ${_.capitalize(alert.parameter_type)} Excursion`;
                break;

              default:
                break;
            }

            allAlerts = [...allAlerts, { id: alert.parameter_type, color: alertColor, title }];
          }
        });

        // For a valid (latitude, longitude) pair: -90<=X<=+90 and -180<=Y<=180
        if (report_entry.report_location !== null
          && report_entry.report_latitude !== null
          && report_entry.report_longitude !== null) {
          const latitude = report_entry.report_latitude
            || report_entry.report_location.latitude;
          const longitude = report_entry.report_longitude
            || report_entry.report_location.longitude;
          if (
            (latitude >= -90 && latitude <= 90)
            && (longitude >= -180 && longitude <= 180)
            && dateTime && date && time
          ) {
            marker = {
              lat: latitude,
              lng: longitude,
              location: report_entry.report_location,
              label: 'Clustered',
              temperature,
              light: report_entry.report_light,
              shock: report_entry.report_shock,
              tilt: report_entry.report_tilt,
              humidity: report_entry.report_humidity,
              battery: report_entry.report_battery,
              pressure: report_entry.report_pressure,
              probe,
              color,
              allAlerts,
              date,
              time,
              timestamp: dateTime,
            };

            markersToSet = [...markersToSet, marker];
          }
        } else {
          marker = {
            lat: '*',
            lng: '*',
            location: 'N/A',
            label: 'Clustered',
            temperature,
            light: report_entry.report_light,
            shock: report_entry.report_shock,
            tilt: report_entry.report_tilt,
            humidity: report_entry.report_humidity,
            battery: report_entry.report_battery,
            pressure: report_entry.report_pressure,
            probe,
            color,
            allAlerts,
            date,
            time,
            timestamp: dateTime,
          };
        }

        sensorReportInfo = [...sensorReportInfo, marker];
        const graphPoint = _.find(temperatureData, {
          x: dateTime,
        });

        if (!graphPoint) {
          temperatureData = [
            ...temperatureData,
            {
              x: dateTime,
              y: temperature,
            },
          ];
          lightData = [
            ...lightData,
            {
              x: dateTime,
              y: report_entry.report_light,
            },
          ];
          shockData = [
            ...shockData,
            {
              x: dateTime,
              y: report_entry.report_shock,
            },
          ];
          tiltData = [
            ...tiltData,
            {
              x: dateTime,
              y: report_entry.report_tilt,
            },
          ];
          humidityData = [
            ...humidityData,
            {
              x: dateTime,
              y: report_entry.report_humidity,
            },
          ];
          batteryData = [
            ...batteryData,
            {
              x: dateTime,
              y: report_entry.report_battery,
            },
          ];
          pressureData = [
            ...pressureData,
            {
              x: dateTime,
              y: report_entry.report_pressure,
            },
          ];
          probeData = [
            ...probeData,
            {
              x: dateTime,
              y: probe,
            },
          ];
          minTempData = [
            ...minTempData,
            {
              x: dateTime,
              y: finalMinTempValue,
            },
          ];
          maxTempData = [
            ...maxTempData,
            {
              x: dateTime,
              y: finalMaxTempValue,
            },
          ];
          minHumidityData = [
            ...minHumidityData,
            {
              x: dateTime,
              y: finalMinHumValue,
            },
          ];
          maxHumidityData = [
            ...maxHumidityData,
            {
              x: dateTime,
              y: finalMaxHumValue,
            },
          ];
          shockThresholdData = [
            ...shockThresholdData,
            {
              x: dateTime,
              y: finalShockValue,
            },
          ];
          lightThresholdData = [
            ...lightThresholdData,
            {
              x: dateTime,
              y: finalLightValue,
            },
          ];
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    });
  }

  return {
    sensorReportInfo,
    markersToSet: _.orderBy(
      markersToSet,
      (item) => moment(item.timestamp),
      ['desc'],
    ),
    graphs: {
      temperature: temperatureData,
      light: lightData,
      shock: shockData,
      tilt: tiltData,
      humidity: humidityData,
      battery: batteryData,
      pressure: pressureData,
      probe: probeData,
      minTemp: minTempData,
      maxTemp: maxTempData,
      minHumidity: minHumidityData,
      maxHumidity: maxHumidityData,
      shockThreshold: shockThresholdData,
      lightThreshold: lightThresholdData,
    },
  };
};

export const tempUnit = (uomt) => {
  let unit = '';
  if (uomt) {
    if (_.isEqual(_.toLower(uomt.unit_of_measure), 'fahrenheit')) {
      unit = '\u00b0F';
    } else if (_.isEqual(_.toLower(uomt.unit_of_measure), 'celsius')) {
      unit = '\u00b0C';
    }
  }

  return unit;
};

export const REPORT_TYPES = (unitOfMeasure) => ([
  { id: 'temperature', unit: tempUnit(_.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature')))) },
  { id: 'humidity', unit: '%' },
  { id: 'shock', unit: 'G' },
  { id: 'light', unit: 'LUX' },
  { id: 'battery', unit: '%' },
]);

export const MARKER_DATA = (unitOfMeasure) => ([
  { id: 'temperature', unit: tempUnit(_.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature')))) },
  { id: 'shock', unit: 'G' },
  { id: 'humidity', unit: '%' },
  { id: 'light', unit: 'LUX' },
]);

export const SENSOR_REPORT_COLUMNS = (unitOfMeasure, timezone, dateFormat, timeFormat) => {
  const getCellStyle = (tableMeta) => ({
    fontWeight: (
      _.some(
        _.range(3, 8), (i) => _.isEqual(tableMeta.rowData[i], null)
          || _.isEqual(tableMeta.rowData[i], undefined),
      )
        ? '700' : '400'),
    fontStyle: (
      _.some(
        _.range(3, 8), (i) => _.isEqual(tableMeta.rowData[i], null)
          || _.isEqual(tableMeta.rowData[i], undefined),
      )
        ? 'italic' : 'normal'),
  });

  return ([
    {
      name: 'allAlerts',
      label: 'Alerts',
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value) => (
          !_.isEmpty(value)
            ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {_.map(value, (item, idx) => (
                  <div key={`sensor-icon-${idx}-${item.id}`}>
                    {getIcon(item)}
                    {' '}
                  </div>
                ))}
              </div>
            ) : ''
        ),
      },
    },
    {
      name: 'timestamp',
      label: 'Date Time',
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value, tableMeta) => (
          <div style={getCellStyle(tableMeta)}>
            {value}
          </div>
        ),
      },
    },
    {
      name: 'location',
      label: 'Location',
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellProps: () => ({
          style: { maxWidth: '300px', wordWrap: 'break-word' },
          className: 'reportingSensorLeftHeader',
        }),
      },
    },
    {
      name: 'temperature',
      label: `TEMP ${tempUnit(_.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature'))))}`,
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value, tableMeta) => (
          <div style={getCellStyle(tableMeta)}>
            {(!_.isEqual(value, null) && !_.isEqual(value, undefined) ? _.round(_.toNumber(value), 2) : '')}
          </div>
        ),
      },
    },
    {
      name: 'humidity',
      label: 'HUM %',
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value, tableMeta) => (
          <div style={getCellStyle(tableMeta)}>
            {(!_.isEqual(value, null) && !_.isEqual(value, undefined) ? _.round(_.toNumber(value), 2) : '')}
          </div>
        ),
      },
    },
    {
      name: 'shock',
      label: 'SHOCK (G)',
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value, tableMeta) => (
          <div style={getCellStyle(tableMeta)}>
            {(!_.isEqual(value, null) && !_.isEqual(value, undefined) ? _.round(_.toNumber(value), 2) : '')}
          </div>
        ),
      },
    },
    {
      name: 'light',
      label: 'LIGHT (LUX)',
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value, tableMeta) => (
          <div style={getCellStyle(tableMeta)}>
            {(!_.isEqual(value, null) && !_.isEqual(value, undefined) ? _.round(_.toNumber(value), 2) : '')}
          </div>
        ),
      },
    },
    {
      name: 'battery',
      label: 'BATTERY (%)',
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value, tableMeta) => (
          <div style={getCellStyle(tableMeta)}>
            {(!_.isEqual(value, null) && !_.isEqual(value, undefined) ? _.round(_.toNumber(value), 2) : '')}
          </div>
        ),
      },
    },
    {
      name: 'tilt',
      label: 'TILT (deg)',
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        display: false,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value) => (!_.isEqual(value, null) && !_.isEqual(value, undefined) ? _.round(_.toNumber(value), 2) : ''),
      },
    },
    {
      name: 'pressure',
      label: 'PRESS (Pa)',
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        display: false,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value) => (!_.isEqual(value, null) && !_.isEqual(value, undefined) ? _.round(_.toNumber(value), 2) : ''),
      },
    },
    {
      name: 'probe',
      label: `PROBE TEMP ${tempUnit(_.find(unitOfMeasure, (unit) => (_.isEqual(_.toLower(unit.unit_of_measure_for), 'temperature'))))}`,
      options: {
        sort: true,
        sortThirdClickReset: true,
        filter: true,
        display: false,
        setCellHeaderProps: () => ({ className: 'reportingSensorLeftHeader' }),
        customBodyRender: (value) => (!_.isEqual(value, null) && !_.isEqual(value, undefined) ? _.round(_.toNumber(value), 2) : ''),
      },
    },
  ]);
};

export const getAlertsReportColumns = (sensorReport, timezone, dateFormat, timeFormat) => ([
  {
    name: 'alertObj',
    label: 'Condition',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        !_.isEmpty(value)
          ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                {getIcon(value)}
                {' '}
              </div>
            </div>
          ) : ''
      ),
    },
  },
  {
    name: 'parameter_value',
    label: 'Value',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => {
        let formattedValue = '';
        if (value && _.includes(value, ' F/') && _.includes(value, ' C')) {
          const [val1, val2] = _.split(value, ' F/');
          const [temp, unit] = _.split(val2, ' ');
          formattedValue = `${val1} F/${_.round(_.toNumber(temp), 2)} ${unit}`;
        } else if (_.includes(value, 'G') || _.includes(value, 'LUX')) {
          formattedValue = `${_.toString(_.round(_.toNumber(value.split(' ')[0]), 2))} ${value.split(' ')[1]}`;
        } else {
          formattedValue = value || '-';
        }

        return formattedValue;
      },
    },
  },
  {
    name: 'create_date',
    label: 'Date/Time stamp',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone).format(`${dateFormat} ${timeFormat}`)
          : value
      ),
    },
  },
  {
    name: 'create_date',
    label: 'Location',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => {
        let location = 'N/A';
        if (value && value !== '-') {
          const dt = moment(value).tz(timezone).format(`${dateFormat} ${timeFormat}`);
          const report = _.find(sensorReport, { timestamp: dt });
          if (report) {
            location = report.location;
          }
        }

        return location;
      },
      setCellProps: () => ({ style: { maxWidth: '300px', wordWrap: 'break-word' } }),
    },
  },
]);

export const gatewayColumns = (timezone, dateFormat) => ([
  {
    name: 'name',
    label: 'Tracker Identifier',
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
    },
  },
  {
    name: 'last_known_battery_level',
    label: 'Battery (%)',
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
        value && value !== '-' ? _.join(value, ', ') : value
      ),
      setCellProps: () => ({ style: { maxWidth: '200px', wordWrap: 'break-word' } }),
    },
  },
  {
    name: 'custodian',
    label: 'Shipper',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-' ? _.join(value, ', ') : value
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
          ? moment(value).tz(timezone).format(`${dateFormat}`)
          : value
      ),
    },
  },
]);

export const getGatewayFormattedRow = (data, gatewayTypeList, shipmentData, custodianData) => {
  if (
    data
    && gatewayTypeList
  ) {
    let formattedData = [];
    _.forEach(data, (element) => {
      if (!element) return;
      let edited = { ...element, shipment: [], custodian: [] };
      _.forEach(gatewayTypeList, (type) => {
        if (_.isEqual(type.url, element.gateway_type)) {
          edited = {
            ...edited,
            gateway_type_value: type.name,
          };
        }
      });
      if (shipmentData && shipmentData.length) {
        _.forEach(shipmentData, (shipment) => {
          if (shipment.partner_shipment_id !== null && !_.isEmpty(element.shipment_ids)
            && element.shipment_ids.includes(shipment.partner_shipment_id.toString())
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
          if (element.custodian_uuid
            && _.isEqual(element.custodian_uuid, custodian.custodian_uuid)
          ) {
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
      if (_.isEqual(edited.shipment.length, 0)) {
        edited.shipment = '-';
      }
      if (_.isEqual(edited.custodian.length, 0)) {
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

export const GATEWAY_STATUS = [
  { value: 'available', name: 'Available' },
  { value: 'unavailable', name: 'Unavailable' },
  { value: 'assigned', name: 'Assigned' },
  { value: 'in-transit', name: 'In-transit' },
];

export const shipmentColumns = (timezone, dateFormat) => ([
  {
    name: 'status',
    label: 'Status',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'estimated_time_of_departure',
    label: 'Depart',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone)
            .format(`${dateFormat}`)
          : value
      ),
    },
  },
  {
    name: 'origin',
    label: 'Origin',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'estimated_time_of_arrival',
    label: 'Arrive',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone)
            .format(`${dateFormat}`)
          : value
      ),
    },
  },
  {
    name: 'destination',
    label: 'Destination',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'alerts',
    label: 'Alerts',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        !_.isEmpty(value)
          ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {_.map(value, (item, idx) => (
                <div key={`icon-${idx}-${item.id}`}>
                  {getIcon(item)}
                  {' '}
                </div>
              ))}
            </div>
          ) : ''
      ),
    },
  },
  {
    name: 'itemNames',
    label: 'Items',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        <Typography sx={{ whiteSpace: 'break-spaces', maxWidth: '400px' }}>
          {value}
        </Typography>
      ),
    },
  },
  {
    name: 'tracker',
    label: 'Tracker',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'battery_levels',
    label: 'Tracker Battery Level (%)',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
]);

export const getShipmentFormattedRow = (
  shipmentData,
  custodianData,
  custodyData,
  itemData,
  gatewayData,
  allAlerts,
  maxColor,
  minColor,
  sensorReports,
) => {
  let shipmentList = [];
  let custodyRows = [];

  if (!_.isEmpty(custodyData) && !_.isEmpty(custodianData)) {
    custodyRows = getFormattedCustodyRows(custodyData, custodianData);
  }

  _.forEach(shipmentData, (shipment) => {
    const editedShipment = { ...shipment };
    let firstCustody = null;
    let lastCustody = null;
    let origin = null;
    let destination = null;
    let carriers = [];

    if (!_.isEmpty(custodyRows)) {
      // From list of custodians attached to the shipment find the first custody for the shipment
      // First custody can be
      // 1. A custody whose first_custody is set to True
      // 2. The custody attached very first to the shipment
      const custodies = _.orderBy(_.filter(custodyRows, { shipment_id: editedShipment.shipment_uuid }), 'create_date', 'asc');

      [firstCustody] = _.filter(custodies, { first_custody: true });
      [lastCustody] = _.filter(custodies, { last_custody: true });

      origin = firstCustody ? firstCustody.custodian_name : 'N/A';
      destination = lastCustody ? lastCustody.custodian_name : 'N/A';
      carriers = _.map(_.orderBy(_.filter(custodies, { first_custody: false, last_custody: false }), 'load_id', 'asc'), 'custodian_name');
    }
    editedShipment.origin = origin;
    editedShipment.destination = destination;
    editedShipment.carriers = carriers;

    switch (_.lowerCase(shipment.status)) {
      case 'planned':
      case 'en route':
      case 'arrived':
        editedShipment.type = 'Active';
        break;

      case 'completed':
        editedShipment.type = 'Completed';
        break;

      case 'cancelled':
        editedShipment.type = 'Cancelled';
        break;

      case 'damaged':
        editedShipment.type = 'Damaged';
        break;

      case 'battery depleted':
        editedShipment.type = 'Battery Depleted';
        break;

      default:
        break;
    }

    if (!_.isEmpty(itemData)) {
      const items = _.filter(itemData, (item) => _.includes(editedShipment.items, item.url));
      editedShipment.itemNames = _.toString(_.join(_.map(items, 'name'), ', '));
    }

    if (!_.isEmpty(gatewayData)) {
      const gateways = _.filter(gatewayData, (gateway) => (
        _.includes(editedShipment.gateway_imei, _.toString(gateway.imei_number))
      ));
      editedShipment.tracker = (!_.isEmpty(gateways) && _.toString(_.join(_.map(gateways, 'name'), ', '))) || 'N/A';
      editedShipment.battery_levels = (!_.isEmpty(gateways) && _.toString(_.join(_.map(gateways, (g) => _.toString(_.toInteger(g.last_known_battery_level))), ', '))) || 'N/A';
    }

    if (editedShipment.had_alert) {
      const filteredAlerts = _.filter(allAlerts, (alert) => (
        _.isEqual(alert.shipment_id, editedShipment.partner_shipment_id)
        && !alert.recovered_alert_id
      ));
      let processedAlerts = [];

      _.forEach(filteredAlerts, (alert) => {
        let color = '';
        let title = '';
        if (_.includes(alert.alert_type, 'max') || _.includes(alert.alert_type, 'shock') || _.includes(alert.alert_type, 'light')) {
          color = maxColor;
          title = `Maximum ${_.capitalize(alert.parameter_type)} Excursion`;
        }
        if (_.includes(alert.alert_type, 'min')) {
          color = minColor;
          title = `Minimum ${_.capitalize(alert.parameter_type)} Excursion`;
        }

        const alertObj = { id: alert.parameter_type, color, title };
        const objFound = !!(_.find(processedAlerts, alertObj));
        if (!objFound) {
          processedAlerts = [...processedAlerts, alertObj];
        }
      });
      editedShipment.alerts = processedAlerts;
    }

    if (!_.isEmpty(sensorReports)) {
      const reports = _.take(
        _.orderBy(
          _.filter(sensorReports, { shipment_id: editedShipment.partner_shipment_id }),
          [
            (obj) => moment(obj.activation_date),
          ],
          ['desc'],
        ),
        10,
      );
      editedShipment.allMarkers = _.map(reports, (report) => ({
        lat: report.report_entry.report_latitude || '*',
        lng: report.report_entry.report_longitude || '*',
        shipment: editedShipment,
      }));

      if (reports[0] && reports[0].report_entry.report_battery) {
        editedShipment.battery_levels = reports[0].report_entry.report_battery;
      }
    }

    shipmentList = [...shipmentList, editedShipment];
  });

  return _.orderBy(
    shipmentList,
    (shipment) => moment(shipment.estimated_time_of_departure)
      && moment(shipment.create_date),
    ['desc'],
  );
};

export const getTemplateFormattedRow = (templates, custodianData, itemData) => {
  let templateList = [];

  _.forEach(templates, (template) => {
    let editedTemplate = template;
    const originCustodian = _.find(custodianData, { url: template.origin_custodian });
    const destinationCustodian = _.find(custodianData, { url: template.destination_custodian });
    const templateItems = _.map(template.items, (item) => _.find(itemData, { url: item }));

    if (originCustodian) {
      editedTemplate = { ...editedTemplate, origin_name: originCustodian.name };
    }
    if (destinationCustodian) {
      editedTemplate = { ...editedTemplate, destination_name: destinationCustodian.name };
    }
    if (!_.isEmpty(templateItems)) {
      editedTemplate = { ...editedTemplate, item_name: _.toString(_.join(_.map(templateItems, 'name'), ', ')) };
    }

    templateList = [...templateList, editedTemplate];
  });

  return _.orderBy(templateList, (tmp) => moment(tmp.create_date), ['desc']);
};

export const templateColumns = (timezone, dateFormat) => ([
  {
    name: 'create_date',
    label: 'Created',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone).format(dateFormat)
          : value
      ),
    },
  },
  {
    name: 'origin_name',
    label: 'Origin',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'destination_name',
    label: 'Destination',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'item_name',
    label: 'Items',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
]);

export const getUserFormattedRows = (userData) => {
  const formattedData = _.map(userData, (ud) => ({
    ...ud,
    full_name: `${ud.first_name} ${ud.last_name}`,
    last_activity: 'Today',
    org_display_name: ud.organization.name,
  }));

  return _.orderBy(formattedData, 'id', 'desc');
};

export const userColumns = () => ([
  {
    name: 'full_name',
    label: 'Full Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'username',
    label: 'User Name',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'email',
    label: 'Email',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'last_activity',
    label: 'Last Activity',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'org_display_name',
    label: 'Organization',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
]);

export const getGroupsFormattedRow = (groups, orgs) => {
  const formattedData = _.map(groups, (g) => ({
    ...g,
    display_permission_name: _.isEqual(g.id, 1)
      ? g.name
      : `${g.name} - ${_.find(orgs, { organization_uuid: g.organization })
        ? _.find(orgs, { organization_uuid: g.organization }).name
        : ''}`,
  }));

  return _.orderBy(formattedData, 'display_permission_name', 'asc');
};

export const getAlertNotificationsColumns = (timezone, dateFormat, timeFormat) => ([
  {
    name: 'alertObj',
    label: 'Condition',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        !_.isEmpty(value)
          ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                {getIcon(value)}
                {' '}
              </div>
            </div>
          ) : ''
      ),
    },
  },
  {
    name: 'parameterValue',
    label: 'Value',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => {
        let formattedValue = '';
        if (value && _.includes(value, ' F/') && _.includes(value, ' C')) {
          const [val1, val2] = _.split(value, ' F/');
          const [temp, unit] = _.split(val2, ' ');
          formattedValue = `${val1} F/${_.round(_.toNumber(temp), 2)} ${unit}`;
        } else {
          formattedValue = value || '-';
        }

        return formattedValue;
      },
    },
  },
  {
    name: 'alert_time',
    label: 'Date/Time stamp',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone).format(`${dateFormat} ${timeFormat}`)
          : value
      ),
    },
  },
  {
    name: 'location',
    label: 'Location',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      setCellProps: () => ({ style: { maxWidth: '300px', wordWrap: 'break-word' } }),
    },
  },
]);
