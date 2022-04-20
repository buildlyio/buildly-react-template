import React from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';
import {
  AccessTime as AccessTimeIcon, Warning as WarningIcon,
} from '@mui/icons-material';
import {
  TempIcon,
  HumidIcon,
  LightIcon,
  BatteryIcon,
  PressureIcon,
  TiltIcon,
  ShockIcon,
} from '../../components/Icons/Icons';
import {
  getFormattedCustodyRows,
} from '../../pages/Shipment/ShipmentConstants';

export const SHIPMENT_OVERVIEW_TOOL_TIP = 'Select a shipment to view reporting data';

export const NO_DATA = 'No data to display';

export const ALERTS_REPORT_TOOLTIP = 'Shipment Alerts till current time';

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
    name: 'custodian_name',
    label: 'Custodian Name',
  },
  {
    name: 'custody_info',
    label: 'Custody Details',
  },
];

export const getIcon = (item, color) => {
  switch (item.id) {
    case 'temperature':
      return <TempIcon color={color} name={item.name} />;

    case 'light':
      return <LightIcon color={color} name={item.name} />;

    case 'shock':
      return <ShockIcon color={color} name={item.name} />;

    case 'tilt':
      return <TiltIcon color={color} name={item.name} />;

    case 'humidity':
      return <HumidIcon color={color} name={item.name} />;

    case 'battery':
      return <BatteryIcon color={color} name={item.name} />;

    case 'pressure':
      return <PressureIcon color={color} name={item.name} />;

    case 'time':
      return <AccessTimeIcon />;

    default:
      return null;
  }
};

export const getShipmentOverview = (
  shipmentData,
  custodianData,
  custodyData,
  aggregateReportData,
  alertsData,
  contactData,
  timezone,
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
    const editedShipment = shipment;
    let custodyInfo = [];
    let custodianName = '';
    let aggregateReportInfo = [];
    let contactInfo = [];
    let temperatureData = [];
    let lightData = [];
    let shockData = [];
    let tiltData = [];
    let humidityData = [];
    let batteryData = [];
    let pressureData = [];
    let markersToSet = [];

    const alerts = _.filter(
      alertsData,
      (alert) => alert.parameter_type !== 'location' && alert.shipment_id === shipment.partner_shipment_id,
    );

    if (custodyRows.length > 0) {
      _.forEach(custodyRows, (custody) => {
        const editedCustody = custody;
        if (custody.shipment_id === shipment.shipment_uuid && custody.custodian_data) {
          custodianName = custodianName
            ? `${custodianName}, ${custody.custodian_data.name}`
            : custody.custodian_data.name;
          _.forEach(contactData, (contact) => {
            const editedContact = contact;
            if (custody.custodian_data.contact_data[0] === contact.url) {
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

    if (
      aggregateReportData
      && aggregateReportData.length > 0
    ) {
      let counter = 0;
      _.forEach(aggregateReportData, (report) => {
        if (
          report.shipment_id === shipment.partner_shipment_id
          && report.report_entries.length > 0
        ) {
          _.forEach(report.report_entries, (report_entry) => {
            try {
              counter += 1;
              let marker = {};
              const temperature = report_entry.report_temp;
              let dateTime = '';
              let alert_status = '-';
              if ('report_timestamp' in report_entry) {
                if (report_entry.report_timestamp !== null) {
                  dateTime = moment(report_entry.report_timestamp)
                    .tz(timezone).format('MMM DD YYYY, h:mm:ss a');
                }
              } else if ('report_location' in report_entry) {
                dateTime = moment(
                  report_entry.report_location.timeOfPosition,
                ).tz(timezone).format('MMM DD YYYY, h:mm:ss a');
              }

              _.forEach(alerts, (alert) => {
                const alertTime = moment(alert.create_date).tz(timezone).format('MMM DD YYYY, h:mm:ss a');
                if (alertTime === dateTime) {
                  if (alert.recovered_alert_id !== null) {
                    alert_status = 'RECOVERED';
                  } else {
                    alert_status = 'YES';
                  }
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
                  (latitude >= -90
                  && latitude <= 90)
                && (longitude >= -180
                  && longitude <= 180)
                && dateTime !== ''
                ) {
                  marker = {
                    lat: latitude,
                    lng: longitude,
                    label: 'Clustered',
                    temperature,
                    light: report_entry.report_light,
                    shock: report_entry.report_shock,
                    tilt: report_entry.report_tilt,
                    humidity: report_entry.report_humidity,
                    battery: report_entry.report_battery,
                    pressure: report_entry.report_pressure,
                    color: 'green',
                    timestamp: dateTime,
                    alert_status,
                  };
                  // Considered use case: If a shipment stays at some
                  // position for long, other value changes can be
                  // critical
                  const markerFound = _.find(markersToSet, {
                    lat: marker.lat,
                    lng: marker.lng,
                  });

                  if (!markerFound) {
                    markersToSet = [...markersToSet, marker];
                  }
                }
              } else {
                marker = {
                  lat: '*',
                  lng: '*',
                  label: 'Clustered',
                  temperature,
                  light: report_entry.report_light,
                  shock: report_entry.report_shock,
                  tilt: report_entry.report_tilt,
                  humidity: report_entry.report_humidity,
                  battery: report_entry.report_battery,
                  pressure: report_entry.report_pressure,
                  color: 'green',
                  timestamp: dateTime,
                  alert_status,
                };
              }
              aggregateReportInfo = [
                ...aggregateReportInfo,
                marker,
              ];

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
              }
            } catch (e) {
              // eslint-disable-next-line no-console
              console.log(e);
            }
          });
        }
      });
    }

    editedShipment.sensor_report = aggregateReportInfo;
    editedShipment.markers_to_set = _.orderBy(
      markersToSet,
      (item) => moment(item.timestamp),
      ['asc'],
    );
    editedShipment.temperature = temperatureData;
    editedShipment.light = lightData;
    editedShipment.shock = shockData;
    editedShipment.tilt = tiltData;
    editedShipment.humidity = humidityData;
    editedShipment.battery = batteryData;
    editedShipment.pressure = pressureData;

    shipmentList = [...shipmentList, editedShipment];
  });

  return _.orderBy(
    shipmentList,
    (shipment) => moment(shipment.estimated_time_of_departure)
      && moment(shipment.create_date),
    ['desc'],
  );
};

export const REPORT_TYPES = [
  { id: 'temperature', name: 'Temperature', unit: '\u00b0F' },
  { id: 'light', name: 'Light', unit: 'lux' },
  { id: 'shock', name: 'Shock', unit: 'mg' },
  { id: 'tilt', name: 'Tilt', unit: 'deg' },
  { id: 'humidity', name: 'Humidity', unit: '%' },
  { id: 'battery', name: 'Battery', unit: '%' },
  { id: 'pressure', name: 'Pressure', unit: 'Pa' },
];

export const SENSOR_REPORT_COLUMNS = [
  {
    name: 'alert_status',
    label: 'ALERT STATUS',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customHeadLabelRender: () => <WarningIcon />,
    },
  },
  {
    name: 'timestamp',
    label: 'DATE-TIME',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
    },
  },
  {
    name: 'lng',
    label: 'LONGITUDE',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        _.isNumber(value)
          ? _.round(value, 2).toFixed(2)
          : '*'
      ),
    },
  },
  {
    name: 'lat',
    label: 'LATITUDE',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        _.isNumber(value)
          ? _.round(value, 2).toFixed(2)
          : '*'
      ),
    },
  },
  {
    name: 'battery',
    label: 'BATTERY',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        _.isNumber(value)
          ? _.round(value, 2).toFixed(2)
          : '-'
      ),
    },
  },
  {
    name: 'temperature',
    label: 'TEMP (\u00b0F)',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        _.isNumber(Number(value))
          ? _.round(value, 2).toFixed(2)
          : '-'
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
      customBodyRender: (value) => (
        _.isNumber(value)
          ? _.round(value, 2).toFixed(2)
          : '-'
      ),
    },
  },
  {
    name: 'light',
    label: 'LIGHT (lux)',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        _.isNumber(value)
          ? _.round(value, 2).toFixed(2)
          : '-'
      ),
    },
  },
  {
    name: 'shock',
    label: 'SHOCK (mg)',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      display: false,
      customBodyRender: (value) => (
        _.isNumber(value)
          ? _.round(value, 2).toFixed(2)
          : '-'
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
      customBodyRender: (value) => (
        _.isNumber(value)
          ? _.round(value, 2).toFixed(2)
          : '-'
      ),
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
      customBodyRender: (value) => (
        _.isNumber(value)
          ? _.round(value, 2).toFixed(2)
          : '-'
      ),
    },
  },
];

export const getAlertsReportColumns = (timezone) => ([
  {
    name: 'id',
    label: 'Alert ID',
    options: {
      sort: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: 'parameter_type',
    label: 'Parameter Type',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? _.capitalize(value)
          : '-'
      ),
    },
  },
  {
    name: 'parameter_value',
    label: 'Parameter Value',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? value
          : '-'
      ),
    },
  },
  {
    name: 'alert_type',
    label: 'Alert Message',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => {
        let returnValue = value;
        if (value && value !== '-') {
          switch (value) {
            case 'min-warning':
              returnValue = 'Minimum Warning';
              break;

            case 'min-excursion':
              returnValue = 'Minimum Excursion';
              break;

            case 'max-warning':
              returnValue = 'Maximum Excursion';
              break;

            case 'max-excursion':
              returnValue = 'Maximum Excursion';
              break;

            default:
              break;
          }
        }
        return returnValue;
      },
    },
  },
  {
    name: 'recovered_alert_id',
    label: 'Recovered',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (value ? 'YES' : 'NO'),
    },
  },
  {
    name: 'recovered_alert_id',
    label: 'Recovered Alert ID',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (value || '-'),
    },
  },
  {
    name: 'create_date',
    label: 'Alert Created At',
    options: {
      sort: true,
      sortThirdClickReset: true,
      filter: true,
      customBodyRender: (value) => (
        value && value !== '-'
          ? moment(value).tz(timezone).format('MMM DD YYYY, h:mm:ss a')
          : value
      ),
    },
  },
]);
